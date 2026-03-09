export interface Deck {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: string;
  deckId: string;
  sentence: string;
  highlightedWord: string;
  translation: string;
  createdAt: Date;
  correctCount: number;
  incorrectCount: number;
  lastPracticedAt: Date | null;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  decks: Array<{
    id: string;
    name: string;
    createdAt: string;
    cards: Array<{
      id: string;
      sentence: string;
      highlightedWord: string;
      translation: string;
      createdAt: string;
      correctCount: number;
      incorrectCount: number;
    }>;
  }>;
}
