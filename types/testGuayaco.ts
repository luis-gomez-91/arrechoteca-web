/** Respuesta de una pregunta del test Guayaco */
export interface TestGuayacoAnswer {
  id: number;
  test_guayaco_id: number;
  text: string;
  order: number;
  is_correct: boolean;
}

/** Pregunta del test con sus 4 respuestas */
export interface TestGuayacoQuestion {
  id: number;
  question: string;
  is_active: boolean;
  answers: TestGuayacoAnswer[];
}

/** Respuesta paginada del listado */
export interface TestGuayacoPaginated {
  items: TestGuayacoQuestion[];
  total: number;
  skip: number;
  limit: number;
}

/** Item de respuesta para crear/actualizar (sin id) */
export interface TestGuayacoAnswerItem {
  text: string;
  order: number;
  is_correct: boolean;
}

/** Payload para crear pregunta */
export interface TestGuayacoCreatePayload {
  question: string;
  is_active?: boolean;
  answers: TestGuayacoAnswerItem[];
}

/** Payload para actualizar pregunta */
export interface TestGuayacoUpdatePayload {
  question?: string;
  is_active?: boolean;
  answers?: TestGuayacoAnswerItem[];
}
