import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConvertRequest {
  from: string;
  to: string;
  amount: number;
  date?: string | null;
}

export interface ConvertResponse {
  from: string;
  to: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  date: string | null;
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly baseUrl = 'https://currency-converter-api-gahx.onrender.com/currency';

  constructor(private http: HttpClient) {}

  getSymbols(base = 'USD'): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/symbols`, {
      params: { base },
    });
  }

  convert(body: ConvertRequest): Observable<ConvertResponse> {
    return this.http.post<ConvertResponse>(`${this.baseUrl}/convert`, body);
  }
}
