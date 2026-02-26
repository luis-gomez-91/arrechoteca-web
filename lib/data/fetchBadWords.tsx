import type { BadWord } from "@/types/bad_word";
import type { InsultTag } from "@/types/bad_word";
import type { InsultCommentType } from "@/types/bad_word";

const apiUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchBadWords(accessToken?: string | null): Promise<BadWord[]> {
  const headers: HeadersInit = {};
  if (accessToken) (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  const response = await fetch(`${apiUrl()}bad_words/`, { headers });
  if (!response.ok) throw new Error("Error al cargar puteadas");
  return response.json();
}

export async function fetchBadWordById(id: number, accessToken?: string | null): Promise<BadWord> {
  const headers: HeadersInit = {};
  if (accessToken) (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  const response = await fetch(`${apiUrl()}bad_words/${id}`, { headers });
  if (!response.ok) throw new Error("Puteada no encontrada");
  return response.json();
}

export async function fetchInsultComments(insultId: number, accessToken?: string | null): Promise<InsultCommentType[]> {
  const headers: HeadersInit = {};
  if (accessToken) (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  const response = await fetch(`${apiUrl()}bad_words/${insultId}/comments`, { headers });
  if (!response.ok) throw new Error("Error al cargar comentarios");
  return response.json();
}

export async function fetchInsultTags(): Promise<InsultTag[]> {
  const response = await fetch(`${apiUrl()}bad_words/tags`);
  if (!response.ok) throw new Error("Error al cargar tags");
  return response.json();
}
