import { Component, Type, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MartingaleComponent } from '../../../strategies/martingale/martingale.component';
import { CompoundInterestComponent } from '../../../strategies/compound-interest/compound-interest.component';

@Component({
  selector: 'app-strategy-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './strategy-selector.component.html',
  styleUrls: ['./strategy-selector.component.scss']
})
export class StrategySelectorComponent implements OnInit {
  selectedStrategy: Type<any> | null = MartingaleComponent; // Martingale como default

  strategies = [
    { name: 'Martingale', component: MartingaleComponent },
    { name: 'Juros Compostos', component: CompoundInterestComponent }
  ];

  ngOnInit(): void {
    this.selectedStrategy = this.strategies[0].component; // Define Martingale como padrão ao iniciar
  }

  selectStrategy(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedStrategy = this.strategies.find(strategy => strategy.name === target.value);
    if (selectedStrategy) {
      this.selectedStrategy = selectedStrategy.component;
    }
  }
}
