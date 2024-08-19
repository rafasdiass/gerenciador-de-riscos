export interface Operation {
  id?: number;  // O ID pode ser opcional, caso seja gerado automaticamente no backend
  bet: number;  // Valor apostado
  profit: number;  // Lucro obtido na operação
  total: number;  // Total acumulado após a operação
  win?: boolean;  // Indica se a operação foi um ganho (true) ou uma perda (false)
}

export interface MartingaleEntry extends Operation {
  round: number;  // Número da rodada no sistema Martingale
}

export interface CompoundInterestEntry extends Operation {
  periods: number;  // Número de períodos de aplicação do juros composto
  interestRate: number;  // Taxa de juros aplicada
}

export interface CustomStrategyEntry extends Operation {
  strategyName: string;  // Nome da estratégia customizada
  parameters: any;  // Parâmetros adicionais específicos para essa estratégia
}
