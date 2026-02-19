export interface BadWord {
    id: number;
    insult: string;
    meaning: string;
    examples?: Example[];
}

export interface Example {
    id: number;
    text: string;
}

export interface NewBadWord {
  insult: string;
  meaning: string;
}