import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import z from "zod";
import { authOptions } from "@/lib/auth/authOptions";
import client from "@/lib/prisma";

export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return NextResponse.json(
			{ error: "Usuário não autenticado" },
			{ status: 401 },
		);
	}

	const authorId = session.user.id;
	const answerSchema = z.object({
		content: z.string().min(1, "A resposta não pode ser vazia"),
		questionId: z.string().min(1, "ID da pergunta é obrigatório"),
	});

	const body = await request.json();
	const parsed = answerSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(parsed.error, { status: 400 });
	}

	const { content, questionId } = parsed.data;

	const answer = await client.answer.create({
		data: {
			content,
			questionId,
			authorId,
		},
	});

	return NextResponse.json(answer, { status: 201 });
}
