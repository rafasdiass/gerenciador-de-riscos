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
        const totalOperations = this.calculateTotalOperations(operations);
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
    const riskAmount = this.calculateRiskAmount();
    this.operationService.setRiskAmount(riskAmount);
  }

  saveSettings(): void {
    this.localStorageService.setItem('initialBalance', this.initialBalance.toString());
    this.localStorageService.setItem('riskPercentage', this.riskPercentage.toString());
    this.localStorageService.setItem('payout', this.payout.toString());
    alert('Configurações salvas com sucesso!');
  }

  loadSettings(): void {
    this.initialBalance = this.getLocalStorageItem('initialBalance', 0);
    this.riskPercentage = this.getLocalStorageItem('riskPercentage', 0);
    this.payout = this.getLocalStorageItem('payout', 80);

    this.updateInitialBalance();
  }

  private calculateGrowth(initialBalance: number, currentBalance: number, operationCount: number): number {
    return operationCount > 0 ? (currentBalance - initialBalance) / initialBalance : 0;
  }

  private calculateTotalOperations(operations: number[]): number {
    return operations.reduce((acc, val) => acc + val, 0);
  }

  private calculateRiskAmount(): number {
    return (this.initialBalance * this.riskPercentage) / 100;
  }

  private updateBalanceColor(): void {
    if (this.currentBalance > this.initialBalance) {
      this.setBalanceAppearance('text-success', 'bi-arrow-up-circle-fill');
    } else if (this.currentBalance < this.initialBalance) {
      this.setBalanceAppearance('text-danger', 'bi-arrow-down-circle-fill');
    } else {
      this.setBalanceAppearance('text-dark', '');
    }
  }

  private setBalanceAppearance(color: string, icon: string): void {
    this.balanceColor = color;
    this.balanceIcon = icon;
  }

  private getLocalStorageItem(key: string, defaultValue: number): number {
    const value = this.localStorageService.getItem(key);
    return value ? parseFloat(value) : defaultValue;
  }
}
