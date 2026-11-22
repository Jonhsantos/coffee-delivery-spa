import type { Coffee } from '../types/coffee'
import traditional from '../assets/coffees/expresso-tradicional.png'
import americano from '../assets/coffees/expresso-americano.png'
import creamy from '../assets/coffees/expresso-cremoso.png'
import iced from '../assets/coffees/expresso-gelado.png'
import milk from '../assets/coffees/cafe-com-leite.png'
import latte from '../assets/coffees/latte.png'
import cappuccino from '../assets/coffees/capuccino.png'
import macchiato from '../assets/coffees/macchiato.png'
import mocaccino from '../assets/coffees/mocaccino.png'
import chocolate from '../assets/coffees/chocolate-quente.png'
import cuban from '../assets/coffees/cubano.png'
import hawaiian from '../assets/coffees/havaiano.png'
import arabic from '../assets/coffees/arabe.png'
import irish from '../assets/coffees/irlandes.png'

export const coffees: readonly Coffee[] = [
  {
    id: 'expresso-tradicional',
    name: 'Expresso Tradicional',
    description: 'O tradicional café feito com água quente e grãos moídos',
    imageUrl: traditional,
    category: 'Tradicional',
    tags: ['Tradicional'],
    priceCents: 990,
  },
  {
    id: 'cafe-com-leite',
    name: 'Café com Leite',
    description: 'Meio a meio de expresso tradicional com leite vaporizado',
    imageUrl: milk,
    category: 'Tradicional',
    tags: ['Tradicional', 'com leite'],
    priceCents: 990,
  },
  {
    id: 'mocaccino',
    name: 'Mocaccino',
    description: 'Café expresso com calda de chocolate, pouco leite e espuma',
    imageUrl: mocaccino,
    category: 'Tradicional',
    tags: ['Tradicional', 'com leite'],
    priceCents: 990,
  },
  {
    id: 'arabe',
    name: 'Árabe',
    description: 'Bebida preparada com grãos de café árabe e especiarias',
    imageUrl: arabic,
    category: 'especial',
    tags: ['especial'],
    priceCents: 990,
  },
  {
    id: 'expresso-americano',
    name: 'Expresso Americano',
    description: 'Expresso diluído, menos intenso que o tradicional',
    imageUrl: americano,
    category: 'Tradicional',
    tags: ['Tradicional'],
    priceCents: 990,
  },
  {
    id: 'latte',
    name: 'Latte',
    description:
      'Uma dose de café expresso com o dobro de leite e espuma cremosa',
    imageUrl: latte,
    category: 'Tradicional',
    tags: ['Tradicional', 'com leite'],
    priceCents: 990,
  },
  {
    id: 'chocolate-quente',
    name: 'Chocolate Quente',
    description: 'Bebida feita com chocolate dissolvido no leite quente e café',
    imageUrl: chocolate,
    category: 'especial',
    tags: ['especial', 'com leite'],
    priceCents: 990,
  },
  {
    id: 'irlandes',
    name: 'Irlandês',
    description: 'Bebida a base de café, uísque irlandês, açúcar e chantilly',
    imageUrl: irish,
    category: 'especial',
    tags: ['especial', 'alcoólico'],
    priceCents: 990,
  },
  {
    id: 'expresso-cremoso',
    name: 'Expresso Cremoso',
    description: 'Café expresso tradicional com espuma cremosa',
    imageUrl: creamy,
    category: 'Tradicional',
    tags: ['Tradicional'],
    priceCents: 990,
  },
  {
    id: 'capuccino',
    name: 'Capuccino',
    description:
      'Bebida com canela feita de doses iguais de café, leite e espuma',
    imageUrl: cappuccino,
    category: 'Tradicional',
    tags: ['Tradicional', 'com leite'],
    priceCents: 990,
  },
  {
    id: 'cubano',
    name: 'Cubano',
    description:
      'Drink gelado de café expresso com rum, creme de leite e hortelã',
    imageUrl: cuban,
    category: 'especial',
    tags: ['especial', 'alcoólico', 'gelado'],
    priceCents: 990,
  },
  {
    id: 'expresso-gelado',
    name: 'Expresso Gelado',
    description: 'Bebida preparada com café expresso e cubos de gelo',
    imageUrl: iced,
    category: 'Tradicional',
    tags: ['Tradicional', 'gelado'],
    priceCents: 990,
  },
  {
    id: 'macchiato',
    name: 'Macchiato',
    description:
      'Café expresso misturado com um pouco de leite quente e espuma',
    imageUrl: macchiato,
    category: 'Tradicional',
    tags: ['Tradicional', 'com leite'],
    priceCents: 990,
  },
  {
    id: 'havaiano',
    name: 'Havaiano',
    description: 'Bebida adocicada preparada com café e leite de coco',
    imageUrl: hawaiian,
    category: 'especial',
    tags: ['especial'],
    priceCents: 990,
  },
]
