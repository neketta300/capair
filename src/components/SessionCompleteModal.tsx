'use client';

import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { useI18n } from './I18nProvider';

interface SessionCompleteModalProps {
  isOpen: boolean;
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  onReviewMistakes: () => void;
  onDone: () => void;
  onRestart: () => void;
}

export function SessionCompleteModal({
  isOpen,
  totalCards,
  correctCount,
  incorrectCount,
  onReviewMistakes,
  onDone,
  onRestart,
}: SessionCompleteModalProps) {
  const { t } = useI18n();
  const accuracy = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onDone} title={t('sessionComplete')} size="md">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-mist/30">
            <p className="text-2xl font-mono font-semibold text-warm-navy">
              {totalCards}
            </p>
            <p className="text-xs text-stone mt-1 uppercase tracking-wide">
              {t('reviewed')}
            </p>
          </div>

          <div className="text-center p-4 rounded-xl bg-sage/10">
            <div className="flex items-center justify-center gap-1 text-sage">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-2xl font-mono font-semibold">
                {correctCount}
              </span>
            </div>
            <p className="text-xs text-stone mt-1 uppercase tracking-wide">
              {t('correct_count')}
            </p>
          </div>

          <div className="text-center p-4 rounded-xl bg-warm-red/10">
            <div className="flex items-center justify-center gap-1 text-warm-red">
              <XCircle className="w-5 h-5" />
              <span className="text-2xl font-mono font-semibold">
                {incorrectCount}
              </span>
            </div>
            <p className="text-xs text-stone mt-1 uppercase tracking-wide">
              {t('needReview')}
            </p>
          </div>
        </div>

        {/* Accuracy */}
        <div className="text-center p-6 rounded-2xl bg-warm-navy text-white">
          <p className="text-4xl font-mono font-bold">{accuracy}%</p>
          <p className="text-sm text-white/70 mt-1">{t('accuracy')}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {incorrectCount > 0 && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={onReviewMistakes}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('reviewMistakes')}
            </Button>
          )}

          <Button variant="primary" className="w-full" onClick={onRestart}>
            {t('practiceAgain')}
          </Button>

          <Button variant="ghost" className="w-full" onClick={onDone}>
            {t('done')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
