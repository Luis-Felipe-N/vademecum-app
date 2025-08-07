import CreateQuestionModal from "@/components/create-question-modal";
import Header from "@/components/header";
import { RecentQuestionsList } from "@/components/recent-questions-list";

export default function Home() {


  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Header />

      <div className="flex justify-center pt-10 pb-10">
        <div className="text-center max-w-5xl mt-5 px-5 mx-5">
          <h1 className="text-6xl font-black font-[family-name:var(--font-outfit)]">
            Qual sua dúvida?
          </h1> 
          <p className="text-white-70 mt-8 mb-4 mx-5 px-5">
            No Vade Mecum UFT, sua pergunta encontra a resposta da comunidade.
            Seja uma dúvida sobre a matéria, uma questão de prova antiga ou um
            tópico desafiador, digite abaixo e conecte-se com seus colegas.
          </p>

          <CreateQuestionModal />
        </div>
      </div>

      <section className="max-w-4xl mx-auto mt-5 px-5">
        <strong className="block mb-4">Perguntas recentes</strong>
        <RecentQuestionsList />
          {/* <Card>
            <CardHeader className="text-white text-xs flex items-center justify-between">
              <nav className="flex items-center gap-2">
                <a className="underline" href="">#UX</a>
                <a className="underline" href="">#UI</a>
                <a className="underline" href="">#Front-end</a>
                <a className="underline" href="">#Back-end</a>
                <a className="underline" href="">#DevOps</a>
              </nav>
              <time dateTime="2023-10-01T12:00:00Z" className="text-white-50">
                1 de outubro de 2023
              </time>
            </CardHeader>
            <CardContent className="text-white-70">
            
            <strong className="text-3xl">Como criar uma interface de usuário responsiva?</strong>
            <p className="text-white-70 mt-4">
              Estou tentando fazer uma página que se adapte a diferentes tamanhos
              de tela, mas não sei por onde começar. Alguma dica?
            </p>
            <figure className="my-4">
             <div className="flex justify-center bg-accent p-1">
               <img
              src="https://cdn.dribbble.com/userupload/15215190/file/original-25e4f6f605193322cc2151062f8ce0a6.jpg?resize=1024x768&vertical=center"
              alt="Exemplo de interface de usuário responsiva"
              className="text-center rounded-lg object-cover max-h-72"
              />
             </div>
              <figcaption className="text-xs text-white/60 mt-2">
                <span lang="pt">Exemplo de interface de usuário responsiva</span>
              </figcaption>
            </figure>
            <div className="flex items-center gap-2 mt-4 text-xs text-white/70">
              <span className="text-white-50">2 respostas</span> 
              <span className="text-white-50">30 curtidas</span> 
            </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full ">
                Responder
              </Button>
            </CardFooter>
          </Card> */}
        
      </section>
    </div>
  );
}
