'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { DeckCard } from '@/components/DeckCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  getAllDecks,
  getCardsByDeck,
  createDeck,
  updateDeck,
  deleteDeck,
  getTotalCardsCount,
  getTodayPracticeCount,
  initializeWithDefaultData,
} from '@/lib/db';
import type { Deck } from '@/lib/types';
import { useI18n } from '@/components/I18nProvider';
import { cn } from '@/lib/utils';

export default function DecksPage() {
  const { t } = useI18n();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cardsCount, setCardsCount] = useState<Record<string, number>>({});
  const [masteredCount, setMasteredCount] = useState<Record<string, number>>({});
  const [totalCards, setTotalCards] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  const loadData = useCallback(async () => {
    // Initialize with default data on first run
    await initializeWithDefaultData();
    
    const allDecks = await getAllDecks();
    setDecks(allDecks);

    const total = await getTotalCardsCount();
    setTotalCards(total);

    const today = await getTodayPracticeCount();
    setTodayCount(today);

    // Load card counts for each deck
    const counts: Record<string, number> = {};
    const mastered: Record<string, number> = {};
    for (const deck of allDecks) {
      const cards = await getCardsByDeck(deck.id);
      counts[deck.id] = cards.length;
      mastered[deck.id] = cards.filter((c) => c.correctCount > c.incorrectCount).length;
    }
    setCardsCount(counts);
    setMasteredCount(mastered);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) return;
    await createDeck(newDeckName.trim());
    setNewDeckName('');
    setIsCreateModalOpen(false);
    loadData();
  };

  const handleEditDeck = async () => {
    if (!editingDeck || !newDeckName.trim()) return;
    await updateDeck(editingDeck.id, newDeckName.trim());
    setNewDeckName('');
    setEditingDeck(null);
    setIsCreateModalOpen(false);
    loadData();
  };

  const handleDeleteDeck = async (id: string) => {
    if (confirm('Are you sure you want to delete this deck? All cards will be lost.')) {
      await deleteDeck(id);
      loadData();
    }
  };

  const openCreateModal = () => {
    setNewDeckName('');
    setEditingDeck(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (deck: Deck) => {
    setNewDeckName(deck.name);
    setEditingDeck(deck);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pl-64">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-6 safe-top">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-ink">{t('capair')}</h1>
            <p className="text-sm text-stone">{t('yourVocabulary')}</p>
          </div>
          <Button onClick={openCreateModal} className="hidden md:flex">
            <Plus className="w-4 h-4 mr-2" />
            {t('newDeck')}
          </Button>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-soft-white rounded-xl border border-mist px-4 py-3 text-center">
            <p className="text-xl font-mono font-medium text-warm-navy">{decks.length}</p>
            <p className="text-xs text-stone mt-0.5 uppercase tracking-wide">{t('decks')}</p>
          </div>
          <div className="bg-soft-white rounded-xl border border-mist px-4 py-3 text-center">
            <p className="text-xl font-mono font-medium text-warm-navy">{totalCards}</p>
            <p className="text-xs text-stone mt-0.5 uppercase tracking-wide">{t('cards')}</p>
          </div>
          <div className="bg-soft-white rounded-xl border border-mist px-4 py-3 text-center">
            <p className="text-xl font-mono font-medium text-warm-navy">{todayCount}</p>
            <p className="text-xs text-stone mt-0.5 uppercase tracking-wide">{t('play')}</p>
          </div>
        </div>

        {/* Deck List */}
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
              {t('noDecksYet')}
            </h2>
            <p className="text-stone mb-6">
              {t('createYourFirstDeck')}
            </p>
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-2" />
              {t('createDeck')}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {decks.map((deck, index) => (
                <motion.div
                  key={deck.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="stagger-item"
                >
                  <DeckCard
                    deck={deck}
                    cardsCount={cardsCount[deck.id] || 0}
                    masteredCount={masteredCount[deck.id] || 0}
                    showActions
                    onEdit={() => openEditModal(deck)}
                    onDelete={() => handleDeleteDeck(deck.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Mobile FAB */}
      <Button
        onClick={openCreateModal}
        className="md:hidden fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg z-30"
        size="lg"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Create/Edit Deck Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewDeckName('');
          setEditingDeck(null);
        }}
        title={editingDeck ? t('editDeck') : t('newDeck')}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label={t('deckName')}
            placeholder="e.g., Animals, Food, Travel"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (editingDeck ? handleEditDeck() : handleCreateDeck())}
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewDeckName('');
                setEditingDeck(null);
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={editingDeck ? handleEditDeck : handleCreateDeck}
              disabled={!newDeckName.trim()}
            >
              {editingDeck ? t('save') : t('createDeck')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
