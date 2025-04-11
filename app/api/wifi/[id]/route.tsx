
import { NextResponse } from 'next/server';
import { prisma } from "../../../lib/prisma";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = await params;
	const wifi = await prisma.map.findUnique({ where: { id: Number(id) } });

	if (!wifi) {
		return NextResponse.json(
			{ error: 'Wi-Fi point not found' },
			{ status: 404 }
		);
	}

	return NextResponse.json(wifi);
}

export async function POST(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	const { location, hotspots } = await request.json();

	const updatedWifi = await prisma.map.update({
		where: { id: Number(id) },
		data: { location, hotspots },
	});

	return NextResponse.json(updatedWifi);
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	await prisma.map.delete({ where: { id: Number(id) } });
	return new Response(null, { status: 204 });
}
