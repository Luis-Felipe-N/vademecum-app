"use client";

import { StarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { use } from "react";
import { AvatarAuthor } from "@/components/core/avatar-user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { useGetUser } from "@/http/use-get-user";

interface ProfilePageProps {
	params: Promise<{ id: string }>;
}

const navigationLinks = [
	{ href: "#", label: "", color: "emerald", active: true },
	{ href: "#", label: "", color: "cyan" },
	{ href: "#", label: "", color: "emerald" },
];

export default function ProfilePage({ params }: ProfilePageProps) {
	const { data: sessionData } = useSession();
	const { id } = use(params);
	const { data: userData } = useGetUser(id);

	if (!userData) {
		return null;
	}

	console.log(userData)

	const userStats = [
		{ label: "Respostas", count: userData._count.answersProvided },
		{ label: "Perguntas", count: userData._count.questionsCreated },
		{ label: "Votos", count: userData._count.votes },
	];

	return (
		<main className="w-full p-12">
			<div className="absolute top-[-180px] left-[400px] z-10 h-[150px] w-[400px] rotate-[0deg] transform rounded-full bg-gradient-to-tl from-slate-800 via-cyan-500 to-zinc-400 blur-[150px]"></div>

			<div className="grid grid-cols-3">
				<section className="gap-6 mb-8 lg:col-span-1 col-span-3">
					<div className="flex items-center gap-4">
						<AvatarAuthor
							size="lg"
							author={{
								name: userData.name,
								profilePicture: userData.profilePicture,
							}}
						/>
						<div className="flex flex-col gap-2 items-start">
							<strong>{userData.name}</strong>
							<span className="bg-amber-500/50 font-bold text-xs px-2 py-1 gap-1 rounded-full inline-flex items-center">
								<StarIcon size={16} /> <span>{userData.points || 0} pts</span>
							</span>
						</div>
					</div>
					<ul className="flex gap-6 mt-4 ">
						{userStats.map((stat) => (
							<li key={stat.label} className="text-center">
								<small className="text-muted-foreground">{stat.label}</small>
								<p className="font-medium">{stat.count}</p>
							</li>
						))}
					</ul>
				</section>

				<section className="w-full flex flex-col items-end lg:col-span-2 col-span-3">
					<Tabs defaultValue="reposta-tab" className="w-full">
						<TabsList className="text-foreground h-auto gap-2 rounded-none bg-transparent px-0 py-1 flex justify-end lg:ms-auto">
							<TabsTrigger
								value="reposta-tab"
								className="cursor-pointer data-[state=active]:after:bg-emerald-600 relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none"
							>
								Respostas
							</TabsTrigger>
							<TabsTrigger
								value="perguntas-tab"
								className="cursor-pointer hover:bg-accent hover:text-foreground data-[state=active]:after:bg-cyan-600 data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-none"
							>
								Perguntas
							</TabsTrigger>
							<TabsTrigger
								value="melhor-resposta-tab"
								className="cursor-pointer hover:bg-accent hover:text-foreground data-[state=active]:after:bg-amber-600 data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-none"
							>
								Melhor Resposta
							</TabsTrigger>
						</TabsList>
						<TabsContent value="reposta-tab">
							<ul className="space-y-4">
								{userData.answersProvided.map((answer) => (
									<li key={answer.id}>
										<Card>
											<CardHeader className="text-xs flex items-center justify-between">
												<div className="flex items-center gap-2">
													{answer.author && (
														<>
															<AvatarAuthor author={answer.author} size="sm" />
															<div>
																<strong className="text-xs">{answer.author.name}</strong>
																<small className="block text-zinc-400">
																	<time dateTime={new Date(answer.createdAt).toISOString()}>
																		{new Date(answer.createdAt).toLocaleDateString("pt-BR", {
																			day: "numeric",
																			month: "long",
																			year: "numeric",
																		})}
																	</time>
																</small>
															</div>
														</>
													)}
												</div>
											</CardHeader>
											<CardContent className="text-sm">
												<div
													// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
													dangerouslySetInnerHTML={{
														__html: answer.content,
													}}
												></div>
											</CardContent>
										</Card>
									</li>
								))}
							</ul>
						</TabsContent>
						<TabsContent value="perguntas-tab">
							<p className="text-muted-foreground p-4 text-center text-xs">
								Content for Tab 2
							</p>
						</TabsContent>
						<TabsContent value="melhor-resposta-tab">
							<p className="text-muted-foreground p-4 text-center text-xs">
								Content for Tab 3
							</p>
						</TabsContent>
					</Tabs>



				</section>

			</div>
		</main>
	);
}