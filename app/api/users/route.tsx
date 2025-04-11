import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
	const users = await prisma.users.findMany(); // Changed to 'users'
	return NextResponse.json(users);
}

export async function POST(request: Request) {
	const { id, name, username, mail, password, email } = await request.json();

	if (!id || !name || !username || !mail || !password || !email) {
		return NextResponse.json(
			{ error: 'Missing required fields' },
			{ status: 400 }
		);
	}

	const newUser = await prisma.users.create({
		data: { id, name, username, mail, password, email },
	});

	return NextResponse.json(newUser, { status: 201 });
}
