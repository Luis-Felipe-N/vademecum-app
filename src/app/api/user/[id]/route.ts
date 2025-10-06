import { type NextRequest, NextResponse } from "next/server";
import client from "@/lib/prisma";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	if (!id) {
		return NextResponse.json(
			{ error: "ID do usuario é obrigatório" },
			{ status: 400 },
		);
	}

	try {
		const user = await client.user.findUnique({
			where: {
				id: id,
			},
			include: {
				answersProvided: {
					include: {
						author: {
							select: {
								id: true,
								name: true,
								profilePicture: true,
							},
						},
					},
				},
				questionsCreated: true,
        _count: {
          select: {
            questionsCreated: true,
            answersProvided: true,
            votes: true,
          },
        },
			},
		});

		if (!user) {
			return NextResponse.json(
				{ message: "Usuario não encontrado" },
				{ status: 404 },
			);
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error("Erro ao buscar usuario:", error);
		return NextResponse.json(
			{ error: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}
