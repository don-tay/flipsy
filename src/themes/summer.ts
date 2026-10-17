import {
  AnchorIcon, BalloonIcon, BbqGrillIcon, BeachIcon, BinocularsIcon, BoatIcon, BucketIcon, Camera01Icon, CamperIcon,
  CampfireIcon, HatIcon, IceCreamConeIcon, KayakIcon, KiteIcon, LifebuoyIcon, Luggage01Icon, PopsicleIcon,
  SailboatIcon, SandalsIcon, ShellIcon, ShovelIcon, SoftDrink01Icon, Sun03Icon, SunglassesIcon, SurfboardIcon,
  SwimmingCapIcon, TentIcon, TreePalmIcon, UmbrellaIcon, VolleyballIcon, WatermelonIcon, WaveIcon,
} from '@hugeicons/core-free-icons';
import { defineItems, type Theme } from './types';

export const summer: Theme = {
  id: 'summer',
  name: 'Summer Vibes',
  tagline: 'Sun, sand and sunglasses',
  font: "'Fredoka', system-ui, sans-serif",
  colors: {
    background: '#ffe9c7',
    surface: '#fff6e6',
    text: '#3b2417',
    muted: '#7a5236',
    accent: '#d9381e',
    players: ['#d9381e', '#0a7f8c'],
    ink: '#3b2417',
    paper: '#ffffff',
  },
  page: 'linear-gradient(160deg,#ffe9c7 0%,#ffd2b0 60%,#ffb9a0 100%)',
  cardBack:
    'radial-gradient(circle at 50% 45%,#ffd98a 0 18%,transparent 19%),repeating-linear-gradient(135deg,#f59a6c 0 8px,#f28f5f 8px 16px)',
  cardBackEdge: '#c9502a',
  radius: 28,
  stroke: 1.6,
  tiles: ['#ffd166', '#7fd8e0', '#ff9f80', '#b6e388', '#f7a8c4', '#ffe08a', '#8fc9ff', '#ffb347'],
  items: defineItems([
    [SunglassesIcon, 'Sunglasses'], [IceCreamConeIcon, 'Ice cream'], [UmbrellaIcon, 'Beach umbrella'],
    [SandalsIcon, 'Flip-flops'], [SurfboardIcon, 'Surfboard'], [Sun03Icon, 'Sun'], [TreePalmIcon, 'Palm tree'],
    [PopsicleIcon, 'Ice pop'], [SailboatIcon, 'Sailboat'], [BucketIcon, 'Sand bucket'], [ShovelIcon, 'Sand shovel'],
    [KiteIcon, 'Kite'], [LifebuoyIcon, 'Life ring'], [ShellIcon, 'Seashell'], [WatermelonIcon, 'Watermelon'],
    [BbqGrillIcon, 'BBQ grill'], [CampfireIcon, 'Campfire'], [TentIcon, 'Tent'], [Camera01Icon, 'Camera'],
    [Luggage01Icon, 'Suitcase'], [HatIcon, 'Sun hat'], [SwimmingCapIcon, 'Swim cap'], [BinocularsIcon, 'Binoculars'],
    [SoftDrink01Icon, 'Cold drink'], [AnchorIcon, 'Anchor'], [BoatIcon, 'Boat'], [CamperIcon, 'Camper van'],
    [KayakIcon, 'Kayak'], [VolleyballIcon, 'Volleyball'], [BalloonIcon, 'Balloon'], [WaveIcon, 'Wave'],
    [BeachIcon, 'Beach'],
  ]),
};
