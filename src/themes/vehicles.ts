import {
  AmbulanceIcon, BicycleIcon, Bus01Icon, CableCarIcon, Car01Icon, CaravanIcon, CargoShipIcon, CraneIcon, DumpTruckIcon,
  ExcavatorIcon, FerryBoatIcon, ForkliftIcon, GarbageTruckIcon, GolfCartIcon, HelicopterIcon, KayakIcon, Motorbike01Icon,
  PlaneIcon, PoliceCarIcon, RocketIcon, SailboatIcon, SchoolBusIcon, ScooterElectricIcon, SemiTruckIcon, SubmarineIcon,
  TankerTruckIcon, TaxiIcon, TowTruckIcon, TractorIcon, Train01Icon, TramIcon, ZeppelinIcon,
} from '@hugeicons/core-free-icons';
import { defineItems, type Theme } from './types';

export const vehicles: Theme = {
  id: 'vehicles',
  name: 'On the Move',
  tagline: 'Wheels, wings and waves',
  font: "'Barlow Condensed', 'Arial Narrow', sans-serif",
  colors: {
    background: '#eef1f6',
    surface: '#ffffff',
    text: '#1d2433',
    muted: '#566078',
    accent: '#ffb400',
    players: ['#d62839', '#1d5fd1'],
    ink: '#1d2433',
    paper: '#ffffff',
  },
  page: 'repeating-linear-gradient(0deg,#eef1f6 0 118px,#dfe4ee 118px 122px)',
  cardBack: 'repeating-linear-gradient(45deg,#8aa0c6 0 12px,#7f96be 12px 24px)',
  cardBackEdge: '#566a91',
  radius: 18,
  stroke: 1.8,
  tiles: ['#f2cf7a', '#8fd3ea', '#f0a3a3', '#a6e3b4', '#f2cdaa', '#c3c3f0', '#f2b5d4', '#a9dfdc'],
  items: defineItems([
    [Car01Icon, 'Car'], [Bus01Icon, 'Bus'], [BicycleIcon, 'Bicycle'], [RocketIcon, 'Rocket'], [Train01Icon, 'Train'],
    [PlaneIcon, 'Airplane'], [SailboatIcon, 'Sailboat'], [HelicopterIcon, 'Helicopter'], [Motorbike01Icon, 'Motorbike'],
    [ScooterElectricIcon, 'Scooter'], [TractorIcon, 'Tractor'], [SubmarineIcon, 'Submarine'], [TaxiIcon, 'Taxi'],
    [AmbulanceIcon, 'Ambulance'], [PoliceCarIcon, 'Police car'], [SchoolBusIcon, 'School bus'], [TramIcon, 'Tram'],
    [CableCarIcon, 'Cable car'], [CaravanIcon, 'Caravan'], [CargoShipIcon, 'Cargo ship'], [FerryBoatIcon, 'Ferry'],
    [KayakIcon, 'Kayak'], [ZeppelinIcon, 'Airship'], [GolfCartIcon, 'Golf cart'], [DumpTruckIcon, 'Dump truck'],
    [GarbageTruckIcon, 'Garbage truck'], [SemiTruckIcon, 'Semi truck'], [TankerTruckIcon, 'Tanker truck'],
    [TowTruckIcon, 'Tow truck'], [ExcavatorIcon, 'Excavator'], [ForkliftIcon, 'Forklift'], [CraneIcon, 'Crane'],
  ]),
};
