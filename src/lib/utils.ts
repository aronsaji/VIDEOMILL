import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('nb-NO').format(num);
};

export const MOCK_STATS = {
  totalViews: 12405920,
  watchTime: 84203,
  retentionRate: 62,
  engagementRate: 8,
};
