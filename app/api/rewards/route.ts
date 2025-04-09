import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Reward } from '@/models/reward';
import { User } from '@/models/user';

export async function POST(request: Request) {
  try {
    const { userId, type, value } = await request.json();

    if (!userId || !type || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create reward
    const reward = await Reward.create({
      userId,
      type,
      value,
      date: new Date(),
    });

    // Update user points and lastSpin if it's a daily spin
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.points += value;
    if (type === 'daily_spin') {
      user.lastSpin = new Date();
    }
    await user.save();

    return NextResponse.json({ reward, points: user.points });
  } catch (error) {
    console.error('Error creating reward:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}