import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type Direction = 'top' | 'bottom' | 'left' | 'right' | string;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));