import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../shared/services/operation.service';
import { StrategyService } from '../../shared/services/strategy.service';
import { MartingaleEntry } from '../../shared/models/operation.model';
import { catchError, of } from 'rxjs';
import { Strategy } from '../../shared/models/strategy.model';

@Component({
  selector: 'app-martingale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './martingale.component.html',
  styleUrls: ['./martingale.component.scss']
})
export class MartingaleComponent implements OnInit {
  initialAmount!: number;
  payout!: number;
  entries: MartingaleEntry[] = [];

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
      this.trySimulateMartingale();
    });

    this.operationService.payout$.subscribe(payout => {
      this.payout = payout;
      this.trySimulateMartingale();
    });
  }

  private trySimulateMartingale(): void {
    if (this.isValidSettings()) {
      this.simulateMartingale();
    }
  }

  private isValidSettings(): boolean {
    return this.initialAmount > 0 && this.payout > 0;
  }

  private simulateMartingale(): void {
    const strategy: Strategy = {
      name: 'martingale',
      component: MartingaleComponent,
    };

    const params = { initialAmount: this.initialAmount, payoutPercent: this.payout };

    this.strategyService.calculateStrategy<MartingaleEntry[]>(strategy, params)
      .pipe(
        catchError(error => {
          console.error('Erro ao calcular Martingale:', error);
          return of([] as MartingaleEntry[]);
        })
      )
      .subscribe(result => {
        this.entries = this.flattenEntries(result);
      });
  }

  private flattenEntries(result: MartingaleEntry[][] | MartingaleEntry[]): MartingaleEntry[] {
    return Array.isArray(result[0]) ? (result as MartingaleEntry[][]).flat() : result as MartingaleEntry[];
  }

  markWin(index: number): void {
    this.processResult(index, 'win');
  }

  markLoss(index: number): void {
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
      .subscribe((updatedEntry: void | Partial<MartingaleEntry>) => {
        if (updatedEntry) {
          this.updateEntry(index, updatedEntry);
        }
      });
  }

  private updateEntry(index: number, updatedEntry: Partial<MartingaleEntry>): void {
    this.entries[index] = { ...this.entries[index], ...updatedEntry };
  }
}
