import { ArrowUp, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { AnswerResponse } from "@/types/answer";

interface AnswerProps {
	answer: AnswerResponse;
	isAuthor: boolean;
	onSetBestAnswer: (answerId: string) => void;
	bestAnswerId: string | null;
}

export function Answer({
	answer,
	isAuthor,
	onSetBestAnswer,
	bestAnswerId,
}: AnswerProps) {
	const { data: sessionData } = useSession();
	const [votesCount, setVotesCount] = useState(answer._count?.votes ?? 0);
	const [hasVoted, setHasVoted] = useState(false);

	const isBestAnswer = bestAnswerId === answer.id;

	useEffect(() => {
		if (sessionData?.user) {
			setHasVoted(
				!!answer.votes.find((vote) => vote.authorId === sessionData.user.id),
			);
		}
	}, [sessionData, answer.votes]);

	const handleVote = async () => {
		try {
			if (hasVoted) {
				toast.info("Você já votou nesta resposta.");
				return;
			}

			const response = await fetch("/api/answer/vote", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ answerId: answer.id }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Erro ao registrar voto.");
			}

			setVotesCount((prev) => prev + 1);
			setHasVoted(true);
			toast.success("Voto registrado com sucesso!");
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	const handleSetBestAnswer = async () => {
		try {
			const response = await fetch("/api/answer/best", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ answerId: answer.id }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || "Erro ao marcar como melhor resposta.",
				);
			}

			onSetBestAnswer(answer.id);
			toast.success("Resposta marcada como a melhor!");
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	return (
		<Card
			key={answer.id}
			className={`border-2 ${isBestAnswer ? `bg-emerald-950/50 border-emerald-800/50` : ""}`}
		>
			<CardHeader className="text-xs flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar className="h-12 w-12">
						{answer.author.profilePicture && (
							<AvatarImage
								src={answer.author.profilePicture || ""}
								alt="Profile image"
							/>
						)}
						<AvatarFallback>
							{answer.author.name?.charAt(0).toUpperCase() || "U"}
						</AvatarFallback>
					</Avatar>
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
				</div>
				{isAuthor && !bestAnswerId && (
					<Button
						className={`mt-4 sm:mt-0 ${
							isBestAnswer
								? "bg-emerald-600 text-white"
								: "bg-transparent text-emerald-600 border border-emerald-600 hover:bg-emerald-600 hover:text-white"
						} `}
						onClick={handleSetBestAnswer}
						disabled={isBestAnswer}
					>
						{isBestAnswer ? (
							<>
								<Star size={16} strokeWidth={2} absoluteStrokeWidth />
								<span className="ml-2">Melhor Resposta</span>
							</>
						) : (
							<>
								<Star size={16} strokeWidth={2} absoluteStrokeWidth />
								<span className="ml-2">Marcar como a Melhor</span>
							</>
						)}
					</Button>
				)}
			</CardHeader>
			<CardContent>
				<div
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: answer.content,
					}}
				></div>
			</CardContent>
			<CardFooter className="flex justify-between items-center">
				<Button
					variant="outline"
					title={`Curtir resposta de ${answer.author.name}`}
					className={`cursor-pointer bg-transparent  ${hasVoted ? `text-emerald-500 bg-emerald-950 border-emerald-700` : `text-zinc-400 hover:bg-zinc-800`}`}
					disabled={hasVoted}
					onClick={handleVote}
				>
					<div className={`flex items-center gap-2`}>
						<ArrowUp className="" />
						<span className={`text-xs flex items-center gap-1 `}>
							{votesCount}
						</span>
					</div>
				</Button>
			</CardFooter>
		</Card>
	);
}
