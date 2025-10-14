import type { User, Vote } from "@prisma/client";
import type { AnswerResponse } from "./answer";
import type { QuestionResponse } from "./question";

export type UserResponse = User & {
	answersProvided: Array<AnswerResponse>;
	questionsCreated: Array<Partial<QuestionResponse>>;
	votes: Array<Partial<Vote>>;
	_count: {
		answersProvided: number;
		questionsCreated: number;
		votes: number;
	};
};


export interface UserRanking {
  id: string;
  name: string;
  profilePicture: string;
  points: number;
  level: number;
  _count: {
    questionsCreated: number;
    answersProvided: number;
  };
  bestAnswersCount: number;
}
