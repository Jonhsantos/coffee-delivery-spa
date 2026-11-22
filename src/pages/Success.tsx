import { CurrencyDollar, MapPin, Timer } from '@phosphor-icons/react'
import { Link } from 'react-router'
import illustration from '../assets/J4DFV.svg'
import { orderSchema } from '../schemas/storageSchemas'
import { readStorage, STORAGE_KEYS } from '../services/storage'
import { formatBRL } from '../utils/money'

const paymentLabels = {
  credit: 'Cartão de crédito',
  debit: 'Cartão de débito',
  cash: 'Dinheiro',
} as const

export default function Success() {
  const stored = readStorage(STORAGE_KEYS.order)
  const parsed = orderSchema.safeParse(
    stored.status === 'ok' ? stored.value : null,
  )
  if (!parsed.success)
    return (
      <main className="container success">
        <h1>Nenhum pedido encontrado</h1>
        <p>Escolha seus cafés para iniciar uma simulação.</p>
        <Link to="/">Voltar para a Home</Link>
      </main>
    )
  const order = parsed.data
  return (
    <main className="container success">
      <h1>Uhu! Pedido confirmado</h1>
      <p>Seu pedido foi registrado nesta simulação acadêmica.</p>
      <div className="success-layout">
        <section className="success-info">
          <div>
            <MapPin weight="fill" />
            <p>
              Entrega em{' '}
              <strong>
                {order.address.street}, {order.address.number}
              </strong>
              <br />
              {order.address.neighborhood} - {order.address.city},{' '}
              {order.address.uf} · {order.address.cep}
              {order.address.complement && (
                <>
                  <br />
                  {order.address.complement}
                </>
              )}
            </p>
          </div>
          <div>
            <Timer weight="fill" />
            <p>
              Pedido fictício
              <br />
              <strong>Sem entrega real</strong>
            </p>
          </div>
          <div>
            <CurrencyDollar />
            <p>
              Pagamento na entrega
              <br />
              <strong>{paymentLabels[order.paymentMethod]}</strong>
            </p>
          </div>
        </section>
        <img className="success-illustration" src={illustration} alt="" />
      </div>
      <section className="order-details">
        <h2>Resumo do pedido</h2>
        <p>Pedido {order.id}</p>
        <ul>
          {order.items.map((item) => (
            <li key={item.productId}>
              {item.quantity} × {item.name} — {formatBRL(item.lineTotalCents)}
            </li>
          ))}
        </ul>
        <p>
          Subtotal: {formatBRL(order.subtotalCents)} · Entrega:{' '}
          {formatBRL(order.deliveryFeeCents)} ·{' '}
          <strong>Total: {formatBRL(order.totalCents)}</strong>
        </p>
        <Link to="/">Voltar para a Home</Link>
      </section>
    </main>
  )
}
