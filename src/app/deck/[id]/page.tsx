'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Play, Edit2, Trash2 } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { CardItem } from '@/components/CardItem';
import { AddCardModal } from '@/components/AddCardModal';
import { Button } from '@/components/ui/Button';
import {
  getDeck,
  getCardsByDeck,
  updateDeck,
  deleteDeck,
  createCard,
  updateCard,
  deleteCard,
} from '@/lib/db';
import type { Deck, Card } from '@/lib/types';
import { useUIStore } from '@/lib/store';
import { useI18n } from '@/components/I18nProvider';

export default function DeckDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [deckName, setDeckName] = useState('');
  const { openAddCardModal, closeAddCardModal, isAddCardModalOpen, editingCard } = useUIStore();

  const loadData = useCallback(async () => {
    const deckData = await getDeck(deckId);
    if (!deckData) {
      router.push('/');
      return;
    }
    setDeck(deckData);
    setDeckName(deckData.name);
    
    const cardsData = await getCardsByDeck(deckId);
    setCards(cardsData);
  }, [deckId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateName = async () => {
    if (!deckName.trim() || !deck) return;
    await updateDeck(deck.id, deckName.trim());
    setIsEditingName(false);
    loadData();
  };

  const handleDeleteDeck = async () => {
    if (confirm('Are you sure you want to delete this deck? All cards will be lost.')) {
      await deleteDeck(deckId);
      router.push('/');
    }
  };

  const handleSaveCard = async (cardData: { sentence: string; highlightedWord: string; translation: string }) => {
    if (editingCard) {
      await updateCard(editingCard.id, cardData);
    } else {
      await createCard(deckId, cardData.sentence, cardData.highlightedWord, cardData.translation);
    }
    loadData();
  };

  const handleDeleteCard = async (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      await deleteCard(cardId);
      loadData();
    }
  };

  const handlePlay = () => {
    router.push(`/session/${deckId}`);
  };

  if (!deck) return null;

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pl-64">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-6 safe-top">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            {isEditingName ? (
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                onBlur={handleUpdateName}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                className="text-2xl font-heading font-semibold text-ink bg-transparent border-b-2 border-warm-navy focus:outline-none w-full"
                autoFocus
              />
            ) : (
              <h1
                onClick={() => setIsEditingName(true)}
                className="text-2xl font-heading font-semibold text-ink cursor-pointer hover:text-warm-navy/80"
              >
                {deck.name}
              </h1>
            )}
            <p className="text-sm text-stone">{cards.length} {cards.length === 1 ? t('card') : t('cards')}</p>
          </div>

          <Button variant="primary" onClick={handlePlay} disabled={cards.length === 0}>
            <Play className="w-4 h-4 mr-2" />
            {t('startSession')}
          </Button>
        </div>

        {/* Card List */}
        {cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-mist flex items-center justify-center">
              <Plus className="w-10 h-10 text-stone" />
            </div>
            <h2 className="text-lg font-heading font-medium text-ink mb-2">
              {t('noCardsYet')}
            </h2>
            <p className="text-stone mb-4">
              {t('addYourFirstCard')}
            </p>
            <Button onClick={() => openAddCardModal()}>
              <Plus className="w-4 h-4 mr-2" />
              {t('addCard')}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="stagger-item"
                >
                  <CardItem
                    card={card}
                    showActions
                    onEdit={() => openAddCardModal(card)}
                    onDelete={() => handleDeleteCard(card.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add Card Button (Desktop) */}
        <div className="hidden md:flex justify-center mt-6">
          <Button onClick={() => openAddCardModal()} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            {t('addAnotherCard')}
          </Button>
        </div>
      </main>

      {/* Add Card FAB */}
      <Button
        onClick={() => openAddCardModal()}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg z-30 md:hidden"
        size="lg"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add/Edit Card Modal */}
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={closeAddCardModal}
        onSave={handleSaveCard}
        editingCard={editingCard}
      />
    </div>
  );
}
