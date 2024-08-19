import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrategyService } from '../../shared/services/strategy.service';
import { OperationService } from '../../shared/services/operation.service';
import { catchError, of } from 'rxjs';
import { Strategy } from '../../shared/models/strategy.model';

@Component({
  selector: 'app-compound-interest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compound-interest.component.html',
  styleUrls: ['./compound-interest.component.scss']
})
export class CompoundInterestComponent implements OnInit {
  initialAmount!: number;
  interestRate!: number;
  periods!: number;
  finalAmounts: number[] = [];  // Lista para armazenar os valores retornados do backend

  constructor(
    private strategyService: StrategyService,
    private operationService: OperationService
  ) {}

  ngOnInit(): void {
    this.loadSettingsAndCalculate();
  }

  private loadSettingsAndCalculate(): void {
    this.operationService.initialBalance$.subscribe(balance => {
      this.initialAmount = balance;
      this.tryCalculateCompoundInterest();
    });

    this.operationService.riskAmount$.subscribe(riskAmount => {
      this.interestRate = (riskAmount / this.initialAmount) * 100;
      this.tryCalculateCompoundInterest();
    });

    this.operationService.payout$.subscribe(payout => {
      this.periods = payout;
      this.tryCalculateCompoundInterest();
    });
  }

  private tryCalculateCompoundInterest(): void {
    if (this.isValidSettings()) {
      this.calculateCompoundInterest();
    }
  }

  private isValidSettings(): boolean {
    return this.initialAmount > 0 && this.interestRate > 0 && this.periods > 0;
  }

  private calculateCompoundInterest(): void {
    const strategy: Strategy = {
      name: 'compound-interest',
      component: CompoundInterestComponent,
    };

    const params = {
      initialAmount: this.initialAmount,
      interestRate: this.interestRate,
      periods: this.periods
    };

    this.strategyService.calculateStrategy<number[]>(strategy, params)
      .pipe(
        catchError(error => {
          console.error('Erro ao calcular Juros Compostos:', error);
          return of([] as number[]);
        })
      )
      .subscribe(results => {
        this.finalAmounts = this.flattenResults(results); // Armazena a lista de valores retornados
      });
  }

  private flattenResults(results: number[][] | number[]): number[] {
    return Array.isArray(results[0]) ? (results as number[][]).flat() : results as number[];
  }
}
