# PRD_SPEC — Coffee Delivery | Product Requirements Document

> **Versão:** 1.2  
> **Status:** Especificação para implementação  
> **Tipo:** Aplicação web frontend de catálogo e pedidos fictícios de cafés  
> **Stack de referência:** React + TypeScript + React Router  
> **Idioma e moeda:** pt-BR / BRL  
> **Fonte de verdade visual:** `coffee-delivery.pen` (arquivo oficial do projeto, na raiz do repositório). Este PRD define o comportamento e as regras de negócio; o `.pen` prevalece nas decisões visuais.

## 1. Visão geral, problema, objetivos e público-alvo

### 1.1 Contexto e problema

Em uma experiência de compra simulada de cafés, o usuário precisa encontrar produtos, escolher quantidades, acompanhar valores e finalizar o fluxo sem inconsistências. A ausência de estado compartilhado pode produzir carrinhos duplicados, totais incorretos e uma confirmação incompatível com o pedido. A digitação integral do endereço também aumenta a chance de erro.

**Solução proposta:** uma aplicação web de delivery fictício de cafés, com catálogo, carrinho persistente, consulta real a serviço público de CEP e confirmação informativa, sem operação financeira ou entrega real.

### 1.2 Visão do produto

Desenvolver uma aplicação web responsiva para descoberta de cafés, montagem de carrinho e simulação de checkout. O usuário deve conseguir escolher produtos e quantidades, informar o endereço com consulta obrigatória a uma API pública de CEP, selecionar uma forma de pagamento fictícia e visualizar a confirmação do pedido. A aplicação não realiza cobrança nem exige backend próprio.

### 1.3 Objetivos de produto

Oferecer um fluxo completo, intuitivo e acessível de compra simulada de cafés, preservando carrinho e preferência de tema entre atualizações da página e mantendo um registro independente do último pedido concluído para exibição na confirmação.

### 1.4 Público-alvo

Pessoas que desejam explorar um catálogo digital de cafés e experimentar um fluxo de compra simples, sem cadastro ou pagamento real. A interface deve atender usuários de desktop e celular, incluindo pessoas que navegam por teclado e com tecnologias assistivas.

### 1.5 Indicadores de sucesso e verificabilidade

- Concluir a jornada inteira sem recarregamento completo de página e sem autenticação.
- Nenhuma confirmação deve ocorrer com carrinho vazio, produto inválido, endereço não validado ou pagamento ausente.
- Carrinho, tema e último pedido confirmado mantêm o comportamento especificado após refresh.
- O resumo financeiro e o contador de unidades são consistentes em todos os estados.

## 2. Escopo, funcionalidades e exclusões

### 2.1 Escopo do MVP

**Incluído:** catálogo local tipado, seleção de quantidades, carrinho persistente, roteamento SPA, checkout com CEP via API pública, validação, resumo financeiro, confirmação fictícia, temas claro/escuro, responsividade, logo original e favicon.

**Fora do escopo:** autenticação, cadastro de clientes, pagamentos reais, estoque em tempo real, gestão administrativa, backend próprio, cálculo de frete por distância, consulta de histórico de múltiplos pedidos e envio real para estabelecimento.

### 2.2 Inclusões e exclusões

| Dentro do MVP | Fora do MVP |
| --- | --- |
| Catálogo local e seleção de quantidade | Login, cadastro e conta de usuário |
| Carrinho editável e persistente | Estoque em tempo real e painel administrativo |
| Checkout com consulta real de CEP | Backend próprio e banco de dados obrigatório |
| Escolha informativa de pagamento | Cobrança real, captura de cartão, PIX ou gateway |
| Total com frete fixo fictício | Cálculo de frete por distância, rastreamento e entrega real |
| Confirmação com snapshot | Histórico de múltiplos pedidos, notificações e envio ao estabelecimento |
| Modos claro e escuro e logo com IA | Produção automática de marca sem arquivo final aprovado |

## 3. Fluxos de usuário — Home → Carrinho/Checkout → Confirmação

**Usuário:** visitante que deseja selecionar cafés e simular um pedido sem cadastro.

**Jornada principal:** Home → escolher quantidade → adicionar ao carrinho → abrir Checkout → preencher CEP e endereço → escolher pagamento → conferir totais → confirmar pedido fictício → visualizar Confirmação.

**Jornadas alternativas:** atualizar a página e recuperar carrinho; editar/remover itens; alternar tema; corrigir CEP ou endereço; acessar Checkout vazio; acessar Confirmação sem pedido válido.

## 4. Regras de negócio (RN-01 a RN-10) e decisões consolidadas

| Decisão | Definição obrigatória |
| --- | --- |
| RN-01 — Quantidades | Adição exige número inteiro >= 1. No carrinho, reduzir de 1 para 0 **remove o item**. O botão de remoção também o elimina. |
| RN-02 — Produto único | Cada `productId` aparece no máximo uma vez no carrinho. Adições subsequentes somam unidades. |
| RN-03 — Entrega | **Taxa fixa fictícia de R$ 5,00 por pedido não vazio**, definida em uma única constante `DELIVERY_FEE_CENTS = 500`. Carrinho vazio: entrega e total são R$ 0,00. |
| RN-04 — Dinheiro | Valores de preços, frete e totais são armazenados/calculados em **centavos inteiros** e exibidos em `pt-BR`/`BRL` com duas casas decimais. |
| RN-05 — Pagamento | Crédito, débito ou dinheiro; seleção informativa, **sem processamento de pagamento**. |
| RN-06 — Persistência | Carrinho em `localStorage`; confirmação usa **snapshot independente**, também persistido para suportar refresh na tela de sucesso. |
| RN-07 — Endereço | CEP obrigatório com 8 dígitos; consulta pública obrigatória; número obrigatório; complemento opcional; demais campos obrigatórios com validações definidas na seção 7. |
| RN-08 — Dados | Catálogo pode ser um arquivo local TypeScript; não é exigido backend próprio. **Consulta HTTP ao serviço de CEP é obrigatória.** |
| RN-09 — Estados vazios | Carrinho vazio e ausência de pedido válido devem ter mensagens e ações orientadoras. |
| RN-10 — Confirmação | Bloquear pedidos com carrinho vazio, produto desconhecido, quantidade inválida, endereço inválido ou pagamento ausente. |

## 5. Requisitos funcionais (RF-01 a RF-16) e critérios verificáveis

| ID | Comportamento esperado | Critérios de aceite verificáveis |
| --- | --- | --- |
| RF-01 | Listar cafés com imagem, nome, descrição, preço e categoria/tag. | Todos os campos aparecem na Home; imagem possui texto alternativo; valores são formatados em BRL. |
| RF-02 | Selecionar quantidade antes de adicionar. | Controles incrementam/decrementam números inteiros; valor mínimo de adição é 1; entrada não aceita valores fracionários ou negativos. |
| RF-03 | Adicionar ao carrinho consolidando produtos iguais. | Mesma `productId` produz apenas uma linha e soma quantidades; produto diferente cria outra linha. |
| RF-04 | Mostrar contador no Header. | Contador = `sum(item.quantity)` e atualiza imediatamente em todas as telas. |
| RF-05 | Alterar e remover itens. | `+` aumenta; `−` diminui; de 1 para 0 remove; botão remover elimina; contador e totais são recalculados. |
| RF-06 | Persistir carrinho. | Refresh mantém produtos e quantidades válidos; dados corrompidos são tratados sem quebrar a aplicação. |
| RF-07 | Navegar com React Router. | Home, Checkout e Confirmação são rotas; navegação interna não gera recarregamento completo. |
| RF-08 | Validar endereço e consultar CEP. | CEP válido dispara consulta; campos disponíveis são preenchidos; número e complemento nunca são sobrescritos pela API; estados de loading, CEP inválido, não encontrado e indisponibilidade são tratados. |
| RF-09 | Selecionar forma de pagamento. | Apenas uma entre crédito/débito/dinheiro; escolha obrigatória antes de confirmar. |
| RF-10 | Mostrar subtotal, entrega e total. | Fórmulas usam centavos; taxa fixa centralizada; valores atualizam junto com carrinho. |
| RF-11 | Bloquear finalização inválida. | Carrinho vazio ou campos inválidos impedem confirmação; erros são exibidos junto aos campos e anunciáveis por leitores de tela. |
| RF-12 | Confirmar pedido fictício. | Tela exibe itens, quantidades, totais, endereço e pagamento correspondentes ao pedido fechado. |
| RF-13 | Limpar carrinho após confirmação. | Carrinho fica vazio; snapshot de confirmação permanece íntegro mesmo após refresh. |
| RF-14 | Alternar tema. | Light/dark aplicados a todas as telas; preferência persiste em `localStorage`. |
| RF-15 | Ser responsivo. | É possível concluir a jornada sem rolagem horizontal ou elementos inacessíveis a partir de 320 px de largura. |
| RF-16 | Usar logo original com apoio de IA. | Logo final fornecida/aprovada é integrada ao Header, favicon e seção de identidade visual da documentação; não inventar ativo não disponibilizado. |

## 6. Rotas e comportamento de navegação

| Rota | Tela | Comportamento |
| --- | --- | --- |
| `/` | Home | Catálogo, seleção de quantidade, ação de adicionar e acesso ao carrinho. |
| `/checkout` | Checkout | Lista/edição do carrinho, endereço, pagamento e resumo. Se vazio, mostrar estado vazio e impedir finalização. |
| `/success` | Confirmação | Exibir snapshot do último pedido válido. Se não existir, exibir estado vazio com link para Home. |
| `*` | Não encontrada | Mensagem amigável e link para Home. |

As transições devem ocorrer por React Router (`Link`, `NavLink`, `useNavigate`), sem navegação forçada por `window.location`. O usuário pode retornar à Home e continuar compras. A tela de Confirmação não deve reconstruir dados a partir do carrinho.

## 7. Catálogo e carrinho

### 6.1 Fonte de dados

Arquivo local tipado, por exemplo `src/data/coffees.ts`. Cada café possui identificador estável e único, nome, descrição, categoria/tags, URL/caminho de imagem e `priceCents` inteiro positivo. O conteúdo específico do catálogo (produtos, imagens, preços e categorias) deve corresponder aos ativos/design disponibilizados; **não inferir dados oficiais**.

### 6.2 Operações do carrinho

- `addItem(productId, quantity)`: valida produto existente e `quantity` inteiro >= 1; acumula quantidade se já presente.
- `incrementItem(productId)`: adiciona 1 ao item existente.
- `decrementItem(productId)`: subtrai 1; se o resultado for 0, remove o item.
- `removeItem(productId)`: exclui o item.
- `clearCart()`: remove todos os itens após confirmação bem-sucedida.

**Fonte de verdade:** guardar somente `productId` e `quantity` no carrinho; obter nome, imagem e preço atual no catálogo. Itens persistidos com produtos inexistentes ou quantidades inválidas devem ser descartados na hidratação e impedir confirmação enquanto não forem saneados.

### 6.3 Cálculos

```ts
const DELIVERY_FEE_CENTS = 500;

const subtotalCents = cart.reduce(
  (total, item) => total + catalogById[item.productId].priceCents * item.quantity,
  0,
);
const deliveryFeeCents = cart.length > 0 ? DELIVERY_FEE_CENTS : 0;
const totalCents = subtotalCents + deliveryFeeCents;

const formatBRL = (cents: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
```

Cálculos são derivados do estado do carrinho; não manter cópias independentes de subtotal/total no estado. A validação deve garantir inteiros seguros e prevenir overflow.

## 8. Checkout, endereço e API de CEP

### 7.1 Campos e validações

| Campo | Obrigatório | Validação e comportamento |
| --- | --- | --- |
| CEP | Sim | Aceitar `00000-000` ou 8 dígitos; normalizar removendo não dígitos e exigir **exatamente 8 dígitos** antes da consulta. CEP de formato válido ainda pode não existir. |
| Rua/logradouro | Sim | Texto não vazio após `trim`; preenchimento automático quando disponível; editável. |
| Número | Sim | Texto não vazio após `trim`; aceitar `S/N` quando aplicável; preenchimento manual. |
| Complemento | Não | Texto livre opcional; preenchimento manual. |
| Bairro | Sim | Texto não vazio após `trim`; preenchimento automático quando disponível; editável. |
| Cidade | Sim | Texto não vazio após `trim`; preenchimento automático quando disponível; editável. |
| UF | Sim | Sigla com exatamente duas letras; normalizar para maiúsculas; validar contra a lista oficial das 27 UFs brasileiras. |

A máscara visual de CEP é opcional, mas o valor normalizado deve ter oito dígitos. Não inventar rua/bairro quando a resposta não fornecer esses campos; permitir preenchimento/correção manual dos campos faltantes. Evitar sobrescrever número e complemento em qualquer consulta.

### 7.2 Integração HTTP obrigatória

Serviço de referência: **ViaCEP**, `GET https://viacep.com.br/ws/{cep}/json/`, com `{cep}` normalizado de 8 dígitos. Exemplos de condições:

1. **CEP incompleto/inválido:** não chamar API; mostrar validação local.
2. **Consultando:** exibir indicador de progresso, desabilitar consultas repetidas e evitar respostas antigas (por exemplo, usando `AbortController` ou identificador da última requisição).
3. **Encontrado:** preencher automaticamente `logradouro`, `bairro`, `localidade` → cidade e `uf` quando presentes; preservar campos editáveis manuais e permitir ajustes.
4. **Não encontrado:** tratar `erro: true`, limpar dados automáticos obsoletos do CEP anterior e informar que o CEP não foi localizado.
5. **Falha de rede, indisponibilidade ou formato inesperado:** apresentar mensagem e opção de tentar novamente; não exibir dados do CEP anterior como se fossem resultado do novo CEP.

**Regra de segurança de fluxo:** a API de CEP é obrigatória. Antes da confirmação, deve existir **uma consulta bem-sucedida para o CEP atualmente informado**. Se o CEP mudar, a consulta anterior perde validade e uma nova consulta deve ser feita. Campos ausentes na resposta podem ser preenchidos manualmente. Em caso de falha ou indisponibilidade, permitir edição do endereço e nova tentativa, mas **não concluir enquanto a verificação do CEP atual não ocorrer com sucesso**. Isso mantém o requisito obrigatório de integração sem simular uma consulta bem-sucedida.

Evitar expor chaves ou dados pessoais em logs. ViaCEP não exige API key para este uso.

### 7.3 Pagamento

Campo único com alternativas `credit`, `debit`, `cash`, exibidas como **Cartão de crédito**, **Cartão de débito** e **Dinheiro**. A seleção é obrigatória, exclusivamente informativa e não deve solicitar números de cartão, código de segurança nem efetuar transação.

### 7.4 Finalização

Ao clicar em **Confirmar pedido**:

1. Revalidar carrinho e produtos existentes, quantidade, CEP consultado, endereço e pagamento.
2. Em caso de erro, permanecer no checkout, indicar o campo/ação e orientar o usuário.
3. Em caso de sucesso, gerar identificador local (por exemplo, `crypto.randomUUID()`), data/hora de criação e **snapshot imutável** com detalhes de itens, endereço, pagamento, subtotal, frete e total.
4. Persistir o snapshot **antes** de limpar o carrinho; em seguida limpar o carrinho e navegar para `/success`.
5. Evitar confirmações duplicadas com bloqueio de duplo clique durante a operação.

A confirmação é uma **simulação**; a interface deve deixar claro que nenhum pagamento/pedido real foi realizado.

## 9. Modelo de dados proposto (TypeScript)

```ts
type PaymentMethod = 'credit' | 'debit' | 'cash';
type Theme = 'light' | 'dark';

type Coffee = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  priceCents: number;
};

type CartItem = {
  productId: string;
  quantity: number;
};

type Address = {
  cep: string; // Somente 8 dígitos
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  uf: string;
};

type OrderItemSnapshot = {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  lineTotalCents: number;
};

type CompletedOrder = {
  id: string;
  createdAt: string; // ISO 8601
  items: OrderItemSnapshot[];
  address: Address;
  paymentMethod: PaymentMethod;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
};
```

O snapshot contém nome e preço dos produtos no momento da confirmação, portanto permanece correto mesmo que o catálogo ou o carrinho mudem posteriormente.

## 10. Persistência local

| Chave sugerida | Valor | Regra |
| --- | --- | --- |
| `coffee:cart:v1` | `CartItem[]` | Salvar a cada mudança válida; recuperar ao iniciar; validar formato e IDs. |
| `coffee:theme:v1` | `'light' \| 'dark'` | Restaurar preferência; sem preferência, usar `prefers-color-scheme` como padrão inicial. |
| `coffee:last-order:v1` | `CompletedOrder` | Salvar em confirmação; consultar em `/success`; manter após limpar o carrinho. |

Encapsular acesso ao `localStorage` em `try/catch` para lidar com armazenamento desabilitado, quota ou JSON inválido. Em falha, aplicação continua funcional em memória e fornece feedback quando a persistência não puder ser garantida. Não persistir dados de cartão (não existem no fluxo).

## 11. UI, UX e acessibilidade

- **Home:** Header com logo, botão de tema e contador de unidades; cards de café com controles e CTA identificável.
- **Checkout:** lista editável de produtos, formulário de endereço, seleção de pagamento e resumo financeiro; botão de confirmação condicionado ao estado válido (com explicação dos erros).
- **Confirmação:** mensagem de pedido fictício, identificador, itens, totais, endereço, pagamento e botão para voltar à Home.
- **Estados:** loading e erros da consulta de CEP; carrinho vazio; confirmação indisponível; feedback de item adicionado; falha de armazenamento.
- **Acessibilidade:** HTML semântico, `label` para inputs, estados de foco visíveis, contraste adequado aos dois temas, botões com nomes acessíveis, associação de erros via `aria-describedby`, `aria-invalid` e mensagens dinâmicas com `role="status"`/`role="alert"` quando apropriado; controles operáveis por teclado.
- **Responsividade:** mobile-first; sem overflow horizontal a partir de 320 px; grids e colunas refluem; campos e ações com áreas de toque confortáveis; header e resumo utilizáveis no celular.
- **Temas:** tokens semânticos (fundo, superfície, texto, borda, ação e feedback) para garantir cobertura de todos os componentes; evitar cores fixas que quebrem no modo escuro.
- **Transições:** animações discretas, sem bloquear navegação e respeitando `prefers-reduced-motion`.

## 12. Identidade visual, design system, logo com IA e temas (RF-14 e RF-16)

**Referência mandatória:** `coffee-delivery.pen`, localizado na raiz de `coffee-delivery-spa/`. A implementação deve seguir fielmente seus frames e componentes; as imagens de referência fornecidas detalham a paleta, a tipografia e a biblioteca de ícones. Em conflitos: o PRD determina comportamento e regras de negócio; o `.pen` determina aparência, disposição e tratamento visual. Não inventar elementos visuais que contradigam o arquivo oficial.

### 12.1 Paleta de cores — tokens oficiais

**Produto / cores de marca** (nomes e códigos preservados exatamente da referência):

| Token original | Hexadecimal | Descrição |
| --- | --- | --- |
| `yellow-dark` | `#C47F17` | Amarelo escuro |
| `yellow` | `#DBAC2C` | Amarelo |
| `yellow-light` | `#F1E9C9` | Amarelo claro |
| `purple-dark` | `#4B2995` | Roxo escuro |
| `purple` | `#8047F8` | Roxo |
| `purple-light` | `#EBE5F9` | Roxo claro |

**Base / superfícies e textos:**

| Token original | Hexadecimal | Descrição |
| --- | --- | --- |
| `base-title` | `#272221` | Títulos |
| `base-subtitle` | `#403937` | Subtítulos |
| `base-text` | `#574F4D` | Texto principal |
| `base-label` | `#8D8686` | Rótulos e textos auxiliares |
| `base-hover` | `#D7D5D5` | Superfície de hover |
| `base-button` | `#E6E5E5` | Superfícies de botões neutros |
| `base-input` | `#EDEDED` | Superfícies de inputs |
| `base-card` | `#F3F2F2` | Superfícies de cards |
| `background` | `#FAFAFA` | Fundo principal claro |
| `white` | `#FFFFFF` | Branco |

**Diretrizes de uso:**

- Centralizar os códigos em tokens reutilizáveis (CSS custom properties e/ou tema Tailwind), sem duplicar hexadecimais entre componentes.
- Preservar os nomes dos tokens originais; criar aliases semânticos (por exemplo, `--color-surface`, `--color-text-primary`) que apontem para os tokens, facilitando o suporte aos temas.
- Aplicar cada cor conforme os estados/componentes desenhados no `coffee-delivery.pen`; não assumir que uma cor de marca seja apropriada para todo texto, ação ou fundo.
- Estados de foco, erro e sucesso devem ter contraste e semântica adequados. A imagem não especifica tokens próprios de erro/sucesso; defini-los na implementação com base na acessibilidade e na aparência oficial, registrando eventuais complementos no `TECH_SPEC.md`.

### 12.2 Tipografia — famílias, escalas e pesos

**Famílias oficiais:** `Baloo 2` para títulos; `Roboto` para corpo de texto, etiquetas, tags e botões. Ambas podem ser obtidas pelo Google Fonts, com alternativa local/fallback apropriada.

**Escala de títulos — Baloo 2:**

| Token tipográfico | Tamanho | Line-height | Peso |
| --- | --- | --- | --- |
| `Title XL` | `48px` | `130%` | ExtraBold (800) |
| `Title L` | `32px` | `130%` | ExtraBold (800) |
| `Title M` | `24px` | `130%` | ExtraBold (800) |
| `Title S` | `20px` | `130%` | Bold (700) |
| `Title XS` | `18px` | `130%` | Bold (700) |

**Escala de textos e controles — Roboto:**

| Token tipográfico | Tamanho | Line-height | Peso |
| --- | --- | --- | --- |
| `Text L` | `20px` | `130%` | Regular (400) ou Bold (700) |
| `Text M` | `16px` | `130%` | Regular (400) ou Bold (700) |
| `Text S` | `14px` | `130%` | Regular (400) |
| `Text XS` | `12px` | `130%` | Bold (700) |
| `Tag` | `10px` | `130%` | Bold (700) |
| `Button G` | `14px` | `160%` | Bold (700) |
| `Button M` | `12px` | `160%` | Regular (400) |

**Diretrizes de tipografia:**

- Usar as escalas oficiais como estilos reutilizáveis; manter a hierarquia de títulos e semântica HTML (`h1`, `h2` etc.) independente da escolha de tamanho visual.
- Carregar os pesos efetivamente usados: Baloo 2 (700/800) e Roboto (400/700).
- Respeitar zoom do navegador, redimensionamento de texto e ausência de cortes em mobile. Para ajustes responsivos, usar variantes documentadas sem descaracterizar o `.pen`.
- `Tag` de 10px é um token visual da referência, não uma autorização para texto ilegível; verificar legibilidade e ampliar quando necessário para atender acessibilidade.

### 12.3 Ícones — biblioteca oficial

**Biblioteca:** [Phosphor Icons](https://phosphoricons.com/). Utilizar o pacote React oficial (`@phosphor-icons/react`, conforme compatibilidade da stack definida no `TECH_SPEC.md`). Não misturar outras bibliotecas de ícones sem justificativa.

A imagem apresenta, da esquerda para a direita, referências visuais para os seguintes conceitos:

| Conceito / ícone visual | Uso potencial (quando previsto no `.pen`) |
| --- | --- |
| Localização preenchida | Indicador de endereço/localização |
| Localização contornada | Localização secundária |
| Lixeira | Remover item do carrinho |
| Cifrão (`$`) | Representação de valor/pagamento |
| Carrinho de compras | Carrinho e contador no Header |
| Cronômetro | Tempo ou informação de entrega fictícia |
| Pacote/caixa | Pedido/produtos |
| Xícara de café | Categoria/identidade do café |
| Mais (`+`) | Incrementar quantidade |
| Menos (`−`) | Decrementar quantidade |
| Cartão | Crédito ou débito |
| Cédula | Dinheiro |
| Edifício bancário | Instituição/forma de pagamento, se constar no design |

**Regra:** utilizar ícones equivalentes visualmente no Phosphor, com variante de peso (`regular`, `fill` etc.), tamanho e cor guiados pelo `coffee-delivery.pen`. A tabela identifica conceitos visíveis, não fixa nomes de componentes da biblioteca nem obriga o uso de todos eles. Ícones puramente decorativos devem ser ocultados para tecnologias assistivas; botões só de ícone exigem nome acessível (`aria-label`) e foco visível.

### 12.4 Light mode e dark mode (RF-14)

- A paleta acima corresponde à **referência visual clara** enviada. Ela deve ser usada no light mode respeitando o arquivo `.pen`.
- O dark mode é obrigatório, mas **a referência não fornece uma paleta escura completa**. Não apresentar valores inventados como tokens oficiais do design. Definir os aliases semânticos de modo escuro no `TECH_SPEC.md` e verificar contraste e fidelidade ao tema caso existam frames escuros em `coffee-delivery.pen`.
- A alternância deve funcionar nas rotas Home, Checkout e Confirmação, persistindo a preferência em `localStorage`; na ausência de preferência salva, respeitar o tema do sistema.
- Verificar estados normal, hover, focus, disabled, erro, loading e seleção em ambos os temas; não inverter indiscriminadamente imagens de produtos ou o logo.

### 12.5 Logo original desenvolvida com auxílio de IA (RF-16)

Aplicar **somente o arquivo final da logo original** desenvolvido/aprovado para o projeto com auxílio de IA. Usá-lo no Header e produzir favicon apropriado a partir do ativo autorizado. Documentar em README ou `docs/brand.md`: nome da marca, conceito da logo, paleta/tipografia oficiais, local dos arquivos, ferramenta de IA utilizada e a finalidade de seu uso (quando essas informações forem fornecidas). Não atribuir autoria/ferramenta específica sem evidência. Se o ativo não estiver presente no repositório, manter pendência explícita; não substituir silenciosamente por logo genérica.

### 12.6 Critérios verificáveis do design system

- Todas as 16 cores são declaradas com os códigos hexadecimais indicados e usadas por tokens/aliases consistentes.
- As escalas de Baloo 2 e Roboto reproduzem tamanhos, line-height e pesos da referência nos elementos correspondentes.
- Os ícones visíveis nas telas seguem a linguagem visual do Phosphor Icons.
- Componentes mantêm legibilidade, contraste e interação por teclado nos dois temas.
- As telas correspondem ao `coffee-delivery.pen` e funcionam de 320px em diante sem perda de conteúdo ou ações.

## 13. Arquitetura e organização sugeridas

```text
coffee-delivery-spa/
├── coffee-delivery.pen       # Fonte de verdade visual oficial
├── public/
├── src/
│   ├── assets/              # Logo criada com IA e imagens
│   ├── components/          # UI reutilizável
│   ├── pages/               # Home, Checkout, Success
│   ├── contexts/            # CartProvider e ThemeProvider
│   ├── reducers/            # Ações e atualização imutável
│   ├── hooks/               # useCart, useTheme, useLocalStorage...
│   ├── data/                # Catálogo de cafés
│   ├── types/               # Tipos/interfaces
│   ├── schemas/             # Zod do checkout
│   ├── utils/               # Formatação e cálculos
│   ├── styles/              # Temas/tokens/estilos
│   ├── tests/               # Testes automatizados
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   ├── PRD_SPEC.md
│   ├── TECH_SPEC.md
│   └── TASKS_SPEC.md
├── AGENTS.md
└── README.md
```

Esta estrutura é a referência organizacional para o projeto. Priorizar Context API + `useReducer`, tipagem estrita, componentes reutilizáveis e separação entre UI, estado, regras de negócio e integrações externas. O `TECH_SPEC.md` detalha as decisões técnicas; o `TASKS_SPEC.md` distribui as tarefas; `AGENTS.md` orienta os agentes; `coffee-delivery.pen` prevalece como fonte visual. Não introduzir backend, autenticação ou biblioteca de estado pesada sem necessidade.

## 14. Testes e cenários de aceite

| Cenário | Resultado esperado |
| --- | --- |
| Adicionar 2 unidades do mesmo café e depois mais 3 | Uma linha com quantidade 5; Header conta 5. |
| Adicionar cafés distintos com quantidades 2 e 3 | Header conta 5 (não 2); subtotal soma os cinco produtos corretamente. |
| Tentar adicionar 0, número negativo ou decimal | Operação bloqueada; estado preservado. |
| Diminuir item com quantidade 1 | Item removido; contador e totais atualizados. |
| Atualizar página com carrinho preenchido | Itens válidos e quantidades reaparecem. |
| Carregar `localStorage` com JSON inválido | App abre sem crash; dados inválidos ignorados de maneira segura. |
| Usar CEP encontrado | Rua, bairro, cidade e UF preenchidos conforme resposta, quando disponíveis. |
| CEP com menos/mais de 8 dígitos | Erro local; sem chamada à API. |
| API retornar `erro: true` | Erro de CEP não encontrado; bloqueio de confirmação. |
| API ficar indisponível | Erro e opção de tentar novamente; não confirmar sem consulta válida. |
| Alterar CEP após consulta válida | Invalidar resultado anterior e exigir nova consulta. |
| API não retornar logradouro ou bairro | Campos faltantes podem ser preenchidos manualmente após consulta bem-sucedida. |
| Deixar número vazio ou pagamento não escolhido | Impedir confirmação e destacar erro correspondente. |
| Confirmar com carrinho vazio | Impedir finalização e mostrar orientação para adicionar cafés. |
| Concluir pedido com carrinho e formulário válidos | Criar snapshot, limpar carrinho, abrir `/success` com endereço e pagamento corretos. |
| Atualizar `/success` após concluir | Resumo permanece correto e contador do carrinho permanece zerado. |
| Abrir `/success` sem snapshot | Mostrar estado vazio com link para Home; não inventar pedido. |
| Alternar tema e atualizar página | Tema escolhido permanece e vale para todas as rotas. |
| Executar fluxo em viewport de 320 px | Navegação, carrinho, formulário e confirmação continuam utilizáveis sem scroll horizontal. |
| Navegar e operar formulário somente com teclado | Controles acessíveis, foco visível e feedback de erro compreensível. |

### 14.1 Prioridade de testes automatizados

**Unitários:** reducer/operações do carrinho; cálculos em centavos; formatação monetária; validadores de CEP/UF/endereço; serialização e hidratação do storage.

**Integração:** mock HTTP do ViaCEP incluindo sucesso, não encontrado, falha e concorrência entre consultas; validação de checkout; criação de snapshot.

**E2E (recomendado):** compra simulada completa; refresh do carrinho; refresh da confirmação; tema; fluxo mobile.

## 15. Requisitos não funcionais

| ID | Dimensão | Critério verificável |
| --- | --- | --- |
| RNF-01 | Acessibilidade | Navegação por teclado, foco visível, labels adequados, contraste legível em ambos os temas e erros de formulário associados aos campos. Referência: WCAG 2.2 nível AA onde aplicável. |
| RNF-02 | Responsividade | Jornada completa em viewport de 320 px de largura ou superior, sem scroll horizontal causado pelo layout e sem perda de ações essenciais. |
| RNF-03 | Desempenho | Home e carrinho são utilizáveis sem aguardar resposta do CEP; atualizações de quantidade/total ocorrem na interação sem recarregamento completo. |
| RNF-04 | Persistência | Carrinho e tema são restaurados após refresh; pedido confirmado mantém resumo íntegro e independente do carrinho. |
| RNF-05 | Compatibilidade | Funciona nas versões estáveis atuais de Chrome, Edge, Firefox e Safari, em desktop e navegadores móveis modernos, com fallback de armazenamento. |
| RNF-06 | Confiabilidade | Falhas de rede, payload incorreto do CEP e dados inválidos no armazenamento não provocam tela em branco; o usuário recebe orientação. |
| RNF-07 | Segurança e privacidade | Nenhum dado sensível de cartão é coletado; respostas da API e storage são validados; não há cobrança nem envio de pedido real. |
| RNF-08 | Manutenibilidade | Catálogo tipado, regras monetárias centralizadas e separação de UI, estado e integrações externas. |

- Aplicação sem backend próprio, com chamada de rede somente para consulta de CEP e carregamento de recursos quando aplicável.
- Navegação SPA fluida, componentes reutilizáveis e ausência de erros no console em cenários normais.
- Resiliência a respostas lentas e falhas da API pública; não depender da API para renderizar Home e carrinho.
- Segurança básica: não usar `dangerouslySetInnerHTML` com dados externos; validar conteúdo do storage e respostas HTTP; não armazenar informações de pagamento sensíveis.
- Compatibilidade com navegadores modernos em desktop e mobile.

## 16. Critérios de aceite gerais e Definition of Done (DoD)

A entrega será considerada concluída somente quando:

1. Todos os RF-01 a RF-16 forem implementados e os critérios de aceite atendidos.
2. As regras RN-01 a RN-10 e decisões explícitas desta especificação forem respeitadas.
3. A consulta HTTP real a uma API pública de CEP funcionar, inclusive casos de erro e loading.
4. Subtotal, taxa de entrega e total estiverem corretos em centavos e em BRL.
5. Carrinho e tema persistirem; snapshot do pedido sobreviver a refresh e permanecer independente do carrinho.
6. Um pedido inválido não puder ser confirmado; a confirmação for claramente identificada como fictícia.
7. Todo o fluxo funcionar em desktop e mobile, com operação por teclado e feedback acessível.
8. O design system (cores, tipografia e Phosphor Icons) seguir as referências visuais e o `coffee-delivery.pen`, e a logo final aprovada estiver no Header, favicon e documentação; caso não seja fornecida, registrar essa pendência e não afirmar que RF-16 foi concluído.
9. Build de produção e testes definidos para o projeto executarem sem falhas impeditivas.

## 17. Decisões de produto e pendências de insumos

### 17.1 Decisões fechadas para implementação

- **Frete:** R$ 5,00 por pedido com itens; frete zero no carrinho vazio; constante única em centavos.
- **Quantidade mínima:** 1 ao adicionar; reduzir de 1 para 0 remove o item.
- **Forma de pagamento:** uma das três opções obrigatórias; informativa, sem cobrança.
- **CEP:** consulta real bem-sucedida para o CEP atual é obrigatória antes da confirmação; campos ausentes na resposta podem ser editados manualmente.
- **Pedido concluído:** snapshot próprio persistido, não derivado do carrinho após finalização.
- **Rotas:** `/`, `/checkout` e `/success`; carrinho exibido e editado no checkout.
- **Tema inicial:** preferência salva; na ausência, preferência do sistema.
- **Dados do catálogo e visual oficial:** devem vir dos ativos disponibilizados e de `coffee-delivery.pen`, sem invenção de produtos ou logotipo oficiais; aplicar os tokens da seção 12.

### 17.2 Pendências de insumos

- **Identidade da marca:** nome definitivo, arquivo original da logo e informações de criação com IA.
- **Catálogo definitivo:** nomes, descrições, preços, categorias e imagens oficiais dos cafés.
- **Design visual:** `coffee-delivery.pen` é a referência obrigatória; caso não esteja acessível no repositório, registrar bloqueio de fidelidade visual. A paleta clara, tipografia e ícones estão especificados na seção 12; tokens escuros adicionais dependem dos frames do arquivo ou de decisão técnica documentada.

Esses materiais devem ser incorporados quando disponibilizados sem alterar as regras funcionais aqui estabelecidas.
