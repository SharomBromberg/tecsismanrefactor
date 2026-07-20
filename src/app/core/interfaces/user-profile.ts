export interface UserProfile {
  displayName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  city: string;
  addressLine: string;
  reference: string;
  isDefault: boolean;
}

export type UserProfilesMap = Record<string, UserProfile>;
