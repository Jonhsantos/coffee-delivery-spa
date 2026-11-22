# Coffee Delivery

SPA acadêmica para simular a escolha e o pedido de cafés. Não há cobrança,
entrega, envio de pedidos ou integração financeira real.

## Executar

Requisitos: Node.js e npm compatíveis com as versões do projeto.

```bash
npm install
npm run dev
```

Abra o endereço local informado pelo Vite. A aplicação usa React, TypeScript,
Vite, Tailwind CSS, React Router, React Hook Form, Zod e Phosphor Icons.
Carrinho, preferência de tema e último pedido são guardados no navegador.
O checkout requer conexão HTTPS ao ViaCEP e consulta bem-sucedida do CEP atual;
o frete fictício é de R$ 5,00 quando há itens.

## Verificação

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run format:check
npm run test:e2e
```

O teste E2E usa Playwright e intercepta o ViaCEP para ser reproduzível; seu
navegador Chromium deve estar instalado. A verificação real do ViaCEP é
separada. Para hospedagem estática, configure fallback das rotas para
`index.html`. Não há deploy configurado.

## Identidade visual

`coffee-delivery.pen` é a referência visual; a marca e o uso de IA estão
documentados em `docs/brand.md`. O arquivo do hero não está associado ao frame
do Pencil. A imagem de um café do catálogo é usada provisoriamente no hero,
portanto essa parte ainda não reproduz a arte original.
