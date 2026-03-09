export type Language = 'en' | 'ru';

export const translations = {
  en: {
    // Navigation
    decks: 'Decks',
    play: 'Play',
    settings: 'Settings',
    yourVocabulary: 'Your vocabulary',
    
    // Decks page
    newDeck: 'New Deck',
    createDeck: 'Create Deck',
    editDeck: 'Edit Deck',
    deckName: 'Deck Name',
    noDecksYet: 'No decks yet',
    createYourFirstDeck: 'Create your first deck to start learning',
    cards: 'cards',
    card: 'card',
    mastery: 'mastery',
    
    // Deck detail
    addCard: 'Add Card',
    addAnotherCard: 'Add Another Card',
    noCardsYet: 'No cards yet',
    addYourFirstCard: 'Add your first card to start learning',
    startSession: 'Start Session',
    editCard: 'Edit Card',
    
    // Add/Edit Card Modal
    englishSentence: 'English Sentence',
    tapToHighlight: 'Tap on a word to highlight it',
    translation: 'Translation of highlighted word',
    cancel: 'Cancel',
    save: 'Save',
    saveChanges: 'Save Changes',
    multipleTranslationsHint: 'Use / to add multiple translations',
    
    // Play page
    practice: 'Practice',
    chooseADeck: 'Choose a deck',
    allCards: 'All Cards',
    mistakes: 'Mistakes',
    reviewWeakCards: 'Review weak cards',
    noDecksAvailable: 'No decks available',
    createDeckFirst: 'Create a deck first to start practicing',
    goToDecks: 'Go to Decks',
    
    // Game session
    skip: 'Skip',
    translateHighlighted: 'Translate the highlighted word',
    typeTranslation: 'Type translation...',
    correct: 'Correct!',
    tryAgain: 'Try again',
    correctAnswer: 'Correct answer:',
    gotIt: 'Got it',
    check: 'Check',
    next: 'Next',
    hint: 'Hint',
    
    // Session complete
    sessionComplete: 'Session Complete',
    reviewed: 'Reviewed',
    correct_count: 'Correct',
    needReview: 'Review',
    accuracy: 'Accuracy',
    reviewMistakes: 'Review Mistakes',
    practiceAgain: 'Practice Again',
    done: 'Done',
    
    // Settings
    dataManagement: 'Data Management',
    exportAllData: 'Export All Data',
    downloadDecksCards: 'Download your decks and cards as JSON',
    importData: 'Import Data',
    restoreFromJSON: 'Restore from a JSON file',
    clearAllData: 'Clear All Data',
    deleteAllDecksCards: 'Delete all decks and cards',
    installApp: 'Install App',
    addToHomeScreen: 'Add to Home Screen',
    addToHomeScreenDesktop: 'Add to home screen (Desktop/Android)',
    addToHomeScreenIOS: 'Tap Share → Add to Home Screen',
    about: 'About',
    version: 'Version',
    appDescription: 'A focused, warm, minimal vocabulary learning application. Built with Next.js, Tailwind CSS, and IndexedDB for offline-first experience.',
    
    // Common
    capair: 'Capair',
    close: 'Close',
    delete: 'Delete',
    confirm: 'Confirm',
    areYouSure: 'Are you sure?',
    deleteDeckConfirm: 'Are you sure you want to delete this deck? All cards will be lost.',
    deleteCardConfirm: 'Are you sure you want to delete this card?',
    clearDataConfirm: 'This will permanently delete all decks and cards. This action cannot be undone.',
    clearAll: 'Clear All',
    dataCleared: 'All data has been cleared.',
    dataImported: 'Data imported successfully!',
    importFailed: 'Failed to import data. Please check the file format.',
    selectJSONFile: 'Select a JSON file exported from Capair to restore your data.',
  },
  ru: {
    // Navigation
    decks: 'Колоды',
    play: 'Практика',
    settings: 'Настройки',
    yourVocabulary: 'Ваш словарный запас',
    
    // Decks page
    newDeck: 'Новая колода',
    createDeck: 'Создать колоду',
    editDeck: 'Редактировать колоду',
    deckName: 'Название колоды',
    noDecksYet: 'Пока нет колод',
    createYourFirstDeck: 'Создайте свою первую колоду для начала обучения',
    cards: 'карт',
    card: 'карта',
    mastery: 'освоение',
    
    // Deck detail
    addCard: 'Добавить карту',
    addAnotherCard: 'Добавить ещё карту',
    noCardsYet: 'Пока нет карт',
    addYourFirstCard: 'Добавьте свою первую карту для начала обучения',
    startSession: 'Начать',
    editCard: 'Редактировать карту',
    
    // Add/Edit Card Modal
    englishSentence: 'Предложение на английском',
    tapToHighlight: 'Нажмите на слово, чтобы выделить его',
    translation: 'Перевод выделенного слова',
    cancel: 'Отмена',
    save: 'Сохранить',
    saveChanges: 'Сохранить изменения',
    multipleTranslationsHint: 'Используйте / для добавления нескольких переводов',
    
    // Play page
    practice: 'Практика',
    chooseADeck: 'Выберите колоду',
    allCards: 'Все карты',
    mistakes: 'Ошибки',
    reviewWeakCards: 'Повторить сложные карты',
    noDecksAvailable: 'Нет доступных колод',
    createDeckFirst: 'Сначала создайте колоду для начала практики',
    goToDecks: 'Перейти к колодам',
    
    // Game session
    skip: 'Пропустить',
    translateHighlighted: 'Переведите выделенное слово',
    typeTranslation: 'Введите перевод...',
    correct: 'Правильно!',
    tryAgain: 'Попробуйте снова',
    correctAnswer: 'Правильный ответ:',
    gotIt: 'Понятно',
    check: 'Проверить',
    next: 'Дальше',
    hint: 'Подсказка',
    
    // Session complete
    sessionComplete: 'Сессия завершена',
    reviewed: 'Повторено',
    correct_count: 'Правильно',
    needReview: 'На повторение',
    accuracy: 'Точность',
    reviewMistakes: 'Повторить ошибки',
    practiceAgain: 'Практиковаться снова',
    done: 'Готово',
    
    // Settings
    dataManagement: 'Управление данными',
    exportAllData: 'Экспортировать все данные',
    downloadDecksCards: 'Скачать ваши колоды и карты в формате JSON',
    importData: 'Импортировать данные',
    restoreFromJSON: 'Восстановить из JSON файла',
    clearAllData: 'Очистить все данные',
    deleteAllDecksCards: 'Удалить все колоды и карты',
    installApp: 'Установить приложение',
    addToHomeScreen: 'Добавить на главный экран',
    addToHomeScreenDesktop: 'Добавить на главный экран (Desktop/Android)',
    addToHomeScreenIOS: 'Нажмите Share → Добавить на главный экран',
    about: 'О приложении',
    version: 'Версия',
    appDescription: 'Сфокусированное, тёплое, минималистичное приложение для изучения словарного запаса. Создано с использованием Next.js, Tailwind CSS и IndexedDB для работы офлайн.',
    
    // Common
    capair: 'Capair',
    close: 'Закрыть',
    delete: 'Удалить',
    confirm: 'Подтвердить',
    areYouSure: 'Вы уверены?',
    deleteDeckConfirm: 'Вы уверены, что хотите удалить эту колоду? Все карты будут потеряны.',
    deleteCardConfirm: 'Вы уверены, что хотите удалить эту карту?',
    clearDataConfirm: 'Это навсегда удалит все колоды и карты. Это действие нельзя отменить.',
    clearAll: 'Очистить всё',
    dataCleared: 'Все данные были очищены.',
    dataImported: 'Данные успешно импортированы!',
    importFailed: 'Не удалось импортировать данные. Проверьте формат файла.',
    selectJSONFile: 'Выберите JSON файл, экспортированный из Capair, для восстановления данных.',
  },
};
