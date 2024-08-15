import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  constructor(private apiService: ApiService) {}

  calculateMartingale(initialAmount: number, payoutPercent: number): Observable<number> {
    return this.apiService.post<number>('strategy/martingale', { initialAmount, payoutPercent });
  }

  calculateCompoundInterest(initialAmount: number, interestRate: number, periods: number): Observable<number> {
    return this.apiService.post<number>('strategy/compound-interest', { initialAmount, interestRate, periods });
  }

  // Este método foi adicionado como exemplo, mas precisa de um endpoint correspondente no backend
  calculateSimpleInterest(initialAmount: number, interestRate: number, periods: number): Observable<number> {
    return this.apiService.post<number>('strategy/simple-interest', { initialAmount, interestRate, periods });
  }

  calculateSoros(initialAmount: number, payoutPercent: number, rounds: number): Observable<number> {
    return this.apiService.post<number>('strategy/soros', { initialAmount, payoutPercent, rounds });
  }

  calculateCustomStrategy(parameters: any): Observable<number> {
    return this.apiService.post<number>('strategy/custom-strategy', parameters);
  }

  processWin(bet: number, payout: number): Observable<void> {
    const winData = { bet, payout, result: 'win' };
    return this.apiService.post<void>('strategy/process-result', winData);
  }

  processLoss(bet: number): Observable<void> {
    const lossData = { bet, result: 'loss' };
    return this.apiService.post<void>('strategy/process-result', lossData);
  }
}
