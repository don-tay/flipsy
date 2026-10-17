export type IconData = ReadonlyArray<readonly [string, Record<string, string | number>]>;

export interface ThemeItem {
  name: string;
  icon: IconData;
  /** Index into theme.tiles. Defaults to the item's position modulo tiles.length. */
  tone?: number;
}

export interface Theme {
  id: string;
  name: string;
  tagline: string;
  font: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    /** Player colours: seat 0 and seat 1. */
    players: [string, string];
    ink: string;
    paper: string;
  };
  /** CSS `background` for the page. */
  page: string;
  /** CSS `background` for the face-down card. */
  cardBack: string;
  cardBackEdge: string;
  /** Corner radius of tiles as a percentage of the tile size. */
  radius: number;
  stroke: number;
  tiles: string[];
  items: ThemeItem[];
}

export const defineItems = (list: [IconData, string, number?][]): ThemeItem[] =>
  list.map(([icon, name, tone]) => ({ icon, name, tone }));
