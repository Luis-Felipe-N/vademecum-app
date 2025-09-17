import { type NextRequest, NextResponse } from "next/server";
import client from "@/lib/prisma";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	if (!id) {
		return NextResponse.json(
			{ error: "ID da pergunta é obrigatório" },
			{ status: 400 },
		);
	}

	try {
		const question = await client.question.findUnique({
			where: {
				id: id,
			},
			include: {
				author: {
					select: {
						name: true,
						profilePicture: true,
					},
				},
				subject: {
					select: {
						name: true,
					},
				},
				answers: {
          orderBy: {
            createdAt: "asc", // or 'desc' depending on your preference
          },
          take: 10,
          include: {
            author: {
              select: {
                name: true,
                profilePicture: true,
              },
            },
          },
        },
        // It's also a good practice to include the total answer count
        _count: {
          select: {
            answers: true,
          },
        },
			},
		});

		if (!question) {
			return NextResponse.json(
				{ message: "Pergunta não encontrada" },
				{ status: 404 },
			);
		}

		return NextResponse.json(question);
	} catch (error) {
		console.error("Erro ao buscar pergunta:", error);
		return NextResponse.json(
			{ error: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}
