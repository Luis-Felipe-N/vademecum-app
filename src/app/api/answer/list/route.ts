import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import client from "@/lib/prisma";

const getAnswersSchema = z.object({
	questionId: z.string().optional(),
	page: z.coerce.number().int().min(1).default(1),
});

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	try {
		const validatedParams = getAnswersSchema.safeParse({
			page: searchParams.get("page") || undefined,
			questionId: searchParams.get("questionId") || undefined,
		});

		if (!validatedParams.success) {
			return NextResponse.json(
				{
					error: "Parâmetros de busca inválidos.",
					details: validatedParams.error.issues,
				},
				{ status: 400 },
			);
		}

		const { questionId: validatedQuestionId, page } = validatedParams.data;

		const answers = await client.answer.findMany({
			where: validatedQuestionId ? { questionId: validatedQuestionId } : {},
			include: {
				author: {
					select: {
						name: true,
						profilePicture: true,
					},
				},
        _count: {
          select: {
            votes: true,
          },
        },
			},      
			orderBy: {
				createdAt: "asc",
			},
		});

		return new Response(JSON.stringify(answers), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Erro ao buscar respostas:", error);
		return new Response("Erro interno do servidor.", { status: 500 });
	}
}
