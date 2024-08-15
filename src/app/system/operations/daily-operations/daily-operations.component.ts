import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyService } from '../../../shared/services/strategy.service';
import { OperationService } from '../../../shared/services/operation.service';

interface Operation {
  round: number;
  bet: number;
  profit: number;
  total: number;
  win?: boolean;
}

@Component({
  selector: 'app-daily-operations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-operations.component.html',
  styleUrls: ['./daily-operations.component.scss']
})
export class DailyOperationsComponent implements OnInit {
  @Input() selectedStrategy!: string; // Recebe a estratégia selecionada
  operations: Operation[] = [];
  payout!: number;
  initialBalance!: number;

  constructor(
    private operationService: OperationService,
    private strategyService: StrategyService
  ) {}

  ngOnInit(): void {
    this.operationService.initialBalance$.subscribe(balance => {
      this.initialBalance = balance;
    });

    this.operationService.payout$.subscribe(payout => {
      this.payout = payout;
    });

    this.applyStrategy();
  }

  applyStrategy(): void {
    if (this.selectedStrategy === 'Martingale') {
      this.strategyService.calculateMartingale(this.initialBalance, this.payout).subscribe(result => {
        this.operations = this.createMartingaleEntries(result);
      });
    } else if (this.selectedStrategy === 'Juros Compostos') {
      this.strategyService.calculateCompoundInterest(this.initialBalance, this.payout, 80).subscribe(result => {
        this.operations = this.createCompoundInterestEntries(result);
      });
    }
  }

  private createMartingaleEntries(initialBet: number): Operation[] {
    let currentBet = initialBet;
    const payoutPercent = this.payout / 100;

    return Array.from({ length: 3 }, (_, i) => {
      const profit = currentBet * payoutPercent;
      const total = currentBet + profit;

      const entry: Operation = {
        round: i + 1,
        bet: currentBet,
        profit,
        total
      };

      currentBet *= 2;
      return entry;
    });
  }

  private createCompoundInterestEntries(finalAmount: number): Operation[] {
    const profit = finalAmount - this.initialBalance;
    return [{
      round: 1,
      bet: this.initialBalance,
      profit,
      total: finalAmount
    }];
  }

  markWin(index: number): void {
    if (this.operations[index]) {
      this.operations[index].win = true;
      this.updateOperationResult(index, true);
    }
  }

  markLoss(index: number): void {
    if (this.operations[index]) {
      this.operations[index].win = false;
      this.updateOperationResult(index, false);
    }
  }

  private updateOperationResult(index: number, isWin: boolean): void {
    const operation = this.operations[index];
    const result = isWin 
      ? operation.bet * (this.payout / 100)
      : -operation.bet;
    operation.profit = result;
    operation.total += result;
  }
}
