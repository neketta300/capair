'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { Card } from '@/lib/types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useI18n } from './I18nProvider';
import { cn } from '@/lib/utils';

interface GameCardProps {
  card: Card;
  currentNumber: number;
  totalCards: number;
  onAnswer: (isCorrect: boolean) => void;
  onSkip: () => void;
}

export function GameCard({ card, currentNumber, totalCards, onAnswer, onSkip }: GameCardProps) {
  const { t } = useI18n();
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const normalizeText = (text: string) => {
    return text.toLowerCase().trim().replace(/[.,!?;:'"()]/g, '');
  };

  const renderTranslation = (translation: string) => {
    const parts = translation.split('/');
    if (parts.length === 1) {
      return <span className="text-warm-navy">{translation}</span>;
    }
    return parts.map((part, index) => (
      <span key={index}>
        {index > 0 && <span className="text-mist mx-2 font-medium"> / </span>}
        <span className={index === 0 ? 'text-warm-navy font-semibold' : 'text-stone'}>
          {part.trim()}
        </span>
      </span>
    ));
  };

  const checkAnswer = () => {
    const normalizedAnswer = normalizeText(answer);
    const normalizedTranslation = normalizeText(card.translation);
    
    // Check if answer matches translation (or part of it for multiple translations)
    const translations = normalizedTranslation.split(/[,/]/).map((t) => t.trim());
    const isCorrect = translations.some((t) => t === normalizedAnswer || normalizedAnswer.includes(t));

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        onAnswer(true);
      }, 1000);
    } else {
      setAttempts((prev) => prev + 1);
      setFeedback('incorrect');
      
      if (attempts >= 2) {
        setShowAnswer(true);
      }
      
      setTimeout(() => {
        setFeedback(null);
        setAnswer('');
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && answer.trim()) {
      checkAnswer();
    }
  };

  const highlightSentence = (sentence: string, word: string) => {
    const parts = sentence.split(new RegExp(`(${word})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === word.toLowerCase() ? (
        <span
          key={index}
          className="bg-soft-amber/30 text-warm-navy px-2 py-0.5 rounded font-semibold"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col h-full max-w-sm mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onSkip}>
          {t('skip')}
        </Button>
        <span className="text-sm text-stone font-mono">
          {currentNumber} / {totalCards}
        </span>
      </div>

      {/* Card */}
      <motion.div
        key={card.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2 }}
        className="flex-1 flex flex-col justify-center"
      >
        <div className="bg-soft-white rounded-2xl border border-mist p-8 mb-6">
          <p className="font-card text-xl text-ink text-center leading-relaxed">
            {highlightSentence(card.sentence, card.highlightedWord)}
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <p className="text-sm text-stone text-center">
            {t('translateHighlighted')}
          </p>

          <div className="flex gap-2">
            <div className={cn(
              'flex-1 transition-all duration-150',
              feedback === 'incorrect' && 'shake'
            )}>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('typeTranslation')}
                disabled={showAnswer}
                className={cn(
                  'text-center text-lg',
                  feedback === 'correct' && 'border-sage bg-sage/5',
                  feedback === 'incorrect' && 'border-warm-red bg-warm-red/5'
                )}
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setShowHint(true)}
              disabled={showAnswer || showHint}
              className="flex-shrink-0 px-4 text-sm font-medium"
            >
              {t('hint')}
            </Button>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-sage"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">{t('correct')}</span>
              </motion.div>
            )}

            {feedback === 'incorrect' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-warm-red"
              >
                <XCircle className="w-5 h-5" />
                <span className="font-medium">{t('tryAgain')}</span>
              </motion.div>
            )}

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-mist/50 rounded-xl p-4 text-center"
              >
                <p className="text-sm text-stone mb-1">{t('correctAnswer')}</p>
                <p className="text-lg font-medium text-ink">{renderTranslation(card.translation)}</p>
                <Button
                  variant="primary"
                  className="mt-3 w-full"
                  onClick={() => {
                    onAnswer(false);
                    setShowAnswer(false);
                    setAttempts(0);
                  }}
                >
                  {t('gotIt')}
                </Button>
              </motion.div>
            )}

            {showHint && !showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="bg-amber-50 border border-soft-amber rounded-xl p-4 text-center">
                  <p className="text-sm text-stone mb-1">{t('correctAnswer')}</p>
                  <p className="text-xl font-medium">{renderTranslation(card.translation)}</p>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    onAnswer(false);
                    setShowHint(false);
                  }}
                >
                  {t('next')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showAnswer && !showHint && (
            <Button
              variant="primary"
              className="w-full"
              onClick={checkAnswer}
              disabled={!answer.trim() || showAnswer}
            >
              {t('check')}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
