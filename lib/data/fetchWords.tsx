import type { WordPaginated } from "@/types/word";

/**
 * Obtiene palabras paginadas del backend (GET /words/).
 * @param skip - Número de registros a saltar (default 0)
 * @param limit - Máximo de registros (1-100, default 20)
 */
export async function fetchWords(skip = 0, limit = 20): Promise<WordPaginated> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  const response = await fetch(`${apiUrl}words/?${params}`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail ?? `Error ${response.status}`);
  }
  const json = await response.json();
  return json as WordPaginated;
}

