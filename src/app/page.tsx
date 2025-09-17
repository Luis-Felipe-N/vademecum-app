import { Suspense } from "react";
import { RecentQuestionsList } from "@/components/feature/questions/recent-questions-list";
import { SearchQuestions } from "@/components/feature/questions/search-questions";

export default async function Home() {
	return (
		<>
			<div className="flex justify-center items-center min-h-96 my-10">
				<div className="text-center max-w-5xl mt-5 px-5 mx-5">
					<h1 className="text-7xl font-black font-[family-name:var(--font-outfit)]">
						Qual sua dúvida?
					</h1>
					<p className="text-white-70 mt-4 mb-8 mx-5 px-5">
						No Vade Mecum, sua pergunta encontra a resposta da comunidade. Seja
						uma dúvida sobre a matéria, uma questão de prova antiga ou um tópico
						desafiador, digite abaixo e conecte-se com seus colegas.
					</p>
					<Suspense>
						<SearchQuestions />
					</Suspense>
				</div>
			</div>

			<section className="max-w-4xl mx-auto mt-5 px-5">
				<Suspense>
					<RecentQuestionsList />
				</Suspense>
			</section>
		</>
	);
}
