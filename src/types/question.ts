import type { Question as QuestionPrisma, Subject, User } from "@prisma/client";
import type { AnswerResponse } from "./answer";

export type Question = QuestionPrisma & {
	_count?: {
		answers: number;
	};
};

export type CreateQuestionData = {
	subjectId: string | null;
	title: string;
	content: string;
	file?: string;
};

export type QuestionResponse = Question & {
	author: Partial<User>;
	subject: Pick<Subject, "name">;
	answers?: AnswerResponse[];
};

export type CreateQuestionError = {
	message: string;
};
