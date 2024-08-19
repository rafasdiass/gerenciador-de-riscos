import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyService } from '../../../shared/services/strategy.service';
import { OperationService } from '../../../shared/services/operation.service';
import { Operation } from '../../../shared/models/operation.model';
import { Strategy } from '../../../shared/models/strategy.model';

@Component({
  selector: 'app-daily-operations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-operations.component.html',
  styleUrls: ['./daily-operations.component.scss']
})
export class DailyOperationsComponent implements OnInit {
  @Input() selectedStrategy!: string;
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
      this.tryApplyStrategy();
    });

    this.operationService.payout$.subscribe(payout => {
      this.payout = payout;
      this.tryApplyStrategy();
    });
  }

  private tryApplyStrategy(): void {
    if (this.isValidSettings()) {
      this.applyStrategy();
    }
  }

  private isValidSettings(): boolean {
    return !!this.selectedStrategy && this.initialBalance > 0 && this.payout > 0;
  }

  applyStrategy(): void {
    const strategy: Strategy = {
      name: this.selectedStrategy,
      component: DailyOperationsComponent,
    };

    const parameters = this.buildStrategyParameters();
    console.log(`Aplicando estratégia: ${this.selectedStrategy} com parâmetros:`, parameters);

    this.strategyService.calculateStrategy<Operation[]>(strategy, parameters)
      .subscribe({
        next: (result) => {
          this.operations = this.flattenOperations(result);
          console.log('Operações recebidas:', this.operations);
        },
        error: (err) => {
          console.error('Erro ao calcular a estratégia:', err);
          this.operations = [];
        }
      });
  }

  private flattenOperations(result: Operation[][] | Operation[]): Operation[] {
    return Array.isArray(result[0]) ? (result as Operation[][]).flat() : result as Operation[];
  }

  markWin(index: number): void {
    this.processOperationResult(index, 'win');
  }

  markLoss(index: number): void {
    this.processOperationResult(index, 'loss');
  }

  private processOperationResult(index: number, result: 'win' | 'loss'): void {
    const operation = this.operations[index];
    const payout = result === 'win' ? this.payout : 0;
  
    this.strategyService.processResult(operation.bet, payout, result)
      .subscribe({
        next: (updatedOperation) => {
          if (updatedOperation !== undefined && updatedOperation !== null) {
            this.updateOperationResult(index, updatedOperation);
          }
        },
        error: (err) => {
          console.error('Erro ao processar o resultado:', err);
        }
      });
  }
  
  private updateOperationResult(index: number, updatedOperation: Partial<Operation>): void {
    this.operations[index] = { ...this.operations[index], ...updatedOperation };
  }

  private buildStrategyParameters(): any {
    return {
      initialAmount: this.initialBalance,
      payoutPercent: this.payout,
    };
  }
}
