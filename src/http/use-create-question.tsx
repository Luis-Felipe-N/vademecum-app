import { useMutation } from "@tanstack/react-query";
import type {
	CreateQuestionData,
	CreateQuestionError,
	QuestionResponse,
} from "@/types/question";

export function useCreateQuestion() {

	return useMutation({
		mutationFn: async (data: CreateQuestionData) => {
			const response = await fetch("/api/question/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const body = await response.json();

			if (!response.ok) {
				const errorMessage =
					(body as CreateQuestionError).message || "Falha ao criar a pergunta.";
				throw new Error(errorMessage);
			}

			return body as QuestionResponse;
		},
	});
}
