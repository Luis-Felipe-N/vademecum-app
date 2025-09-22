import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
}

export function Answer({ answer }: AnswerProps) {
	const [votes, setVotes] = useState(answer._count?.votes ?? 0);

	const handleVote = async () => {
		try {
			const response = fetch("/api/answer/vote", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ answerId: answer.id }),
			});

			console.log(response);

			toast.promise(response, {
				loading: "Publicando voto...",
				success: () => {
					setVotes((prevVotes) => prevVotes + 1);

					return "Voto registrado com sucesso";
				},
				error: (err) => {
					console.log(err);
					return `Erro ao registrar voto: ${err}`;
				},
			});
		} catch (error) {}
	};

	return (
		<Card key={answer.id} className={` border-2`}>
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
				<div className="flex items-center hover:bg-red-400/10 hover:text-accent-foreground rounded-md pe-3">
					<Button
						variant="ghost"
						size="icon"
						title={`Curtir resposta de ${answer.author.name}`}
						className="cursor-pointer hover:bg-transparent ps-0"
						onClick={handleVote}
					>
						<ThumbsUp className="" />
					</Button>
					<span className="text-zinc-400 text-xs flex items-center gap-1">
						{votes}
					</span>
				</div>
			</CardFooter>
		</Card>
	);
}
