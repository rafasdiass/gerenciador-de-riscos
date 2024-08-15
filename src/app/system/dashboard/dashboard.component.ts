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
  riskPercentage!: number;
  payout!: number;
  currentBalance!: number;
  growth: number = 0;
  balanceColor: string = 'text-dark';
  balanceIcon: string = '';

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
        this.growth = this.calculateGrowth(initialBalance, this.currentBalance, operations.length);
      })
    ).subscribe();
  }

  updateInitialBalance(): void {
    this.operationService.setInitialBalance(this.initialBalance);
    this.updateRiskAmount();
    this.updateBalanceColor();
  }

  updateRiskAmount(): void {
    const riskAmount = (this.initialBalance * this.riskPercentage) / 100;
    this.operationService.setRiskAmount(riskAmount);
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

  private calculateGrowth(initialBalance: number, currentBalance: number, operationCount: number): number {
    return operationCount > 0 ? (currentBalance - initialBalance) / initialBalance : 0;
  }

  private updateBalanceColor(): void {
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
