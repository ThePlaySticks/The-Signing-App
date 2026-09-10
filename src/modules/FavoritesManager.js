const STORAGE_KEY = 'asha_favorites_v1';

export class FavoritesManager {
  constructor() {
    this.favorites = this.loadFavorites();
    this.listeners = [];
  }

  loadFavorites() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : ['p-1', 'p-3', 'p-18', 'p-19']; // Default helpful starter favorites
    } catch {
      return ['p-1', 'p-3', 'p-18', 'p-19'];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites));
      this.notify();
    } catch (err) {
      console.error('Failed to save favorites:', err);
    }
  }

  isFavorite(phraseId) {
    return this.favorites.includes(phraseId);
  }

  toggleFavorite(phraseId) {
    if (this.isFavorite(phraseId)) {
      this.favorites = this.favorites.filter((id) => id !== phraseId);
    } else {
      this.favorites.push(phraseId);
    }
    this.saveFavorites();
    return this.isFavorite(phraseId);
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach((cb) => cb(this.favorites));
  }
}
