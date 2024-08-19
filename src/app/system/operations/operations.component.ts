import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrategySelectorComponent } from '../../shared/components/strategy-selector/strategy-selector.component';
import { DailyOperationsComponent } from './daily-operations/daily-operations.component';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    StrategySelectorComponent, 
    DailyOperationsComponent
  ],
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {
  selectedStrategyName: string = 'Martingale'; // Definir estratégia padrão como "Martingale"

  ngOnInit(): void {}

  onStrategySelected(strategy: { name: string }): void {
    this.selectedStrategyName = strategy.name;
  }
}
