import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/user';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        name: '',
        points: 0,
        streak: 0,
        lastSpin: null,
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json({ userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}