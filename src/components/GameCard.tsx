'use client';

import { useState, useEffect } from 'react';
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

  // Парсим highlightedWord по запятым: "look up, give in" → ['look up', 'give in']
  const items = String(card.highlightedWord || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const [answers, setAnswers] = useState<string[]>(new Array(items.length).fill(''));
  const [lockedAnswers, setLockedAnswers] = useState<boolean[]>(new Array(items.length).fill(false));
  const [attempts, setAttempts] = useState<number[]>(new Array(items.length).fill(0));
  const [fieldFeedback, setFieldFeedback] = useState<('correct' | 'incorrect' | null)[]>(
    new Array(items.length).fill(null)
  );
  const [showHint, setShowHint] = useState(false);
  const [showFullTranslation, setShowFullTranslation] = useState(false);

  // Сбрасываем состояние при смене карточки
  useEffect(() => {
    setAnswers(new Array(items.length).fill(''));
    setLockedAnswers(new Array(items.length).fill(false));
    setAttempts(new Array(items.length).fill(0));
    setFieldFeedback(new Array(items.length).fill(null));
    setShowHint(false);
    setShowFullTranslation(false);
  }, [card.id, items.length]);

  const normalizeText = (text: string) => {
    return text.toLowerCase().trim().replace(/[.,!?;:'"()]/g, '');
  };

  const renderTranslation = (translation: string) => {
    const translationStr = String(translation || '');
    const parts = translationStr.split('/');
    if (parts.length === 1) {
      return <span className="text-warm-navy font-semibold">{translationStr}</span>;
    }
    return parts.map((part, index) => (
      <span key={index}>
        {index > 0 && <span className="text-mist font-medium">/</span>}
        <span className="text-warm-navy font-semibold">
          {part.trim()}
        </span>
      </span>
    ));
  };

  // Получаем переводы для каждого элемента (разбиваем translation по запятой)
  const getExpectedTranslations = () => {
    const translationStr = String(card.translation || '');
    return translationStr.split(',').map(t => t.trim()).filter(Boolean);
  };

  // Проверка одного поля
  const checkFieldAnswer = (answer: string, expected: string) => {
    const normalizedAnswer = normalizeText(answer);
    const normalizedExpected = normalizeText(expected);
    // Также проверяем варианты через "/" (например, "привет / здравствуй")
    const expectedVariants = normalizedExpected.split('/').map(v => v.trim());
    return expectedVariants.some(v => v === normalizedAnswer || normalizedAnswer.includes(v));
  };

  // Проверка всех ответов
  const checkAllAnswersCorrect = () => {
    const expectedTranslations = getExpectedTranslations();
    return answers.every((answer, index) => {
      const expected = expectedTranslations[index] || expectedTranslations[0] || '';
      return checkFieldAnswer(answer, expected);
    });
  };

  const checkAnswer = () => {
    const expectedTranslations = getExpectedTranslations();
    const newLockedAnswers = [...lockedAnswers];
    const newFieldFeedback = [...fieldFeedback];
    const newAttempts = [...attempts];
    let hasIncorrect = false;

    items.forEach((item, index) => {
      if (lockedAnswers[index]) return; // Уже заблокировано

      const expected = expectedTranslations[index] || expectedTranslations[0] || '';
      const isCorrect = checkFieldAnswer(answers[index], expected);

      if (isCorrect) {
        newLockedAnswers[index] = true;
        newFieldFeedback[index] = 'correct';
      } else {
        newAttempts[index] += 1;
        newFieldFeedback[index] = 'incorrect';
        hasIncorrect = true;

        // Если 5 попыток — показываем подсказку
        if (newAttempts[index] >= 5) {
          setShowHint(true);
        }
      }
    });

    setLockedAnswers(newLockedAnswers);
    setFieldFeedback(newFieldFeedback);
    setAttempts(newAttempts);

    // Если все поля правильные — показываем полный перевод и переходим дальше
    const allCorrect = newLockedAnswers.every(l => l);
    if (allCorrect) {
      setShowFullTranslation(true);
      setTimeout(() => {
        onAnswer(true);
      }, 1500);
    } else {
      // Есть неправильные — очищаем только их через 500мс
      if (hasIncorrect) {
        setTimeout(() => {
          const newAnswers = answers.map((answer, index) => {
            if (!newLockedAnswers[index] && newFieldFeedback[index] === 'incorrect') {
              return '';
            }
            return answer;
          });
          setAnswers(newAnswers);
          setFieldFeedback(new Array(items.length).fill(null));
        }, 500);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      if (showHint) {
        // После подсказки Enter проверяет все ответы
        if (checkAllAnswersCorrect()) {
          onAnswer(true);
        }
      } else {
        const allFilled = answers.every(a => a.trim());
        if (allFilled) {
          checkAnswer();
        }
      }
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    // Сбрасываем feedback при изменении
    const newFieldFeedback = [...fieldFeedback];
    newFieldFeedback[index] = null;
    setFieldFeedback(newFieldFeedback);
  };

  const highlightSentence = (sentence: string, word: string) => {
    const sentenceStr = String(sentence || '');
    const wordStr = String(word || '');
    // Разбиваем по запятой на группы, затем каждую группу на слова
    const groups = wordStr.split(',').map(g => g.trim()).filter(Boolean);
    const words = groups.flatMap(g => g.split(/\s+/).filter(Boolean));
    
    // Сортируем по длине (длинные сначала) чтобы "look up" обрабатывался раньше "look"
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    const parts = sentenceStr.split(new RegExp(`(${sortedWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi'));

    return parts.map((part, index) => {
      const isHighlighted = sortedWords.some(w => part.toLowerCase() === w.toLowerCase());
      return isHighlighted ? (
        <span
          key={index}
          className="bg-soft-amber/30 text-warm-navy px-2 py-0.5 rounded font-semibold"
        >
          {part}
        </span>
      ) : (
        part
      );
    });
  };

  // Проверяем, все ли поля заполнены
  const allFieldsFilled = answers.every(a => a.trim());
  const allFieldsLocked = lockedAnswers.every(l => l);
  const allAnswersCorrect = checkAllAnswersCorrect();

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
            {highlightSentence(card.sentence || '', card.highlightedWord || '')}
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <p className="text-sm text-stone text-center">
            {items.length > 1 ? t('translateWords') : t('translateHighlighted')}
          </p>

          {/* Поля ввода */}
          <div className="space-y-2">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={cn(
                  'transition-all duration-150',
                  fieldFeedback[index] === 'incorrect' && 'shake'
                )}
              >
                <Input
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder={items.length > 1 ? `${t('typeTranslationWord')} ${index + 1}` : t('typeTranslation')}
                  disabled={lockedAnswers[index] || showFullTranslation}
                  className={cn(
                    'text-center text-lg',
                    fieldFeedback[index] === 'correct' && 'border-sage bg-sage/5',
                    fieldFeedback[index] === 'incorrect' && 'border-warm-red bg-warm-red/5'
                  )}
                  autoFocus={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence mode="wait">
            {showHint && !showFullTranslation && (
              <motion.div
                key="show-hint"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-amber-50 border border-soft-amber rounded-xl p-4 text-center space-y-3"
              >
                <div className="space-y-3">
                  <p className="text-sm text-stone mb-1">{t('correctAnswer')}</p>
                  {items.length === 1 ? (
                    <p className="text-xl font-medium">{renderTranslation(card.translation)}</p>
                  ) : (
                    <div className="space-y-2">
                      {getExpectedTranslations().map((translation, index) => (
                        <div key={index} className="flex items-center justify-center gap-2">
                          <span className="text-sm text-stone font-medium">{items[index]}:</span>
                          <span className="text-lg font-medium">{renderTranslation(translation)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {card.fullTranslation && (
                  <div className="bg-white rounded-lg p-3 mt-2">
                    <p className="text-sm text-stone mb-1">{t('fullSentenceTranslation')}</p>
                    <p className="text-base text-ink">{card.fullTranslation}</p>
                  </div>
                )}
              </motion.div>
            )}

            {showFullTranslation && card.fullTranslation && (
              <motion.div
                key="show-full-translation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-soft-white border border-mist rounded-xl p-4 text-center"
              >
                <p className="text-sm text-stone mb-1">{t('fullSentenceTranslation')}</p>
                <p className="text-lg font-medium text-ink">{card.fullTranslation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопки */}
          <div className="flex flex-col gap-2">
            {!showHint && !showFullTranslation && (
              <>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={checkAnswer}
                  disabled={!allFieldsFilled || allFieldsLocked}
                >
                  {t('check')}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="flex-shrink-0 px-4 text-sm font-medium"
                >
                  {t('hint')}
                </Button>
              </>
            )}

            {showHint && !showFullTranslation && (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => onAnswer(true)}
                disabled={!allFieldsFilled || !allAnswersCorrect}
              >
                {t('next')}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
