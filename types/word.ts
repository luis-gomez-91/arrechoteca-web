export interface Word {
    id: number;
    word: string;
    meaning: string;
    categories?: Category[];
    examples?: Example[];
}

export interface Category {
    id: number;
    name: string;
}

export interface Example {
    id: number;
    text: string;
}

export interface NewWord {
  word: string;
  meaning: string;
  category_ids: number[];
}

export interface WordExample {
    id: number;
    text: string;
}

export interface NewWordExmple {
    text: string;
}