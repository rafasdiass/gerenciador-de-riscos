import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../shared/services/operation.service';
import { DailyOperationsComponent } from '../../system/operations/daily-operations/daily-operations.component';

interface Operation {
  bet: number;
  profit: number;
  total: number;
  win?: boolean;
}

interface MartingaleEntry extends Operation {
  round: number;
}

@Component({
  selector: 'app-martingale',
  standalone: true,
  imports: [CommonModule, FormsModule,DailyOperationsComponent],
  templateUrl: './martingale.component.html',
  styleUrls: ['./martingale.component.scss']
})
export class MartingaleComponent implements OnInit {
  initialAmount!: number;
  payout!: number;
  entries: MartingaleEntry[] = [];

  constructor(private operationService: OperationService) {}

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
    let currentBet: number = this.initialAmount * 0.1; // 10% da banca inicial
    const payoutPercent: number = this.payout / 100;

    this.entries = [];

    for (let i = 0; i < 3; i++) { // Supondo 3 rodadas para a estratégia Martingale
      const profit: number = currentBet * payoutPercent;
      const totalAmount: number = currentBet + profit;

      const entry: MartingaleEntry = { 
        round: i + 1, 
        bet: currentBet, 
        profit, 
        total: totalAmount 
      };
      this.entries.push(entry);

      currentBet *= 2; // Dobra a aposta a cada rodada
    }
  }
}
