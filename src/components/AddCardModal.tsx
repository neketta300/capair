'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Card } from '@/lib/types';
import { Modal } from './ui/Modal';
import { Textarea } from './ui/Textarea';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useI18n } from './I18nProvider';
import { cn } from '@/lib/utils';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: { sentence: string; highlightedWord: string; translation: string }) => void;
  editingCard?: Card | null;
}

export function AddCardModal({ isOpen, onClose, onSave, editingCard }: AddCardModalProps) {
  const { t } = useI18n();
  const [sentence, setSentence] = useState('');
  const [highlightedWord, setHighlightedWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const sentenceRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingCard) {
      setSentence(editingCard.sentence);
      setHighlightedWord(editingCard.highlightedWord);
      setTranslation(editingCard.translation);
      setSelectedWords(editingCard.highlightedWord.split(/\s+/).filter(Boolean));
    } else {
      resetForm();
    }
  }, [editingCard, isOpen]);

  const resetForm = () => {
    setSentence('');
    setHighlightedWord('');
    setTranslation('');
    setSelectedWords([]);
  };

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
    setSelectedWords((prev) => {
      const isSelected = prev.includes(cleanWord);
      const newWords = isSelected
        ? prev.filter((w) => w !== cleanWord)
        : [...prev, cleanWord];
      setHighlightedWord(newWords.join(' '));
      return newWords;
    });
  };

  const handleSentenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSentence(e.target.value);
    setSelectedWords([]);
    setHighlightedWord('');
  };

  const renderSentenceWithClickableWords = () => {
    const words = sentence.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
      const isSelected = selectedWords.includes(cleanWord) && cleanWord.trim() !== '';

      return (
        <span
          key={index}
          onClick={() => cleanWord.trim() && handleWordClick(cleanWord)}
          className={cn(
            'cursor-pointer transition-colors duration-150 rounded px-0.5',
            isSelected
              ? 'bg-soft-amber/30 text-warm-navy font-semibold'
              : 'hover:bg-mist/50'
          )}
        >
          {word}
        </span>
      );
    });
  };

  const handleSave = () => {
    if (!sentence.trim() || !highlightedWord.trim() || !translation.trim()) {
      return;
    }
    onSave({ sentence, highlightedWord, translation });
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingCard ? t('editCard') : t('addCard')} size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone mb-1.5">
            {t('englishSentence')}
          </label>
          <Textarea
            ref={sentenceRef}
            value={sentence}
            onChange={handleSentenceChange}
            placeholder="e.g., I love cats"
            rows={3}
          />
        </div>

        {sentence.trim() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <p className="text-sm text-stone">
              {t('tapToHighlight')}
            </p>
            <div className="p-4 rounded-xl border-2 border-mist bg-soft-white font-card text-lg leading-relaxed">
              {renderSentenceWithClickableWords()}
            </div>
          </motion.div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone mb-1.5">
            {t('translation')}
          </label>
          <Input
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="e.g., кот/коты"
          />
          <p className="text-xs text-stone mt-1.5">
            {t('multipleTranslationsHint')}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!sentence.trim() || !highlightedWord.trim() || !translation.trim()}
          >
            {editingCard ? t('saveChanges') : t('addCard')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
