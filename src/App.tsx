import { BrowserRouter, Link, Route, Routes } from 'react-router'
import {
  Coffee,
  MapPin,
  Moon,
  Package,
  ShoppingCart,
  Sun,
  Timer,
} from '@phosphor-icons/react'
import { useContext, useState } from 'react'
import logo from './assets/sKMTC.svg'
import { QuantityControl } from './components/QuantityControl'
import { coffees } from './data/coffees'
import { useCart } from './hooks/useCart'
import type { Coffee as CoffeeType } from './types/coffee'
import { formatBRL } from './utils/money'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import { ThemeContext } from './contexts/ThemeContext'
import { ThemeProvider } from './contexts/ThemeProvider'
import './styles/app.css'

function Card({ coffee }: { coffee: CoffeeType }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  return (
    <article className="coffee-card">
      <img src={coffee.imageUrl} alt={coffee.name} />
      <div className="tags">
        {(coffee.tags ?? [coffee.category]).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <h3>{coffee.name}</h3>
      <p>{coffee.description}</p>
      <div className="card-actions">
        <strong>{formatBRL(coffee.priceCents)}</strong>
        <QuantityControl
          productName={coffee.name}
          quantity={quantity}
          onChange={setQuantity}
        />
        <button
          className="add-button"
          aria-label={`Adicionar ${coffee.name} ao carrinho`}
          onClick={() => {
            addItem(coffee.id, quantity)
            setAdded(true)
          }}
        >
          <ShoppingCart size={22} weight="fill" />
        </button>
      </div>
      <span className="sr-only" role="status">
        {added ? `${coffee.name} adicionado ao carrinho` : ''}
      </span>
    </article>
  )
}

function Home() {
  // O catálogo está organizado em colunas no arquivo de referência.
  const order = [0, 4, 8, 11, 1, 5, 9, 12, 2, 6, 10, 13, 3, 7]
  return (
    <main>
      <section className="hero container">
        <div>
          <h1>Encontre o café perfeito para qualquer hora do dia</h1>
          <p>
            Com o Coffee Delivery você recebe seu café onde estiver, a qualquer
            hora
          </p>
          <ul className="benefits">
            <li>
              <ShoppingCart weight="fill" /> Compra simples e segura
            </li>
            <li>
              <Package weight="fill" /> Embalagem mantém o café intacto
            </li>
            <li>
              <Timer weight="fill" /> Entrega rápida e rastreada
            </li>
            <li>
              <Coffee weight="fill" /> O café chega fresquinho até você
            </li>
          </ul>
        </div>
        <img className="hero-image" src={coffees[0].imageUrl} alt="" />
      </section>
      <section className="container catalog">
        <h2>Nossos cafés</h2>
        <div className="coffee-grid">
          {order
            .map((index) => coffees[index])
            .map((coffee) => (
              <Card key={coffee.id} coffee={coffee} />
            ))}
        </div>
      </section>
    </main>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <main className="container">
      <h1>{title}</h1>
      <Link to="/">Voltar para a Home</Link>
    </main>
  )
}

function Layout() {
  const { unitCount } = useCart()
  const { theme, toggleTheme } = useContext(ThemeContext)
  return (
    <BrowserRouter>
      <header className="container header">
        <Link to="/" aria-label="Café Rodinhas - início">
          <img src={logo} alt="Café Rodinhas" />
        </Link>
        <div className="header-actions">
          <span className="location">
            <MapPin size={22} weight="fill" /> Porto Alegre, RS
          </span>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'
            }
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link
            className="cart-link"
            to="/checkout"
            aria-label={`Carrinho: ${unitCount} unidades`}
          >
            <ShoppingCart size={22} weight="fill" />
            {unitCount > 0 && <span>{unitCount}</span>}
          </Link>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route
          path="*"
          element={<Placeholder title="Página não encontrada" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  )
}
