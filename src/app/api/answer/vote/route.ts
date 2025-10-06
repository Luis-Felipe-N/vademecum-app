import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import z4 from "zod/v4";
import { authOptions } from "@/lib/auth/authOptions";
import { addPoints } from "@/lib/gamification";
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
	const voteSchema = z4.object({
		answerId: z4.string().min(1, "ID da resposta é obrigatório"),
	});

	const body = await request.json();
	const parsed = voteSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(parsed.error, { status: 400 });
	}

	const { answerId } = parsed.data;

	const answer = await client.answer.findUnique({
		where: { id: answerId },
	});

	if (!answer) {
		return NextResponse.json(
			{ error: "Resposta não encontrada" },
			{ status: 404 },
		);
	}

	const authorAlreadyVoted = await client.vote.findFirst({
		where: {
			answerId,
			authorId,
		},
	});

	if (authorAlreadyVoted) {
		const errorResponse = {
			status: "error",
			message: "Você já votou nesta resposta",
		};

		return new NextResponse(JSON.stringify(errorResponse), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const vote = await client.vote.create({
		data: {
			answerId,
			authorId,
			voteType: 0, // Upvote
		},
	});

	// Assigning gamification points for the upvote
	await addPoints({
		userId: answer.authorId,
		points: 10,
		sourceType: "UPVOTE",
		sourceId: vote.id,
	});

	return NextResponse.json(vote, { status: 201 });
}
