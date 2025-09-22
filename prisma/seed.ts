import { faker } from "@faker-js/faker/locale/pt_BR";
import { PrismaClient, QuestionStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	console.log(
		"Iniciando o processo de seeding com 100 perguntas e 3 respostas cada...",
	);

	// --- Criar 5 usuários de teste para que as respostas pareçam de pessoas diferentes ---
	const password = await hash("senha123", 10);
	const usersToCreate = [];
	for (let i = 0; i < 5; i++) {
		usersToCreate.push({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: password,
		});
	}

	const createdUsers = await prisma.$transaction(
		usersToCreate.map((userData) =>
			prisma.user.upsert({
				where: { email: userData.email },
				update: {},
				create: userData,
			}),
		),
	);
	console.log(`${createdUsers.length} usuários criados ou encontrados.`);

	// --- Criar 5 matérias (subjects) ---
	const subjects = [
		{ name: "Matemática", code: "MAT" },
		{ name: "Física", code: "FIS" },
		{ name: "Química", code: "QUI" },
		{ name: "Biologia", code: "BIO" },
		{ name: "História", code: "HIS" },
	];

	const createdSubjects = await Promise.all(
		subjects.map((data) =>
			prisma.subject.upsert({
				where: { name: data.name },
				update: {},
				create: data,
			}),
		),
	);
	console.log("Matérias criadas ou encontradas.");

	// --- Gerar 100 perguntas com dados realistas do Faker ---
	const questionsToCreate = [];
	const numberOfQuestions = 100;

	for (let i = 1; i <= numberOfQuestions; i++) {
		const randomSubject = faker.helpers.arrayElement(createdSubjects);
		const title = faker.lorem.sentence({ min: 5, max: 10 });
		const content = faker.lorem.paragraphs({ min: 1, max: 3 });

		questionsToCreate.push({
			title: title,
			content: content,
			authorId: faker.helpers.arrayElement(createdUsers).id,
			subjectId: randomSubject.id,
			status: QuestionStatus.OPEN,
		});
	}

	const createdQuestions = await prisma.$transaction(
		questionsToCreate.map((questionData) =>
			prisma.question.create({ data: questionData }),
		),
	);
	console.log(
		`${createdQuestions.length} perguntas criadas com dados do Faker.`,
	);

	// --- Criar 3 respostas para CADA pergunta ---
	const answersToCreate = [];
	for (const question of createdQuestions) {
		for (let i = 0; i < 3; i++) {
			answersToCreate.push({
				content: faker.lorem.paragraph({ min: 1, max: 2 }),
				authorId: faker.helpers.arrayElement(createdUsers).id,
				questionId: question.id,
			});
		}
	}

	const createdAnswers = await prisma.$transaction(
		answersToCreate.map((answerData) =>
			prisma.answer.create({ data: answerData }),
		),
	);
	console.log(`${createdAnswers.length} respostas criadas.`);

	console.log("Seeding concluído com sucesso!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
