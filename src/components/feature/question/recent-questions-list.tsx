"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { useGetQuestions } from "@/http/use-get-questions";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Question } from ".";

export function RecentQuestionsList() {
	const searchParams = useSearchParams();
	const query = searchParams.get("query") ?? "";
	const {
		data: questions,
		isLoading,
		isError,
		error,
	} = useGetQuestions(query);

	console.log("QUESTIONS", questions, query);
	if (isLoading) {
		return (
			<div className="flex justify-center items-center p-10">
				<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isError) {
		return (
			<Card>
				<CardContent className="pt-6">
					<p className="text-center text-destructive">
						Erro ao carregar perguntas: {error.message}
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<strong className="block mb-4">Perguntas recentes</strong>
			<div className="space-y-4">
				{questions && questions.length > 0 ? (
					questions.map((question) => (
						<Question question={question} key={question.id}/>
					))
				) : (
					<Card>
						<CardContent className="pt-6">
							<p className="text-center text-muted-foreground">
								Nenhuma pergunta foi feita ainda. Seja o primeiro a perguntar!
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</>
	);
}
