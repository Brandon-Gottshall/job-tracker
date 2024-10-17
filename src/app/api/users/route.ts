// app/api/users/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET(req: Request) {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const data = await req.json();
  const user = await prisma.user.create({
    data,
  });
  return NextResponse.json(user, { status: 201 });
}
