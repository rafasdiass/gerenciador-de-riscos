import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private operationsSubject = new BehaviorSubject<number[]>([]);
  private initialBalanceSubject = new BehaviorSubject<number>(0);
  private currentBalanceSubject = new BehaviorSubject<number>(0);
  private riskAmountSubject = new BehaviorSubject<number>(0);
  private payoutSubject = new BehaviorSubject<number>(80); // Valor padrão de payout

  get operations$(): Observable<number[]> {
    return this.operationsSubject.asObservable();
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

  updateOperations(operation: number): void {
    const currentOperations = this.operationsSubject.getValue();
    currentOperations.push(operation);
    this.operationsSubject.next(currentOperations);
    this.updateCurrentBalance();
  }

  updateInitialBalance(balance: number): void {
    this.initialBalanceSubject.next(balance);
    this.updateCurrentBalance();
  }

  updateRiskAmount(amount: number): void {
    this.riskAmountSubject.next(amount);
  }

  updatePayout(payout: number): void {
    this.payoutSubject.next(payout);
  }

  private updateCurrentBalance(): void {
    const operations = this.operationsSubject.getValue();
    const initialBalance = this.initialBalanceSubject.getValue();
    const totalOperations = operations.reduce((acc, val) => acc + val, 0);
    this.currentBalanceSubject.next(initialBalance + totalOperations);
  }
}
