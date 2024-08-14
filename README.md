Você está absolutamente certo! Ter um detalhamento da lógica de negócios e uma explicação clara sobre o que cada pasta e componente faz é extremamente útil no `README.md`, especialmente para desenvolvedores que vão trabalhar no projeto. Isso não só facilita o entendimento do código, como também ajuda na manutenção e na expansão do sistema.

Vou integrar esse detalhamento da lógica de negócio e a explicação das responsabilidades no `README.md`, seguindo a estrutura padronizada.

---

```markdown
# Gerenciador de Riscos

## Descrição do Projeto

O **Gerenciador de Riscos** é uma aplicação desenvolvida em Angular 17, projetada para auxiliar na gestão de risco em operações financeiras. Ele permite que os usuários escolham entre diferentes estratégias de investimento, como Martingale, Soros, Juros Simples, Juros Compostos, entre outras, e fornece ferramentas para evitar overtrading e gerenciar a banca de forma eficiente.

## Requisitos

- **Angular CLI:** 17.0.0 ou superior
- **Node.js:** 18.x ou superior
- **NPM:** 9.x ou superior

## Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/gerenciador-de-riscos.git
cd gerenciador-de-riscos
```

### 2. Instalar Dependências

```bash
npm install
```

## Como Rodar o Projeto

### 1. Rodar o Servidor de Desenvolvimento

```bash
ng serve
```

### 2. Acessar a Aplicação

Abra o navegador e acesse `http://localhost:4200`.

## Estrutura de Pastas

A estrutura do projeto é modular e organizada para facilitar a manutenção e a expansão futura.

```bash
gerenciador-de-riscos/
├── src/
│   ├── app/
│   │   ├── system/
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   ├── home.component.scss
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   ├── dashboard.component.scss
│   │   │   ├── operations/
│   │   │   │   ├── operations.component.ts
│   │   │   │   ├── operations.component.html
│   │   │   │   ├── operations.component.scss
│   │   │   ├── settings/
│   │   │   │   ├── settings.component.ts
│   │   │   │   ├── settings.component.html
│   │   │   │   ├── settings.component.scss
│   │   │   ├── history/
│   │   │   │   ├── history.component.ts
│   │   │   │   ├── history.component.html
│   │   │   │   ├── history.component.scss
│   │   ├── strategies/
│   │   │   ├── martingale/
│   │   │   │   ├── martingale.component.ts
│   │   │   │   ├── martingale.component.html
│   │   │   │   ├── martingale.component.scss
│   │   │   ├── soros/
│   │   │   │   ├── soros.component.ts
│   │   │   │   ├── soros.component.html
│   │   │   │   ├── soros.component.scss
│   │   │   ├── compound-interest/
│   │   │   │   ├── compound-interest.component.ts
│   │   │   │   ├── compound-interest.component.html
│   │   │   │   ├── compound-interest.component.scss
│   │   │   ├── simple-interest/
│   │   │   │   ├── simple-interest.component.ts
│   │   │   │   ├── simple-interest.component.html
│   │   │   │   ├── simple-interest.component.scss
│   │   │   ├── custom-strategy/
│   │   │   │   ├── custom-strategy.component.ts
│   │   │   │   ├── custom-strategy.component.html
│   │   │   │   ├── custom-strategy.component.scss
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── strategy-selector/
│   │   │   │   │   ├── strategy-selector.component.ts
│   │   │   │   │   ├── strategy-selector.component.html
│   │   │   │   │   ├── strategy-selector.component.scss
│   │   │   │   ├── risk-alert/
│   │   │   │   │   ├── risk-alert.component.ts
│   │   │   │   │   ├── risk-alert.component.html
│   │   │   │   │   ├── risk-alert.component.scss
│   │   │   ├── services/
│   │   │   │   ├── strategy.service.ts
│   │   │   │   ├── operation.service.ts
│   │   │   │   ├── settings.service.ts
│   │   │   ├── models/
│   │   │   │   ├── strategy.model.ts
│   │   │   │   ├── operation.model.ts
│   │   │   │   ├── settings.model.ts
│   │   │   ├── utilities/
│   │   │   │   ├── calculations.util.ts
│   │   │   │   ├── storage.util.ts
```

## Lógica do Negócio

Para criar uma aplicação modular e seguir o princípio da responsabilidade única, o sistema foi estruturado de forma a separar as responsabilidades em componentes distintos. Cada estratégia de investimento é encapsulada em seu próprio componente, e o componente `strategy-selector` é responsável por exibir as opções de estratégia e direcionar o usuário para o componente correto.

### **Explicação das Responsabilidades:**

- **`strategy-selector.component.ts`:** Este é o componente pai que gerencia a escolha de estratégia. Dependendo da escolha do usuário, ele carrega e exibe o componente correto (por exemplo, Martingale, Soros, etc.). Esse componente também pode passar as configurações selecionadas para o componente de estratégia correspondente.
  
- **`martingale.component.ts`, `soros.component.ts`, etc.:** Cada um desses componentes é responsável por encapsular a lógica, interface e cálculos específicos da estratégia que ele implementa. Isso permite que cada estratégia opere de forma independente, com seu próprio conjunto de regras e cálculos.

- **`strategy.service.ts`:** Este serviço fornece os dados e lógica necessários para as estratégias. Ele poderia, por exemplo, calcular o próximo valor de entrada com base na estratégia selecionada e retornar os resultados para o componente.

### **Vantagens dessa Estrutura:**

1. **Modularidade:** Cada estratégia tem seu próprio componente, o que facilita a manutenção e a adição de novas estratégias no futuro.
2. **Responsabilidade Única:** Cada componente é responsável por uma única tarefa ou parte do sistema, o que melhora a clareza do código e facilita a depuração.
3. **Reutilização:** Componentes e serviços em `shared` podem ser reutilizados em várias partes do sistema, reduzindo a duplicação de código.

## Como Contribuir

1. Faça um fork do projeto.
2. Crie uma nova branch (`git checkout -b feature/MinhaFeature`).
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/MinhaFeature`).
5. Abra um Pull Request.

## Autor

**Rafael Dias**
```

### Estrutura do `README.md`:

1. **Descrição do Projeto:** Breve explicação do que é o projeto.
2. **Requisitos:** Lista do que você precisa para rodar o projeto.
3. **Instalação:** Instruções para clonar o repositório e instalar dependências.
4. **Como Rodar o Projeto:** Comandos para rodar o servidor de desenvolvimento e acessar a aplicação.
5. **Estrutura de Pastas:** Uma visão geral da estrutura do projeto.
6. **Lógica do Negócio:** Explicação de como a aplicação está organizada e como os componentes se relacionam, incluindo a responsabilidade de cada um.
7. **Como Contribuir:** Instruções para contribuir com o projeto.
8. **Autor:** Informação sobre o autor do projeto.

