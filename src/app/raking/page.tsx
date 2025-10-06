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

const items = [
	{
		id: "1",
		name: "Alex Thompson",
		username: "@alexthompson",
		image:
			"https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-02_upqrxi.jpg",
		email: "alex.t@company.com",
		location: "San Francisco, US",
		status: "Active",
		points: 1250.0,
	},
	{
		id: "2",
		name: "Sarah Chen",
		username: "@sarahchen",
		image:
			"https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-01_ij9v7j.jpg",
		email: "sarah.c@company.com",
		location: "Singapore",
		status: "Active",
		points: 600.0,
	},
	{
		id: "4",
		name: "Maria Garcia",
		username: "@mariagarcia",
		image:
			"https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-03_dkeufx.jpg",
		email: "m.garcia@company.com",
		location: "Madrid, Spain",
		status: "Active",
		points: 0.0,
	},
	{
		id: "5",
		name: "David Kim",
		username: "@davidkim",
		image:
			"https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-05_cmz0mg.jpg",
		email: "d.kim@company.com",
		location: "Seoul, KR",
		status: "Active",
		points: 1000,
	},
];

export default function RakingPage() {
	return (
		<main>
			<div className="mb-6 flex  gap-4">
				{items.slice(0, 3).map((item, index) => (
					<Card className="w-full border-2" key={item.id}>
						<CardHeader className="flex justify-between items-center">
							<div className="flex items-center gap-4">
								<AvatarAuthor
									author={{ name: item.name, profilePicture: item.image }}
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
                  <span className="text-xs">323</span>
                </div>
                <div className="border-b border-emerald-600 border-dashed flex flex-col gap-2 pb-2">
                  <span className="text-zinc-400 text-sm">Perguntas</span>
                  <span className="text-xs">323</span>
                </div>
                <div className="border-b border-amber-600 border-dashed flex flex-col gap-2 pb-2">
                  <span className="text-zinc-400 text-sm">Melhor respostas</span>
                  <span className="text-xs">323</span>
                </div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="border-2 p-4 rounded-2xl bg-card">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead></TableHead>
							<TableHead>Usuário</TableHead>
							<TableHead>Pontos</TableHead>
							<TableHead>Classificação</TableHead>
							<TableHead>Balance</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.id}</TableCell>

								<TableCell>
									<div className="flex items-center gap-3">
										<img
											className="rounded-full"
											src={item.image}
											width={40}
											height={40}
											alt={item.name}
										/>
										<div>
											<div className="font-medium">{item.name}</div>
											<span className="text-muted-foreground mt-0.5 text-xs">
												{item.username}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell>{item.points}</TableCell>
								<TableCell>{item.status}</TableCell>
								<TableCell>{item.status}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</main>
	);
}
