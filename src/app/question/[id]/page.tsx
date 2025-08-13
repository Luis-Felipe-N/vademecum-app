// file: components/question-view.tsx

"use client"; // This marks the component as a Client Component

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2, MessageSquare } from "lucide-react";

// Import your UI components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { use } from "react";

// The fetcher function that useQuery will call
// Because this runs on the client, relative URLs are fine.
const getQuestionById = async (id: string) => {
  const response = await fetch(`/api/question/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  console.log("Fetched question data:", data, response);
  return data;
};

interface QuestionPageProps {
  params: Promise<{ id: string }>;
}

export default function QuestionView({ params }: QuestionPageProps) {
  const { id } = use(params)

  const {
    data: question,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["question", id], // A unique key for this query
    queryFn: () => getQuestionById(id),
  });

  // Handle the loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }


  // Handle the error state
  if (isError) {
    return <div className="text-center text-red-500">Erro ao carregar a pergunta.</div>;
  }

  console.log(question)

  // Render the data on success
  return (
    <Card className="bg-zinc-950/20 border-zinc-800">
      <CardHeader className="text-xs flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={question.author.profilePicture || ""} alt="Profile image" />
            <AvatarFallback>{question.author.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <strong className="text-sm">{question.author.name}</strong>
            <a className="block underline text-accent-foreground/70 text-xs" href="#">
              #{question.subject.name}
            </a>
          </div>
        </div>
        <time className="text-xs text-zinc-400" dateTime={new Date(question.createdAt).toISOString()}>
          {new Date(question.createdAt).toLocaleDateString("pt-BR", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </time>
      </CardHeader>
      <CardContent>
        <strong className="text-2xl text-zinc-50">{question.title}</strong>
        <p className="text-zinc-300 mt-4">{question.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-zinc-400 text-xs">0 respostas</span>
        <Link href={`/question/${question.id}/#answer-form`}>
          <Button className="text-white bg-cyan-600 hover:bg-cyan-700">
            <MessageSquare className="mr-2 h-4 w-4" />
            Responder
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}