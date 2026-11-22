# TASKS_SPEC — Coffee Delivery SPA

Versão 3.0 — Finalização acadêmica

Referências: PRD_SPEC.md, TECH_SPEC.md e ../coffee-delivery.pen. Este plano substitui a sequência operacional de 43 tarefas; preserve seu histórico no Git. Não reduz RF-01–16, RN-01–10 ou requisitos não funcionais.

## Base existente (não refazer)

Na revisão da branch main, foram encontrados Vite, React, TypeScript, Tailwind, tokens claros e tipografia, catálogo de 14 cafés e imagens, logo aprovada e favicon, tipos, reducer, CartProvider/useCart, persistência, cálculos, QuantityControl e testes unitários. O App ainda é um placeholder. Confirmar rapidamente alterações locais e conservar tudo que funciona. Os testes existentes não foram executados nesta revisão externa.

## Checklist restante

### [ ] F01 — Home, Header e navegação
- Status: Em andamento. Home e navegação inicial implementadas; falta validação visual e da jornada no navegador. Checkout e confirmação ainda são placeholders. `typecheck` e `lint` passaram; `test`: 36 testes passaram; `build` e `format:check` passaram. Implementação parcial: commit `f94aa79`.
- Revisão visual parcial, 2026-11-22: referências e telas comparadas no navegador; corrigidos marca, sequência dos cafés, medidas e cores da Home. A imagem do hero não está disponível no frame (preenchimento sem arquivo); não foi inventada. Layout em 320 px inspecionado sem rolagem horizontal. `typecheck`, `lint`, `test` (36) e `build` passaram. Checkout, Success e tema escuro continuam pendentes.
- Objetivo: entregar a interface inicial funcional, reaproveitando catálogo, assets, QuantityControl e CartProvider. Criar rotas /, /checkout, /success e fallback; Header com logo, contador de unidades e acesso ao checkout; hero e grid dos 14 cafés segundo o .pen. Usar Phosphor e feedback acessível.
- Requisitos: RF-01–04, RF-06–07, RF-15–16; RN-01–02, RN-08–09.
- Arquivos: src/App.tsx, src/main.tsx, src/pages/, src/components/, src/styles/ (conforme necessidade).
- Pronto: Home fiel ao design, adicionar repetidos consolida, badge soma unidades, refresh mantém carrinho; rotas funcionam. Validar jornada no navegador. Commit: `feat: implementar home e navegacao`.

### [ ] F02 — Checkout e ViaCEP
- Status: Pendente.
- Objetivo: implementar linhas editáveis, resumo financeiro, formulário RHF/Zod, consulta real ViaCEP e pagamento fictício crédito/débito/dinheiro. Reutilizar seletores e money.ts. Frete 500 centavos com itens e zero sem itens. CEP atual deve ter consulta bem-sucedida; tratar loading, inválido, inexistente, falha, respostas parciais e obsoletas; permitir correções manuais, número e complemento não sobrescritos. Impedir envio inválido e carrinho vazio.
- Requisitos: RF-05, RF-08–11, RF-15; RN-01–05, RN-07–10.
- Arquivos: src/pages/Checkout.tsx, src/components/, src/schemas/, src/hooks/, src/services/.
- Pronto: editar/remover atualiza totais e badge; formulário e pagamento funcionam; CEP real preenche dados, falhas são visíveis e impedem confirmação inválida. Commit: `feat: implementar checkout e consulta de cep`.

### [ ] F03 — Confirmação e pedido persistido
- Status: Pendente.
- Objetivo: validar novamente a submissão, impedir envio duplicado, criar snapshot independente com itens, endereço, pagamento e totais; persistir com storage existente antes de limpar carrinho. Falha ao persistir mantém carrinho e informa erro. Criar Success conforme .pen, com resumo completo e indicação de simulação, estado sem pedido válido e recuperação após refresh.
- Requisitos: RF-11–13; RN-05–06, RN-09–10.
- Arquivos: src/pages/Checkout.tsx, src/pages/Success.tsx, src/utils/order.ts, tipos e schemas existentes.
- Pronto: compra fictícia completa; pedido permanece após refresh, carrinho limpa somente após gravação bem-sucedida; acesso direto sem pedido apresenta orientação. Commit: `feat: finalizar pedido e confirmacao`.

### [ ] F04 — Tema e acabamento visual
- Status: Pendente.
- Objetivo: tema claro/escuro persistido com preferência do sistema como fallback; aliases semânticos, contraste, responsividade desde 320 px, teclado, foco, rótulos e mensagens de erro. Comparar as três telas com o .pen. Preservar paleta, Baloo 2, Roboto, Phosphor, logo aprovada e favicon. Adaptar mobile/dark quando não houver frame; registrar decisões técnicas sem inventar referências oficiais. Se houver asset de hero/ilustração indisponível, aproveitar material autorizado ou registrar limitação, sem paralisar o restante.
- Requisitos: RF-14–16, RNF do PRD; RF-01, RF-08, RF-11.
- Arquivos: src/contexts/, src/hooks/, src/components/, src/pages/, src/styles/, docs/brand.md se necessário.
- Pronto: todas as telas utilizáveis em desktop/mobile, sem overflow lateral, tema persiste, controles acessíveis; marca integrada. Commit: `style: finalizar tema e interface responsiva`.

### [ ] F05 — Validação e entrega acadêmica
- Status: Pendente.
- Objetivo: preservar testes existentes, atualizar smoke test para a aplicação real e adicionar somente testes essenciais ausentes de checkout/ViaCEP/snapshot/tema e jornada Playwright. Executar typecheck, lint, test, build, format:check e test:e2e; verificar ViaCEP real no navegador com CEP público e fluxo em desktop/mobile. Corrigir regressões. README com execução, stack, simulação, marca/uso real de IA e limitações. Preparar fallback SPA para hospedagem se necessário; não publicar sem autorização.
- Requisitos: RF-01–16, RN-01–10 e RNF do PRD.
- Arquivos: src/tests/, e2e/, playwright.config.ts, README.md, docs/TASKS_SPEC.md e configuração de hospedagem se aplicável.
- Pronto: jornada validada, comandos aprovados ou impedimentos reais explicitados, README utilizável e requisitos conferidos. Deploy efetivo, se exigido, permanece pendente até autorização e revisão de segurança. Commit: `test: validar projeto e preparar entrega` (documentação pode ter commit docs separado).

## Processo enxuto

- Ler SPECs uma vez no início; consultar trechos relevantes depois. Inspecionar o .pen via Pencil, sem modificá-lo. Usar PRD para negócio, .pen para visual e TECH para implementação.
- Executar F01–F05 automaticamente após autorização geral, sem pedir aprovação por componente ou fase. Trabalhar por blocos, sem recomeçar a base. Se bloqueado, prosseguir com atividades independentes.
- Testar o essencial de cada bloco e fazer uma validação integrada final; registrar uma linha de resultado e commit semântico real por bloco. Marcar [x] somente após critério atendido e evidência real; não inventar testes. Evitar relatórios extensos, novas abstrações ou dependências dispensáveis.
- Respeitar política de segurança vigente no TECH §11.4; não repetir investigação de advisory já aceito nas mesmas condições locais. Auditar quando dependências mudarem e no final; registrar resultados reais, avaliar riscos novos e reavaliar antes de deploy. Não usar audit fix --force nem suprimir alertas. Não expor Vite publicamente.
- Não criar backend, banco, autenticação ou pagamento real. Não fazer push/deploy sem autorização. Ao final, informar funcionalidades, testes, commits e pendências em resumo curto.
