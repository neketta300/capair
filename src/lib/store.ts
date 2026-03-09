import { create } from 'zustand';
import type { Deck, Card } from './types';

interface GameState {
  sessionCards: Card[];
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  isSessionActive: boolean;
  sessionComplete: boolean;
  
  startSession: (cards: Card[]) => void;
  nextCard: () => void;
  recordAnswer: (isCorrect: boolean) => void;
  endSession: () => void;
  resetSession: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  sessionCards: [],
  currentIndex: 0,
  correctCount: 0,
  incorrectCount: 0,
  isSessionActive: false,
  sessionComplete: false,

  startSession: (cards: Card[]) => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    set({
      sessionCards: shuffled,
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      isSessionActive: true,
      sessionComplete: false,
    });
  },

  nextCard: () => {
    const { currentIndex, sessionCards } = get();
    if (currentIndex < sessionCards.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      set({ sessionComplete: true, isSessionActive: false });
    }
  },

  recordAnswer: (isCorrect: boolean) => {
    set((state) => ({
      correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
      incorrectCount: isCorrect ? state.incorrectCount : state.incorrectCount + 1,
    }));
  },

  endSession: () => {
    set({
      isSessionActive: false,
      sessionComplete: false,
      sessionCards: [],
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
    });
  },

  resetSession: () => {
    const { sessionCards } = get();
    const shuffled = [...sessionCards].sort(() => Math.random() - 0.5);
    set({
      sessionCards: shuffled,
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      sessionComplete: false,
      isSessionActive: true,
    });
  },
}));

interface UIState {
  activeTab: 'decks' | 'play' | 'settings';
  selectedDeckId: string | null;
  isAddCardModalOpen: boolean;
  editingCard: Card | null;
  isSidebarOpen: boolean;

  setActiveTab: (tab: 'decks' | 'play' | 'settings') => void;
  setSelectedDeckId: (id: string | null) => void;
  openAddCardModal: (card?: Card) => void;
  closeAddCardModal: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'decks',
  selectedDeckId: null,
  isAddCardModalOpen: false,
  editingCard: null,
  isSidebarOpen: true,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedDeckId: (id) => set({ selectedDeckId: id }),
  openAddCardModal: (card) =>
    set({ isAddCardModalOpen: true, editingCard: card || null }),
  closeAddCardModal: () =>
    set({ isAddCardModalOpen: false, editingCard: null }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
