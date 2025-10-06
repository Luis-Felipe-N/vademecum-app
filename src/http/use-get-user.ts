import type { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import type { QuestionResponse } from "@/types/question";
import type { UserResponse } from "@/types/user";

async function fetchUser(id: string): Promise<UserResponse | null> {
	const response = await fetch(`/api/user/${id}`);
	if (!response.ok) {
		throw new Error("Falha ao buscar as perguntas.");
	}
	return response.json();
}

export function useGetUser(id: string) {
	return useQuery<UserResponse | null>({
		queryKey: ["question", id],
		queryFn: () => fetchUser(id),
	});
}
