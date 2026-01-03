import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import {
  CurrencyService,
  ConvertResponse,
} from './currency.service';
import {
  ConversionHistoryItem,
  ConversionHistoryService,
} from './conversion-history.service';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {
  form!: FormGroup;
  currencies: string[] = [];
  loadingSymbols = false;
  converting = false;
  result: ConvertResponse | null = null;
  history: ConversionHistoryItem[] = [];
  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private historyService: ConversionHistoryService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.history = this.historyService.getHistory();
    this.loadSymbols();
  }

  private buildForm() {
    this.form = this.fb.group({
      from: ['USD', Validators.required],
      to: ['EUR', Validators.required],
      amount: [1, [Validators.required, Validators.min(0.0000001)]],
      date: [null],
    });
  }

  get f() {
    return this.form.controls;
  }

  loadSymbols() {
    this.loadingSymbols = true;
    this.currencyService.getSymbols('USD').subscribe({
      next: (symbols) => {
        this.currencies = symbols;
        this.loadingSymbols = false;
      },
      error: () => {
        this.loadingSymbols = false;
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { from, to, amount, date } = this.form.value;
    const dateStr = date
      ? new Date(date).toISOString().slice(0, 10)
      : null;

    this.converting = true;
    this.result = null;

    this.currencyService
      .convert({
        from,
        to,
        amount: Number(amount),
        date: dateStr,
      })
      .subscribe({
        next: (res) => {
          this.result = res;
          this.converting = false;
          this.addToHistory(res);
        },
        error: () => {
          this.converting = false;
        },
      });
  }

  private addToHistory(res: ConvertResponse) {
    const item: ConversionHistoryItem = {
      from: res.from,
      to: res.to,
      amount: res.amount,
      convertedAmount: res.convertedAmount,
      rate: res.rate,
      dateUsed: res.date,
      timestamp: new Date().toISOString(),
    };
    this.historyService.add(item);
    this.history = this.historyService.getHistory();
  }

  clearHistory() {
    this.historyService.clear();
    this.history = [];
  }
}
