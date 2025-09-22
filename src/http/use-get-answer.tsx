import { useQuery } from "@tanstack/react-query";
import type { AnswerResponse } from "@/types/answer";

async function fetchAnswer(page: number, questionId?: string): Promise<Array<AnswerResponse>> {
	const questionIdParam = questionId ? `?questionId=${encodeURIComponent(questionId)}&page=${page}` : `?page=${page}`;
	const response = await fetch(
		`/api/answer/list${questionIdParam}`,
	);
	if (!response.ok) {
		throw new Error("Falha ao buscar as respostas.");
	}
	return response.json();
}

export function useGetAnswer(page = 1, questionId?: string) {
	return useQuery<AnswerResponse[]>({
		queryKey: ["get-answer", questionId],
		queryFn: () => fetchAnswer(page, questionId),
	});
}
