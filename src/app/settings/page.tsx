'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Trash2, Info, Smartphone, Monitor } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { exportAllData, exportSelectedDecks, importData, clearAllData, getAllDecks, db } from '@/lib/db';
import { useUIStore } from '@/lib/store';
import { useI18n } from '@/components/I18nProvider';

export default function SettingsPage() {
  const { t } = useI18n();
  const { isSidebarOpen } = useUIStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [decks, setDecks] = useState<Array<{ id: string; name: string; cardsCount: number }>>([]);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const [exportMode, setExportMode] = useState<'all' | 'selected'>('all');

  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  // Detect if app is installed and iOS
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);
  }, []);

  // Listen for install prompt (Android/Desktop)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const loadDecks = useCallback(async () => {
    const allDecks = await getAllDecks();
    const decksWithCount = await Promise.all(
      allDecks.map(async (deck) => {
        const cards = await db.cards.where('deckId').equals(deck.id).toArray();
        return { id: deck.id, name: deck.name, cardsCount: cards.length };
      })
    );
    setDecks(decksWithCount);
  }, []);

  const openExportModal = useCallback(async () => {
    await loadDecks();
    setExportMode('all');
    setSelectedDeckIds([]);
    setIsExportModalOpen(true);
  }, [loadDecks]);

  const handleExport = useCallback(async (mode: 'all' | 'selected', selectedIds?: string[]) => {
    setIsExporting(true);
    try {
      let data: string;
      if (mode === 'selected' && selectedIds && selectedIds.length > 0) {
        data = await exportSelectedDecks(selectedIds);
      } else {
        data = await exportAllData();
      }
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `capair-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importData(text);
      setIsImportModalOpen(false);
      setImportError(null);
      alert('Data imported successfully!');
    } catch (error) {
      setImportError('Failed to import data. Please check the file format.');
      console.error('Import failed:', error);
    }
  }, []);

  const handleClear = useCallback(async () => {
    await clearAllData();
    setIsClearModalOpen(false);
    alert('All data has been cleared.');
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pl-64">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-6 safe-top">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-semibold text-ink">{t('settings')}</h1>
          <p className="text-sm text-stone">{t('dataManagement')}</p>
        </div>

        {/* Data Management */}
        <section className="mb-8">
          <h2 className="text-sm font-heading font-semibold text-stone uppercase tracking-wide mb-4">
            {t('dataManagement')}
          </h2>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openExportModal}
              disabled={isExporting}
              className="w-full bg-soft-white rounded-2xl border border-mist p-4 flex items-center gap-4 card-hover"
            >
              <div className="w-10 h-10 rounded-full bg-warm-navy/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-warm-navy" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-heading font-semibold text-ink">{t('exportAllData')}</p>
                <p className="text-sm text-stone">{t('downloadDecksCards')}</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsImportModalOpen(true)}
              className="w-full bg-soft-white rounded-2xl border border-mist p-4 flex items-center gap-4 card-hover"
            >
              <div className="w-10 h-10 rounded-full bg-warm-navy/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-warm-navy" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-heading font-semibold text-ink">{t('importData')}</p>
                <p className="text-sm text-stone">{t('restoreFromJSON')}</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsClearModalOpen(true)}
              className="w-full bg-soft-white rounded-2xl border border-mist p-4 flex items-center gap-4 card-hover"
            >
              <div className="w-10 h-10 rounded-full bg-warm-red/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-warm-red" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-heading font-semibold text-warm-red">{t('clearAllData')}</p>
                <p className="text-sm text-stone">{t('deleteAllDecksCards')}</p>
              </div>
            </motion.button>
          </div>
        </section>

        {/* Install App */}
        {!isInstalled && (deferredPrompt || isIOS) && (
          <section className="mb-8">
            <h2 className="text-sm font-heading font-semibold text-stone uppercase tracking-wide mb-4">
              {t('installApp')}
            </h2>
            <div className="space-y-3">
              {deferredPrompt && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInstall}
                  className="w-full bg-soft-white rounded-2xl border border-mist p-4 flex items-center gap-4 card-hover"
                >
                  <div className="w-10 h-10 rounded-full bg-warm-navy/10 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-warm-navy" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-heading font-semibold text-ink">{t('addToHomeScreen')}</p>
                    <p className="text-sm text-stone">{t('addToHomeScreenDesktop')}</p>
                  </div>
                </motion.button>
              )}

              {isIOS && (
                <motion.div
                  className="w-full bg-soft-white rounded-2xl border border-mist p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-warm-navy/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-warm-navy" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-heading font-semibold text-ink">{t('addToHomeScreen')}</p>
                    <p className="text-sm text-stone">
                      Tap <span className="font-semibold">Share</span> →{' '}
                      <span className="font-semibold">Add to Home Screen</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* About */}
        <section>
          <h2 className="text-sm font-heading font-semibold text-stone uppercase tracking-wide mb-4">
            {t('about')}
          </h2>
          <div className="bg-soft-white rounded-2xl border border-mist p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-warm-navy flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-heading font-semibold text-ink">{t('capair')}</p>
                <p className="text-sm text-stone">{t('version')} 1.0.0</p>
              </div>
            </div>
            <p className="text-stone text-sm leading-relaxed">
              {t('appDescription')}
            </p>
          </div>
        </section>
      </main>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportError(null);
        }}
        title={t('importData')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-stone text-sm">
            {t('selectJSONFile')}
          </p>
          {importError && (
            <p className="text-warm-red text-sm bg-warm-red/10 p-3 rounded-xl">
              {importError}
            </p>
          )}
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-warm-navy file:text-white hover:file:bg-warm-navy/90"
          />
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setIsImportModalOpen(false);
                setImportError(null);
              }}
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title={t('clearAllData')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-stone text-sm">
            {t('clearDataConfirm')}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsClearModalOpen(false)}>
              {t('cancel')}
            </Button>
            <Button variant="danger" onClick={handleClear}>
              {t('clearAll')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={t('exportAllData')}
        size="md"
      >
        <div className="space-y-4">
          {/* Export Mode */}
          <div className="space-y-3">
            <p className="text-sm text-stone">{t('selectExportMode')}</p>
            
            <label className="flex items-center gap-3 p-3 rounded-xl border border-mist cursor-pointer hover:bg-mist/30">
              <input
                type="radio"
                name="exportMode"
                checked={exportMode === 'all'}
                onChange={() => setExportMode('all')}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <p className="font-medium text-ink">{t('exportAllDecks')}</p>
                <p className="text-xs text-stone">{t('exportAllDecksDesc')}</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-mist cursor-pointer hover:bg-mist/30">
              <input
                type="radio"
                name="exportMode"
                checked={exportMode === 'selected'}
                onChange={() => setExportMode('selected')}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <p className="font-medium text-ink">{t('exportSelectedDecks')}</p>
                <p className="text-xs text-stone">{t('exportSelectedDecksDesc')}</p>
              </div>
            </label>
          </div>

          {/* Deck Selection */}
          {exportMode === 'selected' && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {decks.length === 0 ? (
                <p className="text-sm text-stone text-center py-4">{t('noDecksAvailable')}</p>
              ) : (
                decks.map((deck) => (
                  <label
                    key={deck.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-mist cursor-pointer hover:bg-mist/30"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDeckIds.includes(deck.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDeckIds([...selectedDeckIds, deck.id]);
                        } else {
                          setSelectedDeckIds(selectedDeckIds.filter((id) => id !== deck.id));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-ink">{deck.name}</p>
                      <p className="text-xs text-stone">{deck.cardsCount} {deck.cardsCount === 1 ? t('card') : t('cards')}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsExportModalOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={() => handleExport(exportMode, exportMode === 'selected' ? selectedDeckIds : undefined)}
              disabled={exportMode === 'selected' && selectedDeckIds.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              {t('export')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
