import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Strategy } from '../models/strategy.model';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  constructor(private apiService: ApiService) {}

  calculateStrategy<T>(strategy: Strategy, parameters: any): Observable<T[]> {
    return this.apiService.post<T[]>(`strategy/${strategy.name}`, parameters).pipe(
      map(response => Array.isArray(response) ? response : [response]),
      catchError(error => {
        console.error('Erro ao calcular a estratégia:', error);
        return of([]);  // Retorna um array vazio em caso de erro
      })
    );
  }

  processResult(bet: number, payout: number = 0, result: 'win' | 'loss'): Observable<void> {
    const data = { bet, payout, result };
    return this.apiService.post<void>('strategy/process-result', data).pipe(
      catchError(error => {
        console.error('Erro ao processar o resultado:', error);
        return of();  // Retorna um observable vazio em caso de erro
      })
    );
  }
}
