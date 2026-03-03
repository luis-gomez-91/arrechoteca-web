import type { WordPaginated } from "@/types/word";

/**
 * Obtiene palabras paginadas del backend (GET /words/).
 * @param skip - Número de registros a saltar (default 0)
 * @param limit - Máximo de registros (1-100, default 20)
 */
export async function fetchWords(skip = 0, limit = 20): Promise<WordPaginated> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL no está configurada");
  }
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  const response = await fetch(`${apiUrl}words/?${params}`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { detail?: string };
    throw new Error(err.detail ?? `Error ${response.status}`);
  }
  const json = await response.json();
  // Normalizar: el backend puede devolver { items, total, skip, limit } o un array
  if (Array.isArray(json)) {
    return { items: json, total: json.length, skip: 0, limit: json.length };
  }
  const items = json.items ?? json.results ?? json.data ?? [];
  const total = typeof json.total === "number" ? json.total : (json.count ?? items.length);
  return {
    items: Array.isArray(items) ? items : [],
    total,
    skip: typeof json.skip === "number" ? json.skip : skip,
    limit: typeof json.limit === "number" ? json.limit : limit,
  };
}

