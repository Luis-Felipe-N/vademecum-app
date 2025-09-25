"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronRight, Coins, Loader2, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { use } from "react";
import { AvatarAuthor } from "@/components/core/avatar-user";
import { Answer } from "@/components/feature/answer";
import CreateAnswerModal from "@/components/feature/questions/create-answer/create-answer-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { useGetAnswer } from "@/http/use-get-answer";
import { useGetQuestion } from "@/http/use-get-quetion";
import type { AnswerResponse } from "@/types/answer";

interface QuestionPageProps {
	params: Promise<{ id: string }>;
}

export default function QuestionView({ params }: QuestionPageProps) {
	const { id } = use(params);

	const { data: question, isLoading, isError } = useGetQuestion(id);
	const { data: answers } = useGetAnswer(1, id);

	const { data } = useSession();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center p-10">
				<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isError || !question) {
		return (
			<div className="text-center text-red-500">Pergunta não encontrada.</div>
		);
	}

	return (
		<>
			<CreateAnswerModal questionId={id} />
			<main className="max-w-6xl mx-auto mb-10">
				<div className="gap-6 flex items-start">
					<div className="max-w-2/3 space-y-6">
						<Card className="bg-emerald-950/20 border-emerald-800/10 border-2">
							<CardHeader className="text-xs flex items-center justify-between">
								<div className="flex items-center gap-2">
									{question?.author && (
										<AvatarAuthor author={question.author} />
									)}

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

						<hr className="" />

						<div className="">
							<h3>Respostas: </h3>
						</div>
						<div className=" space-y-4">
							{answers?.length === 0 ? (
								<p className="text-zinc-400">
									Nenhuma resposta ainda. Seja o primeiro!
								</p>
							) : (
								answers?.map((answer: AnswerResponse) => (
									<Answer answer={answer} key={answer.id} />
								))
							)}
						</div>
					</div>

					<div className="max-w-1/3 w-full hidden lg:block ">
						{data?.user && (
							<Card className="w-full pb-0">
								<CardHeader>
									{/* <h3 className="text-lg">Seu perfil</h3> */}
								</CardHeader>
								<CardContent className="space-y-4 p-0">
									<div className="flex items-center gap-4 px-4">
										<div className="rounded-full p-1 bg-gradient-to-b from-cyan-600 to-emerald-600">
											<AvatarAuthor author={data.user} size="lg" />
										</div>
										<div className="flex flex-col">
											<strong className="text-md mb-1">{data.user.name}</strong>
											<strong className="bg-amber-400/50 text-xs px-2 py-1 rounded-full">
												principiante</strong>
										</div>
									</div>
									<div className="border-b border-accent-foreground/10 pb-4 px-4">
										<span className="bg-amber-400/50 text-xs px-1.5 py-1 rounded-full inline-flex gap-1">
											<Coins size={16} />
											<strong>10</strong> Pts
										</span>
									</div>

									<div className="border-b border-accent-foreground/10 pb-4 px-4 m-0">
										<strong className="text-sm">Conquistas</strong>
										<ul className="text-sm text-zinc-300 mt-2 space-y-1 list-disc ms-6">
											<li><strong>2340</strong> votos</li>
											<li><strong>4</strong> perguntas respondidas</li>
											<li><strong>10</strong> perguntas</li>
										</ul>
									</div>
									<div className="flex justify-center">
										<Link href={`/profile/${data.user.id}`} className="text-amber-400/50  hover:text-amber-500/50 flex items-center gap-1 text-sm font-medium p-4">
											Acessar meu perfil
											<ChevronRight size={20} />
										</Link>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</main>
		</>
	);
}
