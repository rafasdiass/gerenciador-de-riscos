import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../shared/services/operation.service';
import { StrategyService } from '../../shared/services/strategy.service';
import { DailyOperationsComponent } from '../../system/operations/daily-operations/daily-operations.component';
import { MartingaleEntry } from '../../shared/models/operation.model';  // Importando a interface centralizada

@Component({
  selector: 'app-martingale',
  standalone: true,
  imports: [CommonModule, FormsModule, DailyOperationsComponent],
  templateUrl: './martingale.component.html',
  styleUrls: ['./martingale.component.scss']
})
export class MartingaleComponent implements OnInit {
  initialAmount!: number;
  payout!: number;
  entries: MartingaleEntry[] = [];

  constructor(private operationService: OperationService, private strategyService: StrategyService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.operationService.initialBalance$.subscribe(balance => {
      this.initialAmount = balance;
      this.simulateMartingale();
    });

    this.operationService.payout$.subscribe(payout => {
      this.payout = payout;
      this.simulateMartingale();
    });
  }

  simulateMartingale(): void {
    this.strategyService.calculateMartingale(this.initialAmount, this.payout)
      .subscribe(result => {
        this.createEntries(result);
      });
  }

  private createEntries(initialBet: number): void {
    let currentBet = initialBet;
    const payoutPercent = this.payout / 100;

    this.entries = Array.from({ length: 3 }, (_, i) => {
      const profit = currentBet * payoutPercent;
      const total = currentBet + profit;

      const entry: MartingaleEntry = {
        round: i + 1,
        bet: currentBet,
        profit,
        total
      };

      currentBet *= 2; // Dobra a aposta a cada rodada
      return entry;
    });
  }

  markWin(index: number): void {
    const operation = this.entries[index];
    this.strategyService.processWin(operation.bet, this.payout).subscribe(() => {
      operation.win = true;
      operation.profit = operation.bet * (this.payout / 100);
      operation.total += operation.profit;
    });
  }

  markLoss(index: number): void {
    const operation = this.entries[index];
    this.strategyService.processLoss(operation.bet).subscribe(() => {
      operation.win = false;
      operation.profit = -operation.bet;
      operation.total += operation.profit;
    });
  }
}
