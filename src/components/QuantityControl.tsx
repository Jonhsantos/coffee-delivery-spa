import { Minus, Plus } from '@phosphor-icons/react'
import '../styles/quantity-control.css'

interface QuantityControlProps {
  productName: string
  quantity: number
  onChange: (quantity: number) => void
}

export function QuantityControl({
  productName,
  quantity,
  onChange,
}: QuantityControlProps) {
  const valid = Number.isSafeInteger(quantity) && quantity >= 1

  function changeQuantity(delta: number) {
    const next = quantity + delta
    if (valid && Number.isSafeInteger(next) && next >= 1) onChange(next)
  }

  return (
    <div
      className="quantity-control"
      role="group"
      aria-label={`Quantidade de ${productName}`}
    >
      <button
        type="button"
        aria-label={`Diminuir quantidade de ${productName}`}
        disabled={!valid || quantity === 1}
        onClick={() => changeQuantity(-1)}
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <span aria-live="polite">{valid ? quantity : '—'}</span>
      <button
        type="button"
        aria-label={`Aumentar quantidade de ${productName}`}
        disabled={!valid || quantity === Number.MAX_SAFE_INTEGER}
        onClick={() => changeQuantity(1)}
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
