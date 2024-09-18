import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const usersCount = await prisma.user.count();
    return NextResponse.json({ message: 'Database connection successful', usersCount });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}