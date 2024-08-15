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
    this.loadSettingsAndCalculate();
  }

  loadSettingsAndCalculate(): void {
    this.operationService.initialBalance$.subscribe(balance => {
      this.initialAmount = balance;
      this.calculateCompoundInterest();
    });

    this.operationService.riskAmount$.subscribe(riskAmount => {
      this.interestRate = (riskAmount / this.initialAmount) * 100;
      this.calculateCompoundInterest();
    });

    this.operationService.payout$.subscribe(payout => {
      this.periods = payout;
      this.calculateCompoundInterest();
    });
  }

  calculateCompoundInterest(): void {
    if (this.initialAmount && this.interestRate && this.periods) {
      this.strategyService.calculateStrategy<number>('compound-interest', {
        initialAmount: this.initialAmount,
        interestRate: this.interestRate,
        periods: this.periods
      }).subscribe({
        next: result => {
          this.finalAmount = result;
        },
        error: err => {
          console.error('Error calculating compound interest:', err);
        }
      });
    }
  }
}
