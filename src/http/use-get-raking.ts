import { useQuery } from "@tanstack/react-query";
import type { UserRanking } from "@/types/user";

async function fetchRanking(): Promise<UserRanking[]> {
	const response = await fetch("/api/raking");
	if (!response.ok) {
		throw new Error("Falha ao buscar o ranking.");
	}
	return response.json();
}

export function useGetRanking() {
	return useQuery<UserRanking[]>({
		queryKey: ["ranking"],
		queryFn: fetchRanking,
	});
}
