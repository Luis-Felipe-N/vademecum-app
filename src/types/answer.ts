import type { Answer, Subject, User, Vote } from "@prisma/client";

export type CreateAnswerData = {
	content: string;
	file?: string;
};

export type AnswerResponse = Answer &
	{
	author: Partial<User>;
	votes: Array<Partial<Vote>>;
	subjects: Array<Partial<Subject> | null>;
}

export type CreateAnswerError = {
	message: string;
};
