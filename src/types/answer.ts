import type { Answer, Subject, User } from "@prisma/client";

export type CreateAnswerData = {
	content: string;
	file?: string;
};

export type AnswerResponse = Answer & {
	author: Partial<User>;
	subject: Pick<Subject, "name">;
};

export type CreateAnswerError = {
	message: string;
};
