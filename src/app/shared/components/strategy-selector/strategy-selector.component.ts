import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Strategy } from '../../models/strategy.model';
import { MartingaleComponent } from '../../../strategies/martingale/martingale.component';
import { CompoundInterestComponent } from '../../../strategies/compound-interest/compound-interest.component';
import { CustomStrategyComponent } from '../../../strategies/custom-strategy/custom-strategy.component';

@Component({
  selector: 'app-strategy-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './strategy-selector.component.html',
  styleUrls: ['./strategy-selector.component.scss']
})
export class StrategySelectorComponent implements OnInit {
  @Output() strategyChange = new EventEmitter<Strategy>();

  strategies: Strategy[] = [
    { name: 'Martingale', component: MartingaleComponent },
    { name: 'Juros Compostos', component: CompoundInterestComponent },
    { name: 'Estratégia Personalizada', component: CustomStrategyComponent }
  ];

  ngOnInit(): void {
    this.emitDefaultStrategy(); // Emitir a estratégia padrão ao iniciar
  }

  emitDefaultStrategy(): void {
    this.strategyChange.emit(this.strategies[0]); // Emitir "Martingale" como padrão
  }

  selectStrategy(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedStrategy = this.strategies.find(strategy => strategy.name === target.value);
    if (selectedStrategy) {
      this.strategyChange.emit(selectedStrategy); // Emitir a estratégia selecionada como objeto
    }
  }
}
