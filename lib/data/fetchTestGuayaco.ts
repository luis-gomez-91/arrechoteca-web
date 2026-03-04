import type {
  TestGuayacoQuestion,
  TestGuayacoPaginated,
  TestGuayacoCreatePayload,
  TestGuayacoUpdatePayload,
} from "@/types/testGuayaco";

const apiUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "";

/** Listar preguntas paginadas (público, sin auth) */
export async function fetchTestGuayacoQuestions(
  skip = 0,
  limit = 100
): Promise<TestGuayacoPaginated> {
  const res = await fetch(
    `${apiUrl()}test-guayaco/?skip=${skip}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Error al cargar preguntas del test");
  return res.json();
}

/** Obtener una pregunta por ID (público) */
export async function fetchTestGuayacoQuestion(
  questionId: number
): Promise<TestGuayacoQuestion> {
  const res = await fetch(`${apiUrl()}test-guayaco/${questionId}`);
  if (!res.ok) throw new Error("Pregunta no encontrada");
  return res.json();
}

/** Crear pregunta (requiere auth) */
export async function createTestGuayacoQuestion(
  data: TestGuayacoCreatePayload,
  token: string
): Promise<TestGuayacoQuestion> {
  const res = await fetch(`${apiUrl()}test-guayaco/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail ?? "Error al crear pregunta");
  return body;
}

/** Actualizar pregunta (requiere auth) */
export async function updateTestGuayacoQuestion(
  questionId: number,
  data: TestGuayacoUpdatePayload,
  token: string
): Promise<TestGuayacoQuestion> {
  const res = await fetch(`${apiUrl()}test-guayaco/${questionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail ?? "Error al actualizar pregunta");
  return body;
}

/** Eliminar pregunta (requiere auth) */
export async function deleteTestGuayacoQuestion(
  questionId: number,
  token: string
): Promise<{ success: boolean; message: string; deleted_id: number }> {
  const res = await fetch(`${apiUrl()}test-guayaco/${questionId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail ?? "Error al eliminar pregunta");
  return body;
}
