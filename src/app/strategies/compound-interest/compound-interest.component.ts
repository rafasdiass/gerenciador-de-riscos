import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../shared/services/operation.service';

interface CompoundInterestEntry {
  round: number;
  bet: number;
  profit: number;
  total: number;
}

@Component({
  selector: 'app-compound-interest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compound-interest.component.html',
  styleUrls: ['./compound-interest.component.scss']
})
export class CompoundInterestComponent implements OnInit {
  initialAmount!: number;
  payout!: number;
  riskAmount!: number; // Valor de risco definido no dashboard
  operationsCount = 6; // Quantidade de operações
  entries: CompoundInterestEntry[] = [];

  constructor(private operationService: OperationService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.operationService.initialBalance$.subscribe(balance => {
      this.initialAmount = balance;
      this.simulateCompoundInterest();
    });

    this.operationService.payout$.subscribe(payout => {
      this.payout = payout;
      this.simulateCompoundInterest();
    });

    this.operationService.riskAmount$.subscribe(riskAmount => {
      this.riskAmount = riskAmount;
      this.simulateCompoundInterest();
    });
  }

  simulateCompoundInterest(): void {
    this.entries = [];
    let currentAmount = this.riskAmount; // Utiliza o valor de risco definido no dashboard

    for (let i = 1; i <= this.operationsCount; i++) {
      const profit = currentAmount * (this.payout / 100);
      const total = currentAmount + profit;

      const entry: CompoundInterestEntry = {
        round: i,
        bet: currentAmount,
        profit: profit,
        total: total
      };
      this.entries.push(entry);

      currentAmount = total; // Reinveste o total (capital + lucro) na próxima operação
    }
  }

  applyWin(index: number): void {
    const operation = this.entries[index];
    this.operationService.updateOperations(operation.profit); // Adiciona o lucro ao saldo
  }

  applyLoss(index: number): void {
    const operation = this.entries[index];
    this.operationService.updateOperations(-operation.bet); // Subtrai o valor da aposta do saldo
  }
}
