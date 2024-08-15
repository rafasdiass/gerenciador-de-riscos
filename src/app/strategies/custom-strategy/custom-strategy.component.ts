import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrategyService } from '../../shared/services/strategy.service';
import { OperationService } from '../../shared/services/operation.service';

@Component({
  selector: 'app-custom-strategy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-strategy.component.html',
  styleUrls: ['./custom-strategy.component.scss']
})
export class CustomStrategyComponent {
  parameters: any = {};
  result!: number;

  constructor(private strategyService: StrategyService, private operationService: OperationService) {}

  calculate(): void {
    this.strategyService.calculateStrategy<number>('custom-strategy', this.parameters)
      .subscribe(result => {
        this.result = result;
      });
  }
}
