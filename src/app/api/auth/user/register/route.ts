import { NextResponse, type NextRequest } from "next/server";
import z4 from "zod/v4";
import bcrypt from "bcrypt";
import client from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const personRegisterSchema = z4.object({
    name: z4.string().min(1, "Informe o nome completo"),
    email: z4.string().min(1, "Informe o nome de usuário"),
    password: z4.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    profilePicture: z4.url().optional(),
    bio: z4.string().max(180, "Bio deve ter no máximo 180 caracteres").optional(),
  });
  const body = await request.json();
  const parsedData = personRegisterSchema.safeParse(body);
  
  if (!parsedData.success) {
    return new Response(JSON.stringify(parsedData.error), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, password, profilePicture } = parsedData.data;

  const existingUser = await client.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({message: "Já existe um usuário com este e-mail"}, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await client.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profilePicture
    },
    omit: {
      password: true
    }
  });

  return NextResponse.json(user, { status: 201 });
} 