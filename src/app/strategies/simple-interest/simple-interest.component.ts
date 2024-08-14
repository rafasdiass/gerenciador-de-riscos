import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../shared/services/operation.service';
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

  constructor(private operationService: OperationService) {}

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
    let currentBet: number = this.initialAmount * 0.1; // 10% da banca inicial
    const payoutPercent: number = this.payout / 100;

    this.entries = [];

    for (let i = 0; i < 3; i++) { // Supondo 3 rodadas para a estratégia de Juros Simples
      const profit: number = currentBet * payoutPercent;
      const totalAmount: number = currentBet + profit;

      const entry: SimpleInterestEntry = { 
        round: i + 1, 
        bet: currentBet, 
        profit, 
        total: currentBet + profit,
        win: undefined // Inicialmente indefinido
      };
      this.entries.push(entry);
    }
  }

  applyWin(index: number): void {
    const operation = this.entries[index];
    this.operationService.updateOperations(operation.profit); // Adiciona o lucro ao saldo
    operation.win = true; // Marca como Win
  }

  applyLoss(index: number): void {
    const operation = this.entries[index];
    this.operationService.updateOperations(-operation.bet); // Subtrai o valor da aposta do saldo
    operation.win = false; // Marca como Loss
  }
}
