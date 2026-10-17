import {
  Backpack01Icon, Book01Icon, Briefcase01Icon, CalculatorIcon, Calendar01Icon, ClipboardIcon, Clock01Icon,
  DrawingCompassIcon, EraserIcon, File01Icon, FloppyDiskIcon, Folder01Icon, HeadphonesIcon, HighlighterIcon, KeyboardIcon,
  LampDeskIcon, LaptopIcon, Mail01Icon, MonitorIcon, Mouse01Icon, Notebook01Icon, PaintBrush01Icon, PaletteIcon,
  PaperclipIcon, Pen01Icon, PencilIcon, PinIcon, PrinterIcon, RulerIcon, Scissor01Icon, Stamp01Icon, StickyNote01Icon,
} from '@hugeicons/core-free-icons';
import { defineItems, type Theme } from './types';

export const desk: Theme = {
  id: 'desk',
  name: 'Desk Life',
  tagline: 'Notebook doodles and stationery',
  font: "'Patrick Hand', 'Segoe Print', cursive",
  colors: {
    background: '#f7f4ea',
    surface: '#ffffff',
    text: '#1f2a44',
    muted: '#53607f',
    accent: '#1f2a44',
    players: ['#c62828', '#1f5fc2'],
    ink: '#1f2a44',
    paper: '#ffffff',
  },
  page: 'linear-gradient(90deg,transparent 0 47px,#f1a7a7 47px 49px,transparent 49px),repeating-linear-gradient(transparent 0 27px,#cfe0f2 27px 28px),#f7f4ea',
  cardBack:
    'linear-gradient(#a9c4e8 1px,transparent 1px) 0 0/9px 9px,linear-gradient(90deg,#a9c4e8 1px,transparent 1px) 0 0/9px 9px,#e6effb',
  cardBackEdge: '#7f9fcf',
  radius: 8,
  stroke: 1.6,
  tiles: ['#fff176', '#ffab91', '#a5d6a7', '#90caf9', '#f48fb1', '#ce93d8', '#80deea', '#ffcc80'],
  items: defineItems([
    [PencilIcon, 'Pencil'], [Pen01Icon, 'Pen'], [EraserIcon, 'Eraser'], [RulerIcon, 'Ruler'], [Scissor01Icon, 'Scissors'],
    [PaperclipIcon, 'Paperclip'], [PinIcon, 'Push pin'], [StickyNote01Icon, 'Sticky note'], [HighlighterIcon, 'Highlighter'],
    [Notebook01Icon, 'Notebook'], [Book01Icon, 'Book'], [CalculatorIcon, 'Calculator'], [Calendar01Icon, 'Calendar'],
    [ClipboardIcon, 'Clipboard'], [Clock01Icon, 'Clock'], [DrawingCompassIcon, 'Compass'], [File01Icon, 'File'],
    [Folder01Icon, 'Folder'], [FloppyDiskIcon, 'Floppy disk'], [HeadphonesIcon, 'Headphones'], [KeyboardIcon, 'Keyboard'],
    [LampDeskIcon, 'Desk lamp'], [LaptopIcon, 'Laptop'], [Mail01Icon, 'Envelope'], [MonitorIcon, 'Monitor'],
    [Mouse01Icon, 'Computer mouse'], [PaintBrush01Icon, 'Paintbrush'], [PaletteIcon, 'Palette'], [PrinterIcon, 'Printer'],
    [Stamp01Icon, 'Stamp'], [Backpack01Icon, 'Backpack'], [Briefcase01Icon, 'Briefcase'],
  ]),
};
