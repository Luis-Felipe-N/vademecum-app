import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import z4, { z } from "zod/v4";
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
	const voteSchema = z4.object({
		answerId: z.string().min(1, "ID da resposta é obrigatório"),
	});

	const body = await request.json();
	const parsed = voteSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(parsed.error, { status: 400 });
	}

	const { answerId } = parsed.data;

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

  return NextResponse.json(vote, { status: 201 });
}
