import client from "@/lib/prisma";
import type { NextRequest } from "next/server";
import z4 from "zod/v4";

export async function GET(request: NextRequest) {
  const listQuestionsSchema = z4.object({
    query: z4.string().optional(),
    page: z4.number().optional().default(1),
  })

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
