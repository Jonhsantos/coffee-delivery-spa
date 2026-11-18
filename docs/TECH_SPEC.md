# TECH_SPEC — Coffee Delivery SPA | Technical Specification

> **Versão:** 1.1 — sincronizada com PRD_SPEC.md v1.2  
> **Status:** Especificação técnica para implementação  
> **Documento de produto:** [`PRD_SPEC.md`](./PRD_SPEC.md) — prevalece em requisitos, escopo e regras de negócio.  
> **Fonte de verdade visual:** `coffee-delivery.pen` na raiz do projeto — prevalece em layout, identidade, componentes visuais, tipografia, espaçamentos, cores e responsividade.  
> **Local esperado:** `coffee-delivery-spa/docs/TECH_SPEC.md`  
> **Linguagem:** pt-BR | **Moeda:** BRL | **Aplicação:** SPA frontend, sem backend próprio.

## 1. Objetivo, precedência e rastreabilidade

Este documento descreve **como** implementar o Coffee Delivery SPA com base nos requisitos **RF-01 a RF-16**, regras **RN-01 a RN-10** e requisitos não funcionais **RNF-01 a RNF-08** do `PRD_SPEC.md`.

**Ordem de autoridade por assunto:**

1. **Produto e negócios:** `docs/PRD_SPEC.md` (incluindo as alterações informadas pelo responsável).
2. **Decisões visuais:** `coffee-delivery.pen` (fonte de verdade visual obrigatória).
3. **Implementação:** `docs/TECH_SPEC.md` (este documento).
4. **Planejamento:** `docs/TASKS_SPEC.md`.
5. **Convenções dos agentes:** `AGENTS.md` (instruções operacionais; não podem contrariar produto, visual ou arquitetura aprovada).

Se o arquivo `.pen` estiver indisponível ou ilegível no ambiente, registrar o bloqueio; **não alegar fidelidade visual sem conferi-lo**. Não inventar catálogo definitivo, logo, cores ou telas ausentes; trabalhar com os ativos autorizados no repositório e identificar pendências. O PRD disponibilizado originalmente ainda continha uma estrutura antiga em sua seção 13; **este TECH_SPEC adota expressamente a estrutura atualizada fornecida pelo responsável**, detalhada na seção 4.

## 2. Stack e justificativa

| Tecnologia | Responsabilidade | Justificativa / decisão |
| --- | --- | --- |
| **React + TypeScript (strict)** | UI e tipos estáticos | Componentização, estados previsíveis e contratos tipados. |
| **Vite** | Desenvolvimento e build | Inicialização rápida e build frontend; `vite` como ferramenta, não framework de backend. |
| **React Router** | Rotas `/`, `/checkout`, `/success` e 404 | Navegação client-side sem refresh completo (**RF-07**). |
| **Tailwind CSS** | Estilos utilitários, responsividade e tema | Consumir os 16 tokens oficiais de cor, aliases semânticos e escalas de tipografia do PRD v1.2, sem valores soltos. |
| **Google Fonts — Baloo 2 e Roboto** | Tipografia oficial | Baloo 2 para títulos (700/800) e Roboto para textos/controles (400/700), com fallback e carregamento otimizado (**RF-15/16**). |
| **`@phosphor-icons/react`** | Ícones do design system | Biblioteca oficial do PRD v1.2; pesos/variantes e tamanhos orientados pelo `.pen` (**RF-15/16**). |
| **Context API + `useReducer`** | Estado compartilhado do carrinho | Suficiente ao escopo; ações explícitas, invariantes testáveis, sem Redux (**RF-03–06**). |
| **Context API + `useState`** | Preferência de tema | Estado simples de baixo custo, persistido (**RF-14**). |
| **React Hook Form + Zod + `@hookform/resolvers`** | Formulário e validação | Regras declarativas, tipagem inferida, erros por campo e menos renderizações (**RF-08–11**). |
| **`fetch` nativo + `AbortController`** | ViaCEP | Sem cliente HTTP adicional; cancelar/ignorar respostas antigas (**RF-08; RN-07/08**). |
| **`localStorage`** | Carrinho, tema e último pedido | Sem backend; leitura/salvamento controlados e validados (**RF-06/13/14**). |
| **Vitest + Testing Library + user-event + jest-dom** | Testes unitários e de integração | Testar estados, interações acessíveis e contratos sem navegador real. |
| **MSW (recomendado)** | Interceptação HTTP nos testes | Simular ViaCEP com sucesso, erro, latência e corrida entre CEPs. |
| **Playwright** | Testes E2E | Exercitar navegação, refresh, storage e viewport móvel em navegador. |
| **ESLint + Prettier + `tsc --noEmit`** | Qualidade | Padrões consistentes, detecção de defeitos e tipagem estrita. |

**Restrições:** não incluir autenticação, gateway, serviço de entrega, API própria ou banco de dados; não adicionar biblioteca pesada de estado sem justificativa técnica. Preferir versões estáveis compatíveis entre si, registradas no lockfile; verificar no projeto as APIs específicas da versão escolhida. A consulta ViaCEP é a **única integração funcional HTTP externa obrigatória**. (**RN-05, RN-08**)

## 3. Arquitetura da SPA e desenho de responsabilidades

**Padrão:** SPA organizada por camadas leves, com componentes de apresentação separados de estado, validação, domínio e efeitos externos.

```text
                     React Router / App
                             |
                  Providers (Theme / Cart)
                             |
             Pages: Home / Checkout / Success
                   |                  |
             UI reutilizável       Form RHF+Zod
                   |                  |
             hooks useCart      hooks useCepLookup
                   |                  |
           CartContext/Reducer    services/viacep
                   |                  |
              catálogo local     ViaCEP (HTTP)
                   |
         selectors / money / order snapshot
                   |
        services/storage (localStorage)
```

| Parte | Responsabilidades | Não deve fazer |
| --- | --- | --- |
| `pages/` | Orquestrar telas e navegação; usar componentes/hooks | Reimplementar cálculos ou chamar storage diretamente |
| `components/` | Renderização acessível e eventos via props; cartões, resumo, formulário | Ter regras de negócio duplicadas |
| `contexts/` | Expor estado e comandos de carrinho/tema; controlar hidratação | Fazer requisições dentro do reducer |
| `reducers/` | Transições **puras e imutáveis** do carrinho | `fetch`, storage, navegação, relógio ou UUID |
| `hooks/` | Encapsular acesso a contexto, validação de CEP, efeitos e persistência | Misturar efeitos com cálculos que devem ser puros |
| `data/` | Catálogo local tipado, IDs estáveis, dados aprovados | Inventar catálogo oficial a partir de suposições |
| `types/` | Contratos de domínio | Importar componentes ou depender do DOM |
| `schemas/` | Validar formulário, CEP, respostas externas e dados persistidos | Confiar em dados externos sem validação |
| `utils/` | Seletores, cálculos, formatação e normalizações puras | Alterar estado de interface |
| `services/` | Adaptadores HTTP e armazenamento em `try/catch` | Renderizar UI |
| `styles/` | Tokens semânticos e estilos globais | Divergir do `.pen` sem aprovação |

**Princípios:** fluxo unidirecional; reducers puros; catálogo como referência dos itens ainda no carrinho; `Order` como cópia independente do pedido fechado; UI não deve depender da API de CEP para renderizar o catálogo. (**RN-02, RN-04, RN-06, RNF-03/08**)

## 4. Estrutura de diretórios e inventário de componentes

A organização abaixo respeita **a estrutura atualizada informada pelo responsável**; subpastas de apoio podem ser criadas **dentro** das pastas previstas.

```text
coffee-delivery-spa/
├── coffee-delivery.pen           # Fonte de verdade visual obrigatória
├── public/                       # favicon e arquivos estáticos publicados
├── src/
│   ├── assets/                  # Logo original com IA e imagens autorizadas
│   ├── components/              # UI reutilizável
│   │   ├── Header.tsx
│   │   ├── CoffeeCard.tsx
│   │   ├── QuantityControl.tsx
│   │   ├── CartItemRow.tsx
│   │   ├── CartSummary.tsx
│   │   ├── DeliveryAddressForm.tsx
│   │   ├── PaymentMethodSelector.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── EmptyState.tsx
│   │   └── FeedbackMessage.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Checkout.tsx
│   │   ├── Success.tsx
│   │   └── NotFound.tsx
│   ├── contexts/
│   │   ├── CartContext.tsx
│   │   └── ThemeContext.tsx
│   ├── reducers/
│   │   └── cartReducer.ts
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useTheme.ts
│   │   ├── useLocalStorage.ts
│   │   └── useCepLookup.ts
│   ├── data/
│   │   └── coffees.ts
│   ├── types/
│   │   ├── coffee.ts
│   │   ├── cart.ts
│   │   ├── checkout.ts
│   │   └── order.ts
│   ├── schemas/
│   │   ├── checkoutSchema.ts
│   │   └── storageSchemas.ts
│   ├── utils/
│   │   ├── money.ts
│   │   ├── cartSelectors.ts
│   │   ├── cep.ts
│   │   └── order.ts
│   ├── styles/
│   │   ├── globals.css           # Base, reset e importação de fontes
│   │   ├── tokens.css            # 16 cores oficiais + aliases de light/dark
│   │   └── typography.css        # Escalas tipográficas oficiais
│   ├── tests/
│   │   ├── cartReducer.test.ts
│   │   ├── money.test.ts
│   │   ├── checkout.test.tsx
│   │   ├── cep.test.ts
│   │   └── storage.test.ts
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   ├── PRD_SPEC.md
│   ├── TECH_SPEC.md
│   └── TASKS_SPEC.md
├── AGENTS.md
├── README.md
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Arquivos como `package-lock.json`, configurações de ESLint e testes E2E podem existir conforme as ferramentas escolhidas. Componentes nomeados são **sugestões técnicas**, ajustáveis à decomposição do `coffee-delivery.pen`, sem eliminar as responsabilidades essenciais.

**Composição das telas:**
- **Home (`/`):** `Header`, grid de `CoffeeCard`, `QuantityControl` por card, CTA de adição e feedback. (**RF-01/02/03/04/15/16**)
- **Checkout (`/checkout`):** `CartItemRow`, `CartSummary`, `DeliveryAddressForm`, `PaymentMethodSelector`, ações de editar/remover, estado vazio, submissão. (**RF-05/08/09/10/11**)
- **Success (`/success`):** resumo a partir do **snapshot** de `Order`; estado sem pedido, ação de voltar à Home. (**RF-12/13, RN-09**)
- **Global:** `Header`, `ThemeToggle`, feedback acessível, estilos responsivos. (**RF-04/14/15/16**)

## 5. Contratos TypeScript e domínio

```ts
// src/types/coffee.ts
export interface Coffee {
  id: string;                 // único e estável
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  priceCents: number;         // inteiro seguro e > 0
}

// src/types/cart.ts
export interface CartItem {
  productId: Coffee['id'];
  quantity: number;           // inteiro seguro >= 1
}

// src/types/checkout.ts
export type PaymentMethod = 'credit' | 'debit' | 'cash';
export type Theme = 'light' | 'dark';
export interface DeliveryAddress {
  cep: string;                // 8 dígitos normalizados
  street: string;
  number: string;             // permite "S/N"
  complement?: string;
  neighborhood: string;
  city: string;
  uf: string;                 // duas letras; UF brasileira válida
}

// src/types/order.ts
export interface OrderItemSnapshot {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  lineTotalCents: number;
}
export interface Order {
  id: string;
  createdAt: string;         // ISO 8601
  items: OrderItemSnapshot[];
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}
```

**Nomes equivalentes:** o `PRD_SPEC.md` utiliza `Address` e `CompletedOrder`; neste documento, `DeliveryAddress` e `Order` são os nomes canônicos de código solicitados e **representam os mesmos contratos**. Caso o repositório já use os nomes antigos, podem ser usados aliases (`type Address = DeliveryAddress; type CompletedOrder = Order`) sem manter duas estruturas divergentes. (**RF-08/12/13; RN-06/07**)

**Invariantes:** `Coffee.priceCents`, `quantity`, subtotais e frete são inteiros seguros; não permitir IDs repetidos; para `Order`, copiar os itens resolvidos (incluindo **nome e preço no fechamento**), endereço, pagamento e valores calculados. **Nunca** reconstruir uma confirmação a partir do carrinho ou dos preços atuais do catálogo.

## 6. Context API, reducer e seletores

Apenas o **carrinho** é mantido como estado compartilhado de domínio. Armazenar itens como `{ productId, quantity }[]`, sem cópias dos dados do produto.

```ts
export type CartAction =
  | { type: 'ADD_ITEM'; productId: string; quantity: number }
  | { type: 'INCREMENT_ITEM'; productId: string }
  | { type: 'DECREMENT_ITEM'; productId: string }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'CLEAR_CART' };

export interface CartContextValue {
  items: CartItem[];
  unitCount: number;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  addItem(productId: string, quantity: number): void;
  incrementItem(productId: string): void;
  decrementItem(productId: string): void;
  removeItem(productId: string): void;
  clearCart(): void;
}
```

**Regras de transição (`cartReducer`):**
1. `ADD_ITEM`: validar que produto existe, quantidade é inteira segura e >= 1, soma não ultrapassa `Number.MAX_SAFE_INTEGER`; se o ID já existir, **somar** à mesma linha; caso contrário, inserir uma linha. Nenhuma ação inválida deve corromper o estado.
2. `INCREMENT_ITEM`: somar exatamente 1 somente se o item existir, sem overflow.
3. `DECREMENT_ITEM`: subtrair 1; se era 1, **remover a linha**.
4. `REMOVE_ITEM`: excluir somente a linha do ID indicado.
5. `CLEAR_CART`: produzir lista vazia; executado **após** persistir o snapshot da compra simulada.

O reducer deve ser puro. Para validar catálogo, preferir **fechar o reducer sobre o índice imutável do catálogo** (fábrica `createCartReducer(catalogById)`) ou validar e despachar IDs válidos via comandos do contexto, mantendo uma barreira de validação no checkout. Não transformar o catálogo em estado duplicado do carrinho.

**Seletores derivados, não armazenados:**

```ts
const unitCount = items.reduce((sum, item) => sum + item.quantity, 0);
const subtotalCents = items.reduce(
  (sum, item) => sum + catalogById[item.productId].priceCents * item.quantity,
  0,
);
const deliveryFeeCents = items.length === 0 ? 0 : DELIVERY_FEE_CENTS;
const totalCents = subtotalCents + deliveryFeeCents;
```

Antes de calcular, o carrinho deve ter sido sanitizado; **não** acessar `catalogById[id]` para produto desconhecido. Validar produtos e inteiros seguros no carregamento, comandos e finalização. Se houver dados inválidos em memória, bloquear confirmação e solicitar correção; ao carregar storage corrompido, descartar entradas inválidas de modo seguro. `useMemo` pode reduzir recomputações; não é necessário para correção. (**RF-03/04/05/06/10/11; RN-01/02/03/04/10**)

## 7. Hooks, eventos, efeitos e persistência

### 7.1 Hooks

- `useCart()`: retorna estado, seletores e operações, lançando erro descritivo fora de `CartProvider`.
- `useTheme()`: lê tema, disponibiliza `toggleTheme()`/`setTheme()` e mantém atributo na raiz.
- `useLocalStorage<T>()`: encapsula leitura/salvamento com `try/catch`, validação, versionamento de chave e fallback em memória; **não** significa aceitar JSON sem validar.
- `useCepLookup()`: consulta ViaCEP, informa `idle | loading | success | not-found | error`, vincula resultado ao CEP consultado e oferece `lookup(cep)`/`retry()`; aborta requisições obsoletas.
- Formulário: `useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema), ... })` com controles associados corretamente.

### 7.2 Sequência de eventos e efeitos

```text
Home: clique em Adicionar
  → validação de produto e quantidade
  → dispatch(ADD_ITEM)
  → UI/contador/resumo atualizados
  → efeito salva coffee:cart:v1

Checkout: CEP digitado/alterado
  → normalizar CEP; invalidar verificação anterior se mudou
  → se 8 dígitos, acionar consulta (ex.: onBlur / botão Buscar)
  → loading → resposta válida/erro
  → atualizar campos disponíveis, preservando número e complemento

Checkout: Confirmar
  → revalidar formulário + consulta do CEP atual + carrinho
  → criar Order (snapshot)
  → persistir coffee:last-order:v1 com confirmação de escrita
  → dispatch(CLEAR_CART)
  → navegar /success
```

### 7.3 Contrato de storage

| Chave | Conteúdo | Leitura e gravação |
| --- | --- | --- |
| `coffee:cart:v1` | `CartItem[]` | Inicializar com lazy initializer seguro; validar forma, IDs, quantidade e duplicatas (consolidar ou descartar). Salvar a cada alteração. |
| `coffee:theme:v1` | `'light' \| 'dark'` | Preferência explícita; caso ausente/inválida, iniciar a partir de `prefers-color-scheme`. |
| `coffee:last-order:v1` | `Order` | Validar estrutura e totais ao restaurar; usar exclusivamente na confirmação. |

**Detalhe de consistência:** a leitura inicial do carrinho deve ocorrer **antes do primeiro efeito de escrita**, evitando sobrescrever o storage com carrinho vazio durante a montagem. Para pedido concluído, a gravação deve ser **síncrona e bem-sucedida antes de limpar o carrinho**; se falhar, não prosseguir com limpeza/navegação, oferecer recuperação e tentar novamente. Na ausência de storage (modo privado/restrições), a navegação e o tema podem funcionar em memória com aviso, mas a UI **não deve prometer** persistência após refresh. Se a gravação do carrinho falhar, oferecer aviso de persistência degradada.

**Integridade adicional:** validar e sane ar dados no carregamento e na confirmação. Em `React.StrictMode`, garantir efeitos idempotentes, sem duplicar criação de pedidos; `crypto.randomUUID()` deve rodar **somente** no handler confirmado, nunca em render/effect de montagem. Usar estado ou ref síncrona para bloquear clique duplicado.

### 7.4 Concorrência de CEP

- Fazer a requisição apenas quando CEP normalizado tiver exatamente 8 dígitos; evitar disparar uma requisição por tecla sem controle.
- Ao editar o CEP, **invalidar imediatamente** a consulta anterior; abortar a requisição pendente ou ignorar qualquer resposta cujo CEP/token não corresponda ao atual.
- Nunca sobrescrever `number` ou `complement` com dados da API.
- Quando o CEP mudar, limpar os campos **auto-preenchidos obsoletos** da consulta anterior (preservar entradas manuais de maneira explícita), antes de mostrar novos resultados.
- Uma consulta com resposta HTTP bem-sucedida e payload válido pode preencher campos faltantes manualmente; resposta `erro: true` **não** valida CEP para conclusão.

(**RF-06/08/13/14; RN-06/07; RNF-04/06**)

## 8. Rotas, checkout, validação Zod e fluxo de confirmação

### 8.1 Rotas

| Caminho | Componente | Regras |
| --- | --- | --- |
| `/` | `Home` | Catálogo, quantidade, adição e acesso ao carrinho. |
| `/checkout` | `Checkout` | Carrinho editável, endereço, pagamento e resumo; bloqueio de confirmação com carrinho vazio. |
| `/success` | `Success` | Lê `Order` persistido; se ausente/inválido, `EmptyState` com volta para `/`. |
| `*` | `NotFound` | Página amigável e link para `/`. |

Usar `BrowserRouter`, `Routes`, `Route`, `Link`/`NavLink`/`useNavigate`; não usar `window.location` para navegação interna. Configurar hosting de SPA com fallback para `index.html` em acesso direto às rotas. (**RF-07/11/12; RN-09/10**)

### 8.2 Formulário e Zod

Contrato de entrada: `DeliveryAddress` + `paymentMethod: PaymentMethod` com validação de:

| Campo | Regra |
| --- | --- |
| `cep` | Normalizado somente dígitos; **exatamente 8**, verificação HTTP bem-sucedida do **mesmo CEP** atual antes de confirmar. |
| `street` | Texto não vazio após trim; editável se ViaCEP omitir dado. |
| `number` | Texto obrigatório após trim; `S/N` permitido; sempre manual. |
| `complement` | Opcional, pode ser vazio; sempre manual. |
| `neighborhood` | Texto não vazio após trim; editável. |
| `city` | Texto não vazio após trim; editável. |
| `uf` | Uppercase, sigla oficial entre 27 UFs brasileiras. |
| `paymentMethod` | Enum `'credit' | 'debit' | 'cash'`; sem seleção inicial. |

Exemplo de base tipada:

```ts
import { z } from 'zod';

const UF = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
] as const;

const nonEmpty = z.string().trim().min(1, 'Campo obrigatório');
export const checkoutSchema = z.object({
  cep: z.string().transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{8}$/, 'Informe 8 dígitos')),
  street: nonEmpty,
  number: nonEmpty,
  complement: z.string().optional(),
  neighborhood: nonEmpty,
  city: nonEmpty,
  uf: z.string().trim().toUpperCase().pipe(z.enum(UF)),
  paymentMethod: z.enum(['credit', 'debit', 'cash']),
});

export type CheckoutFormInput = z.input<typeof checkoutSchema>;
export type CheckoutFormValues = z.output<typeof checkoutSchema>;
```

**Observação de implementação:** `z.input` e `z.output` diferem quando se usam transformações; tipar o React Hook Form com ambos (e o contexto de resolver quando aplicável) para evitar incompatibilidade. Não tratar sucesso do Zod como substituto da verificação da API de CEP: é **uma condição externa adicional** de finalização. Usar `aria-invalid`, `aria-describedby`, `label`, erros próximos ao campo, foco no primeiro campo inválido e resumo quando útil. (**RF-08/09/11; RN-07/10**)

### 8.3 Serviço de CEP

`GET https://viacep.com.br/ws/{cep}/json/`, sem API key. Validar resposta com schema: `erro?: boolean`, `logradouro?: string`, `bairro?: string`, `localidade?: string`, `uf?: string`; confirmar que resposta é objeto esperado. Mapear `logradouro → street`, `bairro → neighborhood`, `localidade → city`, `uf → uf`. Estados explícitos de loading, encontrado, não encontrado e erro (rede, timeout ou resposta inválida). Mostrar **Tentar novamente** se necessário. **Falha da API bloqueia conclusão**, embora o usuário possa editar os campos. Não registrar endereço completo em logs. (**RF-08; RN-07/08**)

### 8.4 Confirmação e atomicidade prática

A confirmação é **fictícia** e não cria pagamento ou entrega real:

1. Impedir submissões concorrentes (ref de submissão + botão indisponível durante a operação).
2. Validar carrinho saneado, preços e quantidades; o total deve ser recalculado com funções puras.
3. Validar `checkoutSchema` e comparar `cep` normalizado com o CEP da **última consulta bem-sucedida ainda válida**.
4. Criar `Order` com `crypto.randomUUID()`, `new Date().toISOString()`, itens e preços copiados, endereço normalizado, método e totais do fechamento.
5. Gravar `coffee:last-order:v1`; se gravação falhar, manter carrinho e apresentar erro.
6. Limpar carrinho; persistir estado vazio; navegar com `navigate('/success')`. Se a gravação do carrinho vazio falhar, informar falha e impedir nova confirmação duplicada na mesma sessão; na próxima inicialização, reconciliar os itens persistidos com o último pedido para não interpretar um pedido antigo como um novo pedido. **Não usar uma confirmação parcialmente persistida como comprovante de compra real.**
7. Na tela de sucesso, ler o `Order` salvo, **não o carrinho**. A confirmação deve informar claramente que se trata de um pedido de demonstração.

Para evitar a complexidade de transações entre duas chaves `localStorage`, recomenda-se uma **única função de finalização** responsável pela ordem de escrita e tratamento de falhas; não espalhar o fluxo entre efeitos que possam acontecer em ordem não determinística. Uma estratégia de marcação de operação concluída (ID ou status em storage) pode ser adicionada se os testes de falha de escrita exigirem recuperação forte. (**RF-11/12/13; RN-05/06/09/10**)

## 9. Cálculo de valores e formatação

**Fonte única** `src/utils/money.ts`:

```ts
export const DELIVERY_FEE_CENTS = 500; // R$ 5,00 por pedido não vazio

export const formatBRL = (cents: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
```

**Fórmulas:**

```text
unitCount = Σ(quantity)
lineTotalCents = priceCents × quantity
subtotalCents = Σ(lineTotalCents)
deliveryFeeCents = cart.length > 0 ? 500 : 0
totalCents = subtotalCents + deliveryFeeCents
```

Validar `Number.isSafeInteger` em quantidade, preço, linha e soma; não converter preços monetários para floats durante a operação. Usar um único conjunto de seletores em Home/Checkout/Header e copiar esses valores para o `Order` na finalização. Exemplo: cafés de R$ 8,90 (2 unidades) e R$ 12,50 (1 unidade) → subtotal **R$ 30,30**, frete **R$ 5,00**, total **R$ 35,30**, Header **3 unidades**. No carrinho vazio, subtotal, frete e total são **R$ 0,00**. (**RF-04/10; RN-03/04**)

## 10. Tema, tokens visuais, breakpoints, motion e acessibilidade

### 10.1 Fonte visual oficial, cores e tokens (PRD v1.2 §12.1)

**Fontes normativas:** `docs/PRD_SPEC.md` v1.2, especialmente §12, e o arquivo `coffee-delivery.pen` na raiz. O PRD define os **valores oficiais** reproduzidos das imagens; o `.pen` define sua aplicação visual, hierarquia, composição e estados. Em caso de conflito de cor com um frame do `.pen`, registrar a diferença e validar com o responsável antes de substituir um token oficial.

**Produto — nomes originais e valores exatos:**

| Token | Hex | Token CSS |
| --- | --- | --- |
| `yellow-dark` | `#C47F17` | `--color-yellow-dark` |
| `yellow` | `#DBAC2C` | `--color-yellow` |
| `yellow-light` | `#F1E9C9` | `--color-yellow-light` |
| `purple-dark` | `#4B2995` | `--color-purple-dark` |
| `purple` | `#8047F8` | `--color-purple` |
| `purple-light` | `#EBE5F9` | `--color-purple-light` |

**Base — nomes originais e valores exatos:**

| Token | Hex | Token CSS |
| --- | --- | --- |
| `base-title` | `#272221` | `--color-base-title` |
| `base-subtitle` | `#403937` | `--color-base-subtitle` |
| `base-text` | `#574F4D` | `--color-base-text` |
| `base-label` | `#8D8686` | `--color-base-label` |
| `base-hover` | `#D7D5D5` | `--color-base-hover` |
| `base-button` | `#E6E5E5` | `--color-base-button` |
| `base-input` | `#EDEDED` | `--color-base-input` |
| `base-card` | `#F3F2F2` | `--color-base-card` |
| `background` | `#FAFAFA` | `--color-background` |
| `white` | `#FFFFFF` | `--color-white` |

**Implementação de referência em `src/styles/tokens.css`:**

```css
:root {
  /* Tokens oficiais de marca — não mudar os HEX */
  --color-yellow-dark: #C47F17;
  --color-yellow: #DBAC2C;
  --color-yellow-light: #F1E9C9;
  --color-purple-dark: #4B2995;
  --color-purple: #8047F8;
  --color-purple-light: #EBE5F9;

  /* Tokens oficiais de base do tema claro */
  --color-base-title: #272221;
  --color-base-subtitle: #403937;
  --color-base-text: #574F4D;
  --color-base-label: #8D8686;
  --color-base-hover: #D7D5D5;
  --color-base-button: #E6E5E5;
  --color-base-input: #EDEDED;
  --color-base-card: #F3F2F2;
  --color-background: #FAFAFA;
  --color-white: #FFFFFF;

  /* Aliases semânticos: componentes devem preferi-los */
  --surface-page: var(--color-background);
  --surface-card: var(--color-base-card);
  --surface-input: var(--color-base-input);
  --text-primary: var(--color-base-title);
  --text-secondary: var(--color-base-text);
  --text-muted: var(--color-base-label);
}
```

Esses 16 valores são **oficiais para o tema claro**. Centralizar sua declaração e disponibilizar aliases no Tailwind conforme a versão instalada (configuração em `tailwind.config` ou diretiva `@theme`, se apropriado). Componentes devem consumir tokens e não duplicar HEX em classes inline. **Não** presumir quais elementos usam roxo ou amarelo sem verificar `coffee-delivery.pen`. Definir tokens suplementares de foco, erro e sucesso com contraste verificável; são escolhas de implementação e não cores oficiais fornecidas pela referência.

**Dark mode:** não foram disponibilizados códigos HEX oficiais para a paleta escura. Verificar primeiro se `coffee-delivery.pen` contém frames/tokens dark; se não contiver, configurar em `[data-theme='dark']` **aliases semânticos** (`--surface-page`, `--surface-card`, `--surface-input`, `--text-primary`, `--text-secondary`, `--text-muted` e estados necessários), usando valores derivados e testados quanto a contraste, identificados como **propostos/pendentes de validação visual**, e não como tokens oficiais do PRD. Manter os 16 tokens originais imutáveis; não aplicar `filter: invert()` às imagens ou à logo. (**RF-14/15; RNF-01/02/08**)

### 10.1.1 Tipografia oficial e aplicação (PRD v1.2 §12.2)

**Famílias:** `Baloo 2` em títulos e `Roboto` em textos, tags, formulários e botões. Obter em Google Fonts ou hospedar localmente, carregar somente pesos necessários; fallback de sistema preserva a usabilidade se a fonte falhar. Manter `font-family` como tokens centralizados.

| Token | Família | Font-size | Line-height | Font-weight |
| --- | --- | --- | --- | --- |
| `Title XL` | Baloo 2 | 48px | 130% | 800 |
| `Title L` | Baloo 2 | 32px | 130% | 800 |
| `Title M` | Baloo 2 | 24px | 130% | 800 |
| `Title S` | Baloo 2 | 20px | 130% | 700 |
| `Title XS` | Baloo 2 | 18px | 130% | 700 |
| `Text L` | Roboto | 20px | 130% | 400 ou 700 |
| `Text M` | Roboto | 16px | 130% | 400 ou 700 |
| `Text S` | Roboto | 14px | 130% | 400 |
| `Text XS` | Roboto | 12px | 130% | 700 |
| `Tag` | Roboto | 10px | 130% | 700 |
| `Button G` | Roboto | 14px | 160% | 700 |
| `Button M` | Roboto | 12px | 160% | 400 |

Em `src/styles/typography.css` ou utilitários configurados do Tailwind, criar tokens reutilizáveis (por exemplo, `.type-title-xl`, `.type-text-m`, `.type-button-g`) sem repetir regras em cada componente. `line-height: 1.3` corresponde a 130%, e `1.6` a 160%. O peso de `Text L`/`Text M` é variante regular ou bold conforme contexto e `.pen`, não duas fontes simultâneas. Preservar semântica de cabeçalhos independentemente de tamanho visual; testar zoom a 200%, quebra de linha e ausência de truncamento. **Tag de 10px** é uma especificação visual, sujeita a revisão de acessibilidade quando ilegível. (**RF-01/15/16; RNF-01/02**)

### 10.1.2 Iconografia oficial (PRD v1.2 §12.3)

Usar exclusivamente **Phosphor Icons**, pacote `@phosphor-icons/react`, com peso (`regular`, `fill`, etc.), tamanho e cor orientados pelos componentes do `coffee-delivery.pen`. Referências conceituais observadas, na ordem da imagem: localização preenchida, localização contornada, lixeira, cifrão, carrinho, cronômetro, pacote/caixa, xícara de café, adição, subtração, cartão, cédula e instituição bancária. Exemplos de componentes Phosphor a **verificar contra a versão instalada**: `MapPin`, `Trash`, `CurrencyDollar`, `ShoppingCart`, `Timer`, `Package`, `Coffee`, `Plus`, `Minus`, `CreditCard`, `Money`, `Bank`. A lista são aproximações de nomes da biblioteca, **não** nomes oficiais validados pelo design; escolher variante exata após inspecionar o `.pen`.

- Não misturar Lucide, Font Awesome, emojis ou outras bibliotecas de ícones no layout oficial sem decisão documentada.
- Ícones decorativos: `aria-hidden="true"`; botões só com ícone: `aria-label` descritivo por ação/produto; foco visível e alvo de toque adequado.
- Não renderizar ícones presentes na prancha de referência se não constarem nos fluxos reais do `.pen`.
- Cobrir iconografia nos testes visuais da Home, Checkout e Success. (**RF-02/04/05/09/15/16; RNF-01/02**)

### 10.2 Implementação de tema

- `ThemeProvider`: preferência explícita em `coffee:theme:v1`.
- Primeira visita: usar `matchMedia('(prefers-color-scheme: dark)')` como padrão inicial; observar mudanças do sistema somente se não houver escolha manual persistida.
- Aplicar `data-theme='light'|'dark'` no elemento raiz da página; garantir que não haja flash perceptível de tema incorreto na carga, por exemplo com script de inicialização mínimo antes do render, quando aplicável.
- `ThemeToggle` com rótulo e estado acessíveis; atualização em todas as rotas sem refresh.

### 10.3 Responsividade

- **Mobile-first**; validar telas desde **320 px** de largura. Ajustar grid de cards, Header, detalhes do carrinho, campos do endereço, resumo e ações sem rolagem horizontal.
- Preferir breakpoints do próprio `.pen`; caso o arquivo não defina valores explícitos, usar como **padrões de engenharia revisáveis**: `sm` 640 px, `md` 768 px, `lg` 1024 px, `xl` 1280 px (padrões usuais do Tailwind), sem apresentar esses números como decisões do design.
- Controles interativos devem ter dimensões apropriadas para toque e não depender de hover. Verificar teclado em 320 px e zoom de 200%.

### 10.4 Acessibilidade e feedback

HTML semântico (`header`, `main`, `nav`, `form`, `button`); `alt` útil nas imagens de produto e logo conforme função; `label` associado a inputs; `fieldset`/`legend` no pagamento; botão de quantidade com rótulo que identifique café e ação; `aria-live="polite"` para atualização de carrinho e sucesso de consulta; `role="alert"` para erros relevantes; foco visível; contraste WCAG 2.2 AA onde aplicável. Gerenciar foco após navegação e erro de formulário. Usar transições sutis sem deslocamento visual excessivo e respeitar `prefers-reduced-motion`. (**RF-01/02/08/11/14/15/16; RNF-01/02**)

### 10.5 Marca original e favicon

Usar **a logo original aprovada com apoio de IA**, disponibilizada no projeto, no Header e favicon em `public/`. Documentar no README ou `docs/brand.md` o arquivo, conceito, cores/tipografia e ferramenta/finalidade da IA **se esses dados forem fornecidos**. Sem arquivo de logo aprovado, registrar **RF-16 pendente**, sem afirmar que está implementado. (**RF-16**)

## 11. Testes, ferramentas de qualidade e instruções de execução

### 11.1 Plano de testes

| Camada | Casos mínimos | Rastreabilidade |
| --- | --- | --- |
| Unitário — reducer | Adicionar 2+3 do mesmo ID = uma linha 5; IDs diferentes; zero/negativo/fração bloqueados; decrementar de 1 remove; limpar | RF-02/03/05; RN-01/02 |
| Unitário — selectors/money | Contador por unidades; subtotal em centavos; frete 500 com carrinho não vazio; vazio = 0; prevenção de overflow | RF-04/10; RN-03/04 |
| Unitário — schema | CEP não tem 8 dígitos, UF inválida, número vazio, complemento vazio permitido, pagamento fora do enum | RF-08/09/11; RN-07/10 |
| Unitário — storage | JSON inválido, ID inexistente, quantidade inválida, duplicatas, falha de escrita, hidratação inicial sem sobrescrita | RF-06/13/14; RN-06 |
| Integração — ViaCEP (MSW) | Sucesso com campos completos/parciais; `erro: true`; rede indisponível; resposta inválida; troca de CEP ignora resposta antiga; número/complemento preservados | RF-08/11; RN-07/08 |
| Integração — checkout | Bloqueio por carrinho vazio, item inválido, CEP não verificado, endereço inválido e pagamento ausente; snapshot correto; grava antes de limpar | RF-11/12/13; RN-05/06/10 |
| Integração — tema e UI | Alternância e persistência em todas as rotas; contador sincronizado; mensagens acessíveis; tokens semânticos em light/dark | RF-04/14; RNF-01/04 |
| Visual — design system | Verificar os 16 HEX oficiais, escala Baloo 2/Roboto, line-height/pesos, Phosphor Icons, fallback de fontes e ausência de mistura de bibliotecas | RF-01/14/15/16; PRD §12.1–12.3 |
| E2E — Playwright | Home → adição → Checkout → CEP → pagamento → Success; refresh de carrinho e Success; acesso direto às rotas | RF-01–15; RN-01–10 |
| E2E — visual/a11y | Conferência manual do `.pen` em desktop e mobile; 320 px; teclado; foco; contraste e reduced motion; logo/favicons presentes | RF-14/15/16; RNF-01/02 |

Usar payloads fictícios nos testes, nunca dados pessoais reais. Testes E2E de CEP devem preferir rede interceptada para reprodutibilidade; antes do aceite, realizar **ao menos uma consulta real** à API para confirmar a integração externa e comportamento de CORS no ambiente implantado.

### 11.2 Quality gates

- `npm run typecheck`: TypeScript estrito sem erro.
- `npm run lint`: ESLint sem problemas impeditivos.
- `npm run test`: unitários e integrações aprovados.
- `npm run build`: build de produção sem erro.
- `npm run test:e2e`: Playwright para fluxos-chave; configurar script e browsers antes de usá-lo.
- Revisão visual contra `coffee-delivery.pen`, responsividade em ≥320 px e fluxo completo por teclado.
- Testar também Chrome, Edge, Firefox e Safari atuais (navegadores móveis equivalentes quando disponíveis).

**Scripts recomendados no `package.json`:** `dev`, `build`, `preview`, `typecheck`, `lint`, `format`, `test`, `test:watch`, `test:e2e`. São nomes **a configurar**, não declaração de que já existem.

### 11.3 Inicialização e execução

Pré-requisitos: Node.js LTS suportado pelas versões instaladas, npm e repositório com `coffee-delivery.pen`/ativos necessários.

```bash
# na raiz coffee-delivery-spa/
npm install
npm run dev

# validações após configurar os scripts
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
npm run test:e2e
```

No deploy: publicar a saída padrão de build do Vite (`dist/`) e configurar **fallback SPA** para `/checkout` e `/success` retornarem `index.html` em acesso direto. Consultas ViaCEP são feitas pelo navegador por HTTPS, sem segredo/API key. Em ambiente de rede restrita, o checkout deve exibir falha consultável e bloquear confirmação até validar o CEP.

### 11.4 Registro central de risco de dependências

**Exceção temporária ativa — GHSA-fc5q-39xc-vjpf / CVE-2026-112366:** em 2026-11-18 o responsável estendeu expressamente a aceitação de risco às tarefas subsequentes, exclusivamente para desenvolvimento local confiável. A exceção é vinculada ao advisory, ambiente, versões e exposição, não ao número da tarefa. A vulnerabilidade de ReDoS afeta `picomatch` em versões `<=4.0.7`; a versão instalada verificada é `4.0.7`. A cadeia atual inclui `vite@8.3.8` diretamente e via `tinyglobby`/`fdir`, `@vitejs/plugin-react@6.3.0` e `vitest@5.1.1`. Novos caminhos transitivos do mesmo advisory devem ser registrados, sem nova autorização ou bloqueio automático quando permanecerem nas mesmas condições e risco residual.

**Justificativa e risco residual:** não se identificou correção upstream publicada na investigação registrada em T002. O código atual não recebe padrões glob de usuário, mas a análise não comprovou ausência de caminhos exploráveis nos fluxos internos do Vite/Vitest. A falha pode causar indisponibilidade; a aceitação não significa correção ou eliminação do risco.

**Limites e medidas:** executar ferramentas somente em ambiente local confiável; Vite configurado por padrão em `127.0.0.1`, sem exposição pública, túneis ou proxies; não processar padrões glob não confiáveis. O host pode ser sobrescrito por argumentos e não deve ser exposto. Executar `npm audit` e `npm audit --omit=dev` ao alterar dependências e antes de deploy, registrando falhas e caminhos sem suprimir alertas. Não usar `npm audit fix --force`, desativar auditorias ou aplicar overrides inseguros.

**Fora da aceitação:** outros advisories, dependências de produção afetadas, exposição pública ou mudanças relevantes na gravidade ou explorabilidade. Nessas situações interromper a tarefa afetada e apresentar a diferença concreta para decisão. Se somente este advisory aceito permanecer e os demais critérios forem cumpridos, é possível concluir com ressalva. Reavaliar antes de deploy, em mudança relevante de exposição ou quando uma correção upstream for publicada; validar e aplicar a correção assim que possível. Esta exceção não aprova deploy e não altera os requisitos de segurança do produto.

## 12. Matriz de rastreabilidade RF e regras de negócio

| ID PRD | Implementação técnica principal | Evidência de aceite |
| --- | --- | --- |
| RF-01 | `data/coffees.ts`, `CoffeeCard`, `Home` | Campos e imagem na Home |
| RF-02 | `QuantityControl`, validação do reducer | Seleção inteira >=1 |
| RF-03 | `CartContext`, `ADD_ITEM` | Mesmo ID consolida |
| RF-04 | `unitCount`, `Header` | Soma de unidades |
| RF-05 | `INCREMENT_ITEM`, `DECREMENT_ITEM`, `REMOVE_ITEM` | Atualização imediata |
| RF-06 | `storageSchemas`, `useLocalStorage`, `CartProvider` | Carrinho válido após refresh |
| RF-07 | `App.tsx` + React Router | Navegação sem reload |
| RF-08 | `DeliveryAddressForm`, `useCepLookup`, ViaCEP, Zod | Auto-preenchimento e erros |
| RF-09 | `PaymentMethodSelector`, enum Zod | Exatamente uma forma |
| RF-10 | `money.ts`, `cartSelectors.ts`, `CartSummary` | Subtotal/frete/total corretos |
| RF-11 | Schema + verificação CEP/carrinho no submit | Bloqueio com erro acessível |
| RF-12 | `utils/order.ts`, `Success` | Resumo do snapshot |
| RF-13 | Persistência do `Order` + `CLEAR_CART` | Carrinho vazio, resumo intacto |
| RF-14 | `ThemeContext`, `styles/tokens.css`, aliases light/dark e storage | Tema em todas as rotas e refresh; contraste em ambos os temas |
| RF-15 | Estilos responsivos, escalas tipográficas, Phosphor Icons e testes 320 px | Jornada mobile completa, legível e acessível |
| RF-16 | Logo aprovada, Header, favicon, README; tokens de identidade do PRD §12 | Identidade visível/documentada, sem substituir logo faltante |

| ID PRD | Mecanismo de implementação |
| --- | --- |
| RN-01 | Guardas de quantidade e remoção em decremento para zero |
| RN-02 | Unicidade de `productId` no reducer/hidratação |
| RN-03 | `DELIVERY_FEE_CENTS = 500` centralizada |
| RN-04 | Inteiros em centavos, `formatBRL`, guardas de overflow |
| RN-05 | Pagamento enum sem captura/transação real |
| RN-06 | Storage separado para carrinho e snapshot do pedido |
| RN-07 | Validação local + consulta ViaCEP obrigatória e vigente |
| RN-08 | Catálogo local tipado, sem backend próprio |
| RN-09 | `EmptyState` para carrinho e confirmação ausente |
| RN-10 | Gate de submissão com validação do carrinho e formulário |

## 13. Critérios de conclusão técnica (Definition of Done)

1. RF-01 a RF-16 implementados, demonstráveis e testados; RN-01 a RN-10 respeitadas.
2. Todos os itens de catálogo, cores e composições são fiéis aos **ativos aprovados** e ao `coffee-delivery.pen`; quaisquer pendências visuais estão documentadas.
3. CEP validado com chamada **HTTP real** ao ViaCEP; sem consulta vigente bem-sucedida não se confirma pedido.
4. Nenhum produto desconhecido, quantidade inválida, carrinho vazio, campo obrigatório vazio ou pagamento não selecionado consegue gerar `Order`.
5. Frete de R$ 5,00 centralizado, cálculo em centavos, subtotal e contador consistentes.
6. Após confirmação, `Order` persistido é independente do carrinho, que é limpo; refresh em `/success` mantém resumo correto.
7. Tema persiste; layout é funcional a partir de 320 px; navegação por teclado e mensagens acessíveis.
8. Sem operações financeiras, autenticação ou backend próprio.
9. `typecheck`, `lint`, testes pertinentes e build passam; rotas são acessíveis diretamente no host configurado.
10. Logo original aprovada integra Header/favicon e tem documentação; **se o arquivo não foi disponibilizado, RF-16 permanece pendente** e não pode ser marcado como concluído.

## 14. Decisões fechadas, riscos e pendências

**Decisões fechadas (não alterar silenciosamente):** carrinho guarda somente ID e quantidade; reduzir 1→0 remove; frete fixo de R$ 5,00 quando houver itens; BRL em centavos; pagamento informativo; CEP atual obrigatoriamente consultado com sucesso; snapshot independente; rotas `/`, `/checkout`, `/success`; tema explícito prevalece sobre sistema; `coffee-delivery.pen` define o visual; pastas `docs/` reúnem os três SPECs.

**Riscos a tratar:** storage indisponível ou inconsistente, concorrência entre consultas de CEP, resposta ViaCEP incompleta, falhas de rede, refresh direto em rotas SPA, precisão/overflow de valores, acessibilidade de feedback dinâmico e divergência entre `.pen` e UI. Os testes das seções 7–11 cobrem esses riscos.

**Sincronização PRD v1.2:** 16 cores oficiais (6 de produto + 10 base), duas famílias e doze estilos tipográficos (5 títulos + 7 textos/controles), Phosphor Icons e regras de light/dark estão especificados em §10.1–10.1.2. No dark mode, valores adicionais continuam sujeitos à inspeção do `.pen` e validação visual.

**Pendências dependentes do repositório:** inspecionar a versão real do React Router/Tailwind/Zod instalada; conferir os frames e tokens de `coffee-delivery.pen`; identificar catálogo e imagens aprovados; encontrar logo final e ferramenta de IA realmente utilizada; confirmar configuração do host para fallback SPA. **Não presumir que arquivos, assets ou scripts existem sem verificação.**
