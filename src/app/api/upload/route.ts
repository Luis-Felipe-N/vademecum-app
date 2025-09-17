import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { NextResponse } from "next/server";

const nanoid = customAlphabet(
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	7,
);

export async function POST(request: Request): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);
	const filename = searchParams.get("filename");

	if (!filename || !request.body) {
		return NextResponse.json(
			{ error: "Nome do arquivo não fornecido." },
			{ status: 400 },
		);
	}

	const randomId = nanoid();
	const uniqueFilename = `${randomId}-${filename}`;

	const blob = await put(uniqueFilename, request.body, {
		access: "public",
	});

	return NextResponse.json(blob);
}
