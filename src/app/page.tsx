import Header from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Header />

      <div className="flex justify-center">
        <div className="text-center max-w-6xl mt-5 px-5 mx-5">
          <h1 className="text-white text-6xl font-black font-[family-name:var(--font-outfit)]">
            Qual sua duvida?
          </h1>
          <p className="text-white-70 mt-3 mb-4 mx-5 px-5">
            No Vade Mecum UFT, sua pergunta encontra a resposta da comunidade.
            Seja uma dúvida sobre a matéria, uma questão de prova antiga ou um
            tópico desafiador, digite abaixo e conecte-se com seus colegas.
          </p>
        </div>
      </div>
    </div>
  );
}
