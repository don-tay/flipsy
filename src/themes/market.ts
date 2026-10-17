import {
  Apple01Icon, ApricotIcon, AvocadoIcon, BananaIcon, BeanIcon, BroccoliIcon, CarrotIcon, CherryIcon, CornIcon,
  GrapesIcon, Mushroom01Icon, OrangeIcon, PepperIcon, PumpkinIcon, WatermelonIcon,
} from '@hugeicons/core-free-icons';
import * as h from './hand';
import { defineItems, type Theme } from './types';

export const market: Theme = {
  id: 'market',
  name: 'Fresh Market',
  tagline: 'Straight from the farm stand',
  font: "'DM Serif Display', Georgia, serif",
  colors: {
    background: '#f5efe0',
    surface: '#fffaf0',
    text: '#2d3a1f',
    muted: '#5a6847',
    accent: '#3f7d20',
    players: ['#b93c0b', '#2456c7'],
    ink: '#2d3a1f',
    paper: '#ffffff',
  },
  page: 'repeating-conic-gradient(#efe6d0 0 25%,#f5efe0 0 50%) 0 0/48px 48px',
  cardBack: 'repeating-conic-gradient(#3f7d20 0 25%,#fffaf0 0 50%) 0 0/14px 14px',
  cardBackEdge: '#2d5a17',
  radius: 14,
  stroke: 1.5,
  tiles: ['#ffd0c4', '#fff2a8', '#cfeea0', '#ffdba6', '#e6cff5', '#bfeedb', '#ffbcbc', '#f2e3b3'],
  items: defineItems([
    [Apple01Icon, 'Apple', 6], [BananaIcon, 'Banana'], [CherryIcon, 'Cherries'], [h.lemon, 'Lemon'], [GrapesIcon, 'Grapes'],
    [CarrotIcon, 'Carrot'], [h.pear, 'Pear'], [OrangeIcon, 'Orange', 3], [h.strawberry, 'Strawberry'],
    [BroccoliIcon, 'Broccoli'], [h.pineapple, 'Pineapple'], [CornIcon, 'Corn'], [h.tomato, 'Tomato'],
    [AvocadoIcon, 'Avocado'], [h.coconut, 'Coconut'], [Mushroom01Icon, 'Mushroom'], [h.mango, 'Mango', 2],
    [PepperIcon, 'Pepper'], [h.kiwi, 'Kiwi'], [PumpkinIcon, 'Pumpkin'], [h.peach, 'Peach', 5], [WatermelonIcon, 'Watermelon'],
    [h.plum, 'Plum', 4], [BeanIcon, 'Beans'], [h.cucumber, 'Cucumber'], [ApricotIcon, 'Apricot', 1], [h.lettuce, 'Lettuce'],
    [h.onion, 'Onion'], [h.garlic, 'Garlic'], [h.eggplant, 'Eggplant'], [h.radish, 'Radish'], [h.beet, 'Beet', 0],
  ]),
};
