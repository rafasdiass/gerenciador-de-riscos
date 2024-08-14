import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyService } from '../../../shared/services/strategy.service';
import { OperationService } from '../../../shared/services/operation.service';

interface Operation {
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
  @Input() operations: Operation[] = []; // Recebe as operações de um componente de estratégia
  payout!: number;

  constructor(
    private strategyService: StrategyService,
    private operationService: OperationService
  ) {}

  ngOnInit(): void {
    this.initializeOperations();

    // Obter o valor do payout para uso no cálculo
    this.operationService.payout$.subscribe(payout => {
      this.payout = payout;
    });
  }

  initializeOperations(): void {
    if (this.operations.length === 0) {
      this.operations = Array.from({ length: 3 }, () => ({ // Padrão para 3 operações
        bet: 0,
        profit: 0,
        total: 0
      }));
    }
  }

  markWin(index: number): void {
    const operation = this.operations[index];
    this.strategyService.processWin(operation.bet, this.payout); // Passa o bet e o payout
    this.operations[index].win = true;
  }

  markLoss(index: number): void {
    const operation = this.operations[index];
    this.strategyService.processLoss(operation.bet); // Passa o bet
    this.operations[index].win = false;
  }
}
