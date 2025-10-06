// src/lib/gamification.ts

import type { PointLogSourceType } from "@prisma/client";
import client from "@/lib/prisma";

export async function addPoints({
	userId,
	points,
	sourceType,
	sourceId,
}: {
	userId: string;
	points: number;
	sourceType: PointLogSourceType;
	sourceId?: string;
}) {
	try {
		const user = await client.user.update({
			where: { id: userId },
			data: {
				points: {
					increment: points,
				},
			},
		});

		await client.pointLog.create({
			data: {
				userId: user.id,
				pointsGained: points,
				sourceType,
				sourceId,
			},
		});
	} catch (error) {
		console.error("Erro ao adicionar pontos de gamificação:", error);
		// Opcionalmente, você pode lidar com o erro sem interromper o fluxo principal.
	}
}
