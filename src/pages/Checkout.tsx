import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Bank,
  CreditCard,
  CurrencyDollar,
  MapPinLine,
  Money,
  Trash,
} from '@phosphor-icons/react'
import { coffees } from '../data/coffees'
import { useCart } from '../hooks/useCart'
import {
  checkoutSchema,
  type CheckoutInput,
  type CheckoutValues,
} from '../schemas/checkoutSchema'
import { orderSchema } from '../schemas/storageSchemas'
import { STORAGE_KEYS, writeStorage } from '../services/storage'
import { formatBRL } from '../utils/money'
import { selectCartTotals } from '../utils/cartSelectors'
import type { Order } from '../types/order'

const catalog = Object.fromEntries(coffees.map((coffee) => [coffee.id, coffee]))
const cepResponse = z
  .object({
    erro: z.boolean().optional(),
    logradouro: z.string().optional(),
    bairro: z.string().optional(),
    localidade: z.string().optional(),
    uf: z.string().optional(),
  })
  .refine(
    (data) => data.erro === true || typeof data.localidade === 'string',
    'Resposta inválida',
  )
const addressFields = ['street', 'neighborhood', 'city', 'uf'] as const
const paymentOptions = [
  { value: 'credit', label: 'Cartão de crédito', icon: CreditCard },
  { value: 'debit', label: 'Cartão de débito', icon: Bank },
  { value: 'cash', label: 'Dinheiro', icon: Money },
] as const

export default function Checkout() {
  const cart = useCart()
  const navigate = useNavigate()
  const [cepState, setCepState] = useState('')
  const [verifiedCep, setVerifiedCep] = useState('')
  const [failure, setFailure] = useState('')
  const request = useRef<AbortController | null>(null)
  const currentCep = useRef('')
  const autoValues = useRef<
    Partial<Record<(typeof addressFields)[number], string>>
  >({})
  const submitting = useRef(false)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CheckoutInput, unknown, CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      uf: '',
    },
  })
  useEffect(() => () => request.current?.abort(), [])

  async function lookup(cep: string) {
    if (!/^\d{8}$/.test(cep)) return
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setCepState('Consultando CEP...')
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        signal: controller.signal,
      })
      if (!response.ok) throw new Error()
      const parsed = cepResponse.safeParse(await response.json())
      if (!parsed.success) throw new Error()
      if (controller.signal.aborted || currentCep.current !== cep) return
      if (parsed.data.erro) {
        setCepState('CEP não encontrado.')
        return
      }
      const values = [
        parsed.data.logradouro,
        parsed.data.bairro,
        parsed.data.localidade,
        parsed.data.uf,
      ]
      addressFields.forEach((field, index) => {
        const value = values[index]
        if (value) {
          setValue(field, value, { shouldValidate: true })
          autoValues.current[field] = value
        }
      })
      setVerifiedCep(cep)
      setCepState('CEP consultado com sucesso.')
    } catch {
      if (!controller.signal.aborted && currentCep.current === cep)
        setCepState('Não foi possível consultar o CEP. Tente novamente.')
    }
  }

  const cepRegister = register('cep')
  function onCepChange(event: React.ChangeEvent<HTMLInputElement>) {
    void cepRegister.onChange(event)
    const cep = event.target.value.replace(/\D/g, '')
    if (cep === currentCep.current) return
    request.current?.abort()
    currentCep.current = cep
    setVerifiedCep('')
    setCepState('')
    addressFields.forEach((field) => {
      if (
        autoValues.current[field] &&
        getValues(field) === autoValues.current[field]
      )
        setValue(field, '')
    })
    autoValues.current = {}
    if (cep.length === 8) void lookup(cep)
  }

  function submit(values: CheckoutValues) {
    if (submitting.current) return
    if (values.cep !== verifiedCep || currentCep.current !== verifiedCep) {
      setFailure('Consulte o CEP atual antes de confirmar.')
      return
    }
    try {
      if (!cart.items.length) throw new Error()
      const totals = selectCartTotals(cart.items, catalog)
      const items = cart.items.map(({ productId, quantity }) => {
        const product = catalog[productId]
        if (!product) throw new Error()
        return {
          productId,
          name: product.name,
          priceCents: product.priceCents,
          quantity,
          lineTotalCents: product.priceCents * quantity,
        }
      })
      const { paymentMethod, ...address } = values
      const order: Order = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        items,
        address,
        paymentMethod,
        subtotalCents: totals.subtotalCents,
        deliveryFeeCents: totals.deliveryFeeCents,
        totalCents: totals.totalCents,
      }
      if (!orderSchema.safeParse(order).success) throw new Error()
      submitting.current = true
      if (!writeStorage(STORAGE_KEYS.order, order)) {
        submitting.current = false
        setFailure('Não foi possível salvar o pedido. Tente novamente.')
        return
      }
      if (!writeStorage(STORAGE_KEYS.cart, [])) {
        submitting.current = false
        setFailure(
          'Não foi possível limpar o carrinho salvo. Seus itens foram preservados.',
        )
        return
      }
      cart.clearCart()
      void navigate('/success')
    } catch {
      submitting.current = false
      setFailure('Não foi possível confirmar o pedido. Revise o carrinho.')
    }
  }

  const fields = [
    ['street', 'Rua'],
    ['number', 'Número'],
    ['complement', 'Complemento (opcional)'],
    ['neighborhood', 'Bairro'],
    ['city', 'Cidade'],
    ['uf', 'UF'],
  ] as const

  return (
    <main className="container checkout">
      {cart.items.length === 0 ? (
        <section>
          <h1>Seu carrinho está vazio</h1>
          <p>Escolha seus cafés para começar.</p>
          <Link to="/">Ver cafés</Link>
        </section>
      ) : (
        <form
          onSubmit={(event) => void handleSubmit(submit)(event)}
          noValidate
          className="checkout-grid"
        >
          <div>
            <h1>Complete seu pedido</h1>
            <section className="checkout-panel">
              <div className="section-heading">
                <MapPinLine size={22} />
                <div>
                  <h2>Endereço de entrega</h2>
                  <p>Informe o endereço onde deseja receber seu pedido</p>
                </div>
              </div>
              <div className="address-grid">
                <label className="cep-field">
                  CEP
                  <input
                    {...cepRegister}
                    onChange={onCepChange}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    aria-invalid={!!errors.cep}
                    aria-describedby="cep-message"
                  />
                  <span id="cep-message" role="status">
                    {errors.cep?.message || cepState}
                  </span>
                </label>
                {fields.map(([name, label]) => (
                  <label key={name} className={`field-${name}`}>
                    {label}
                    <input
                      {...register(name)}
                      aria-invalid={!!errors[name]}
                      aria-describedby={`${name}-error`}
                    />
                    <span id={`${name}-error`} role="alert">
                      {errors[name]?.message}
                    </span>
                  </label>
                ))}
              </div>
              {cepState.startsWith('Não foi possível') && (
                <button
                  type="button"
                  onClick={() => void lookup(currentCep.current)}
                >
                  Tentar novamente
                </button>
              )}
            </section>
            <section className="checkout-panel">
              <div className="section-heading payment-heading">
                <CurrencyDollar size={22} />
                <div>
                  <h2>Pagamento</h2>
                  <p>O pagamento é fictício e não será processado</p>
                </div>
              </div>
              <fieldset>
                <legend className="sr-only">Forma de pagamento</legend>
                <div className="payment-options">
                  {paymentOptions.map(({ value, label, icon: Icon }) => (
                    <label key={value}>
                      <input
                        type="radio"
                        value={value}
                        {...register('paymentMethod')}
                      />
                      <span>
                        <Icon size={20} />
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
                <p role="alert">{errors.paymentMethod?.message}</p>
              </fieldset>
            </section>
          </div>
          <div>
            <h2>Cafés selecionados</h2>
            <section className="checkout-panel summary-panel">
              {cart.items.map((item) => {
                const product = catalog[item.productId]
                if (!product) return null
                return (
                  <div className="cart-row" key={item.productId}>
                    <img src={product.imageUrl} alt="" />
                    <div>
                      <p>{product.name}</p>
                      <div className="row-actions">
                        <div className="cart-quantity">
                          <button
                            type="button"
                            aria-label={`Diminuir quantidade de ${product.name}`}
                            onClick={() => cart.decrementItem(item.productId)}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Aumentar quantidade de ${product.name}`}
                            onClick={() => cart.incrementItem(item.productId)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="remove"
                          onClick={() => cart.removeItem(item.productId)}
                        >
                          <Trash size={16} /> Remover
                        </button>
                      </div>
                    </div>
                    <strong>
                      {formatBRL(product.priceCents * item.quantity)}
                    </strong>
                  </div>
                )
              })}
              <dl className="totals">
                <div>
                  <dt>Total de itens</dt>
                  <dd>{formatBRL(cart.subtotalCents)}</dd>
                </div>
                <div>
                  <dt>Entrega</dt>
                  <dd>{formatBRL(cart.deliveryFeeCents)}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{formatBRL(cart.totalCents)}</dd>
                </div>
              </dl>
              {failure && <p role="alert">{failure}</p>}
              <button className="confirm" type="submit">
                Confirmar pedido
              </button>
            </section>
          </div>
        </form>
      )}
    </main>
  )
}
