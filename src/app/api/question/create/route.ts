import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import z from "zod/v4";
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

	const questionSchema = z.object({
		subjects:  z.array(z.string()).min(1, "Selecione pelo menos uma matéria."),
		title: z.string().min(1, "Título é obrigatório"),
		content: z.string().min(1, "Conteúdo é obrigatório"),
		file: z.string().optional(),
	});

	try {
		const body = await request.json();
		const parsedData = questionSchema.parse(body);

		const { subjects, title, content, file } = parsedData;

		const newQuestion = await client.question.create({
			data: {
				title,
				content,
				author: {
					connect: { id: authorId },
				},
				file: file || undefined,
				subjects: {
					connect: subjects.map(id => ({ id })), 
				},
			}
		});

		return NextResponse.json(newQuestion, { status: 201 }); // 201 Created
	} catch (error) {
		const errorResponse = {
			status: "error",
			message:
				error instanceof Error
					? error.message
					: "Não foi possível criar uma review",
		};
		return new NextResponse(JSON.stringify(errorResponse), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}
}
