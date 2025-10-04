import type { NextRequest } from "next/server";
import z4 from "zod/v4";
import { tr } from "zod/v4/locales";
import client from "@/lib/prisma";

export async function GET(request: NextRequest) {
	const listQuestionsSchema = z4.object({
		query: z4.string().optional(),
		page: z4.number().optional().default(1),
	});

	const { searchParams } = new URL(request.url);

	const query = searchParams.get("query") || "";
	const parsedQuery = listQuestionsSchema.safeParse({ query });

	try {
		const questions = await client.question.findMany({
			where: {
				title: {
					contains: parsedQuery.success ? parsedQuery.data.query : "",
					mode: "insensitive",
				},
			},

			select: {
				id: true,
				title: true,
				content: true,
				file: true,
				createdAt: true,
				updatedAt: true,
				author: {
					select: {
						name: true,
						profilePicture: true,
					},
				},
				subjects: {
					select: {
						name: true,
					},
				},
				_count: {
					select: {
						answers: true,
					},
				},
				answers: {
					where: {
						isBestAnswer: true,
					},
					select: {
						isBestAnswer: true,
						author: true,
						id: true,
					},
					take: 1,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 10,
			skip: (parsedQuery.success ? parsedQuery.data.page - 1 : 0) * 10,
		});

		return new Response(JSON.stringify(questions), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Erro ao buscar matérias:", error);
		return new Response("Erro ao buscar matérias", { status: 500 });
	}
}
