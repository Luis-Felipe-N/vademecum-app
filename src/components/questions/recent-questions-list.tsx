"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useGetRecentQuestions } from "@/http/use-get-questions";
import { Loader2 } from "lucide-react";

export function RecentQuestionsList() {
  const { data: questions, isLoading, isError, error } = useGetRecentQuestions();
  
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
    <div className="space-y-4">
      {questions && questions.length > 0 ? (
        questions.map((question) => (
          <Card key={question.id} className="bg-zinc-900">
            <CardHeader className="text-xs flex items-center justify-between">
              <nav className="flex items-center gap-2">
                <a className="underline" href="#">
                  #{question.subject.name}
                </a>
              </nav>
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
              <div className="flex items-center gap-4 mt-4 text-xs">
                <span className="text-white-50">
                  0 respostas
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Responder</Button>
            </CardFooter>
          </Card>
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
  );
}