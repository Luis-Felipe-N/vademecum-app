"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { use } from "react";
import { AvatarAuthor } from "@/components/core/avatar-user";
import { Answer } from "@/components/feature/answer";
import CreateAnswerModal from "@/components/feature/answer/create-answer/create-answer-modal";
import Login from "@/components/feature/auth/login";
import { AlreadyAnswered } from "@/components/feature/question/already-answered";
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
	const { data: answers, refetch: refetchAnswers } = useGetAnswer(1, id);

	const { data, status } = useSession();

	const bestAnswer = answers?.find((answer) => answer.isBestAnswer === true);
	const bestAnswerId = bestAnswer ? bestAnswer.id : null;

	const handleOnSetBestAnswer = () => {
		refetchAnswers();
	};

	const handleOnCreateAnswer = () => {
		refetchAnswers();
	};

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
			<CreateAnswerModal
				questionId={id}
				onCreateAnswer={handleOnCreateAnswer}
			/>
			<main className="max-w-6xl mx-auto mb-10">
				<div className="">
					<div className="lg:w-2/3 px-8 lg:px-0 space-y-6">
						<Card className="border-2">
							<CardHeader className="text-xs flex items-center justify-between">
								<div className="flex items-center gap-2">
									{question?.author && (
										<AvatarAuthor author={question.author} />
									)}

									<div>
										<strong className="text-xs">{question.author.name}</strong>
										<nav className="flex items-center gap-2">
											{question.subjects.map((subject) => (
												<a
													key={subject.name}
													className="underline text-accent-foreground/70 text-xs"
													href={`/subject/${subject.code?.toLocaleLowerCase()}`}
												>
													#{subject.name}
												</a>
											))}
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
								{bestAnswer && bestAnswerId ? (
									<AlreadyAnswered author={bestAnswer?.author} />
								) : !(status === 'authenticated') ? (
									<Login />
								) : (
									<Link href={`/question/${question.id}/#answer`}>
										<Button className="text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
											Responder
										</Button>
									</Link>
								)}
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
									<Answer
										answer={answer}
										isAuthor={
											data?.user ? data.user.id === question.authorId : false
										}
										bestAnswerId={bestAnswerId}
										onSetBestAnswer={handleOnSetBestAnswer}
										key={answer.id}
									/>
								))
							)}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
