import { useQuery } from "@tanstack/react-query";
import type { QuestionResponse } from "@/types/question";

async function fetchQuestion(id: string): Promise<QuestionResponse | null> {
	const response = await fetch(
		`/api/question/${id}`
	);
	if (!response.ok) {
		throw new Error("Falha ao buscar as perguntas.");
	}
	return response.json();
}

export function useGetQuestion(id: string) {
	return useQuery<QuestionResponse | null>({
		queryKey: ["question", id],
		queryFn: () => fetchQuestion(id),
	});
}
