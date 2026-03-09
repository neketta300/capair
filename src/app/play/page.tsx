'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, RotateCcw, Play } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getAllDecks, getCardsByDeck } from '@/lib/db';
import type { Deck } from '@/lib/types';
import { useI18n } from '@/components/I18nProvider';
import { cn } from '@/lib/utils';

interface DeckWithCards extends Deck {
  cardsCount: number;
  masteredCount: number;
}

export default function PlayPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [decks, setDecks] = useState<DeckWithCards[]>([]);
  const [totalCards, setTotalCards] = useState(0);

  const loadData = useCallback(async () => {
    const allDecks = await getAllDecks();
    const decksWithCards: DeckWithCards[] = [];
    let total = 0;

    for (const deck of allDecks) {
      const cards = await getCardsByDeck(deck.id);
      const masteredCount = cards.filter((c) => c.correctCount > c.incorrectCount).length;
      decksWithCards.push({
        ...deck,
        cardsCount: cards.length,
        masteredCount,
      });
      total += cards.length;
    }

    setDecks(decksWithCards);
    setTotalCards(total);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlayDeck = (deckId: string) => {
    router.push(`/session/${deckId}`);
  };

  const handlePlayAll = () => {
    router.push('/session/all');
  };

  const handleReviewMistakes = () => {
    router.push('/session/mistakes');
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pl-64">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-6 safe-top">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-semibold text-ink">{t('practice')}</h1>
          <p className="text-sm text-stone">{t('chooseADeck')}</p>
        </div>

        {/* Quick Actions */}
        {totalCards > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlayAll}
              className="bg-soft-white rounded-2xl border border-mist p-4 text-left card-hover"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-warm-navy flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-ink">{t('allCards')}</p>
                  <p className="text-sm text-stone">{totalCards} {totalCards === 1 ? t('card') : t('cards')}</p>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReviewMistakes}
              className="bg-soft-white rounded-2xl border border-mist p-4 text-left card-hover"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-warm-red/10 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-warm-red" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-ink">{t('mistakes')}</p>
                  <p className="text-sm text-stone">{t('reviewWeakCards')}</p>
                </div>
              </div>
            </motion.button>
          </div>
        )}

        {/* Deck Grid */}
        {decks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-mist flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-stone" />
            </div>
            <h2 className="text-xl font-heading font-medium text-ink mb-2">
              {t('noDecksAvailable')}
            </h2>
            <p className="text-stone">
              {t('createDeckFirst')}
            </p>
            <Button className="mt-6" onClick={() => router.push('/')}>
              {t('goToDecks')}
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {decks.map((deck, index) => {
              const masteryPercentage = deck.cardsCount > 0
                ? (deck.masteredCount / deck.cardsCount) * 100
                : 0;

              return (
                <motion.button
                  key={deck.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handlePlayDeck(deck.id)}
                  className={cn(
                    'bg-soft-white rounded-2xl border border-mist p-4 text-left',
                    'card-hover'
                  )}
                >
                  <div className="aspect-square rounded-xl bg-mist/30 flex items-center justify-center mb-3">
                    <BookOpen className="w-8 h-8 text-warm-navy" />
                  </div>
                  <h3 className="font-heading font-semibold text-ink truncate">
                    {deck.name}
                  </h3>
                  <p className="text-sm text-stone mt-0.5">
                    {deck.cardsCount} {deck.cardsCount === 1 ? t('card') : t('cards')}
                  </p>
                  <div className="mt-3">
                    <ProgressBar
                      value={deck.masteredCount}
                      max={deck.cardsCount || 1}
                      color="navy"
                      size="md"
                    />
                    <p className="text-xs text-stone mt-1 text-right">
                      {Math.round(masteryPercentage)}%
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
