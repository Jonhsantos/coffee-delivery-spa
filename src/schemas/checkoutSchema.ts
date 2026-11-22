import { z } from 'zod'

const required = z.string().trim().min(1, 'Campo obrigatório')
const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const

export const checkoutSchema = z.object({
  cep: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{8}$/, 'Informe um CEP com 8 dígitos')),
  street: required,
  number: required,
  complement: z.string().optional(),
  neighborhood: required,
  city: required,
  uf: z
    .string()
    .trim()
    .toUpperCase()
    .pipe(z.enum(ufs, { error: 'Informe uma UF válida' })),
  paymentMethod: z.enum(['credit', 'debit', 'cash'], {
    error: 'Escolha uma forma de pagamento',
  }),
})

export type CheckoutInput = z.input<typeof checkoutSchema>
export type CheckoutValues = z.output<typeof checkoutSchema>
