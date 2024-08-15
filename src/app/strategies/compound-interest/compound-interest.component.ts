import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrategyService } from '../../shared/services/strategy.service';
import { OperationService } from '../../shared/services/operation.service';

@Component({
  selector: 'app-compound-interest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compound-interest.component.html',
  styleUrls: ['./compound-interest.component.scss']
})
export class CompoundInterestComponent implements OnInit {
  initialAmount!: number;
  interestRate!: number;
  periods!: number;
  finalAmount!: number;

  constructor(private strategyService: StrategyService, private operationService: OperationService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.operationService.initialBalance$.subscribe(balance => {
      this.initialAmount = balance;
    });
  }

  calculate(): void {
    this.strategyService.calculateCompoundInterest(this.initialAmount, this.interestRate, this.periods)
      .subscribe(result => {
        this.finalAmount = result;
      });
  }
}
