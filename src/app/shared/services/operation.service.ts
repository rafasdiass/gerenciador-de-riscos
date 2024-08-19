import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StrategyService } from './strategy.service';
import { Strategy } from '../models/strategy.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private operationsSubject = new BehaviorSubject<number[]>([]);
  private initialBalanceSubject = new BehaviorSubject<number>(0);
  private currentBalanceSubject = new BehaviorSubject<number>(0);
  private riskAmountSubject = new BehaviorSubject<number>(0);
  private payoutSubject = new BehaviorSubject<number>(80);

  constructor(private strategyService: StrategyService) {}

  get operations$(): Observable<number[]> {
    return this.operationsSubject.asObservable();
  }

  setOperations(operations: number[]): void {
    this.operationsSubject.next(operations);
  }

  get initialBalance$(): Observable<number> {
    return this.initialBalanceSubject.asObservable();
  }

  get currentBalance$(): Observable<number> {
    return this.currentBalanceSubject.asObservable();
  }

  get riskAmount$(): Observable<number> {
    return this.riskAmountSubject.asObservable();
  }

  get payout$(): Observable<number> {
    return this.payoutSubject.asObservable();
  }

  setInitialBalance(balance: number): void {
    this.initialBalanceSubject.next(balance);
    this.updateCurrentBalance();
  }

  setRiskAmount(amount: number): void {
    this.riskAmountSubject.next(amount);
  }

  setPayout(payout: number): void {
    this.payoutSubject.next(payout);
  }

  calculateAndSetOperations(strategy: Strategy): void {
    const parameters = this.buildParameters();
    this.strategyService.calculateStrategy<number[]>(strategy, parameters).subscribe({
      next: (result) => {
        this.handleResult(result);
        this.updateCurrentBalance();
      },
      error: (err) => {
        console.error('Erro ao calcular a estratégia:', err);
        this.operationsSubject.next([]); // Resetar as operações em caso de erro
      }
    });
  }

  private buildParameters(): any {
    return {
      initialAmount: this.initialBalanceSubject.getValue(),
      riskAmount: this.riskAmountSubject.getValue(),
      payoutPercent: this.payoutSubject.getValue(),
    };
  }

  private handleResult(result: number[] | number[][]): void {
    const flatResult = this.flattenArray(result);
    if (this.isValidResult(flatResult)) {
      this.setOperations(flatResult); // Aqui chamamos setOperations para atualizar as operações
    } else {
      console.error('Resultado inválido:', result);
    }
  }

  private flattenArray(result: number[] | number[][]): number[] {
    return Array.isArray(result[0]) ? (result as number[][]).flat() : result as number[];
  }

  private isValidResult(result: any): result is number[] {
    return Array.isArray(result) && result.every(item => typeof item === 'number');
  }

  private updateCurrentBalance(): void {
    const operationsTotal = this.operationsSubject.getValue().reduce((acc, operation) => acc + operation, 0);
    const initialBalance = this.initialBalanceSubject.getValue();
    this.currentBalanceSubject.next(initialBalance + operationsTotal);
  }
}
