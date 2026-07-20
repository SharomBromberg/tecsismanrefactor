import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { FavoriteMap } from '@core/interfaces/user-favorites';

@Injectable({
  providedIn: 'root',
})
export class UserFavoritesService {
  private readonly storageKey = 'tecsisman_user_favorites';
  private readonly favoritesSubject = new BehaviorSubject<FavoriteMap>(
    this.readFavorites(),
  );

  getFavoriteIds$(username: string) {
    const normalizedUsername = this.normalizeUsername(username);
    return this.favoritesSubject.pipe(
      map((favorites) => favorites[normalizedUsername] ?? []),
    );
  }

  getFavoriteIds(username: string): string[] {
    const normalizedUsername = this.normalizeUsername(username);
    if (!normalizedUsername) {
      return [];
    }

    return this.favoritesSubject.value[normalizedUsername] ?? [];
  }

  // Utilidad para sincronizar con backend cuando exista API.
  getSyncPayload(username: string): {
    username: string;
    favoriteProductIds: string[];
  } {
    const normalizedUsername = this.normalizeUsername(username);
    return {
      username: normalizedUsername,
      favoriteProductIds: this.getFavoriteIds(normalizedUsername),
    };
  }

  // Reemplaza favoritos locales por el estado recibido desde backend.
  applyServerState(username: string, favoriteProductIds: string[]): void {
    const normalizedUsername = this.normalizeUsername(username);
    if (!normalizedUsername) {
      return;
    }

    const deduped = Array.from(new Set(favoriteProductIds.filter(Boolean)));
    const next = {
      ...this.favoritesSubject.value,
      [normalizedUsername]: deduped,
    };

    this.writeFavorites(next);
    this.favoritesSubject.next(next);
  }

  toggle(username: string, productId: string): boolean {
    const normalizedUsername = this.normalizeUsername(username);
    if (!normalizedUsername || !productId) {
      return false;
    }

    const favorites = this.favoritesSubject.value;
    const current = favorites[normalizedUsername] ?? [];
    const exists = current.includes(productId);

    const updated = exists
      ? current.filter((id) => id !== productId)
      : [...current, productId];

    const next = {
      ...favorites,
      [normalizedUsername]: updated,
    };

    this.writeFavorites(next);
    this.favoritesSubject.next(next);

    return updated.includes(productId);
  }

  private readFavorites(): FavoriteMap {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as FavoriteMap;
      return parsed ?? {};
    } catch {
      return {};
    }
  }

  private writeFavorites(mapValue: FavoriteMap): void {
    localStorage.setItem(this.storageKey, JSON.stringify(mapValue));
  }

  private normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }
}
