import { expect, test } from '@playwright/test';

// Needs internet access: peers find each other through public Nostr relays.
test('online: host and guest play over a shared link; a third visitor sees "room full"', async ({ browser }) => {
  test.setTimeout(150_000);
  const host = await (await browser.newContext()).newPage();
  const guest = await (await browser.newContext()).newPage();

  await host.goto('/');
  await host.getByPlaceholder('Player 1').fill('Hosty');
  await host.getByRole('button', { name: 'Play online with a friend' }).click();
  const url = await host.getByLabel('Game link').inputValue();
  expect(url).toMatch(/#\/r\/[a-z0-9]+$/);

  await guest.goto(url);
  await expect(host.locator('.card').first()).toBeVisible({ timeout: 60_000 });
  await expect(guest.locator('.card').first()).toBeVisible({ timeout: 60_000 });

  const hostTurn = host.getByText('Your turn');
  const guestTurn = guest.getByText('Your turn');
  await Promise.any([hostTurn.waitFor({ timeout: 20_000 }), guestTurn.waitFor({ timeout: 20_000 })]);
  const [mover, watcher] = (await hostTurn.isVisible()) ? [host, guest] : [guest, host];

  await mover.locator('[data-index="5"]').click();
  await expect(watcher.locator('[data-index="5"]')).not.toHaveAttribute('aria-label', /face down/, { timeout: 15_000 });
  await expect(watcher.locator('[data-index="5"]')).toHaveClass(/up/);

  // The watcher cannot move on the mover's turn.
  await watcher.locator('[data-index="6"]').click({ force: true });
  await expect(host.locator('.card.up')).toHaveCount(1);

  const third = await (await browser.newContext()).newPage();
  await third.goto(url);
  await expect(third.getByRole('heading', { name: 'This room is full' })).toBeVisible({ timeout: 60_000 });
});

test('online: guest sees a clear error when nobody answers', async ({ page }) => {
  test.setTimeout(60_000);
  await page.clock.install();
  await page.goto('/#/r/zzzzzzzz');
  await expect(page.getByRole('heading', { name: 'Connecting…' })).toBeVisible();
  await page.clock.runFor(26_000);
  await expect(page.getByRole('heading', { name: 'Couldn’t connect' })).toBeVisible();
});

test('online: guest and host can reload mid-game and resume', async ({ browser }) => {
  test.setTimeout(150_000);
  const host = await (await browser.newContext()).newPage();
  const guest = await (await browser.newContext()).newPage();

  await host.goto('/');
  await host.getByRole('button', { name: 'Play online with a friend' }).click();
  const url = await host.getByLabel('Game link').inputValue();
  await guest.goto(url);

  const hostTurn = host.getByText('Your turn');
  const guestTurn = guest.getByText('Your turn');
  await Promise.any([hostTurn.waitFor({ timeout: 30_000 }), guestTurn.waitFor({ timeout: 30_000 })]);
  const mover = (await hostTurn.isVisible()) ? host : guest;
  await mover.locator('[data-index="3"]').click();
  await expect(guest.locator('[data-index="3"]')).toHaveClass(/up/, { timeout: 15_000 });

  await guest.reload();
  await expect(guest.locator('[data-index="3"]')).toHaveClass(/up/, { timeout: 60_000 });
  await expect(guest.getByText('Waiting for')).toBeHidden();

  await host.reload();
  await expect(host.locator('[data-index="3"]')).toHaveClass(/up/, { timeout: 60_000 });
  await expect(host.getByText('Waiting for')).toBeHidden({ timeout: 60_000 });
  await expect(guest.getByText('disconnected')).toBeHidden({ timeout: 60_000 });
});

test('online: a miss is shown to both players, then the turn passes to the other player', async ({ browser }) => {
  test.setTimeout(150_000);
  const host = await (await browser.newContext()).newPage();
  const guest = await (await browser.newContext()).newPage();
  await host.goto('/');
  await host.getByRole('button', { name: 'Play online with a friend' }).click();
  await guest.goto(await host.getByLabel('Game link').inputValue());

  const hostTurn = host.getByText('Your turn');
  const guestTurn = guest.getByText('Your turn');
  await Promise.any([hostTurn.waitFor({ timeout: 30_000 }), guestTurn.waitFor({ timeout: 30_000 })]);
  const [mover, watcher] = (await hostTurn.isVisible()) ? [host, guest] : [guest, host];

  // Try pairs of cards until one misses (a lucky match just gives the mover another go).
  for (let i = 0; i < 60; i += 2) {
    await mover.locator(`[data-index="${i}"]`).click();
    await mover.locator(`[data-index="${i + 1}"]`).click();
    await expect(watcher.locator('.card.up')).toHaveCount(2, { timeout: 15_000 });
    await expect(watcher.locator('.card.up')).toHaveCount(0, { timeout: 15_000 });
    if ((await watcher.locator('.card.matched').count()) === 0) {
      await expect(watcher.getByText('Your turn')).toBeVisible({ timeout: 10_000 });
      return;
    }
  }
});
