import {
  AmericanFootballIcon, BadmintonShuttleIcon, BaseballBatIcon, BaseballHelmetIcon, BaseballIcon, Basketball01Icon,
  BasketballHoopIcon, BicycleIcon, Billiard01Icon, BowlingBallIcon, BowlingPinsIcon, BoxingBagIcon, BoxingGloveIcon,
  CricketBatIcon, Dumbbell01Icon, EquipmentWeightliftingIcon, FencingMaskIcon, FootballIcon, GolfBallIcon, GolfBatIcon,
  GymnasticRingsIcon, HockeyIcon, Medal01Icon, RollerSkateIcon, RunningShoesIcon, SkiIcon, SkippingRopeIcon,
  TableTennisBatIcon, TennisBallIcon, TennisRacketIcon, TrophyIcon, WhistleIcon,
} from '@hugeicons/core-free-icons';
import { defineItems, type Theme } from './types';

export const sports: Theme = {
  id: 'sports',
  name: 'Sports Day',
  tagline: 'Game on, varsity style',
  font: "'Bebas Neue', Impact, sans-serif",
  colors: {
    background: '#0f2a1d',
    surface: '#17402b',
    text: '#f5f1e6',
    muted: '#b9c9bd',
    accent: '#ffcf33',
    players: ['#ff6b6b', '#5db3ff'],
    ink: '#101510',
    paper: '#ffffff',
  },
  page: 'linear-gradient(180deg,#143523,#0f2a1d)',
  cardBack: 'repeating-linear-gradient(45deg,#34508f 0 10px,#2f4a86 10px 20px)',
  cardBackEdge: '#1f3366',
  radius: 8,
  stroke: 1.9,
  tiles: ['#f2a7a7', '#f1de8f', '#a9d9ac', '#9fc4f0', '#f1c493', '#cdb4ec', '#e9e5d8', '#92d6cc'],
  items: defineItems([
    [FootballIcon, 'Soccer ball'], [TennisBallIcon, 'Tennis ball'], [Basketball01Icon, 'Basketball'],
    [BaseballIcon, 'Baseball'], [AmericanFootballIcon, 'American football'], [GolfBallIcon, 'Golf ball'],
    [BowlingBallIcon, 'Bowling ball'], [Billiard01Icon, 'Billiards'], [TennisRacketIcon, 'Tennis racket'],
    [TableTennisBatIcon, 'Ping-pong paddle'], [BadmintonShuttleIcon, 'Shuttlecock'], [BaseballBatIcon, 'Baseball bat'],
    [BaseballHelmetIcon, 'Batting helmet'], [BasketballHoopIcon, 'Basketball hoop'], [BicycleIcon, 'Bicycle'],
    [BowlingPinsIcon, 'Bowling pins'], [BoxingBagIcon, 'Punching bag'], [BoxingGloveIcon, 'Boxing glove'],
    [CricketBatIcon, 'Cricket bat'], [Dumbbell01Icon, 'Dumbbell'], [EquipmentWeightliftingIcon, 'Barbell'],
    [FencingMaskIcon, 'Fencing mask'], [GolfBatIcon, 'Golf club'], [GymnasticRingsIcon, 'Gymnastic rings'],
    [HockeyIcon, 'Hockey stick'], [WhistleIcon, 'Whistle'], [Medal01Icon, 'Medal'], [RollerSkateIcon, 'Roller skate'],
    [RunningShoesIcon, 'Running shoes'], [SkiIcon, 'Ski'], [SkippingRopeIcon, 'Jump rope'], [TrophyIcon, 'Trophy'],
  ]),
};
