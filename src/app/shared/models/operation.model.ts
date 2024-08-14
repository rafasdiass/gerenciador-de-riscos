// Suponha que Operation está definido assim:
interface Operation {
  bet: number;
  profit: number;
  total: number;
  win?: boolean;
}

// Podemos ajustar MartingaleEntry para que seja compatível com Operation
interface MartingaleEntry extends Operation {
  round: number;
}
