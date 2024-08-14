import { Type } from '@angular/core';

export interface Strategy {
  name: string;
  component: Type<any>;
  calculateOperation?: (balance: number) => { amount: number; profit: number };
}
