"use client";

import type { Answer } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { HandHeart, HeartIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import CreateAnswerModal from "@/components/feature/questions/create-answer/create-answer-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { AnswerResponse } from "@/types/answer";
import type { QuestionResponse } from "@/types/question";

const getQuestionById = async (id: string) => {
	const response = await fetch(`/api/question/${id}`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data: QuestionResponse = await response.json();
	console.log("Fetched question data:", data, response);
	return data;
};

interface QuestionPageProps {
	params: Promise<{ id: string }>;
}

export default function QuestionView({ params }: QuestionPageProps) {
	const { id } = use(params);

	const {
		data: question,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["question", id],
		queryFn: () => getQuestionById(id),
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center p-10">
				<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-center text-red-500">
				Erro ao carregar a pergunta.
			</div>
		);
	}

	if (!question) {
		return (
			<div className="text-center text-red-500">
				Pergunta não encontrada.
			</div>
		);
	}

	return (
		<>
			<CreateAnswerModal questionId={id} />
			<main className="max-w-6xl mx-auto mb-10">
				<div className="grid grid-cols-3 md:grid-cols-3 gap-6">
					<div className="col-span-2">
						<Card className="bg-emerald-950/20 border-emerald-800/10 border-2">
							<CardHeader className="text-xs flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Avatar className="h-12 w-12">
										{question.author.profilePicture && (
											<AvatarImage
												src={question.author.profilePicture || ""}
												alt="Profile image"
											/>
										)}
										<AvatarFallback>
											{question.author.name?.charAt(0).toUpperCase() || "U"}
										</AvatarFallback>
									</Avatar>
									<div>
										<strong className="text-xs">{question.author.name}</strong>
										<nav className="flex items-center gap-2">
											<a
												className="underline text-accent-foreground/70 text-xs"
												href={`/subject/${question.subject.name}`}
											>
												#{question.subject.name}
											</a>
										</nav>
									</div>
								</div>
								<time dateTime={new Date(question.createdAt).toISOString()}>
									{new Date(question.createdAt).toLocaleDateString("pt-BR", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</time>
							</CardHeader>
							<CardContent>
								<strong className="text-2xl text-zinc-50">
									{question.title}
								</strong>
								<p className="text-zinc-300 mt-4">{question.content}</p>
								{question.file && (
									<figure className="my-4">
										<div className="flex justify-center bg-accent ">
											<Image
												width={1000}
												height={500}
												src={question.file}
												alt="Exemplo de interface de usuário responsiva"
												className="text-center  object-cover w-full"
											/>
										</div>
										<figcaption className="text-xs text-white/60 mt-2">
											<span lang="pt">Enviado por {question.author.name}</span>
										</figcaption>
									</figure>
								)}
							</CardContent>
							<CardFooter className="flex justify-between items-center">
								<span className="text-zinc-400 text-xs">
									{question._count?.answers ?? 0} respostas
								</span>
								<Link href={`/question/${question.id}/#answer`}>
									<Button className="text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
										Responder
									</Button>
								</Link>
							</CardFooter>
						</Card>
					</div>

					<hr className="col-span-2" />

					<div className="col-span-2">
						<h3>Respostas: </h3>
					</div>
					<div className="col-span-2 space-y-4">
						{question.answers?.length === 0 ? (
							<p className="text-zinc-400">
								Nenhuma resposta ainda. Seja o primeiro!
							</p>
						) : (
							question.answers?.map((answer: AnswerResponse, index: number) => (
								<Card
									key={answer.id}
									className={`${index === 0 ? "bg-cyan-950/30 border-cyan-800/20" : "mt-4"} border-2`}
								>
									<CardHeader className="text-xs flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Avatar className="h-12 w-12">
												{question.author.profilePicture && (
													<AvatarImage
														src={question.author.profilePicture || ""}
														alt="Profile image"
													/>
												)}
												<AvatarFallback>
													{answer.author.name?.charAt(0).toUpperCase() || "U"}
												</AvatarFallback>
											</Avatar>
											<div>
												<strong className="text-xs">
													{question.author.name}
												</strong>
												<nav className="flex items-center gap-2">
													<a
														className="underline text-accent-foreground/70 text-xs"
														href={`/subject/${question.subject.name}`}
													>
														#{question.subject.name}
													</a>
												</nav>
											</div>
										</div>
										<time dateTime={new Date(answer.createdAt).toISOString()}>
											{new Date(answer.createdAt).toLocaleDateString(
												"pt-BR",
												{
													day: "numeric",
													month: "long",
													year: "numeric",
												},
											)}
										</time>
									</CardHeader>
									<CardContent>
										{/** biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
										<div dangerouslySetInnerHTML={{
											__html: answer.content,
										}}></div>
										{question.file && (
											<figure className="my-4">
												<div className="flex justify-center bg-accent ">
													<Image
														width={1000}
														height={500}
														src={question.file}
														alt="Exemplo de interface de usuário responsiva"
														className="text-center  object-cover w-full"
													/>
												</div>
												<figcaption className="text-xs text-white/60 mt-2">
													<span lang="pt">
														Enviado por {question.author.name}
													</span>
												</figcaption>
											</figure>
										)}
									</CardContent>
									<CardFooter className="flex justify-between items-center">
										<span className="text-zinc-400 text-xs flex items-center gap-1">
											0 Curtidas
										</span>
										<Button title={`Curtir resposta de ${question.author.name}`} className="text-white bg-red-500/80 hover:bg-red-600 cursor-pointer">
											Curtir
										</Button>
									</CardFooter>
								</Card>
							))
						)}
					</div>
				</div>
			</main>
		</>
	);
}
