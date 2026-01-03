import { Injectable } from '@angular/core';

export interface ConversionHistoryItem {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  dateUsed: string | null;
  timestamp: string;
}

const STORAGE_KEY = 'currency_conversion_history';

@Injectable({ providedIn: 'root' })
export class ConversionHistoryService {
  getHistory(): ConversionHistoryItem[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as ConversionHistoryItem[];
    } catch {
      return [];
    }
  }

  add(item: ConversionHistoryItem): void {
    const history = this.getHistory();
    history.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
