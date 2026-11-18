# TASKS_SPEC — Coffee Delivery SPA | Plano de implementação

> **Versão:** 1.0 | **Status:** Plano em execução; consultar os registros de cada tarefa.  
> **Base normativa:** [`PRD_SPEC.md`](./PRD_SPEC.md) v1.2 e [`TECH_SPEC.md`](./TECH_SPEC.md) v1.1.  
> **Fonte de verdade visual:** `../coffee-delivery.pen` (na raiz do repositório).  
> **Local esperado:** `coffee-delivery-spa/docs/TASKS_SPEC.md`.  
> **Objetivo:** executar o MVP em pequenas entregas verificáveis, com teste, evidência e commit semântico a cada conclusão.

## 1. Instruções obrigatórias de execução

1. **Inspecionar antes de alterar:** verificar código, ativos, scripts e `coffee-delivery.pen`; não recriar funcionalidades existentes nem presumir artefatos disponíveis.
2. **Executar por ordem:** seguir T001 → T043. Caso uma tarefa dependa de ativo ausente, marcar `BLOQUEADA`, registrar motivo e continuar apenas em tarefas realmente independentes. Nunca marcar como concluída por conveniência.
3. **Uma tarefa por entrega verificável:** implementar apenas o objetivo descrito, testar, registrar evidência, fazer commit semântico e só então marcar `[x]` com status `CONCLUÍDA`.
4. **Não executar commits fictícios:** a sugestão de mensagem não é evidência de commit. Registrar hash real somente após `git commit` bem-sucedido. Se repositório Git não estiver disponível, deixar `PENDENTE`.
5. **Critério mínimo para finalizar cada tarefa:** critério de pronto atendido; teste específico executado; `npm run typecheck` e `npm run lint` quando scripts existirem; alterações revisadas; commit real criado. Não declarar testes aprovados sem executá-los.
6. **Respeitar a precedência por domínio:** PRD para negócio; `.pen` para visual; TECH para implementação; TASKS para sequência; `AGENTS.md` para conduta do agente sem contrariar os demais.
7. **Escopo fechado:** SPA frontend, catálogo local, React + TypeScript + Vite + Tailwind, Context API + reducer, React Router, Zod + RHF, Phosphor Icons; sem backend próprio, pagamento real ou autenticação.
8. **Estabilidade do fluxo:** não confirmar pedidos com carrinho vazio, produto inválido, formulário inválido ou consulta ViaCEP não bem-sucedida para o CEP atual. Snapshot do último pedido deve ser salvo antes de limpar o carrinho.

**Legenda:** `[ ] PENDENTE` (não iniciado), `[ ] EM ANDAMENTO` (execução em curso), `[ ] BLOQUEADA` (dependência impeditiva), `[x] CONCLUÍDA` (implementado, testado, registrado e commitado). Nunca usar `[x]` antes do cumprimento integral do DoD. Os comandos citados são metas do TECH; se scripts não existirem, configurá-los antes de executá-los.

**Modelo de registro após cada tarefa** (substituir campos, sem inventar resultados):

```text
ID: T0XX
Status: CONCLUÍDA | EM ANDAMENTO | BLOQUEADA | PENDENTE
Data: AAAA-MM-DD
Arquivos alterados: ...
Teste executado: <comando, cenário ou inspeção visual>
Resultado: PASSOU | FALHOU | NÃO EXECUTADO
Evidência: <trecho do log, screenshot, referência ao teste ou explicação objetiva>
Commit: <hash real> — <tipo>: <mensagem>
Bloqueios/observações: ...
```

**Tipos de commit:** `feat:` funcionalidade; `fix:` correção; `docs:` documentação; `test:` testes; `refactor:` reorganização sem alterar comportamento; `style:` aparência/estilos. Para setup, ferramentas e deploy, `chore:` também é recomendado pela convenção semântica; caso o projeto aceite estritamente apenas os seis tipos exigidos, usar `refactor:` para configuração técnica ou `docs:` para documentação, conforme a alteração, sem mascarar o conteúdo.

## 2. Checklist sequencial de implementação

As tarefas começam **PENDENTES**; o estado atual e as evidências constam nos blocos e no histórico.

### Fase 0 — Preparação e referências

#### [x] T001 — Auditar repositório, SPECs e design

- **Status:** `CONCLUÍDA`.
- **Objetivo:** Identificar estrutura atual, scripts, dependências, ativos e telas do `coffee-delivery.pen`; registrar lacunas sem inventar insumos.
- **Requisitos relacionados:** RF-01, RF-15, RF-16; RNF-01, RNF-02.
- **Arquivos afetados:** `coffee-delivery.pen`, `docs/PRD_SPEC.md`, `docs/TECH_SPEC.md`, `docs/TASKS_SPEC.md`, `AGENTS.md`.
- **Critério de pronto:** Inventário de telas, componentes, breakpoints e pendências documentado; referências conflitantes sinalizadas.
- **Teste a realizar:** Revisar manualmente o inventário contra o `.pen` e documentos.
- **Commit sugerido:** `docs: auditar referencias e pendencias do projeto`.
- **Registro de execução:** revisão manual pelo Pencil e conferência dos SPECs e do repositório `PASSOU` · evidência: inventário e decisões abaixo · commit `7fddbe4b2c53741196464b8bfcb7882f8b990720` — `docs: auditar referencias e pendencias do projeto` · data `2026-11-18`.

**Inventário visual e técnico — T001**

- O Pencil abriu `coffee-delivery.pen` sem modificá-lo. Frames desktop de 1440 px: Home (`ecpPI`, 1440 × 2293), Checkout (`xyxIT`, 1440 × 1013), Checkout preenchido (`Z4ZKW1`, 1440 × 1013) e Success (`L5Ov0b`, 1440 × 1013).
- Home: navbar com marca, localização e carrinho; hero com título, texto, quatro benefícios e área de imagem; catálogo em quatro colunas com 14 cards, tags, descrição, preço, quantidade e botão de carrinho. Checkout: duas colunas, formulário de endereço e pagamento à esquerda, itens editáveis, resumo e confirmação à direita. Success: cabeçalho, mensagem, quadro de informações e ilustração à direita.
- Prancha de componentes: botão primário, secundário e de ícone em estados padrão/hover; carrinho vazio/cheio; seletor padrão/hover/selecionado; campo textual vazio/preenchido e ativo; controle numérico padrão/hover; card de catálogo e linha de carrinho. Não há componentes reutilizáveis registrados na integração nem variáveis globais.
- A prancha explicita as 16 cores do PRD, os 12 estilos de Baloo 2 e Roboto e Phosphor Icons. A conferência textual dos nomes e valores coincide com PRD §12. Não há frames de tela mobile ou dark identificados, nem breakpoints explícitos: desktop é a referência; adaptações desde 320 px devem preservar a identidade. Em dark mode aplicar TECH §10.1 e registrar aliases técnicos não oficiais e sua validação.
- Na auditoria inicial, as imagens de produtos e hero apareciam quadriculadas na renderização Pencil. Atualização de 2026-11-18: a prancha `Imagens` agora renderiza 14 imagens de cafés, referenciadas como `image.png` e `image-1.png` a `image-13.png`; os arquivos correspondentes estão presentes na raiz, ainda não rastreados pelo Git. A Home, o hero e o Checkout ainda apresentam áreas quadriculadas; a referência `cafe-expresso-tradicional.png` continua sem arquivo correspondente encontrado. Os 14 nomes, descrições e preços constam no desenho; a correspondência e aprovação dos ativos definitivos devem ser verificadas em T005/T021.
- A marca vetorial aparece nos frames, mas não há comprovação de aprovação como logo original criada com auxílio de IA, arquivo independente aprovado ou informação da ferramenta. T010 e RF-16 dependem desses insumos; não substituir a marca.
- Divergência de negócio: Checkout desenha frete de R$ 3,50 e total de R$ 33,20. Decisão do responsável: RN-03 prevalece, com R$ 5,00 para carrinho não vazio e R$ 0,00 para vazio; recalcular totais reais.
- Decisão do responsável: textos que sugiram entrega ou rastreamento reais devem ser ajustados futuramente para deixar clara a simulação. A Success desenhada não exibe itens, quantidades e totais exigidos pelo RF-12; incluí-los futuramente preservando a identidade visual. Campos desenhados como opcionais não alteram a obrigatoriedade do PRD.
- Repositório na inspeção: branch `main` sem commits, `origin/main` indicado como ausente, cinco arquivos de projeto não rastreados e índice vazio. Não existem `package.json`, lockfile, `src/`, README ou assets independentes. Node `v24.11.1` e `npm.cmd` `11.6.2` disponíveis; `git.exe` funciona por caminho absoluto, embora `git` não esteja no PATH do shell.
- Limitações: não há aplicação ou scripts para testes de build, lint ou typecheck; não se verificou fidelidade de uma implementação, acessibilidade efetiva ou comportamento mobile. Host e configuração de deploy ainda não foram definidos. T002–T043 não foram executadas nesta auditoria.

#### [ ] T002 — Preparar projeto Vite e TypeScript

- **Status:** `EM ANDAMENTO` — critérios funcionais verificados; fechamento e commit pendentes.
- **Objetivo:** Criar ou ajustar aplicação React/Vite/TypeScript estrito respeitando repositório preexistente.
- **Requisitos relacionados:** RF-07; RNF-05.
- **Arquivos afetados:** `package.json`, `package-lock.json`, `index.html`, `tsconfig.json`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`.
- **Critério de pronto:** Aplicação inicial executa em desenvolvimento; verificação TypeScript e build de base passam.
- **Teste a realizar:** Executar `npm install`, `npm run dev`, `npm run build` e `npm run typecheck` (após criar script).
- **Commit sugerido:** `chore: preparar base react vite typescript`.
- **Registro de execução:** `2026-11-18` · `npm install`: PASSOU, com 5 alertas altos; `npm run dev -- --host 127.0.0.1`: PASSOU, HTTP 200 e entrada Vite presente; `npm run typecheck`: PASSOU; `npm run build`: PASSOU; `npm audit`: FALHOU, 5 alertas altos associados a `picomatch` via Vite/fdir/tinyglobby; `npm audit --omit=dev`: PASSOU, 0 vulnerabilidades. O audit sugere `--force` com downgrade incompatível de Vite; não aplicado. Lint não configurado nesta etapa. Commit: NÃO REALIZADO, aguardando resolução da vulnerabilidade.
- **Investigação complementar:** `npm audit --json` identificou o advisory [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf), ReDoS no `picomatch` `<=4.0.7`; os cinco registros são `picomatch`, `fdir`, `tinyglobby`, `vite` e `@vitejs/plugin-react`. `npm ls vite rollup picomatch` e `npm explain picomatch` confirmaram `picomatch@4.0.7` nas dependências de desenvolvimento do Vite 8.3.8; Rollup não consta na árvore atual. O advisory informa que não existe versão corrigida, e o registro oficial npm aponta `4.0.7` como última versão estável. `npm audit fix --dry-run` não aplicou correção compatível. Em simulação isolada, Vite 6.2.7 com `@vitejs/plugin-react` 5.2.0 apresentou outro alerta alto em Vite, incluindo GHSA-p9ff-h696-f583 e GHSA-587h-7wmj-h5pm; Vite 6.4.6 volta a depender de `picomatch`. Não se aplicou downgrade nem override. `typecheck` e `build`: PASSOU; auditoria completa: FALHOU; `audit --omit=dev`: PASSOU. Aguardar correção upstream ou decisão aprovada sobre outra solução verificável.
- **Avaliação de exceção temporária, 2026-11-18 — NÃO APROVADA:** GHSA-fc5q-39xc-vjpf / CVE-2026-112366 pode causar negação de serviço por processamento de glob malicioso; `picomatch@4.0.7` é usado pelo `vite@8.3.8` diretamente e via `tinyglobby`/`fdir`, repercutindo em `@vitejs/plugin-react@6.3.0`. O código atual de `src/` não usa glob, entrada de usuário ou `picomatch`; o Vite usa a biblioteca internamente, por exemplo para padrões configurados em `optimizeDeps.include` e `server.fs.deny`. A análise não demonstrou um caminho de entrada externa até glob vulnerável, mas tampouco comprovou sua inexistência em todos os fluxos internos; não há teste exaustivo nem confirmação de ausência de exploração acessível ao usuário. O responsável autorizou avaliar, não aceitar automaticamente diante dessa incerteza.
- **Mitigações e revisão:** `npm run dev` sem argumentos usa o padrão `localhost`; no teste, HTTP 200 e `netstat` mostrou `[::1]:5173` em escuta. Evitar `--host` público, proxies/túneis e padrões glob de origem não confiável; loopback não é barreira contra todos os processos ou acessos locais. Isso reduz exposição, mas não corrige o defeito. Reavaliar quando houver versão upstream corrigida, evidência suficiente sobre os caminhos de entrada, ou decisão expressa após análise adicional; repetir auditorias antes de concluir T002.
- **Verificações repetidas:** `npm run typecheck` PASSOU; `npm run build` PASSOU; `npm audit` FALHOU com 5 registros altos; `npm audit --omit=dev` PASSOU com 0 vulnerabilidades. Servidor de desenvolvimento padrão iniciou e respondeu HTTP 200; encerrado após o teste. Sem script `lint`. T002 continua bloqueada, sem commit; nenhuma exceção foi aprovada e o advisory não foi suprimido.
- **Nova avaliação solicitada, 2026-11-18:** sem mudança nas dependências nem evidência adicional que elimine a incerteza dos fluxos internos. Nova execução: `typecheck` e `build` PASSARAM; `npm audit` FALHOU com os mesmos 5 registros altos; `npm audit --omit=dev` PASSOU com 0 vulnerabilidades; servidor padrão respondeu HTTP 200 e escutou em `[::1]:5173`, sendo encerrado após o teste. Mantida a decisão de não aprovar exceção automaticamente diante da incerteza previamente identificada; T002 permanece bloqueada e sem commit.
- **Decisão posterior do responsável, 2026-11-18 — exceção temporária aceita exclusivamente para desenvolvimento local:** autorizada explicitamente a aceitação limitada do risco residual de [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) / CVE-2026-112366, sem declarar a vulnerabilidade corrigida ou a ausência de exploração comprovada. A exceção é uma decisão processual específica para conclusão da T002, não altera os requisitos de segurança do PRD nem aprova deploy ou outros ambientes.
- **Escopo e justificativa:** `picomatch@4.0.7`, afetado pelo advisory em versões `<=4.0.7`, é dependência de desenvolvimento do `vite@8.3.8`, diretamente e via `tinyglobby`/`fdir`, com reflexo em `@vitejs/plugin-react@6.3.0`. O impacto possível é negação de serviço por glob malicioso. O código atual da aplicação não recebe glob não confiável, mas não se comprovou imunidade ou ausência de caminhos exploráveis nos fluxos internos do Vite; loopback reduz exposição sem impedir acessos locais. Nenhuma correção upstream compatível foi identificada na investigação anterior. O responsável aceita esse risco residual para possibilitar apenas o desenvolvimento local.
- **Restrições e encerramento da exceção:** `vite.config.ts` fixa o host padrão em `127.0.0.1`; não sobrescrever para interfaces públicas, nem usar túneis ou proxies, nem introduzir padrões glob não confiáveis. A opção de linha de comando pode sobrescrever essa configuração e não deve ser usada para expor o servidor. Manter `npm audit` ativo e não ocultar a falha. Monitorar o advisory e substituir a exceção por correção publicada assim que validada. Antes de qualquer deploy, reavaliar a vulnerabilidade, o ambiente de build e dependências de produção; esta aceitação não autoriza publicação.
- **Verificação da configuração local, 2026-11-18:** `npm run dev` PASSOU, com `netstat` indicando `127.0.0.1:5173` e requisição HTTP retornando 200 com entrada `/src/main.tsx`; processo encerrado após o teste. `npm run typecheck` e `npm run build` PASSARAM; `npm audit` FALHOU com 5 registros altos; `npm audit --omit=dev` PASSOU com 0 vulnerabilidades. `lint` ainda não configurado. Nenhuma versão foi alterada nem o advisory suprimido.

#### [ ] T003 — Instalar dependências e configurar ferramentas

- **Status:** `PENDENTE`.
- **Objetivo:** Configurar Router, Tailwind, Phosphor, React Hook Form, Zod, resolvers, Vitest, Testing Library, MSW e Playwright sem versões incompatíveis.
- **Requisitos relacionados:** RF-07–RF-16; RNF-05.
- **Arquivos afetados:** `package.json`, `package-lock.json`, `vite.config.ts`, configurações de teste.
- **Critério de pronto:** Pacotes e scripts essenciais instalados; setup de teste funcional e documentado.
- **Teste a realizar:** Executar instalação, lint/typecheck/testes de fumaça.
- **Commit sugerido:** `chore: configurar dependencias e qualidade`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T004 — Definir lint, formatação e convenções

- **Status:** `PENDENTE`.
- **Objetivo:** Ativar ESLint/Prettier, aliases quando necessários e regras de importação/componentização.
- **Requisitos relacionados:** RF-01–RF-16; RNF-05.
- **Arquivos afetados:** `eslint.config.*`, `.prettierrc*`, `tsconfig.json`, `AGENTS.md`, `package.json`.
- **Critério de pronto:** Comandos `lint`, `format` e `typecheck` definidos e aprovados na base.
- **Teste a realizar:** Executar `npm run lint`, `npm run typecheck` e verificação de formatação.
- **Commit sugerido:** `chore: padronizar lint formatacao e tipos`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T005 — Definir catálogo e ativos autorizados

- **Status:** `PENDENTE`.
- **Objetivo:** Localizar imagens, nomes, preços e tags aprovados; criar arquivo local tipado sem inventar conteúdo final.
- **Requisitos relacionados:** RF-01, RF-16; RN-08.
- **Arquivos afetados:** `src/data/coffees.ts`, `src/assets/`, `src/types/coffee.ts`.
- **Critério de pronto:** Itens têm IDs únicos, preços em centavos e links de imagens válidos; pendências explícitas.
- **Teste a realizar:** Validar IDs únicos, números inteiros seguros e renderização básica de imagens.
- **Commit sugerido:** `feat: estruturar catalogo tipado de cafes`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

### Fase 1 — Design system e fundação visual

#### [ ] T006 — Implementar tokens oficiais de cores

- **Status:** `PENDENTE`.
- **Objetivo:** Centralizar os 16 tokens HEX do PRD (6 produto e 10 base), sem cores arbitrárias espalhadas.
- **Requisitos relacionados:** RF-14, RF-15, RF-16; RNF-01, RNF-02.
- **Arquivos afetados:** `src/styles/tokens.css`, `src/styles/globals.css`.
- **Critério de pronto:** Todos os 16 tokens coincidem com PRD §12.1; classes/aliases semânticos utilizáveis.
- **Teste a realizar:** Comparar HEX declarados aos valores do PRD e verificar CSS aplicado.
- **Commit sugerido:** `style: definir paleta e tokens oficiais`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T007 — Implementar escala tipográfica

- **Status:** `PENDENTE`.
- **Objetivo:** Integrar Baloo 2 (títulos) e Roboto (textos), pesos, line-height e tamanhos oficiais.
- **Requisitos relacionados:** RF-01, RF-15, RF-16; RNF-01, RNF-02.
- **Arquivos afetados:** `src/styles/typography.css`, `src/styles/globals.css`, `index.html`.
- **Critério de pronto:** 12 estilos oficiais documentados e aplicáveis; fallback legível; sem cortes com zoom.
- **Teste a realizar:** Verificar 5 estilos de título e 7 estilos de texto/controle contra PRD §12.2.
- **Commit sugerido:** `style: implementar tipografia oficial`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T008 — Configurar Tailwind, reset e breakpoints

- **Status:** `PENDENTE`.
- **Objetivo:** Habilitar Tailwind com tokens CSS semânticos; mapear responsividade conforme `.pen`, começando em 320px.
- **Requisitos relacionados:** RF-14, RF-15; RNF-01, RNF-02.
- **Arquivos afetados:** `src/styles/globals.css`, `src/styles/tokens.css`, `src/App.tsx`.
- **Critério de pronto:** Classes funcionam, layout base não causa rolagem horizontal a 320px; sem breakpoints inventados como oficiais.
- **Teste a realizar:** Inspecionar viewport 320px/desktop e CSS compilado.
- **Commit sugerido:** `style: configurar tailwind e base responsiva`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T009 — Definir iconografia Phosphor

- **Status:** `PENDENTE`.
- **Objetivo:** Mapear nomes reais dos ícones disponíveis, pesos, tamanho, foco e rótulos acessíveis.
- **Requisitos relacionados:** RF-15, RF-16; RNF-01.
- **Arquivos afetados:** `src/components/`, `docs/TECH_SPEC.md` (se mapeamento técnico necessário).
- **Critério de pronto:** Ícones da UI usam somente `@phosphor-icons/react` e seguem `.pen`; ícones interativos acessíveis.
- **Teste a realizar:** Inspecionar ícones do design e verificar `aria-label` e foco em botões.
- **Commit sugerido:** `style: padronizar icones phosphor`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T010 — Integrar logo, favicon e documentação da marca

- **Status:** `PENDENTE`.
- **Objetivo:** Usar logo original aprovada; gerar favicon a partir dela e registrar uso real de IA sem atribuições presumidas.
- **Requisitos relacionados:** RF-16; RNF-02.
- **Arquivos afetados:** `src/assets/`, `public/`, `index.html`, `README.md`, `docs/brand.md` (opcional).
- **Critério de pronto:** Logo final em Header/ativo e favicon; marca documentada; se ativo ausente, tarefa bloqueada, nunca simulada.
- **Teste a realizar:** Conferir assets reais, favicon no navegador e aderência ao `.pen`.
- **Commit sugerido:** `feat: integrar identidade e favicon`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

### Fase 2 — Domínio, carrinho e persistência

#### [ ] T011 — Criar contratos e tipos de domínio

- **Status:** `PENDENTE`.
- **Objetivo:** Implementar `Coffee`, `CartItem`, `DeliveryAddress`, `PaymentMethod`, `Order` e snapshot de itens conforme TECH §5.
- **Requisitos relacionados:** RF-01–RF-13; RN-01–RN-10.
- **Arquivos afetados:** `src/types/coffee.ts`, `src/types/cart.ts`, `src/types/checkout.ts`, `src/types/order.ts`.
- **Critério de pronto:** Tipos consistentes, `priceCents` inteiro, sem `any` nem duplicação de modelo.
- **Teste a realizar:** Executar `npm run typecheck` e revisão de contratos contra TECH §5.
- **Commit sugerido:** `feat: definir contratos de dominio`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T012 — Criar utilitário monetário e frete

- **Status:** `PENDENTE`.
- **Objetivo:** Estabelecer `DELIVERY_FEE_CENTS = 500`, subtotal e total em centavos; vazio sem frete.
- **Requisitos relacionados:** RF-10; RN-03, RN-04.
- **Arquivos afetados:** `src/utils/money.ts`, `src/tests/money.test.ts`.
- **Critério de pronto:** Formatação BRL correta; sem float monetário nas operações; erro para overflow.
- **Teste a realizar:** Testar soma de itens, frete R$ 5,00, total, vazio e limites inteiros.
- **Commit sugerido:** `feat: centralizar calculos monetarios`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T013 — Implementar reducer puro do carrinho

- **Status:** `PENDENTE`.
- **Objetivo:** Criar ações `ADD_ITEM`, `INCREMENT_ITEM`, `DECREMENT_ITEM`, `REMOVE_ITEM`, `CLEAR_CART` e guardas de IDs/quantidades.
- **Requisitos relacionados:** RF-02, RF-03, RF-05; RN-01, RN-02, RN-10.
- **Arquivos afetados:** `src/reducers/cartReducer.ts`, `src/tests/cartReducer.test.ts`.
- **Critério de pronto:** Adicionar IDs iguais consolida; quantidade inválida é rejeitada; decrementar 1→0 remove.
- **Teste a realizar:** Testar ações, unicidade, limites inteiros e imutabilidade.
- **Commit sugerido:** `feat: implementar reducer de carrinho`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T014 — Implementar seletores derivados

- **Status:** `PENDENTE`.
- **Objetivo:** Calcular total de unidades, subtotal, frete e total sem duplicar valores no estado.
- **Requisitos relacionados:** RF-04, RF-10; RN-03, RN-04.
- **Arquivos afetados:** `src/utils/cartSelectors.ts`, `src/tests/money.test.ts`.
- **Critério de pronto:** Contagem soma quantidades e não tipos; cálculos seguros após sanitização.
- **Teste a realizar:** Testar carrinhos com múltiplas quantidades, vazio e IDs inválidos.
- **Commit sugerido:** `feat: criar seletores de carrinho`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T015 — Implementar persistência segura e schemas

- **Status:** `PENDENTE`.
- **Objetivo:** Criar leitor/escritor protegido por try/catch, versões de keys e validação Zod para storage.
- **Requisitos relacionados:** RF-06, RF-13, RF-14; RN-06, RN-10.
- **Arquivos afetados:** `src/hooks/useLocalStorage.ts`, `src/schemas/storageSchemas.ts`, `src/tests/storage.test.ts`.
- **Critério de pronto:** Storage corrompido não quebra app; IDs e quantidades inválidos não entram no domínio; fallback em memória sinalizado.
- **Teste a realizar:** Simular JSON inválido, quota, storage bloqueado, entradas duplicadas e refresh.
- **Commit sugerido:** `feat: criar persistencia validada`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T016 — Integrar CartContext e hook useCart

- **Status:** `PENDENTE`.
- **Objetivo:** Conectar reducer, seletores, hidratação inicial anterior à primeira escrita e operações públicas.
- **Requisitos relacionados:** RF-03–RF-06, RF-10; RN-01–RN-04, RN-06.
- **Arquivos afetados:** `src/contexts/CartContext.tsx`, `src/hooks/useCart.ts`, `src/main.tsx`.
- **Critério de pronto:** Componentes podem ler/alterar carrinho; refresh recupera itens; não apaga storage na montagem.
- **Teste a realizar:** Teste integrado de adicionar, atualizar página e ler contagem/subtotal.
- **Commit sugerido:** `feat: integrar provider do carrinho`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

### Fase 3 — Navegação e Home

#### [ ] T017 — Configurar SPA Router e layout global

- **Status:** `PENDENTE`.
- **Objetivo:** Criar rotas `/`, `/checkout`, `/success`, fallback 404 e providers.
- **Requisitos relacionados:** RF-07; RN-09.
- **Arquivos afetados:** `src/App.tsx`, `src/main.tsx`, `src/pages/NotFound.tsx`.
- **Critério de pronto:** Navegação interna sem refresh; rotas desconhecidas têm estado apropriado.
- **Teste a realizar:** Testar troca de rotas e retorno Home.
- **Commit sugerido:** `feat: estruturar rotas da aplicacao`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T018 — Construir Header e badge de carrinho

- **Status:** `PENDENTE`.
- **Objetivo:** Aplicar logo autorizada, navegação e contagem dinâmica de unidades.
- **Requisitos relacionados:** RF-04, RF-07, RF-16.
- **Arquivos afetados:** `src/components/Header.tsx`, `src/App.tsx`.
- **Critério de pronto:** Contador exibe soma das quantidades e atualiza em todas as telas.
- **Teste a realizar:** Adicionar 2 de A + 3 de B e verificar badge 5; testar navegação.
- **Commit sugerido:** `feat: criar header e contador de itens`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T019 — Criar controle de quantidade acessível

- **Status:** `PENDENTE`.
- **Objetivo:** Botões +/- e leitura de quantidade com mínimo de 1 antes de adicionar.
- **Requisitos relacionados:** RF-02; RN-01; RNF-01.
- **Arquivos afetados:** `src/components/QuantityControl.tsx`.
- **Critério de pronto:** Nunca permite adicionar zero, negativo, fração ou valor fora do intervalo.
- **Teste a realizar:** Testar teclado, cliques e limite mínimo.
- **Commit sugerido:** `feat: criar seletor de quantidade`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T020 — Construir CoffeeCard reutilizável

- **Status:** `PENDENTE`.
- **Objetivo:** Exibir foto, título, descrição, preço, categoria/tag e ação de adicionar.
- **Requisitos relacionados:** RF-01, RF-02, RF-03; RN-08.
- **Arquivos afetados:** `src/components/CoffeeCard.tsx`, `src/components/FeedbackMessage.tsx`.
- **Critério de pronto:** Card segue `.pen` e adiciona a quantidade selecionada; feedback acessível após ação.
- **Teste a realizar:** Testar render de propriedades, CTA e atualização de carrinho.
- **Commit sugerido:** `feat: implementar card de cafe`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T021 — Montar Home responsiva

- **Status:** `PENDENTE`.
- **Objetivo:** Compor hero/catálogo e grid conforme frames aprovados, sem inventar conteúdo.
- **Requisitos relacionados:** RF-01, RF-07, RF-15; RNF-02.
- **Arquivos afetados:** `src/pages/Home.tsx`, `src/components/CoffeeCard.tsx`.
- **Critério de pronto:** Catálogo completo presente; layout sem cortes em mobile e desktop conforme `.pen`.
- **Teste a realizar:** Conferir catálogo e comparar com `.pen` em 320px e desktop.
- **Commit sugerido:** `feat: construir pagina inicial`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

### Fase 4 — Carrinho e checkout

#### [ ] T022 — Implementar linhas de carrinho

- **Status:** `PENDENTE`.
- **Objetivo:** Criar `CartItemRow` com preço, quantidade, aumento, diminuição e remoção.
- **Requisitos relacionados:** RF-05; RN-01, RN-02.
- **Arquivos afetados:** `src/components/CartItemRow.tsx`.
- **Critério de pronto:** Todas as ações atualizam UI e não geram linhas duplicadas.
- **Teste a realizar:** Alterar de 2→1→remoção; comparar seletores e badge.
- **Commit sugerido:** `feat: permitir editar itens do carrinho`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T023 — Construir resumo financeiro e estado vazio

- **Status:** `PENDENTE`.
- **Objetivo:** Exibir subtotal, frete e total derivados; carrinho vazio com CTA de retorno.
- **Requisitos relacionados:** RF-10, RF-11; RN-03, RN-04, RN-09.
- **Arquivos afetados:** `src/components/CartSummary.tsx`, `src/components/EmptyState.tsx`.
- **Critério de pronto:** R$ 5,00 de frete somente com itens; carrinho vazio sem finalização.
- **Teste a realizar:** Testar valor com 1 e múltiplos itens e estado vazio.
- **Commit sugerido:** `feat: criar resumo e estados vazios`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T024 — Construir schema Zod do endereço

- **Status:** `PENDENTE`.
- **Objetivo:** Validar CEP, rua, número, bairro, cidade, UF e complemento opcional; pagamento separado ou integrado.
- **Requisitos relacionados:** RF-08, RF-09, RF-11; RN-07, RN-10.
- **Arquivos afetados:** `src/schemas/checkoutSchema.ts`, `src/tests/checkout.test.tsx`.
- **Critério de pronto:** Campos obrigatórios e formatos seguem PRD; erros por campo; complemento opcional.
- **Teste a realizar:** Testar CEP com menos de 8 dígitos, UF incorreta, campos vazios e complemento omitido.
- **Commit sugerido:** `feat: validar dados de checkout com zod`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T025 — Criar serviço e hook de ViaCEP

- **Status:** `PENDENTE`.
- **Objetivo:** Consultar `https://viacep.com.br/ws/{cep}/json/`, normalizar CEP, controlar loading, erro e resposta obsoleta.
- **Requisitos relacionados:** RF-08; RN-07, RN-08.
- **Arquivos afetados:** `src/utils/cep.ts`, `src/hooks/useCepLookup.ts`, `src/tests/cep.test.ts`.
- **Critério de pronto:** CEP válido retorna dados; `erro: true` e falha de rede tratados; abortar/ignorar requisições antigas.
- **Teste a realizar:** MSW: sucesso, parcial, não encontrado, indisponível e troca rápida de CEP.
- **Commit sugerido:** `feat: integrar consulta de cep viacep`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T026 — Construir formulário de endereço

- **Status:** `PENDENTE`.
- **Objetivo:** Integrar RHF/Zod com ViaCEP, autopreenchimento disponível, campos manuais e correção.
- **Requisitos relacionados:** RF-08, RF-11; RN-07.
- **Arquivos afetados:** `src/components/DeliveryAddressForm.tsx`, `src/tests/checkout.test.tsx`.
- **Critério de pronto:** Rua/bairro/cidade/UF auto preenchidos quando disponíveis; número/complemento não são sobrescritos.
- **Teste a realizar:** Testar respostas parciais, digitação manual, loading e mensagens acessíveis.
- **Commit sugerido:** `feat: construir formulario de entrega`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T027 — Construir seletor de pagamento

- **Status:** `PENDENTE`.
- **Objetivo:** Exigir exatamente crédito, débito ou dinheiro, sem coletar cartão nem realizar transação.
- **Requisitos relacionados:** RF-09; RN-05.
- **Arquivos afetados:** `src/components/PaymentMethodSelector.tsx`, `src/tests/checkout.test.tsx`.
- **Critério de pronto:** Uma opção obrigatória e identificável no pedido; sem integração com gateway.
- **Teste a realizar:** Testar sem seleção, cada opção e navegação via teclado.
- **Commit sugerido:** `feat: implementar escolha ficticia de pagamento`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T028 — Montar tela de Checkout

- **Status:** `PENDENTE`.
- **Objetivo:** Integrar linhas, valores, endereço, pagamento, estados e responsividade.
- **Requisitos relacionados:** RF-05, RF-08–RF-11, RF-15; RN-03, RN-07, RN-09.
- **Arquivos afetados:** `src/pages/Checkout.tsx`, `src/components/CartItemRow.tsx`, `src/components/CartSummary.tsx`.
- **Critério de pronto:** Todos os componentes visíveis conforme `.pen`; bloqueio de carrinho vazio.
- **Teste a realizar:** Percorrer checkout no desktop e 320px; testar carrinho vazio e formulário.
- **Commit sugerido:** `feat: integrar tela de checkout`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T029 — Aplicar gate de confirmação

- **Status:** `PENDENTE`.
- **Objetivo:** Na submissão, verificar itens existentes, valores seguros, formulário válido e consulta bem-sucedida do CEP atual.
- **Requisitos relacionados:** RF-08, RF-11; RN-07, RN-10.
- **Arquivos afetados:** `src/pages/Checkout.tsx`, `src/utils/order.ts`, `src/tests/checkout.test.tsx`.
- **Critério de pronto:** Não confirma sem CEP atual verificado, com carrinho inválido, vazio ou pagamento ausente; erros acessíveis.
- **Teste a realizar:** Testar mudança de CEP após consulta, item inexistente, duplo clique e campos inválidos.
- **Commit sugerido:** `feat: bloquear confirmacao invalida`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

### Fase 5 — Pedido e confirmação

#### [ ] T030 — Criar snapshot imutável de pedido

- **Status:** `PENDENTE`.
- **Objetivo:** Montar `Order` com ID, data, itens (nome/preço no momento), endereço, pagamento e totais.
- **Requisitos relacionados:** RF-12, RF-13; RN-05, RN-06.
- **Arquivos afetados:** `src/utils/order.ts`, `src/types/order.ts`.
- **Critério de pronto:** Snapshot não depende de carrinho nem de futuras alterações no catálogo.
- **Teste a realizar:** Testar que edição/limpeza de carrinho não modifica snapshot.
- **Commit sugerido:** `feat: criar snapshot de pedido`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T031 — Persistir pedido antes de limpar carrinho

- **Status:** `PENDENTE`.
- **Objetivo:** Gravar `coffee:last-order:v1` de forma síncrona e validada; limpar carrinho somente em sucesso; evitar duplo submit.
- **Requisitos relacionados:** RF-12, RF-13; RN-06, RN-10.
- **Arquivos afetados:** `src/pages/Checkout.tsx`, `src/schemas/storageSchemas.ts`, `src/tests/storage.test.ts`.
- **Critério de pronto:** Falha de gravação mantém carrinho e mostra erro; sucesso limpa uma vez e navega.
- **Teste a realizar:** Simular `setItem` falhando, duas submissões e refresh após compra.
- **Commit sugerido:** `feat: garantir integridade na confirmacao`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T032 — Construir Success e ausência de pedido

- **Status:** `PENDENTE`.
- **Objetivo:** Exibir endereço, forma de pagamento e detalhes a partir de snapshot persistido; estado vazio se ausente.
- **Requisitos relacionados:** RF-12, RF-13; RN-06, RN-09.
- **Arquivos afetados:** `src/pages/Success.tsx`, `src/components/EmptyState.tsx`.
- **Critério de pronto:** Success funciona após refresh com pedido; sem snapshot válido mostra orientação para Home.
- **Teste a realizar:** Acessar `/success` diretamente com e sem pedido e atualizar a página.
- **Commit sugerido:** `feat: implementar pagina de confirmacao`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

### Fase 6 — Tema, acabamento e acessibilidade

#### [ ] T033 — Criar ThemeContext e alternância persistida

- **Status:** `PENDENTE`.
- **Objetivo:** Preferência local light/dark com fallback inicial para sistema e persistência.
- **Requisitos relacionados:** RF-14; RNF-04.
- **Arquivos afetados:** `src/contexts/ThemeContext.tsx`, `src/hooks/useTheme.ts`, `src/components/ThemeToggle.tsx`.
- **Critério de pronto:** Tema persiste em todas as rotas e refresh; opção explícita prevalece sobre SO.
- **Teste a realizar:** Alternar, navegar e atualizar; simular preferência do SO sem storage.
- **Commit sugerido:** `feat: implementar alternancia de tema`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T034 — Mapear aliases e tema escuro

- **Status:** `PENDENTE`.
- **Objetivo:** Usar tokens semânticos em dark mode, verificando frames escuros no `.pen`, contraste e ausência de falsa paleta oficial.
- **Requisitos relacionados:** RF-14, RF-15; RNF-01, RNF-02.
- **Arquivos afetados:** `src/styles/tokens.css`, `src/styles/globals.css`, `src/components/`.
- **Critério de pronto:** Todos os componentes legíveis em ambos os temas; cores não especificadas são documentadas como decisões técnicas.
- **Teste a realizar:** Inspecionar todas as rotas em light/dark e verificar contraste.
- **Commit sugerido:** `style: aplicar dark mode acessivel`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T035 — Revisar responsividade ponta a ponta

- **Status:** `PENDENTE`.
- **Objetivo:** Ajustar Header, cards, formulário, resumo e confirmação a partir de 320px conforme `.pen`.
- **Requisitos relacionados:** RF-15; RNF-02.
- **Arquivos afetados:** `src/components/`, `src/pages/`, `src/styles/`.
- **Critério de pronto:** Fluxo inteiro utilizável sem perda de informação, clique inacessível ou overflow lateral.
- **Teste a realizar:** Testar 320px, tablet e desktop, rolagem e controles touch.
- **Commit sugerido:** `style: refinar layouts responsivos`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T036 — Revisar acessibilidade e feedback

- **Status:** `PENDENTE`.
- **Objetivo:** Checar semântica, foco, rótulos, erros, anúncios dinâmicos, contraste e redução de movimento.
- **Requisitos relacionados:** RF-08, RF-11, RF-14, RF-15; RNF-01.
- **Arquivos afetados:** `src/components/`, `src/pages/`, `src/styles/`.
- **Critério de pronto:** Fluxos acessíveis ao teclado; erros associados aos campos e feedback anunciado adequadamente.
- **Teste a realizar:** Executar navegação por teclado, zoom 200%, reduced motion e revisão de contraste.
- **Commit sugerido:** `fix: melhorar acessibilidade do fluxo`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

### Fase 7 — Testes e entrega

#### [ ] T037 — Completar testes unitários e integração

- **Status:** `PENDENTE`.
- **Objetivo:** Cobrir reducer, storage, cálculos, Zod, ViaCEP e submissão.
- **Requisitos relacionados:** RF-02–RF-14; RN-01–RN-10.
- **Arquivos afetados:** `src/tests/`, configuração Vitest/MSW.
- **Critério de pronto:** Cenários positivos/negativos automatizados e estáveis; sem requisições externas nos testes isolados.
- **Teste a realizar:** Executar `npm run test` e anexar resumo do resultado ao checklist.
- **Commit sugerido:** `test: cobrir dominio e checkout`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T038 — Automatizar jornada E2E

- **Status:** `PENDENTE`.
- **Objetivo:** Testar Home→Checkout→Success, persistência, tema, rota direta e falhas com Playwright.
- **Requisitos relacionados:** RF-01–RF-15; RN-01–RN-10.
- **Arquivos afetados:** `e2e/`, `playwright.config.ts`, `package.json`.
- **Critério de pronto:** Jornada principal e rotas de erro passam em viewport desktop/mobile com ViaCEP interceptado.
- **Teste a realizar:** Executar `npm run test:e2e` com navegador configurado.
- **Commit sugerido:** `test: automatizar jornada principal`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T039 — Validar integração ViaCEP real

- **Status:** `PENDENTE`.
- **Objetivo:** Executar ao menos uma consulta HTTP real no navegador com CEP público válido e checar CORS/HTTPS.
- **Requisitos relacionados:** RF-08, RF-11; RN-07, RN-08.
- **Arquivos afetados:** `src/hooks/useCepLookup.ts`, `docs/TASKS_SPEC.md`.
- **Critério de pronto:** Consulta real comprovada; falhas tratadas; CEP atual obrigatório no envio.
- **Teste a realizar:** Registrar data, ambiente, CEP público usado e resposta/resultado sem dados pessoais.
- **Commit sugerido:** `test: validar integracao real via cep`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T040 — Executar revisão visual e qualidade final

- **Status:** `PENDENTE`.
- **Objetivo:** Comparar frames `.pen`, tokens HEX, escalas, Phosphor, logo e temas; executar gates de qualidade.
- **Requisitos relacionados:** RF-01, RF-14–RF-16; RNF-01–RNF-08.
- **Arquivos afetados:** `src/`, `public/`, `docs/TASKS_SPEC.md`.
- **Critério de pronto:** Sem divergências não justificadas; `typecheck`, `lint`, `test`, `build` e E2E passam; pendências registradas.
- **Teste a realizar:** Registrar saídas dos comandos e checklist visual desktop/mobile.
- **Commit sugerido:** `test: validar qualidade e fidelidade visual`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T041 — Preparar README e instruções de operação

- **Status:** `PENDENTE`.
- **Objetivo:** Documentar instalação, scripts, arquivos de referência, frete, fake checkout, limitações e marca.
- **Requisitos relacionados:** RF-07, RF-08, RF-16; RN-03, RN-05, RN-08.
- **Arquivos afetados:** `README.md`, `docs/brand.md` (se existir).
- **Critério de pronto:** Novo desenvolvedor consegue instalar, executar, testar e compreender limitações sem suposições.
- **Teste a realizar:** Seguir README em ambiente limpo e verificar links/caminhos.
- **Commit sugerido:** `docs: documentar instalacao e arquitetura`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T042 — Realizar deploy SPA e smoke test

- **Status:** `PENDENTE`.
- **Objetivo:** Publicar `dist/` em host estático e configurar fallback `index.html` para rotas internas.
- **Requisitos relacionados:** RF-07, RF-08, RF-12–RF-15; RN-07.
- **Arquivos afetados:** `README.md`, configuração de hospedagem (`vercel.json` ou equivalente, se necessária).
- **Critério de pronto:** Home, Checkout e Success acessíveis por URL direta; refresh preserva dados válidos; HTTPS e consulta real funcionam.
- **Teste a realizar:** Abrir rotas diretas no domínio implantado; testar refresh, storage, CEP, fluxo e mobile.
- **Commit sugerido:** `chore: configurar deploy da spa`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

#### [ ] T043 — Fechar rastreabilidade e aceite final

- **Status:** `PENDENTE`.
- **Objetivo:** Conferir RF-01–16, RN-01–10, RNF-01–08, DoD e evidências; não aprovar tarefas bloqueadas.
- **Requisitos relacionados:** RF-01–RF-16; RN-01–RN-10; RNF-01–RNF-08.
- **Arquivos afetados:** `docs/TASKS_SPEC.md`, `docs/PRD_SPEC.md`, `docs/TECH_SPEC.md`.
- **Critério de pronto:** Checklist e matriz mostram cobertura, testes, commits e todas as pendências; nada marcado sem evidência.
- **Teste a realizar:** Executar verificação final de requisitos e revisão do histórico de commits.
- **Commit sugerido:** `docs: consolidar aceite e rastreabilidade`.
- **Registro de execução:** teste `NÃO EXECUTADO` · evidência `—` · commit `—` · data `—`.

## 3. Gates de qualidade por marco

| Marco | Ao final de | Comprovação obrigatória |
| --- | --- | --- |
| Base executável | T005 | Instalação, execução, build, typecheck, lint e catálogo validado conforme ativos disponíveis. |
| Design system | T010 | Tokens/HEX e escalas oficiais, ícones Phosphor, análise do `.pen`; logo ausente = bloqueio explícito em T010. |
| Domínio e dados | T016 | Reducer e seletores, storage saneado e hidratação correta; testes unitários pertinentes. |
| Navegação e Home | T021 | Home com itens autorizados, contador e rotas; inspeção mobile/desktop. |
| Checkout | T029 | CEP atual verificado, Zod, pagamento fictício, carrinho válido, frete correto e erros acessíveis. |
| Pedido confirmado | T032 | Snapshot salvo antes do clear; refresh `/success` mantém pedido; falha de storage preserva carrinho. |
| Acessibilidade e temas | T036 | Light/dark, responsividade ≥320px, teclado, foco, zoom, contraste e feedback. |
| Entrega | T043 | Testes completos, consulta real ViaCEP, build, deploy, fallback SPA e matriz de requisitos conferida. |

## 4. Matriz de rastreabilidade — requisitos funcionais

| Requisito | Tarefas principais |
| --- | --- |
| RF-01 — Catálogo | T005, T011, T020, T021, T040 |
| RF-02 — Quantidade antes da adição | T013, T019, T020, T037 |
| RF-03 — Adicionar/consolidar | T013, T016, T020, T037 |
| RF-04 — Contador de unidades | T014, T016, T018, T037 |
| RF-05 — Atualizar/remover | T013, T016, T022, T037 |
| RF-06 — Persistência do carrinho | T015, T016, T037, T038 |
| RF-07 — Rotas SPA | T017, T018, T038, T042 |
| RF-08 — Endereço e API CEP | T024, T025, T026, T029, T039 |
| RF-09 — Pagamento informativo | T024, T027, T029, T038 |
| RF-10 — Totais e frete | T012, T014, T023, T028, T037 |
| RF-11 — Bloqueio de checkout inválido | T023, T024, T026, T028, T029, T037 |
| RF-12 — Confirmar pedido/sucesso | T030, T031, T032, T038 |
| RF-13 — Limpar carrinho e preservar snapshot | T015, T030, T031, T032, T037 |
| RF-14 — Light/dark | T006, T008, T033, T034, T038 |
| RF-15 — Responsividade | T008, T019–T021, T028, T034–T036, T038 |
| RF-16 — Logo original com IA | T001, T005, T007, T009, T010, T018, T040, T041 |

## 5. Matriz de rastreabilidade — regras de negócio

| Regra | Tarefas principais |
| --- | --- |
| RN-01 — Quantidades | T013, T019, T022, T037 |
| RN-02 — Unicidade por produto | T013, T015, T037 |
| RN-03 — Subtotal + frete | T012, T014, T023, T037 |
| RN-04 — Centavos/BRL | T011, T012, T014, T037 |
| RN-05 — Pagamento fictício | T027, T030, T038, T041 |
| RN-06 — Carrinho/snapshot independentes | T015, T016, T030–T032, T037 |
| RN-07 — Endereço e verificação CEP | T024–T026, T029, T039 |
| RN-08 — Catálogo local e API CEP externa | T005, T025, T039, T041 |
| RN-09 — Estados vazios | T017, T023, T028, T032, T038 |
| RN-10 — Proibição de confirmação inválida | T013, T024, T029, T031, T037 |

**Requisitos não funcionais RNF-01–RNF-08:** validar todas as definições do PRD §15 em T004, T006–T010, T015–T018, T033–T036 e T038–T043. A evidência final de conformidade de cada RNF deve ser registrada na T043.

## 6. Checklist de aceite geral

- [ ] Todos os RF-01 a RF-16 demonstrados e vinculados a evidências.
- [ ] Todas as RN-01 a RN-10 respeitadas.
- [ ] Requisitos não funcionais RNF-01 a RNF-08 revisados.
- [ ] `coffee-delivery.pen` inspecionado e interfaces comparadas aos frames reais.
- [ ] Tokens oficiais (16 HEX), tipografia Baloo 2/Roboto e Phosphor Icons utilizados.
- [ ] Logo original aprovada e favicon presentes, com uso de IA documentado; sem inventar autoria.
- [ ] Taxa única R$ 5,00 quando carrinho tem itens, e R$ 0,00 quando vazio.
- [ ] Carrinho persiste após refresh; storage inválido/falha são tratados.
- [ ] CEP atual é verificado por API real antes da confirmação; erros, loading e corrida são tratados.
- [ ] Pagamento apenas fictício; sem integração financeira real.
- [ ] Pedido é snapshot persistido antes de limpar carrinho; `/success` resiste a refresh.
- [ ] Tema claro/escuro persistido e navegável por teclado.
- [ ] Fluxo completo funcional a partir de 320px, sem overflow impeditivo.
- [ ] `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, `npm run test:e2e` aprovados no ambiente configurado.
- [ ] Deploy HTTPS acessível e fallback das rotas SPA testado.
- [ ] Cada T001–T043 concluída tem data, teste executado, resultado, evidência e hash real de commit.

## 7. Histórico de execução e pendências

| Data | Tarefa | Alteração / resultado | Teste / evidência | Commit real | Status |
| --- | --- | --- | --- | --- | --- |
| — | — | Nenhuma tarefa executada na criação deste documento. | — | — | PENDENTE |
| 2026-11-18 | T001 | Inventário visual, decisões, ativos e estado inicial do repositório registrados. | Inspeção Pencil e revisão manual dos SPECs e Git: PASSOU. | `7fddbe4b2c53741196464b8bfcb7882f8b990720` | CONCLUÍDA |
| 2026-11-18 | T001 | Reavaliação após adição de imagens: prancha com 14 cafés renderizada; pendências dos frames e referência de imagem registradas. | Inspeção Pencil dos nós `kvmSF`, `ecpPI` e `xyxIT` e `git status`: PASSOU. | Ver histórico Git para o commit desta atualização. | CONCLUÍDA |

**Pendências de insumo (verificar em T001):** disponibilidade e leitura de `coffee-delivery.pen`; imagens e catálogo definitivos; arquivo final da logo e dados reais da ferramenta de IA; breakpoints/frames de dark mode; scripts e configurações existentes; host de deploy. Não há autorização para inventar imagens, cores escuras oficiais, catálogo definitivo, logs, testes ou commits.

**Regra de manutenção do plano:** ao concluir uma tarefa, atualizar **o seu próprio bloco de status e registro**, marcar `[x]` no título, atualizar o histórico acima e criar um commit semântico real. O commit que contiver a atualização do checklist pode incluir os arquivos da tarefa e a mudança em `docs/TASKS_SPEC.md` no mesmo commit; registrar o hash após o commit usando uma atualização documental adicional se necessário, sem falsificar o identificador. Alterações de escopo devem ser primeiro reconciliadas no PRD e TECH, depois refletidas nas tarefas e matrizes.
