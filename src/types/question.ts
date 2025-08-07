import type { Question, Subject, User } from "@prisma/client"

export type CreateQuestionData = {
  subjectId: string | null
  title: string
  content: string
}

export type QuestionResponse = Question &{
  author: Partial<User>; 
  subject: Pick<Subject, "name">;
}

export type CreateQuestionError = {
  message: string
}