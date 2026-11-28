export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
  order: number;
  active: boolean;
  batchKey?: string;
  badgeText?: string;
  seatsLeft?: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
