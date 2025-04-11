// app/api/map/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    const maps = await prisma.map.findMany();
    return NextResponse.json(maps);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch map points' },
      { status: 500 }
    );
  }

	const maps = await prisma.map.findMany();
	return NextResponse.json(maps);
}

export async function POST(request: Request) {
  try {
    const { hotspots, location, user_id } = await request.json();

    if (!hotspots || !location || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPoint = await prisma.map.create({
      data: { hotspots, location, user_id },
    });

    return NextResponse.json(newPoint, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create map point' },
      { status: 500 }
    );
  }
}