import { Type } from '@angular/core';

export interface Strategy {
  name: string;
  component: Type<any>;
  calculateOperation?: (balance: number) => { amount: number; profit: number };
}

export interface SimpleInterestEntry {
  round: number;
  bet: number;
  profit: number;
  total: number;
  win?: boolean; // Adicionando a propriedade win
}
