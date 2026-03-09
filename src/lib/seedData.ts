import type { Card } from './types';

export const defaultDeck = {
  id: 'default-a1-b1',
  name: 'Базовые слова (A1-B1)',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const defaultCards: Omit<Card, 'id' | 'deckId' | 'createdAt' | 'correctCount' | 'incorrectCount' | 'lastPracticedAt'>[] = [
  { sentence: 'I have a cat.', highlightedWord: 'cat', translation: 'кот' },
  { sentence: 'She lives in London.', highlightedWord: 'lives', translation: 'живёт' },
  { sentence: 'They are happy.', highlightedWord: 'happy', translation: 'счастливы' },
  { sentence: 'He works at a bank.', highlightedWord: 'works', translation: 'работает' },
  { sentence: 'We need water.', highlightedWord: 'water', translation: 'вода' },
  { sentence: 'The book is on the table.', highlightedWord: 'book', translation: 'книга' },
  { sentence: 'I want to eat.', highlightedWord: 'eat', translation: 'есть' },
  { sentence: 'She speaks English.', highlightedWord: 'speaks', translation: 'говорит' },
  { sentence: 'The weather is nice today.', highlightedWord: 'weather', translation: 'погода' },
  { sentence: 'I like this music.', highlightedWord: 'like', translation: 'нравится' },
  { sentence: 'He is my friend.', highlightedWord: 'friend', translation: 'друг' },
  { sentence: 'They went to school.', highlightedWord: 'school', translation: 'школа' },
  { sentence: 'I need some help.', highlightedWord: 'help', translation: 'помощь' },
  { sentence: 'She bought a new dress.', highlightedWord: 'bought', translation: 'купила' },
  { sentence: 'The car is red.', highlightedWord: 'car', translation: 'машина' },
  { sentence: 'We are going home.', highlightedWord: 'home', translation: 'домой' },
  { sentence: 'He can swim very well.', highlightedWord: 'swim', translation: 'плавать' },
  { sentence: 'I love my family.', highlightedWord: 'family', translation: 'семья' },
  { sentence: 'The dog is barking.', highlightedWord: 'barking', translation: 'лает' },
  { sentence: 'She is reading a book.', highlightedWord: 'reading', translation: 'читает' },
];
