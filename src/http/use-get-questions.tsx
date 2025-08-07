import { useQuery } from "@tanstack/react-query";
import type { QuestionResponse } from "@/types/question";

async function fetchRecentQuestions(): Promise<[]> {
  const response = await fetch('/api/question/list');
  if (!response.ok) {
    throw new Error('Falha ao buscar as perguntas.');
  }
  return response.json();
}

export function useGetRecentQuestions() {
  return useQuery<QuestionResponse[]>({
    queryKey: ["questions", "list"],
    queryFn: fetchRecentQuestions,
  });
}