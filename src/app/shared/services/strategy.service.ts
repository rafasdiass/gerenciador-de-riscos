import { Injectable } from '@angular/core';
import { OperationService } from './operation.service';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  constructor(private operationService: OperationService) {}

  // Processa o ganho
  processWin(riskAmount: number, payout: number): void {
    const profit = riskAmount * (payout / 100);  // Lucro = Valor de Risco * Payout
    this.operationService.updateOperations(profit);  // Atualiza com o lucro apenas
  }

  // Processa a perda
  processLoss(riskAmount: number): void {
    this.operationService.updateOperations(-riskAmount);  // A perda é o valor arriscado
  }
}
