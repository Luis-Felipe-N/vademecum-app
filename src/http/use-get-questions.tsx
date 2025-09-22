import { useQuery } from "@tanstack/react-query";
import type { QuestionResponse } from "@/types/question";

async function fetchQuestions(query: string, page: number): Promise<[]> {
	const response = await fetch(
		`/api/question/list?query=${encodeURIComponent(query)}&page=${page}`,
	);
	if (!response.ok) {
		throw new Error("Falha ao buscar as perguntas.");
	}
	return response.json();
}

export function useGetQuestions(query: string = "", page: number = 1) {
	return useQuery<QuestionResponse[]>({
		queryKey: ["questions", query, page],
		queryFn: () => fetchQuestions(query, page),
	});
}
