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
    subjects: z.array(z.string()).min(1, "Selecione pelo menos uma matéria."),
    title: z.string().min(1, "Título é obrigatório"),
    content: z.string().min(1, "Conteúdo é obrigatório"),
    file: z.string().optional(),
  });

  try {
    const body = await request.json();
    const parsedData = questionSchema.parse(body);

    const { subjects, title, content, file } = parsedData;

    const existingUser = await client.user.findUnique({
      where: { id: authorId },
    });

		console.log("Existing User:", authorId, session, session.user, existingUser);

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 },
      );
    }

    const newQuestion = await client.question.create({
      data: {
        title,
        content,
        authorId,
        file: file || undefined,
        subjects: {
          connect: subjects.map(id => ({ id })),
        },
      },
      include: {
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
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    const errorResponse = {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível criar questão.",
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}