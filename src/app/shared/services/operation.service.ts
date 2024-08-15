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

  addOperation(operation: number): void {
    const updatedOperations = [...this.operationsSubject.getValue(), operation];
    this.operationsSubject.next(updatedOperations);
    this.updateCurrentBalance();
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

  private updateCurrentBalance(): void {
    const operationsTotal = this.operationsSubject.getValue().reduce((acc, operation) => acc + operation, 0);
    const initialBalance = this.initialBalanceSubject.getValue();
    this.currentBalanceSubject.next(initialBalance + operationsTotal);
  }
}
