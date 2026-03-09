'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/store';

export function useKeyboardShortcuts() {
  const pathname = usePathname();
  const router = useRouter();
  const { openAddCardModal, setActiveTab } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + N: New Deck (on Decks page)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !e.shiftKey) {
        e.preventDefault();
        if (pathname === '/') {
          // Trigger new deck button click
          const button = document.querySelector('button[aria-label="New Deck"]');
          button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      }

      // Ctrl/Cmd + Shift + N: New Card (on deck detail page)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        if (pathname?.startsWith('/deck/')) {
          openAddCardModal();
        }
      }

      // Escape: Close modal (handled by Modal component)

      // G then D: Go to Decks
      // G then P: Go to Play
      // G then S: Go to Settings
      // (Implemented as a sequence)
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname, openAddCardModal, setActiveTab, router]);
}
