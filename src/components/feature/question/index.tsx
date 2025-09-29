import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AvatarAuthor } from "@/components/core/avatar-user";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { QuestionResponse } from "@/types/question";

interface QuestionProps {
	question: QuestionResponse;
}

export function Question({ question }: QuestionProps) {
	const hasBestAnswer = question.answers?.find(
		(answer) => answer.isBestAnswer === true,
	);

	return (
		<article>
			<Link href={`/question/${question.id}#answer`}>
				<Card className="bg-zinc-950/20 hover:ring-2 hover:ring-emerald-800/50 transition">
					<CardHeader className="text-xs flex items-center justify-between">
						<div className="flex items-center gap-2">
							<AvatarAuthor author={question.author} />
							<div>
								<strong className="text-xs">{question.author.name}</strong>
								<nav className="flex items-center gap-2">
									<span className="underline text-accent-foreground/70 text-xs">
										#{question.subject.name}
									</span>
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
					<CardContent className="text-white-70">
						<strong className="text-2xl">{question.title}</strong>
						<p className="text-white-70 mt-4 line-clamp-3">
							{question.content}
						</p>

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
						<div className="flex items-center gap-4 text-xs">
							<span className="text-white-50">
								{question._count?.answers ?? 0} respostas
							</span>
						</div>

						{hasBestAnswer ? (
							<div className="text-emerald-600 flex gap-1 items-center bg-emerald-950/50 border-emerald-800/50 px-3 py-2 rounded-2xl">
								<Check size={17} />
								<small className="">
									{" "}
									Respondida 
								</small>
							</div>
						) : (
							<Button
								className="text-white bg-emerald-600  hover:bg-emerald-700"
								title="Trabalhando nisso..."
							>
								Responder
							</Button>
						)}
					</CardFooter>
				</Card>
			</Link>
		</article>
	);
}
