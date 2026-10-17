import {
  BiscuitIcon, Bread01Icon, BubbleTea01Icon, CakeIcon, CandyCaneIcon, CandyIcon, CheeseIcon, ChocolateIcon, Coffee01Icon,
  CookieIcon, CottonCandyIcon, CroissantIcon, Cupcake01Icon, DonutIcon, DrumstickIcon, EggFriedIcon, FrenchFries01Icon,
  Hamburger01Icon, Honey01Icon, IceCreamConeIcon, LollipopIcon, MilkBottleIcon, NoodlesIcon, Pizza01Icon, PopcornIcon,
  PopsicleIcon, SandwichIcon, SausageIcon, SodaCanIcon, SoupIcon, Sushi01Icon, Taco01Icon,
} from '@hugeicons/core-free-icons';
import { defineItems, type Theme } from './types';

export const snacks: Theme = {
  id: 'snacks',
  name: 'Snack Attack',
  tagline: 'Sweet, salty, and a bit silly',
  font: "'Chewy', 'Comic Sans MS', cursive",
  colors: {
    background: '#ffd6e8',
    surface: '#fff0f7',
    text: '#4a1d3d',
    muted: '#7d4a6d',
    accent: '#c2185b',
    players: ['#c2185b', '#5b3fd9'],
    ink: '#4a1d3d',
    paper: '#ffffff',
  },
  page: 'linear-gradient(135deg,#ffd6e8 0%,#e3d4ff 55%,#d0e8ff 100%)',
  cardBack: 'radial-gradient(circle,#ffe3ef 2px,transparent 3px) 0 0/14px 14px,#f59cc4',
  cardBackEdge: '#e0508f',
  radius: 40,
  stroke: 1.7,
  tiles: ['#ffb3d1', '#ffe29a', '#b5f0d0', '#c4b5fd', '#ffc9a3', '#a5e1ff', '#fff1a8', '#f9a8d4'],
  items: defineItems([
    [DonutIcon, 'Doughnut'], [Taco01Icon, 'Taco'], [Pizza01Icon, 'Pizza'], [Sushi01Icon, 'Sushi'],
    [PopcornIcon, 'Popcorn'], [Hamburger01Icon, 'Burger'], [FrenchFries01Icon, 'Fries'], [CookieIcon, 'Cookie'],
    [Cupcake01Icon, 'Cupcake'], [IceCreamConeIcon, 'Ice cream'], [LollipopIcon, 'Lollipop'], [CandyIcon, 'Candy'],
    [CandyCaneIcon, 'Candy cane'], [CottonCandyIcon, 'Cotton candy'], [ChocolateIcon, 'Chocolate bar'],
    [CakeIcon, 'Cake'], [BiscuitIcon, 'Biscuit'], [CroissantIcon, 'Croissant'], [Bread01Icon, 'Bread'],
    [SandwichIcon, 'Sandwich'], [SausageIcon, 'Sausage'], [DrumstickIcon, 'Drumstick'], [EggFriedIcon, 'Fried egg'],
    [CheeseIcon, 'Cheese'], [NoodlesIcon, 'Noodles'], [SoupIcon, 'Soup'], [BubbleTea01Icon, 'Bubble tea'],
    [Coffee01Icon, 'Coffee'], [MilkBottleIcon, 'Milk'], [SodaCanIcon, 'Soda can'], [Honey01Icon, 'Honey'],
    [PopsicleIcon, 'Ice pop'],
  ]),
};
