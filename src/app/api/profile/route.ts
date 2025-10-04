import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import z from "zod";
import { authOptions } from "@/lib/auth/authOptions";
import client from "@/lib/prisma";

const profileSchema = z.object({
	name: z.string().min(1, "O nome é obrigatório").optional(),
	bio: z
		.string()
		.max(180, "A biografia deve ter no máximo 180 caracteres")
		.optional(),
	profilePicture: z.string().optional(),
});

export async function PUT(request: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return NextResponse.json(
			{ error: "Usuário não autenticado" },
			{ status: 401 },
		);
	}

	const body = await request.json();
	const parsed = profileSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(parsed.error, { status: 400 });
	}

	const { name, bio, profilePicture } = parsed.data;

	try {
		const updatedUser = await client.user.update({
			where: { id: session.user.id },
			data: {
				name,
				bio,
				profilePicture,
			},
			select: {
				id: true,
				name: true,
				email: true,
				profilePicture: true,
				bio: true,
			},
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error("Erro ao atualizar perfil:", error);
		return NextResponse.json(
			{ error: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}
