'use client';

import { motion } from 'framer-motion';
import { Trash2, Edit2 } from 'lucide-react';
import type { Card } from '@/lib/types';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

interface CardItemProps {
  card: Card;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CardItem({
  card,
  showActions = false,
  onEdit,
  onDelete,
}: CardItemProps) {
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

  const renderTranslation = (translation: string) => {
    const parts = translation.split('/');
    if (parts.length === 1) {
      return translation;
    }
    return parts.map((part, index) => (
      <span key={index}>
        {index > 0 && <span className="text-mist mx-1"> / </span>}
        <span className={index === 0 ? 'text-ink' : 'text-stone'}>
          {part.trim()}
        </span>
      </span>
    ));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'bg-soft-white rounded-xl border border-mist p-4',
        'card-hover'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-card text-ink text-lg leading-relaxed">
            {highlightSentence(card.sentence, card.highlightedWord)}
          </p>
          <p className="text-sm mt-2">
            {renderTranslation(card.translation)}
          </p>
          {(card.correctCount > 0 || card.incorrectCount > 0) && (
            <div className="flex items-center gap-3 mt-3 text-xs font-mono">
              <span className="text-sage">
                ✓ {card.correctCount}
              </span>
              <span className="text-warm-red">
                ✗ {card.incorrectCount}
              </span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="rounded-full w-8 h-8"
              aria-label="Edit card"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="rounded-full w-8 h-8 text-warm-red hover:bg-warm-red/10"
              aria-label="Delete card"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
