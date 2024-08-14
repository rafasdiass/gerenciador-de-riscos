import { Component } from '@angular/core';
import { StrategySelectorComponent } from '../../shared/components/strategy-selector/strategy-selector.component';
import { DailyOperationsComponent } from './daily-operations/daily-operations.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, StrategySelectorComponent, DailyOperationsComponent],
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent {}
