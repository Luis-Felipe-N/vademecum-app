import { api } from "@/lib/api";
import type { Subject } from "@prisma/client";

export async function getAvailableSubjects(): Promise<Subject[]> {
  const response = await api("/api/subject/list");
  if (!response.ok) throw new Error("Falha ao buscar matérias.");
  return response.json();
}