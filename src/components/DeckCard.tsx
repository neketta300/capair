'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Trash2, Edit2 } from 'lucide-react';
import type { Deck } from '@/lib/types';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';
import { cn } from '@/lib/utils';

interface DeckCardProps {
  deck: Deck;
  cardsCount: number;
  masteredCount: number;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DeckCard({
  deck,
  cardsCount,
  masteredCount,
  showActions = false,
  onEdit,
  onDelete,
}: DeckCardProps) {
  const router = useRouter();
  const masteryPercentage = cardsCount > 0 ? (masteredCount / cardsCount) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(44, 62, 80, 0.1)' }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-soft-white rounded-2xl border border-mist p-5',
        'card-hover cursor-pointer'
      )}
      onClick={() => router.push(`/deck/${deck.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-heading font-semibold text-ink truncate">
            {deck.name}
          </h3>
          <p className="text-sm text-stone mt-0.5">
            {cardsCount} {cardsCount === 1 ? 'card' : 'cards'}
          </p>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="rounded-full w-8 h-8"
              aria-label="Edit deck"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="rounded-full w-8 h-8 text-warm-red hover:bg-warm-red/10"
              aria-label="Delete deck"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <ProgressBar
        value={masteredCount}
        max={cardsCount || 1}
        color="navy"
        size="sm"
      />

      {cardsCount > 0 && (
        <p className="text-xs text-stone mt-2 text-right">
          {Math.round(masteryPercentage)}% mastery
        </p>
      )}
    </motion.div>
  );
}
