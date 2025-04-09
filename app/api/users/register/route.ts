import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/user';

export async function POST(request: Request) {
  try {
    const { name, phone, birthDate } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já cadastrado' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      phone,
      birthDate: birthDate || null,
      points: 0,
      lastLogin: new Date(),
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}