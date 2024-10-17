// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../prisma';  // Adjust path if needed
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobs = await prisma.job.findMany({
    where: {
      userId: session.user.id,  // Only jobs for the authenticated user
    },
  });

  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();

  const job = await prisma.job.create({
    data: {
      ...data,
      userId: session.user.id,  // Associate job with the authenticated user
    },
  });

  return NextResponse.json(job, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const { id, ...updateData } = data;

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job || job.userId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updatedJob);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job || job.userId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await prisma.job.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Job deleted successfully' });
}
