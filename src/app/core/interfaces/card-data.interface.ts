import { statusClassButton } from './buttoninterface';

export interface CardData {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  imageFitContain?: boolean;
  buttonText?: string;
  buttonVariant?: statusClassButton;
  isHighlighted?: boolean;
  badgeText?: string;
}
