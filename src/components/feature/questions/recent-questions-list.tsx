"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useGetRecentQuestions } from "@/http/use-get-questions";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import Link from "next/link";
import Image from "next/image";

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
    <>
      <strong className="block mb-4">Perguntas recentes</strong>
      <div className="space-y-4">
        {questions && questions.length > 0 ? (
          questions.map((question) => (
            <Card key={question.id} className="bg-zinc-950/20">
              <CardHeader className="text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar >
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
                      <a className="underline text-accent-foreground/70 text-xs" href="#">
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
              <CardContent className="text-white-70">
                <strong className="text-2xl">{question.title}</strong>
                <p className="text-white-70 mt-4 line-clamp-3">
                  {question.content}
                </p>

                {question.file && (
                  <figure className="my-4">
                    <div className="flex justify-center bg-accent p-1">
                      <Image
                        width={384}
                        height={500}
                        src={question.file}
                        alt="Exemplo de interface de usuário responsiva"
                        className="text-center rounded-lg object-cover max-h-96"
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
                    0 respostas
                  </span>
                </div>
                <Button className="text-white  hover:bg-cyan-700" title="Trabalhando nisso...">
                  <Link href={`/question/${question.id}`}>
                    Responder
                  </Link>
                </Button>
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
    </>
  );
}