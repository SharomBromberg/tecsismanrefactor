import { Injectable } from '@angular/core';
import {
  ShippingAddress,
  UserProfile,
  UserProfilesMap,
} from '@core/interfaces/user-profile';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly storageKey = 'tecsisman_user_profiles';
  private readonly addressesStorageKey = 'tecsisman_user_addresses';

  getProfile(username: string, fallbackDisplayName = 'Usuario'): UserProfile {
    const normalizedUsername = this.normalizeUsername(username);
    const profiles = this.readProfiles();

    const profile = profiles[normalizedUsername];
    if (!profile) {
      return {
        displayName: fallbackDisplayName,
        email: '',
        phone: '',
      };
    }

    return profile;
  }

  saveProfile(username: string, profile: UserProfile): void {
    const normalizedUsername = this.normalizeUsername(username);
    if (!normalizedUsername) {
      return;
    }

    const profiles = this.readProfiles();
    profiles[normalizedUsername] = {
      displayName: profile.displayName.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
    };

    localStorage.setItem(this.storageKey, JSON.stringify(profiles));
  }

  getAddresses(username: string): ShippingAddress[] {
    const normalizedUsername = this.normalizeUsername(username);
    const map = this.readAddressesMap();
    const addresses = map[normalizedUsername] ?? [];
    return [...addresses];
  }

  saveAddresses(username: string, addresses: ShippingAddress[]): void {
    const normalizedUsername = this.normalizeUsername(username);
    if (!normalizedUsername) {
      return;
    }

    const map = this.readAddressesMap();
    map[normalizedUsername] = addresses.map((item, index) => ({
      ...item,
      id: item.id || `${Date.now()}-${index}`,
      isDefault:
        item.isDefault ||
        (!addresses.some((address) => address.isDefault) && index === 0),
    }));
    localStorage.setItem(this.addressesStorageKey, JSON.stringify(map));
  }

  private readProfiles(): UserProfilesMap {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as UserProfilesMap;
      return parsed ?? {};
    } catch {
      return {};
    }
  }

  private readAddressesMap(): Record<string, ShippingAddress[]> {
    const raw = localStorage.getItem(this.addressesStorageKey);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as Record<string, ShippingAddress[]>;
      return parsed ?? {};
    } catch {
      return {};
    }
  }

  private normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }
}
