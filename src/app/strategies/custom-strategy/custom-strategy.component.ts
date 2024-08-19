import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrategyService } from '../../shared/services/strategy.service';
import { OperationService } from '../../shared/services/operation.service';
import { catchError, of } from 'rxjs';
import { Strategy } from '../../shared/models/strategy.model';

@Component({
  selector: 'app-custom-strategy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-strategy.component.html',
  styleUrls: ['./custom-strategy.component.scss']
})
export class CustomStrategyComponent {
  parameters: any = {};
  result!: number[]; // Alterado para lidar com uma lista de resultados, se necessário

  constructor(
    private strategyService: StrategyService,
    private operationService: OperationService
  ) {}

  calculate(): void {
    const strategy: Strategy = {
      name: 'custom-strategy',
      component: CustomStrategyComponent,
    };

    this.strategyService.calculateStrategy<number[]>(strategy, this.parameters)
      .pipe(
        catchError(error => {
          console.error('Erro ao calcular a estratégia customizada:', error);
          return of([] as number[]); // Retorna um array vazio em caso de erro
        })
      )
      .subscribe(result => {
        this.result = this.flattenResult(result); // Armazena o resultado da estratégia
      });
  }

  private flattenResult(result: number[][] | number[]): number[] {
    return Array.isArray(result[0]) ? (result as number[][]).flat() : result as number[];
  }
}
