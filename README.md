# Flipsy

A two-player memory game (8x8 board, 32 pairs). Play on one device, or online through a shared link.
No backend: online games connect the two browsers directly (WebRTC via [Trystero](https://github.com/dmotz/trystero),
using public Nostr relays to introduce the peers). The host's browser shuffles the deck and checks every move.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # engine, session and theme unit tests (Vitest)
npm run test:e2e   # Playwright; the online tests need internet access for the Nostr relays
npm run build
```

`#/themes` shows every icon of every theme, handy for spotting look-alikes.

## Add a theme

Create `src/themes/<id>.ts` exporting a `Theme` (palette, font, card back, tile radius/stroke, 8 tile colours and
32 `[icon, name]` items), then add it to `THEMES` in `src/themes/index.ts`. `npm test` checks the item count,
uniqueness and colour contrast.

## Layout

- `src/engine`: pure game rules (`game.ts`) and the authoritative `Session` (timers, rematch, pause).
- `src/net`: host/guest links over Trystero.
- `src/themes`: theme configs and hand-drawn icons (`hand.ts`).
- `src/ui`: React screens.

## Deploy

Pushing to `main` publishes to GitHub Pages through `.github/workflows/deploy.yml`.
Room links look like `https://<user>.github.io/flipsy/#/r/<room>`; the room id stays after the `#`.
