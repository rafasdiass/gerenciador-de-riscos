import { Component, OnInit } from '@angular/core';
import { OperationService } from '../../shared/services/operation.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DashboardComponent implements OnInit {
  initialBalance!: number;
  riskPercentage!: number; // Percentual de risco
  payout!: number;
  currentBalance!: number;
  growth: number = 0;
  balanceColor: string = 'text-dark';  // Classe CSS para a cor do texto
  balanceIcon: string = ''; // Classe CSS para o ícone de crescimento/perda

  constructor(
    private operationService: OperationService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadSettings();

    combineLatest([
      this.operationService.initialBalance$,
      this.operationService.operations$
    ]).pipe(
      map(([initialBalance, operations]) => {
        const totalOperations = operations.reduce((acc, val) => acc + val, 0);
        this.currentBalance = initialBalance + totalOperations;
        this.updateBalanceColor();
        this.growth = operations.length > 0 ? (this.currentBalance - initialBalance) / initialBalance : 0;
      })
    ).subscribe();
  }

  updateInitialBalance(): void {
    this.operationService.updateInitialBalance(this.initialBalance);
    this.updateRiskAmount(); // Recalcula o valor arriscado baseado no novo saldo
    this.updateBalanceColor();
  }

  updateRiskAmount(): void {
    const riskAmount = (this.initialBalance * this.riskPercentage) / 100;
    this.operationService.updateRiskAmount(riskAmount); // Atualiza o valor a ser arriscado
  }

  saveSettings(): void {
    this.localStorageService.setItem('initialBalance', this.initialBalance.toString());
    this.localStorageService.setItem('riskPercentage', this.riskPercentage.toString());
    this.localStorageService.setItem('payout', this.payout.toString());
    alert('Configurações salvas com sucesso!');
  }

  loadSettings(): void {
    const savedInitialBalance = this.localStorageService.getItem('initialBalance');
    const savedRiskPercentage = this.localStorageService.getItem('riskPercentage');
    const savedPayout = this.localStorageService.getItem('payout');

    this.initialBalance = savedInitialBalance ? parseFloat(savedInitialBalance) : 0;
    this.riskPercentage = savedRiskPercentage ? parseFloat(savedRiskPercentage) : 0;
    this.payout = savedPayout ? parseFloat(savedPayout) : 80;

    this.updateInitialBalance();
  }

  updateBalanceColor(): void {
    if (this.currentBalance > this.initialBalance) {
      this.balanceColor = 'text-success';
      this.balanceIcon = 'bi-arrow-up-circle-fill';
    } else if (this.currentBalance < this.initialBalance) {
      this.balanceColor = 'text-danger';
      this.balanceIcon = 'bi-arrow-down-circle-fill';
    } else {
      this.balanceColor = 'text-dark';
      this.balanceIcon = '';
    }
  }
}
