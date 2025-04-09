import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/user';
import { Reward } from '@/models/reward';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { points } = await request.json();
    
    if (typeof points !== 'number') {
      return NextResponse.json(
        { error: 'Points must be a number' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create reward record
    await Reward.create({
      userId: user._id,
      type: 'admin',
      value: points,
      date: new Date(),
    });

    // Update user points
    user.points += points;
    await user.save();

    return NextResponse.json({ success: true, points: user.points });
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}