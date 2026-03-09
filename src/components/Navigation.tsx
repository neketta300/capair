'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Play, Settings, Menu, X, Globe } from 'lucide-react';
import { Button } from './ui/Button';
import { useUIStore } from '@/lib/store';
import { useI18n } from '@/components/I18nProvider';
import { cn } from '@/lib/utils';
import type { Language } from '@/lib/i18n';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeTab, setActiveTab, isSidebarOpen, toggleSidebar } = useUIStore();
  const { t, language, setLanguage } = useI18n();

  const tabs = [
    { id: 'decks' as const, label: t('decks'), icon: BookOpen, path: '/' },
    { id: 'play' as const, label: t('play'), icon: Play, path: '/play' },
    { id: 'settings' as const, label: t('settings'), icon: Settings, path: '/settings' },
  ];

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    const tab = tabs.find((tab) => tab.id === tabId);
    if (tab) {
      router.push(tab.path);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  // Determine active tab based on exact path or specific prefixes
  const getActiveTab = () => {
    if (pathname === '/') return 'decks';
    if (pathname?.startsWith('/deck/')) return 'decks';
    if (pathname === '/play') return 'play';
    if (pathname?.startsWith('/session/')) return 'play';
    if (pathname === '/settings') return 'settings';
    return 'decks';
  };

  const activeTabId = getActiveTab();

  // Desktop Sidebar
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 240 : 80,
        }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-soft-white border-r border-mist z-40 safe-top"
      >
        {/* Header */}
        <div className="p-6 border-b border-mist">
          <div className="flex items-center justify-between mb-3">
            <motion.h1
              animate={{ opacity: isSidebarOpen ? 1 : 0 }}
              className="text-xl font-heading font-semibold text-ink whitespace-nowrap overflow-hidden"
            >
              Capair
            </motion.h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="flex-shrink-0"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
          <motion.p
            animate={{ opacity: isSidebarOpen ? 1 : 0, height: isSidebarOpen ? 'auto' : 0 }}
            className="text-sm text-stone whitespace-nowrap overflow-hidden"
          >
            {t('yourVocabulary')}
          </motion.p>
          {/* Language Toggle */}
          <motion.button
            onClick={toggleLanguage}
            className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-mist/50 hover:bg-mist transition-colors text-sm text-stone"
            disabled={!isSidebarOpen}
          >
            <Globe className="w-4 h-4" />
            <motion.span
              animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
              className="whitespace-nowrap overflow-hidden font-medium"
            >
              {language === 'en' ? 'English' : 'Русский'}
            </motion.span>
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabId === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl',
                  'transition-colors duration-150',
                  isActive
                    ? 'bg-warm-navy text-white'
                    : 'text-stone hover:bg-mist/50'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <motion.span
                  animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  {tab.label}
                </motion.span>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-mist">
          <p className="text-xs text-stone text-center font-mono">
            v1.0.0
          </p>
        </div>
      </motion.aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-soft-white border-t border-mist safe-bottom z-40">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabId === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center py-3',
                  'transition-colors duration-150'
                )}
              >
                <Icon
                  className={cn(
                    'w-6 h-6 mb-1',
                    isActive ? 'text-warm-navy' : 'text-stone'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-warm-navy' : 'text-stone'
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex-1 flex flex-col items-center justify-center py-3"
          >
            <Globe
              className={cn(
                'w-6 h-6 mb-1',
                'text-stone'
              )}
            />
            <span className="text-xs font-medium text-stone">
              {language === 'en' ? 'EN' : 'RU'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
