import { type NextRequest, NextResponse } from "next/server";
import client from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const rankedUsers = await client.user.findMany({
      select: {
        id: true,
        name: true,
        profilePicture: true,
        points: true,
        level: true,
        _count: {
          select: {
            questionsCreated: true,
            answersProvided: true,
          },
        },
        answersProvided: {
          where: {
            isBestAnswer: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        points: 'desc',
      },
    });

    if (!rankedUsers || rankedUsers.length === 0) {
      return NextResponse.json(
        { message: "Nenhum usuário encontrado" },
        { status: 404 },
      );
    }
    
    const usersWithBestAnswersCount = rankedUsers.map(user => {
      return {
        ...user,
        bestAnswersCount: user.answersProvided.length,
      };
    });

    return NextResponse.json(usersWithBestAnswersCount);
  } catch (error) {
    console.error("Erro ao buscar usuários para o ranking:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}