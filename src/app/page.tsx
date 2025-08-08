import Header from "@/components/header";
import { RecentQuestionsList } from "@/components/questions/recent-questions-list";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Home() {


  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] max-w-6xl mx-auto">
      <Header />

      <div className="flex justify-center items-center min-h-96 my-10">
        <div className="text-center max-w-5xl mt-5 px-5 mx-5">
          <h1 className="text-7xl font-black font-[family-name:var(--font-outfit)]">
            Qual sua dúvida?
          </h1>
          <p className="text-white-70 mt-4 mb-8 mx-5 px-5">
            No Vade Mecum UFT, sua pergunta encontra a resposta da comunidade.
            Seja uma dúvida sobre a matéria, uma questão de prova antiga ou um
            tópico desafiador, digite abaixo e conecte-se com seus colegas.
          </p>
          <div className="grow">
            <div className="relative mx-auto w-full max-w-xl">
              <Input
                className="peer h-12 ps-10 pe-14 focus-visible:border-cyan-300/80 focus-visible:ring-cyan-300/50"
                placeholder="Prova de POO 2025/1..."
                type="search"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-4">
                <kbd className="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

        </div>
      </div>

      <section className="max-w-4xl mx-auto mt-5 px-5">
        <strong className="block mb-4">Perguntas recentes</strong>
        <RecentQuestionsList />
      </section>
    </div>
  );
}
