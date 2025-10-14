'use client'

import { Medal, StarIcon, } from "lucide-react";
import { AvatarAuthor } from "@/components/core/avatar-user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetRanking } from "@/http/use-get-raking";

export default function RakingPage() {
	const {data: items} = useGetRanking()

	return (
		<main className="px-8 lg:px-0">
			<div className="mb-6 grid grid-cols-3 gap-4">
				{items?.slice(0, 3).map((item, index) => (
					<Card className="w-full border-2 col-span-3 lg:col-span-1" key={item.id}>
						<CardHeader className="flex justify-between items-center">
							<div className="flex items-center gap-4">
								<AvatarAuthor
									author={{ name: item.name, profilePicture: item.profilePicture }}
								/>
								<small className="text-sm">{item.name}</small>
							</div>
							<div>
								{index === 0 && (
                  <Medal className="text-amber-400" size={24} />
                )}
                {index === 1 && (
                  <Medal className="text-gray-400" size={24} />
                )}
                {index === 2 && (
                  <Medal className="text-yellow-800" size={24} />
                )}
							</div>
						</CardHeader>
						<CardContent>
							<span className="bg-amber-500/50 font-bold text-xs px-2 py-1 gap-1 rounded-full inline-flex items-center">
								<StarIcon size={16} /> <span>{item.points} pts</span>
							</span>
							<div className="text-sm text-muted-foreground flex mt-4 gap-6">
								<div className="border-b border-cyan-600 border-dashed flex flex-col gap-2 pb-2">
                  <span className="text-zinc-400 text-sm">Respostas</span>
                  <span className="text-xs">{item._count.answersProvided}</span>
                </div>
                <div className="border-b border-emerald-600 border-dashed flex flex-col gap-2 pb-2">
                  <span className="text-zinc-400 text-sm">Perguntas</span>
                  <span className="text-xs">{item._count.questionsCreated}</span>
                </div>
                <div className="border-b border-amber-600 border-dashed flex flex-col gap-2 pb-2">
                  <span className="text-zinc-400 text-sm">Melhor respostas</span>
                  <span className="text-xs">{item.bestAnswersCount}</span>
                </div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="border-2 p-4 rounded-2xl bg-card overflow-x-auto">
				<Table className="overflow-x-auto">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead></TableHead>
							<TableHead>Usuário</TableHead>
							<TableHead>Pontos</TableHead>
							<TableHead>Level</TableHead>
							<TableHead>Melhor Resposta</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items?.map((item, idx) => (
							<TableRow key={item.id}>
								<TableCell>{idx + 1}</TableCell>

								<TableCell>
									<div className="flex items-center gap-3">
										<AvatarAuthor author={{name: item.name, profilePicture: item.profilePicture}} />
										<div>
											<div className="font-medium">{item.name}</div>
											<span className="text-muted-foreground mt-0.5 text-xs">
												{item.points < 60 ? 1 && 'Iniciante' : 'Aprendiz'}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell className="items-center">{item.points}</TableCell>
								<TableCell>{item.points < 60 ? 1 && 'Iniciante' : 'Aprendiz'}</TableCell>
								<TableCell className="items-center">{item.bestAnswersCount}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</main>
	);
}
