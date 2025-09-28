import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import z4, { z } from "zod/v4";
import { authOptions } from "@/lib/auth/authOptions";
import client from "@/lib/prisma";

export async function PUT(request: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return NextResponse.json(
			{ error: "Usuário não autenticado" },
			{ status: 401 },
		);
	}

	const authorId = session.user.id;
	const bestAnswerSchema = z4.object({
		answerId: z.string().min(1, "ID da resposta é obrigatório"),
	});

	const body = await request.json();
	const parsed = bestAnswerSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(parsed.error, { status: 400 });
	}

	const { answerId } = parsed.data;

	const questionsByAuthor = await client.question.findFirst({
		where: {
      answers: {
        some: {
          id: answerId
        }
      },
			authorId,
		},
     include: {
      answers: {
        where: {
          isBestAnswer: true,
        },
      },
    },
	});

	if (!questionsByAuthor) {
		const errorResponse = {
			status: "error",
			message: "Você não tem permissão para marcar esta resposta como a melhor.",
		};

		return new NextResponse(JSON.stringify(errorResponse), {
			status: 403,
			headers: { "Content-Type": "application/json" },
		});
	}

  if (questionsByAuthor.answers.length > 0) {
    const errorResponse = {
      status: "error",
      message: "Uma resposta já foi marcada como a melhor para esta pergunta.",
    };

    return new NextResponse(JSON.stringify(errorResponse), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }


	const betsAnswer = await client.answer.update({
		where: {
			id: answerId,
		},
		data: {
			isBestAnswer: true,
		},
	});

  return NextResponse.json(betsAnswer,{ status: 200 })
}
