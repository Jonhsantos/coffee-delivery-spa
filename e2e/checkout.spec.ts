import { expect, test } from '@playwright/test'

test('compra simulada persiste e tema permanece após atualização', async ({
  page,
}) => {
  await page.route('https://viacep.com.br/ws/01001000/json/', async (route) => {
    await route.fulfill({
      json: {
        logradouro: 'Rua Teste',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP',
      },
    })
  })
  await page.goto('/')
  await page
    .getByRole('button', { name: 'Adicionar Expresso Tradicional ao carrinho' })
    .click()
  await expect(
    page.getByRole('link', { name: 'Carrinho: 1 unidades' }),
  ).toBeVisible()
  await page.reload()
  await page.getByRole('link', { name: 'Carrinho: 1 unidades' }).click()
  await page.getByLabel('CEP', { exact: true }).fill('01001000')
  await expect(page.getByLabel('Rua', { exact: true })).toHaveValue('Rua Teste')
  await page.getByLabel('Número').fill('10')
  await page.getByLabel('Dinheiro', { exact: true }).check()
  await page.getByRole('button', { name: 'Confirmar pedido' }).click()
  await expect(
    page.getByRole('heading', { name: 'Uhu! Pedido confirmado' }),
  ).toBeVisible()
  await page.reload()
  await expect(page.getByText('Rua Teste, 10')).toBeVisible()
  await page.getByRole('button', { name: /Ativar tema/ }).click()
  const theme = await page.locator('html').getAttribute('data-theme')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme ?? '')
})

test('carrinho vazio e confirmação ausente orientam o visitante', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/checkout')
  await expect(
    page.getByRole('heading', { name: 'Seu carrinho está vazio' }),
  ).toBeVisible()
  await page.goto('/success')
  await expect(
    page.getByRole('heading', { name: 'Nenhum pedido encontrado' }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy()
})
