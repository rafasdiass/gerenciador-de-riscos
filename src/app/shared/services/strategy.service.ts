import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  constructor(private apiService: ApiService) {}

  /**
   * Método genérico para calcular uma estratégia baseada nos parâmetros fornecidos.
   * @param strategyName - Nome da estratégia (ex: 'martingale', 'compound-interest', etc.)
   * @param parameters - Objeto contendo os parâmetros da estratégia
   * @returns - Observable com o resultado do cálculo
   */
  calculateStrategy<T>(strategyName: string, parameters: any): Observable<T> {
    return this.apiService.post<T>(`strategy/${strategyName}`, parameters);
  }

  /**
   * Método genérico para processar um resultado (win/loss).
   * @param bet - Valor da aposta
   * @param payout - Percentual de payout
   * @param result - Resultado ('win' ou 'loss')
   * @returns - Observable vazio
   */
  processResult(bet: number, payout: number = 0, result: 'win' | 'loss'): Observable<void> {
    const data = { bet, payout, result };
    return this.apiService.post<void>('strategy/process-result', data);
  }
}
