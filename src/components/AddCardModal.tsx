'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Unlink } from 'lucide-react';
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
  onSave: (card: { sentence: string; highlightedWord: string; translation: string; fullTranslation?: string }) => void;
  editingCard?: Card | null;
}

interface WordGroup {
  id: string;
  wordIndices: number[];
  words: string[];
  translation: string;
}

export function AddCardModal({ isOpen, onClose, onSave, editingCard }: AddCardModalProps) {
  const { t } = useI18n();
  const [sentence, setSentence] = useState('');
  const [wordGroups, setWordGroups] = useState<WordGroup[]>([]);
  const [fullTranslation, setFullTranslation] = useState('');
  const [selectedForMerge, setSelectedForMerge] = useState<number[]>([]);
  const sentenceRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingCard) {
      setSentence(editingCard.sentence);
      setFullTranslation(editingCard.fullTranslation || '');

      const highlightedWords = editingCard.highlightedWord.split(',').map(s => s.trim()).filter(Boolean);
      const translations = editingCard.translation.split(',').map(s => s.trim()).filter(Boolean);

      // Разбиваем предложение на слова для сопоставления
      const sentenceWords = editingCard.sentence.split(/(\s+)/).filter(w => w.trim().length > 0);
      const cleanSentenceWords = sentenceWords.map((w, i) => ({
        clean: w.replace(/[.,!?;:'"()]/g, ''),
        index: i,
      })).filter(w => w.clean.length > 0);

      // Создаём группы с wordIndices
      let currentWordIndex = 0;
      const groups: WordGroup[] = highlightedWords.map((wordStr, groupIndex) => {
        const groupWords = wordStr.split(/\s+/);
        const wordIndices: number[] = [];

        // Ищем каждое слово группы в предложении
        groupWords.forEach((gw) => {
          for (let i = currentWordIndex; i < cleanSentenceWords.length; i++) {
            if (cleanSentenceWords[i].clean.toLowerCase() === gw.toLowerCase()) {
              wordIndices.push(cleanSentenceWords[i].index);
              currentWordIndex = i + 1;
              break;
            }
          }
        });

        return {
          id: `group-${groupIndex}`,
          wordIndices,
          words: groupWords,
          translation: translations[groupIndex] || '',
        };
      });

      setWordGroups(groups);
    } else {
      resetForm();
    }
  }, [editingCard, isOpen]);

  const resetForm = () => {
    setSentence('');
    setWordGroups([]);
    setFullTranslation('');
    setSelectedForMerge([]);
  };

  const getSentenceWords = () => {
    const words = sentence.split(/(\s+)/).filter(w => w.trim().length > 0);
    return words.map((word, index) => ({
      original: word,
      clean: word.replace(/[.,!?;:'"()]/g, ''),
      index,
    })).filter(w => w.clean.length > 0);
  };

  const getGroupForWordIndex = (wordIndex: number) => {
    return wordGroups.find((group) => group.wordIndices.includes(wordIndex));
  };

  const handleWordClick = (wordIndex: number) => {
    const existingGroup = getGroupForWordIndex(wordIndex);

    if (existingGroup) {
      setWordGroups((prev) => prev.filter((g) => g.id !== existingGroup.id));
      setSelectedForMerge((prev) => prev.filter((id) => id !== parseInt(existingGroup.id.replace('group-', ''))));
    } else {
      const words = getSentenceWords();
      const word = words.find((w) => w.index === wordIndex);
      if (!word) return;

      const newGroup: WordGroup = {
        id: `group-${Date.now()}-${wordIndex}`,
        wordIndices: [wordIndex],
        words: [word.clean],
        translation: '',
      };

      setWordGroups((prev) => [...prev, newGroup]);
    }
  };

  const handleSentenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSentence(e.target.value);
    setWordGroups([]);
    setSelectedForMerge([]);
  };

  const handleGroupSelect = (groupIndex: number) => {
    setSelectedForMerge((prev) => {
      if (prev.includes(groupIndex)) {
        return prev.filter((id) => id !== groupIndex);
      }
      return [...prev, groupIndex];
    });
  };

  const handleMergeGroups = () => {
    if (selectedForMerge.length < 2) return;

    const groupsToMerge = wordGroups.filter((_, idx) => selectedForMerge.includes(idx));

    if (groupsToMerge.length < 2) return;

    const mergedWordIndices = groupsToMerge.flatMap((g) => g.wordIndices);
    const mergedWords = groupsToMerge.flatMap((g) => g.words);
    const mergedTranslation = groupsToMerge.find((g) => g.translation.trim())?.translation || '';

    const newGroup: WordGroup = {
      id: `group-${Date.now()}`,
      wordIndices: mergedWordIndices.sort((a, b) => a - b),
      words: mergedWords,
      translation: mergedTranslation,
    };

    setWordGroups((prev) => [
      ...prev.filter((_, idx) => !selectedForMerge.includes(idx)),
      newGroup,
    ]);
    setSelectedForMerge([]);
  };

  const handleRemoveGroup = (groupId: string) => {
    setWordGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleTranslationChange = (groupId: string, value: string) => {
    setWordGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, translation: value } : g))
    );
  };

  const renderSentenceWithClickableWords = () => {
    const words = sentence.split(/(\s+)/);
    const sentenceWords = getSentenceWords();

    const wordToGroup = new Map<number, WordGroup>();
    wordGroups.forEach((group) => {
      group.wordIndices.forEach((idx) => {
        wordToGroup.set(idx, group);
      });
    });

    return words.map((word, wordIdx) => {
      const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
      const wordInfo = sentenceWords.find((w) => w.original === word && w.clean === cleanWord);
      const wordGlobalIndex = wordInfo?.index ?? -1;
      const group = wordToGroup.get(wordGlobalIndex);
      const isInGroup = group !== undefined;

      return (
        <span
          key={wordIdx}
          onClick={() => cleanWord.trim() && handleWordClick(wordGlobalIndex)}
          className={cn(
            'cursor-pointer transition-colors duration-150 rounded px-0.5',
            isInGroup && 'bg-sage/20 text-sage font-semibold',
            !isInGroup && cleanWord.trim() && 'hover:bg-mist/50'
          )}
        >
          {word}
        </span>
      );
    });
  };

  const handleSave = () => {
    if (!sentence.trim() || wordGroups.length === 0 || wordGroups.some((g) => !g.translation.trim())) {
      return;
    }

    const highlightedWord = wordGroups.map((g) => g.words.join(' ')).join(', ');
    const translation = wordGroups.map((g) => g.translation.trim()).join(', ');

    onSave({
      sentence,
      highlightedWord,
      translation,
      fullTranslation: fullTranslation.trim() || undefined,
    });
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
            placeholder="e.g., I need to look up this word"
            rows={3}
          />
        </div>

        {sentence.trim() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone">{t('tapToHighlight')}</p>
              {selectedForMerge.length >= 2 && (
                <Button variant="primary" size="sm" onClick={handleMergeGroups} className="flex items-center gap-1.5">
                  <Link className="w-4 h-4" />
                  Объединить ({selectedForMerge.length})
                </Button>
              )}
            </div>
            <div className="p-4 rounded-xl border-2 border-mist bg-soft-white font-card text-lg leading-relaxed">
              {renderSentenceWithClickableWords()}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {wordGroups.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-stone">Переводы ({wordGroups.length})</p>
              </div>

              {wordGroups.map((group, index) => (
                <div key={group.id} className="flex items-center gap-3">
                  <button
                    onClick={() => handleGroupSelect(index)}
                    className={cn(
                      'flex-1 flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors',
                      selectedForMerge.includes(index)
                        ? 'bg-soft-amber/50 border-soft-amber'
                        : 'bg-soft-white border-mist'
                    )}
                  >
                    <span className="text-xs text-stone font-mono">{index + 1}.</span>
                    <span className="text-warm-navy font-semibold">{group.words.join(' ')}</span>
                  </button>
                  <Input
                    value={group.translation}
                    onChange={(e) => handleTranslationChange(group.id, e.target.value)}
                    placeholder="смотреть / искать"
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveGroup(group.id)} className="flex-shrink-0">
                    <Unlink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <label className="block text-sm font-medium text-stone mb-1.5">
            {t('fullSentenceTranslation')}
          </label>
          <Textarea
            value={fullTranslation}
            onChange={(e) => setFullTranslation(e.target.value)}
            placeholder="e.g., Мне нужно посмотреть это слово"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!sentence.trim() || wordGroups.length === 0 || wordGroups.some((g) => !g.translation.trim())}
          >
            {editingCard ? t('saveChanges') : t('addCard')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
