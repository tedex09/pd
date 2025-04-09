import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Reward } from '@/models/reward';
import { User } from '@/models/user';

export async function POST(request: Request) {
  try {
    const { phone, type, value } = await request.json();

    if (!phone || !type || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create reward
    const reward = await Reward.create({
      userId: user._id,
      type,
      value,
      date: new Date(),
    });

    // Update user points and lastSpin if it's a daily spin
    user.points += value;
    
    if (type === 'daily_spin') {
      const today = new Date();
      const lastSpinDate = user.lastSpin ? new Date(user.lastSpin) : null;
      
      // Check if this is a consecutive day
      if (lastSpinDate) {
        const isConsecutiveDay = 
          lastSpinDate.getDate() === today.getDate() - 1 &&
          lastSpinDate.getMonth() === today.getMonth() &&
          lastSpinDate.getFullYear() === today.getFullYear();
        
        if (isConsecutiveDay) {
          user.streak += 1;
        } else {
          user.streak = 1;
        }
      } else {
        user.streak = 1;
      }
      
      user.lastSpin = today;
    }
    
    await user.save();

    return NextResponse.json({ 
      reward, 
      points: user.points,
      streak: user.streak 
    });
  } catch (error) {
    console.error('Error creating reward:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}