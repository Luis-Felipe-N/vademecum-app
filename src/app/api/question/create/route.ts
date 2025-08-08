import { authOptions } from "@/lib/auth/authOptions";
import client from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod/v4";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  const authorId = session.user.id;

  const questionSchema = z.object({
    subjectId: z.string().min(1, "Inform a matéria"),
    title: z.string().min(1, "Título é obrigatório"),
    content: z.string().min(1, "Conteúdo é obrigatório"),
  })

  try {
    const body = await request.json();
    const parsedData = questionSchema.parse(body)

    const { subjectId, title, content } = parsedData;

    const newQuestion = await client.question.create({
      data: {
        subjectId, 
        title,
        content,
        authorId,
      },
      include: {
        author: {
          select: {
            name: true,
            profilePicture: true,
          }
        },
        subject: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(newQuestion, { status: 201 }); // 201 Created

  } catch (error) {
     const errorResponse = {
      status: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Não foi possível criar uma review',
    }
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

}
