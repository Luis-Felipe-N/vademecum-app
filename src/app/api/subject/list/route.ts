import type { NextRequest } from "next/server";
import z4 from "zod/v4";
import client from "@/lib/prisma";

export async function GET(request: NextRequest) {
	const listSubjectsSchema = z4.object({
		query: z4.string().optional(),
	});

	const { searchParams } = new URL(request.url);

	const query = searchParams.get("query") || "";
	const parsedQuery = listSubjectsSchema.safeParse({ query });

	try {
		const subjects = await client.subject.findMany({
			where: {
				name: {
					contains: parsedQuery.success ? parsedQuery.data.query : "",
					mode: "insensitive",
				},
			},
			select: {
				id: true,
				name: true,
			},
		});

		return new Response(JSON.stringify(subjects), {
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
