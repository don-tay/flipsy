import { expect, test, type Page } from '@playwright/test';

const card = (page: Page, i: number) => page.locator(`[data-index="${i}"]`);
const labelOf = async (page: Page, i: number) => (await card(page, i).getAttribute('aria-label')) ?? '';

/** Plays a whole game using only what a player can see, fast-forwarding the 1s mismatch delay. */
async function playToEnd(page: Page) {
  const known = new Map<number, string>();
  const matched = new Set<number>();
  const flip = async (i: number) => {
    await card(page, i).click();
    const name = await labelOf(page, i);
    known.set(i, name);
    return name;
  };
  const settle = () => page.clock.runFor(1200);

  while (matched.size < 64) {
    const a = [...Array(64).keys()].find((i) => !matched.has(i) && !known.has(i));
    if (a === undefined) {
      const first = [...known.keys()].find((i) => !matched.has(i))!;
      const second = [...known.keys()].find((i) => i !== first && !matched.has(i) && known.get(i) === known.get(first))!;
      await flip(first);
      await flip(second);
      matched.add(first).add(second);
      await settle();
      continue;
    }
    const nameA = await flip(a);
    const twin = [...known.keys()].find((i) => i !== a && !matched.has(i) && known.get(i) === nameA);
    if (twin !== undefined) {
      await flip(twin);
      matched.add(a).add(twin);
    } else {
      const b = [...Array(64).keys()].find((i) => i !== a && !matched.has(i) && !known.has(i))!;
      const nameB = await flip(b);
      if (nameA === nameB) matched.add(a).add(b);
    }
    await settle();
  }
}

test('local: full two-player game with rematch', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await page.getByPlaceholder('Player 1').fill('Ana');
  await page.getByPlaceholder('Player 2').fill('Ben');
  await page.getByRole('button', { name: 'Play on this device' }).click();

  await expect(page.locator('.card')).toHaveCount(64);
  await expect(page.locator('.player.active')).toHaveCount(1);

  await playToEnd(page);

  const dialog = page.getByRole('dialog', { name: 'Game over' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h1')).toHaveText(/wins!|draw/);
  await dialog.getByRole('button', { name: 'Rematch' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('.card.matched')).toHaveCount(0);
});

test('local: turn timer passes the turn', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await page.getByLabel('Turn timer').check();
  await page.getByLabel('Seconds per turn').fill('10');
  await page.getByRole('button', { name: 'Play on this device' }).click();

  const active = page.locator('.player.active .pname');
  const before = await active.innerText();
  await page.clock.runFor(10_500);
  await expect(active).not.toHaveText(before);
});

test('local: keyboard play and screen-reader labels', async ({ page }) => {
  await page.goto('/#/local');
  await card(page, 0).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await expect(card(page, 9)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(card(page, 9)).not.toHaveAttribute('aria-label', /face down/);
  await expect(page.locator('[aria-live]')).toContainText('flipped');
});

test('local: the whole 8x8 board fits a small phone without scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/#/local');
  const box = await card(page, 63).boundingBox();
  expect(box!.x + box!.width).toBeLessThanOrEqual(360);
  expect(box!.y + box!.height).toBeLessThanOrEqual(640);
  expect(box!.width).toBeGreaterThanOrEqual(38);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(640);
});
