import Dexie, { type Table } from 'dexie';
import type { Deck, Card } from './types';
import { defaultDeck, defaultCards } from './seedData';

class CapairDatabase extends Dexie {
  decks!: Table<Deck, string>;
  cards!: Table<Card, string>;

  constructor() {
    super('capair-db');

    this.version(1).stores({
      decks: 'id, name, createdAt, updatedAt',
      cards: 'id, deckId, createdAt, correctCount, incorrectCount, lastPracticedAt',
    });
  }
}

export const db = new CapairDatabase();

// Check if app has been initialized
export async function hasBeenInitialized(): Promise<boolean> {
  const decks = await db.decks.toArray();
  return decks.length > 0;
}

// Initialize with default data
export async function initializeWithDefaultData(): Promise<void> {
  const alreadyInitialized = await hasBeenInitialized();
  if (alreadyInitialized) {
    return;
  }

  await db.transaction('rw', db.decks, db.cards, async () => {
    // Add default deck
    await db.decks.add(defaultDeck);

    // Add default cards
    for (const cardData of defaultCards) {
      await db.cards.add({
        id: crypto.randomUUID(),
        deckId: defaultDeck.id,
        sentence: cardData.sentence,
        highlightedWord: cardData.highlightedWord,
        translation: cardData.translation,
        createdAt: new Date(),
        correctCount: 0,
        incorrectCount: 0,
        lastPracticedAt: null,
      });
    }
  });
}

// Deck operations
export async function createDeck(name: string): Promise<Deck> {
  const now = new Date();
  const deck: Deck = {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    updatedAt: now,
  };
  await db.decks.add(deck);
  return deck;
}

export async function getAllDecks(): Promise<Deck[]> {
  return await db.decks.toArray();
}

export async function getDeck(id: string): Promise<Deck | undefined> {
  return await db.decks.get(id);
}

export async function updateDeck(id: string, name: string): Promise<void> {
  await db.decks.update(id, { name, updatedAt: new Date() });
}

export async function deleteDeck(id: string): Promise<void> {
  await db.decks.delete(id);
  await db.cards.where('deckId').equals(id).delete();
}

// Card operations
export async function createCard(
  deckId: string,
  sentence: string,
  highlightedWord: string,
  translation: string,
  fullTranslation?: string
): Promise<Card> {
  const card: Card = {
    id: crypto.randomUUID(),
    deckId,
    sentence,
    highlightedWord,
    translation,
    fullTranslation,
    createdAt: new Date(),
    correctCount: 0,
    incorrectCount: 0,
    lastPracticedAt: null,
  };
  await db.cards.add(card);
  await db.decks.update(deckId, { updatedAt: new Date() });
  return card;
}

export async function getCardsByDeck(deckId: string): Promise<Card[]> {
  return await db.cards.where('deckId').equals(deckId).toArray();
}

export async function getCard(id: string): Promise<Card | undefined> {
  return await db.cards.get(id);
}

export async function updateCard(
  id: string,
  updates: Partial<Card>
): Promise<void> {
  await db.cards.update(id, updates);
}

export async function deleteCard(id: string): Promise<void> {
  const card = await db.cards.get(id);
  if (card) {
    await db.cards.delete(id);
    await db.decks.update(card.deckId, { updatedAt: new Date() });
  }
}

export async function updateCardProgress(
  id: string,
  isCorrect: boolean
): Promise<void> {
  const card = await db.cards.get(id);
  if (card) {
    await db.cards.update(id, {
      correctCount: isCorrect ? (card.correctCount || 0) + 1 : (card.correctCount || 0),
      incorrectCount: isCorrect ? (card.incorrectCount || 0) : (card.incorrectCount || 0) + 1,
      lastPracticedAt: new Date(),
    });
  }
}

// Statistics
export async function getTotalCardsCount(): Promise<number> {
  return await db.cards.count();
}

export async function getTodayPracticeCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return await db.cards
    .where('lastPracticedAt')
    .aboveOrEqual(today)
    .count();
}

// Export/Import
export async function exportAllData(): Promise<string> {
  const decks = await db.decks.toArray();
  const cards = await db.cards.toArray();

  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    decks: decks.map((deck) => ({
      id: deck.id,
      name: deck.name,
      createdAt: deck.createdAt.toISOString(),
      cards: cards
        .filter((c) => c.deckId === deck.id)
        .map((card) => ({
          id: card.id,
          sentence: card.sentence,
          highlightedWord: card.highlightedWord,
          translation: card.translation,
          fullTranslation: card.fullTranslation,
          createdAt: card.createdAt.toISOString(),
          correctCount: card.correctCount,
          incorrectCount: card.incorrectCount,
        })),
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

export async function exportSelectedDecks(deckIds: string[]): Promise<string> {
  const decks = await db.decks.where('id').anyOf(deckIds).toArray();
  const allCards = await db.cards.toArray();

  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    selectedExport: true,
    decks: decks.map((deck) => ({
      id: deck.id,
      name: deck.name,
      createdAt: deck.createdAt.toISOString(),
      cards: allCards
        .filter((c) => c.deckId === deck.id)
        .map((card) => ({
          id: card.id,
          sentence: card.sentence,
          highlightedWord: card.highlightedWord,
          translation: card.translation,
          fullTranslation: card.fullTranslation,
          createdAt: card.createdAt.toISOString(),
          correctCount: card.correctCount,
          incorrectCount: card.incorrectCount,
        })),
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

export async function importData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);
  
  await db.transaction('rw', db.decks, db.cards, async () => {
    await db.decks.clear();
    await db.cards.clear();

    for (const deck of data.decks) {
      await db.decks.add({
        id: deck.id,
        name: deck.name,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(),
      });

      for (const card of deck.cards) {
        await db.cards.add({
          id: card.id,
          deckId: deck.id,
          sentence: card.sentence,
          highlightedWord: card.highlightedWord,
          translation: card.translation,
          fullTranslation: card.fullTranslation,
          createdAt: new Date(card.createdAt),
          correctCount: card.correctCount,
          incorrectCount: card.incorrectCount,
          lastPracticedAt: null,
        });
      }
    }
  });
}

export async function clearAllData(): Promise<void> {
  await db.decks.clear();
  await db.cards.clear();
}

export async function getAllCards(): Promise<Card[]> {
  return await db.cards.toArray();
}

export async function getMistakeCards(): Promise<Card[]> {
  const allCards = await db.cards.toArray();
  return allCards.filter((card) => card.incorrectCount > card.correctCount);
}
