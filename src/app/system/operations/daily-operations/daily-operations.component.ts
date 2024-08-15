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
      this.strategyService.calculateStrategy<Operation[]>('martingale', { initialAmount: this.initialBalance, payoutPercent: this.payout })
        .subscribe(result => {
          this.operations = result;
        });
    } else if (this.selectedStrategy === 'Juros Compostos') {
      this.strategyService.calculateStrategy<Operation[]>('compound-interest', { initialAmount: this.initialBalance, interestRate: this.payout, periods: 80 })
        .subscribe(result => {
          this.operations = result;
        });
    }
  }

  markWin(index: number): void {
    if (this.operations[index]) {
      this.operations[index].win = true;
      this.strategyService.processResult(this.operations[index].bet, this.payout, 'win')
        .subscribe(() => {
          this.updateOperationResult(index, true);
        });
    }
  }

  markLoss(index: number): void {
    if (this.operations[index]) {
      this.operations[index].win = false;
      this.strategyService.processResult(this.operations[index].bet, 0, 'loss')
        .subscribe(() => {
          this.updateOperationResult(index, false);
        });
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
