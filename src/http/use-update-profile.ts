import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "next-auth";
import { toast } from "sonner";

interface UpdateProfileData {
	name?: string;
	bio?: string;
	profilePicture?: string;
	email?: string;
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UpdateProfileData) => {
			const response = await fetch("/api/profile", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Erro ao atualizar perfil.");
			}

			return response.json() as Promise<User>;
		},
		onSuccess: (updatedUser) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			toast.success("Perfil atualizado com sucesso!");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}
