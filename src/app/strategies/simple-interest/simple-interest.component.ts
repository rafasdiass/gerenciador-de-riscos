import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../shared/services/operation.service';
import { StrategyService } from '../../shared/services/strategy.service';
import { DailyOperationsComponent } from '../../system/operations/daily-operations/daily-operations.component';
import { SimpleInterestEntry } from '../../shared/models/strategy.model';
import { catchError, of } from 'rxjs';
import { Strategy } from '../../shared/models/strategy.model';

@Component({
  selector: 'app-simple-interest',
  standalone: true,
  imports: [CommonModule, FormsModule, DailyOperationsComponent],
  templateUrl: './simple-interest.component.html',
  styleUrls: ['./simple-interest.component.scss']
})
export class SimpleInterestComponent implements OnInit {
  initialAmount!: number;
  payout!: number;
  entries: SimpleInterestEntry[] = [];

  constructor(
    private operationService: OperationService,
    private strategyService: StrategyService
  ) {}

  ngOnInit(): void {
    this.loadSettingsAndCalculate();
  }

  private loadSettingsAndCalculate(): void {
    this.operationService.initialBalance$.subscribe(balance => {
      this.initialAmount = balance;
      this.trySimulateSimpleInterest();
    });

    this.operationService.payout$.subscribe(payout => {
      this.payout = payout;
      this.trySimulateSimpleInterest();
    });
  }

  private trySimulateSimpleInterest(): void {
    if (this.isValidSettings()) {
      this.simulateSimpleInterest();
    }
  }

  private isValidSettings(): boolean {
    return this.initialAmount > 0 && this.payout > 0;
  }

  private simulateSimpleInterest(): void {
    const strategy: Strategy = {
      name: 'simple-interest',
      component: SimpleInterestComponent,
    };

    const params = {
      initialAmount: this.initialAmount,
      payout: this.payout
    };

    this.strategyService.calculateStrategy<SimpleInterestEntry[]>(strategy, params)
      .pipe(
        catchError(error => {
          console.error('Erro ao calcular Juros Simples:', error);
          return of([] as SimpleInterestEntry[]);
        })
      )
      .subscribe(entries => {
        this.entries = this.flattenEntries(entries);
      });
  }

  private flattenEntries(entries: SimpleInterestEntry[][] | SimpleInterestEntry[]): SimpleInterestEntry[] {
    return Array.isArray(entries[0]) ? (entries as SimpleInterestEntry[][]).flat() : entries as SimpleInterestEntry[];
  }

  applyWin(index: number): void {
    this.processResult(index, 'win');
  }

  applyLoss(index: number): void {
    this.processResult(index, 'loss');
  }

  private processResult(index: number, result: 'win' | 'loss'): void {
    const entry = this.entries[index];
    const payout = result === 'win' ? this.payout : 0;

    this.strategyService.processResult(entry.bet, payout, result)
      .pipe(
        catchError(error => {
          console.error('Erro ao processar o resultado:', error);
          return of(undefined);
        })
      )
      .subscribe((updatedEntry: void | Partial<SimpleInterestEntry>) => {
        if (updatedEntry) {
          this.updateEntry(index, updatedEntry);
        }
      });
  }

  private updateEntry(index: number, updatedEntry: Partial<SimpleInterestEntry>): void {
    this.entries[index] = { ...this.entries[index], ...updatedEntry };
  }
}
