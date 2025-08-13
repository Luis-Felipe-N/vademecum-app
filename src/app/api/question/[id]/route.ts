// src/app/api/question/[id]/route.ts
import client from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

// Interface para definir a estrutura esperada dos parâmetros da rota
interface RouteParams {
  params: {
    id: string;
  };
}

// A tipagem correta para o segundo argumento
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = params;

  // Validação simples para garantir que o ID não está vazio
  if (!id) {
    return NextResponse.json({ error: "ID da pergunta é obrigatório" }, { status: 400 });
  }
  
  try {
    const question = await client.question.findUnique({
      where: {
        id: id, // Usa o ID diretamente dos parâmetros
      },
      include: {
        author: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ message: "Pergunta não encontrada" }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Erro ao buscar pergunta:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}