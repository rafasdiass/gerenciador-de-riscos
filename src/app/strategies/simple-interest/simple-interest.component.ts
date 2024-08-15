import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../shared/services/operation.service';
import { StrategyService } from '../../shared/services/strategy.service';
import { DailyOperationsComponent } from '../../system/operations/daily-operations/daily-operations.component';
import { SimpleInterestEntry } from '../../shared/models/strategy.model';

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

  constructor(private operationService: OperationService, private strategyService: StrategyService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.operationService.initialBalance$.subscribe(balance => {
      this.initialAmount = balance;
      this.simulateSimpleInterest();
    });

    this.operationService.payout$.subscribe(payout => {
      this.payout = payout;
      this.simulateSimpleInterest();
    });
  }

  simulateSimpleInterest(): void {
    this.strategyService.calculateStrategy<SimpleInterestEntry[]>('simple-interest', {
      initialAmount: this.initialAmount,
      payout: this.payout
    }).subscribe(entries => {
      this.entries = entries;
    });
  }

  applyWin(index: number): void {
    const operation = this.entries[index];
    this.strategyService.processResult(operation.bet, this.payout, 'win').subscribe(() => {
      operation.win = true;
    });
  }

  applyLoss(index: number): void {
    const operation = this.entries[index];
    this.strategyService.processResult(operation.bet, 0, 'loss').subscribe(() => {
      operation.win = false;
    });
  }
}
