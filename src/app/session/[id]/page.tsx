'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GameCard } from '@/components/GameCard';
import { SessionCompleteModal } from '@/components/SessionCompleteModal';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/lib/store';
import { getCardsByDeck, getAllCards, getMistakeCards, updateCardProgress } from '@/lib/db';
import type { Card } from '@/lib/types';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const {
    sessionCards,
    currentIndex,
    correctCount,
    incorrectCount,
    isSessionActive,
    sessionComplete,
    startSession,
    nextCard,
    recordAnswer,
    endSession,
    resetSession,
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const [shouldExit, setShouldExit] = useState(false);

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    let cards: Card[] = [];

    if (deckId === 'all') {
      cards = await getAllCards();
    } else if (deckId === 'mistakes') {
      cards = await getMistakeCards();
    } else {
      cards = await getCardsByDeck(deckId);
    }

    if (cards.length === 0) {
      router.push('/play');
      return;
    }

    startSession(cards);
    setIsLoading(false);
  }, [deckId, router, startSession]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  // Redirect if user closed the session
  useEffect(() => {
    if (shouldExit && !isSessionActive) {
      router.push('/play');
    }
  }, [shouldExit, isSessionActive, router]);

  const handleAnswer = async (isCorrect: boolean) => {
    const card = sessionCards[currentIndex];
    if (card) {
      await updateCardProgress(card.id, isCorrect);
    }
    recordAnswer(isCorrect);
    nextCard();
  };

  const handleSkip = () => {
    nextCard();
  };

  const handleClose = () => {
    setShouldExit(true);
    endSession();
  };

  const handleReviewMistakes = async () => {
    endSession();
    router.push('/session/mistakes');
  };

  const handleDone = () => {
    endSession();
    router.push('/play');
  };

  const handleRestart = () => {
    resetSession();
  };

  const currentCard = sessionCards[currentIndex];

  if (isLoading || !currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:pl-64">
      <Navigation />

      <main className="h-screen safe-top flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-mist bg-soft-white">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
          <span className="text-sm font-mono text-stone">
            {currentIndex + 1} / {sessionCards.length}
          </span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Game Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              className="w-full max-w-sm"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              <GameCard
                card={currentCard}
                currentNumber={currentIndex + 1}
                totalCards={sessionCards.length}
                onAnswer={handleAnswer}
                onSkip={handleSkip}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Session Complete Modal */}
        <SessionCompleteModal
          isOpen={sessionComplete}
          totalCards={sessionCards.length}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          onReviewMistakes={handleReviewMistakes}
          onDone={handleDone}
          onRestart={handleRestart}
        />
      </main>
    </div>
  );
}
