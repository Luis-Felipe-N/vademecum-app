import { useMutation } from "@tanstack/react-query";
import type {
	AnswerResponse,
	CreateAnswerData,
	CreateAnswerError,
} from "@/types/answer";

export function useCreateAnswer() {
	return useMutation({
		mutationFn: async (data: CreateAnswerData) => {
			const response = await fetch("/api/answer/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const body = await response.json();

			if (!response.ok) {
				const errorMessage =
					(body as CreateAnswerError).message || "Falha ao criar a pergunta.";
				throw new Error(errorMessage);
			}

			return body as AnswerResponse;
		},
		onMutate: () => {},
	});
}
