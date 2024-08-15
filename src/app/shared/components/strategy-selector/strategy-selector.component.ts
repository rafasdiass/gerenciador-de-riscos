import { Component, EventEmitter, OnInit, Output, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  @Output() strategyChange = new EventEmitter<Type<any>>();

  strategies = [
    { name: 'Martingale', component: MartingaleComponent },
    { name: 'Juros Compostos', component: CompoundInterestComponent },
    { name: 'Estratégia Personalizada', component: CustomStrategyComponent }
  ];

  ngOnInit(): void {
    this.emitDefaultStrategy(); // Emite a estratégia padrão ao iniciar
  }

  emitDefaultStrategy(): void {
    this.strategyChange.emit(this.strategies[0].component); // Martingale como padrão
  }

  selectStrategy(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedStrategy = this.strategies.find(strategy => strategy.name === target.value)?.component;
    if (selectedStrategy) {
      this.strategyChange.emit(selectedStrategy); // Emite o componente da estratégia selecionada
    }
  }
}
