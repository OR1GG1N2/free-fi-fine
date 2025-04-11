import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = await params;
	const user = await prisma.users.findUnique({ where: { id: String(id) } });

	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 });
	}

	return NextResponse.json(user);
}

export async function POST(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	const { username, mail, password, name, email } = await request.json();

	const updatedUser = await prisma.users.update({
		where: { id: String(id) },
		data: { username, mail, password, name, email },
	});

	return NextResponse.json(updatedUser);
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	await prisma.users.delete({ where: { id: String(id) } });
	return new Response(null, { status: 204 });
}
