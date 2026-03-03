/** Tag de insultos (entidad separada en el backend) */
export interface InsultTag {
  id: number;
  name: string;
}

/** Ejemplo de uso de un insulto */
export interface InsultExample {
  id: number;
  text: string;
  is_active?: boolean;
}

/** Insulto / puteada tal como lo devuelve el backend (estrellita = InsultStar) */
export interface BadWord {
  id: number;
  insult: string;
  meaning: string;
  is_active?: boolean;
  tag_id?: number | null;
  tag?: InsultTag | null;
  examples?: InsultExample[];
  star_count?: number;
  comments_count?: number;
  starred_by_me?: boolean;
}

/** Payload para crear un insulto (sin ejemplos; se añaden después) */
export interface InsultCreatePayload {
  insult: string;
  meaning: string;
  is_active?: boolean;
  tag_id?: number | null;
}

/** Payload para actualizar un insulto */
export interface InsultUpdatePayload {
  insult: string;
  meaning: string;
  is_active?: boolean;
  tag_id?: number | null;
}

/** Ejemplo en el formulario (puede tener id si ya existe) */
export interface ExampleFormItem {
  id?: number;
  text: string;
}

// Compatibilidad con código que use NewBadWord / Example
export interface NewBadWord extends InsultCreatePayload {
  tag?: string;
  examples?: { text: string }[];
}
export interface BadWordExample extends InsultExample {}
export interface Example {
  id: number;
  text: string;
}

/** Usuario (en comentarios) */
export interface InsultCommentUser {
  id: string;
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
}

/** Comentario de un insulto (like = CommentLike, star = CommentStar) */
export interface InsultCommentType {
  id: number;
  insult_id: number;
  user_id: string;
  comment: string;
  created_at: string;
  parent_id: number | null;
  user: InsultCommentUser;
  star_count: number;
  starred_by_me: boolean;
  likes_count: number;
  liked_by_me: boolean;
  replies: InsultCommentType[];
}
