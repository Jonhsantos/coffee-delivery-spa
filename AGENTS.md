# AGENTS.md — Diretrizes obrigatórias para agentes de IA

> **Projeto:** Coffee Delivery SPA  
> **Local:** raiz de `coffee-delivery-spa/`  
> **Idioma de comunicação e documentação:** português do Brasil (`pt-BR`)  
> **Status deste documento:** instruções operacionais para implementação incremental; não é um registro de tarefas concluídas.

## 1. Missão e contexto do projeto

Desenvolver e manter uma SPA de **delivery fictício de cafés**, com catálogo, seleção de quantidade, carrinho persistente, formulário de endereço com consulta **obrigatória** a uma API pública de CEP, seleção informativa de pagamento, confirmação de pedido fictício, temas claro/escuro e experiência responsiva.

O produto não realiza compras, cobranças ou entregas reais. O projeto deve seguir fielmente os requisitos dos arquivos SPEC e a identidade visual do arquivo `coffee-delivery.pen`. **Não gerar a aplicação inteira de uma só vez**: executar exclusivamente tarefas pequenas, verificáveis e rastreáveis.

## 2. Referências obrigatórias e precedência

Antes de **escrever, gerar, alterar ou remover código**, abrir e ler os arquivos atuais, nesta ordem:

1. `docs/PRD_SPEC.md` — funcionalidades **RF-01 a RF-16**, regras de negócio **RN-01 a RN-10**, requisitos não funcionais **RNF-01 a RNF-08**, critérios de aceite e limites do MVP.
2. `coffee-delivery.pen` — **fonte de verdade visual**, incluindo frames, componentes, cores, tipografia, espaçamento, ícones, estados e responsividade; consultar pelo recurso compatível com arquivos `.pen` disponível no ambiente.
3. `docs/TECH_SPEC.md` — stack, arquitetura, tipos, estado, efeitos, persistência, validações, testes e organização das pastas.
4. `docs/TASKS_SPEC.md` — plano de execução **T001–T043**, ordem, dependências, critérios de pronto, testes e registro de evidências.
5. `AGENTS.md` — estas regras de operação (reler quando o agente for retomado, transferido ou reconfigurado).

**Antes da primeira alteração em cada sessão:** verificar a existência, a legibilidade e o estado atual desses arquivos; observar também `package.json`, lockfile, repositório Git, código e assets existentes. Não assumir que a estrutura planejada já está implementada.

**Precedência por assunto:**

- **Comportamento, requisitos e negócio:** `PRD_SPEC.md`.
- **Aparência e composição visual:** `coffee-delivery.pen`.
- **Decisões e contratos técnicos:** `TECH_SPEC.md`.
- **Sequência e critérios de conclusão:** `TASKS_SPEC.md`.
- **Conduta do agente:** `AGENTS.md`, sem contradizer os documentos acima.

Se dois documentos entrarem em conflito na mesma área, **não escolher silenciosamente**: identificar o conflito, registrar a decisão necessária e não implementar a parte afetada até existir uma resolução autorizada. Se o `.pen` não puder ser aberto, registrar bloqueio de fidelidade visual e **não alegar correspondência ao design**; continuar somente com tarefas independentes. Links Figma podem ser usados como referência auxiliar **quando disponíveis e autorizados**, mas não substituem `coffee-delivery.pen`, salvo alteração expressa dos documentos oficiais.

## 3. Stack e restrições tecnológicas

Usar as escolhas do `TECH_SPEC.md`, verificando compatibilidade das versões realmente instaladas:

- **React + TypeScript estrito + Vite** para interface e build.
- **React Router** para rotas `/`, `/checkout`, `/success` e estado de rota não encontrada.
- **Tailwind CSS** com tokens centralizados; estilos específicos em `src/styles/` quando necessários.
- **Baloo 2** (títulos), **Roboto** (texto) e **`@phosphor-icons/react`** (ícones) conforme o design system.
- **Context API + `useReducer`** para o carrinho; Context API para tema.
- **React Hook Form + Zod + `@hookform/resolvers`** para o checkout.
- **`fetch` + `AbortController`** para a consulta ViaCEP.
- **`localStorage`** para carrinho, tema e último pedido confirmado, com leitura defensiva e validação.
- **Vitest, Testing Library, user-event, jest-dom, MSW (quando adotado), Playwright, ESLint, Prettier e TypeScript** para qualidade.

Não introduzir frameworks, bibliotecas, serviços, arquitetura ou dependências adicionais sem necessidade comprovada e coerência com o TECH SPEC. Não realizar mudanças amplas de versão, reorganizações extensas ou refatorações sem relação com a tarefa atual.

## 4. Identidade visual, Figma e arquivo `.pen`

- **Design oficial:** `coffee-delivery.pen` na raiz. Inspecionar os frames reais antes de construir ou ajustar componentes visuais.
- **Paleta oficial clara:** respeitar os 16 tokens definidos no PRD v1.2 (produto e base); não espalhar códigos HEX diretamente pelos componentes. Usar tokens e aliases semânticos.
- **Tipografia:** aplicar as escalas definidas no PRD — Baloo 2 para títulos e Roboto para textos e controles — sem substituir por fontes semelhantes.
- **Ícones:** usar Phosphor Icons com pesos e tamanhos equivalentes ao `.pen`; não misturar bibliotecas desnecessariamente.
- **Logo:** usar somente a versão original autorizada e documentar o uso real de IA; não afirmar que foi criada/aprovada se o arquivo ou a informação estiver ausente. Integrar Header e favicon apenas quando houver asset válido.
- **Light/dark:** implementar ambos os temas (RF-14). Os tokens claros são oficiais; a paleta escura **não foi integralmente fornecida nas imagens**. Consultar eventuais frames escuros e documentar os aliases técnicos faltantes, sem apresentá-los como cores oficiais.
- **Responsividade:** validar fluxos completos desde **320px**, além de desktop; respeitar o desenho oficial e garantir legibilidade, navegação por teclado e foco visível.
- **Figma:** somente consultar ou alterar arquivos Figma se houver referência identificável e autorização apropriada. Alterar um Figma, um `.pen` ou arquivos de produto não faz parte automaticamente de tarefas de implementação do frontend.

## 5. Estrutura esperada

```text
coffee-delivery-spa/
├── coffee-delivery.pen
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── reducers/
│   ├── hooks/
│   ├── data/
│   ├── types/
│   ├── schemas/
│   ├── utils/
│   ├── styles/
│   ├── tests/
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   ├── PRD_SPEC.md
│   ├── TECH_SPEC.md
│   └── TASKS_SPEC.md
├── AGENTS.md
└── README.md
```

A árvore é **alvo arquitetural**, não prova de que os arquivos existem. Não criar pastas/arquivos ociosos apenas para reproduzi-la. Respeitar as responsabilidades específicas e o inventário do TECH SPEC ao implementar cada tarefa.

## 6. Processo obrigatório — execução por fases e uma tarefa por vez

Uma autorização explícita para executar uma fase do `docs/TASKS_SPEC.md` permite realizar, em sequência, todas as tarefas dessa fase sem solicitar autorização individual para cada uma. Antes de iniciar, identificar todas as tarefas da fase, seus requisitos, dependências e critérios de aceite; comunicar o plano. A autorização de uma fase não autoriza avançar à seguinte, modificar o `.pen`, fazer push ou realizar deploy: essas ações exigem autorização explícita própria. Uma autorização restrita a uma tarefa continua limitada a ela.

1. **Inspecionar:** ler os SPECs e o `.pen`, identificar a próxima tarefa elegível em `docs/TASKS_SPEC.md` e conferir o código existente, dependências e estado do Git.
2. **Delimitar:** declarar internamente o ID (ex.: `T013`), objetivo, RF/RN/RNF relacionados, arquivos previstos, dependências e critério de pronto. Implementar **somente essa tarefa**; não antecipar as próximas.
3. **Implementar:** criar mudanças mínimas, reutilizáveis, tipadas, acessíveis e compatíveis com a arquitetura e visual oficiais. Preservar funcionalidades já existentes.
4. **Verificar:** executar o teste específico da tarefa e, quando configurados, `npm run typecheck` e `npm run lint`; executar testes adicionais proporcionais à alteração. Não declarar aprovação sem execução real.
5. **Revisar:** conferir o diff, estados de erro, tipos, acessibilidade, impacto no armazenamento e rastreabilidade dos requisitos. Evitar arquivos não relacionados.
6. **Registrar:** atualizar no `docs/TASKS_SPEC.md` o teste executado, resultado, evidência, data, dificuldades e status; incluir a documentação da tarefa no mesmo commit sempre que possível.
7. **Commitar:** gerar **um commit semântico real**, restrito à tarefa, após os critérios e testes serem atendidos. Registrar o hash real depois que o Git confirmar o commit; nunca inventar hashes ou resultados.
8. **Concluir:** marcar `[x]` / `CONCLUÍDA` somente quando implementação, critério de pronto, teste, evidência e commit forem reais; então seguir para a próxima tarefa elegível da fase autorizada, sem pedir confirmação individual.

**Não executar uma fase ou T001–T043 como uma única alteração ou um único commit.** Em caso de falha, tentar corrigi-la dentro do escopo autorizado sem comprometer requisitos ou segurança. Interromper a parte afetada diante de novos riscos relevantes, dependências bloqueantes, mudança fora do escopo ou decisão que exija aprovação. Uma tarefa bloqueada permanece `[ ] BLOQUEADA`, com causa específica; é permitido prosseguir apenas com tarefas independentes da mesma fase autorizada, registrando o desvio e as dependências. Respeitar as exceções de segurança da §10.1.

Ao encerrar a fase autorizada, executar as verificações integradas aplicáveis e apresentar relatório consolidado com tarefas concluídas, pendentes e bloqueadas; arquivos; testes e resultados; commits e hashes; vulnerabilidades conhecidas e novas; pendências e decisões; e indicação fundamentada de prontidão para aprovação. Não iniciar outra fase sem autorização.

Se a tarefa já estiver parcialmente ou totalmente implementada, auditar as evidências e adaptar somente o que falta — sem recriar a aplicação ou marcar conclusão retroativa sem prova. Se o usuário pedir uma mudança fora do escopo da tarefa, primeiro avaliar impacto e necessidade de atualizar PRD → TECH → TASKS.

## 7. Regras de domínio que nunca podem ser quebradas

- **Quantidades (RN-01/02):** adição somente de inteiros positivos; ao decrementar de 1 para 0, **remover** o item; uma linha por `productId`, somando novas adições.
- **Valores (RN-03/04):** calcular em centavos inteiros; `DELIVERY_FEE_CENTS = 500` em um único local; frete **R$ 5,00** somente para carrinho com itens, **R$ 0,00** no vazio; exibir `pt-BR`/`BRL` com duas casas decimais.
- **Pagamento (RN-05):** somente `crédito`, `débito` ou `dinheiro`, **informativos**; não criar integração de cobrança.
- **Persistência (RN-06):** validar os dados carregados do `localStorage`; o pedido confirmado é **snapshot próprio**, não uma referência ao estado mutável do carrinho.
- **CEP (RF-08; RN-07/08):** consulta HTTP pública obrigatória (ViaCEP), CEP de oito dígitos, tratamento de carregamento/CEP inválido/não encontrado/erro, preenchimento automático dos campos retornados; número e complemento são manuais, sendo complemento opcional. O usuário deve poder corrigir o endereço conforme o PRD.
- **Confirmação (RF-11–13; RN-09/10):** não confirmar com carrinho vazio, item desconhecido, quantidade ou formulário inválido, pagamento ausente, ou CEP atual sem verificação bem-sucedida. **Persistir o snapshot antes de limpar o carrinho**; em falha de salvamento, não simular sucesso.
- **Navegação (RF-07):** transições via React Router, sem recarregar a SPA; exibir estados vazios na tela de checkout e quando não houver pedido válido na rota de sucesso.

Na dúvida sobre um detalhe, consultar o requisito exato e seu critério de aceite nos SPECs. Não reinterpretar regras de negócio por conveniência de código.

## 8. Boas práticas obrigatórias

- TypeScript `strict`; contratos explícitos, validação nas fronteiras (HTTP/storage/formulários) e ausência de `any` injustificado.
- Componentes pequenos e reutilizáveis, nomenclatura consistente e separação de UI, estado, cálculos e integrações.
- Reducers puros, atualizações imutáveis e seletores derivados; evitar duplicação de estado e lógica monetária.
- Usar hooks com dependências corretas; evitar efeitos que criem loops e proteger consultas CEP contra respostas obsoletas.
- Usar HTML semântico, labels, estados de foco, `aria-*` quando necessário e feedback de validação acessível; não depender exclusivamente de cor.
- Não ocultar erros de rede, storage ou validação; apresentar estados úteis ao usuário e preservar seus dados quando possível.
- Não incluir segredos em código ou commits; não imprimir endereços pessoais ou informações sensíveis em logs/testes.
- Não substituir imagens, produtos ou a logo oficial por conteúdo inventado. Dados temporários só quando a tarefa permitir expressamente e com identificação inequívoca.
- Comentar **o porquê** de decisões não óbvias; evitar comentários redundantes. Não criar documentação paralela conflitante.
- Respeitar o idioma `pt-BR` para UI e documentação, sem prejudicar convenções técnicas de identificadores e bibliotecas.

## 9. Limites de escopo e autonomia

**Não implementar sem mudança explícita aprovada nos SPECs:** backend próprio, autenticação, cadastro de usuários, banco de dados, API privada, estoque em tempo real, pagamento real, rastreamento/logística, cálculo de frete por distância, painel administrativo, múltiplos pedidos históricos ou funcionalidades não previstas no MVP.

O agente pode corrigir problemas diretamente relacionados à tarefa atual, documentando a razão. Para mudanças de escopo, decisões visuais sem referência, alterações de negócio ou substituição de bibliotecas centrais: **registrar a pendência e solicitar decisão em vez de inventar**. Não apagar alterações anteriores, fazer reset destrutivo do Git, modificar segredos ou sobrescrever trabalho alheio sem autorização.

## 10. Testes, qualidade e evidência

Executar somente os scripts realmente disponíveis; se um comando obrigatório ainda não existir, configurá-lo na tarefa apropriada ou registrar impedimento, **nunca fingir execução**.

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
```

Verificar scripts no `package.json` antes de executar. Requisitos mínimos de teste conforme a tarefa:

- **Unitários:** reducer, quantidade, unicidade de item, seletores, frete, formatação, storage e schemas Zod.
- **Integração:** interações de carrinho, checkout, estados do ViaCEP (mock de sucesso, erro, não encontrado e respostas fora de ordem), validação e snapshot do pedido.
- **E2E:** Home → Checkout → Success, refresh/rotas diretas, carrinho vazio, tema persistente e viewport móvel.
- **Rede real:** executar a verificação pública do ViaCEP prevista em **T039**; mocks não substituem essa evidência.
- **Visual e acessibilidade:** comparar com `coffee-delivery.pen`, conferir tokens/ícones/fontes, testar teclado, foco, mensagens de erro, contraste, zoom e largura mínima de 320px.
- **Entrega:** build válido, deploy HTTPS, fallback SPA e smoke test em produção, conforme T040–T043.

Registrar comando, ambiente, resultado (passou/falhou/não executado), evidência e limitações. Não declarar cobertura, desempenho, acessibilidade ou fidelidade visual sem verificação. Falha relevante deve ser resolvida ou deixar a tarefa pendente/bloqueada, salvo risco específico explicitamente aceito e documentado conforme §10.1.

### 10.1 Gerenciamento de vulnerabilidades

- Consultar o registro central em `docs/TECH_SPEC.md` §11.4. Exceções são vinculadas ao advisory, versões afetadas, ambiente e condições de exposição, não a uma tarefa isolada.
- Executar `npm audit` e `npm audit --omit=dev` nas etapas que alterarem dependências e antes de deploy; registrar resultado real e caminhos afetados em `docs/TASKS_SPEC.md`. Não suprimir advisories, desativar auditoria, usar `npm audit fix --force` ou aplicar overrides inseguros.
- Novos caminhos transitivos do mesmo advisory não exigem nova autorização quando permanecerem no ambiente e risco aceitos; registrá-los. Não bloquear apenas pelo aumento de registros nem repetir investigação integral sem fatos novos relevantes.
- Outros advisories, dependências de produção afetadas, exposição pública ou mudança relevante de gravidade ou explorabilidade não estão cobertos: interromper a tarefa afetada, relatar a diferença e solicitar decisão.
- Manter Vite e ferramentas de desenvolvimento em ambientes locais confiáveis, sem exposição à internet, túneis ou proxies públicos; não processar padrões glob de entrada não confiável. Uma exceção não comprova ausência de exploração nem corrige a vulnerabilidade.
- Reavaliar diante de correção upstream validada, alteração relevante de exposição e antes de qualquer deploy; substituir a exceção por correção validada assim que disponível. Se os demais critérios forem atendidos e somente um advisory coberto permanecer, concluir com ressalva e evidência, sem enfraquecer testes ou requisitos de produto.

## 11. Commits e manutenção do checklist

Usar mensagens pequenas, objetivas e no imperativo, preferencialmente em português, nos padrões:

```text
feat: implementar reducer do carrinho
fix: corrigir validacao de cep no checkout
docs: atualizar rastreabilidade da tarefa t013
test: cobrir calculo de subtotal e frete
refactor: separar seletores do carrinho
style: aplicar tokens de tipografia oficial
```

Tipos principais exigidos: **`feat:`**, **`fix:`**, **`docs:`**, **`test:`**, **`refactor:`**, **`style:`**. O `TASKS_SPEC.md` admite `chore:` para configuração/deploy quando a convenção do repositório permitir. Não forçar um prefixo incorreto para esconder o objetivo do commit.

**Cada tarefa concluída exige:** checklist `[x]`, status `CONCLUÍDA`, critério de pronto verificado, teste realmente executado, evidência, data e hash do commit real. Se o hash não puder constar no próprio commit sem emenda posterior, registrá-lo em atualização documental subsequente, sem inventá-lo. Se o repositório Git ou permissão para commit estiver indisponível, **não marcar a tarefa como concluída**, mesmo que o código esteja pronto.

Não usar `git add .` indiscriminadamente sem inspecionar o status/diff. Não incluir arquivos `.env`, credenciais, logs volumosos ou alterações de outra tarefa.

## 12. Protocolo de comunicação e encerramento

Antes de iniciar cada tarefa, apresentar de forma breve a **tarefa ID**, objetivo e arquivos envolvidos. Registrar e comunicar o resultado de cada tarefa; ao final da fase, consolidar os resultados sem solicitar confirmação entre tarefas. Modelo por tarefa:

```text
Tarefa: T0XX — [nome]
Status: CONCLUÍDA | PENDENTE | BLOQUEADA
Requisitos: RF-..., RN-..., RNF-...
Arquivos alterados: ...
Teste(s) executado(s): [comandos e resultados reais]
Critério de pronto: [atendido / pendência]
Commit: [tipo: mensagem; hash real] | NÃO REALIZADO
Próxima tarefa elegível: T0YY | nenhuma
Bloqueios/observações: ...
```

Não dizer “feito”, “testado”, “publicado”, “sincronizado” ou “commitado” sem ter executado e verificado a ação correspondente. Identificar claramente propostas, decisões pendentes e trabalho não realizado.

---

**Regra final:** **ler os SPECs e o `coffee-delivery.pen` antes de codificar; implementar uma tarefa pequena por vez; testar, registrar evidências e realizar commit semântico antes de marcar a tarefa como concluída.**
