import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.retro-badge');
});

test('shows welcome screen with retro badge', async ({ page }) => {
  const badge = page.locator('.retro-badge');
  await expect(badge).toBeVisible();
  await expect(badge.locator('span')).toContainText('HismaR Dev');
});

test('executes help command', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('help');
  await input.press('Enter');
  await page.waitForSelector('.command-container');
  await expect(page.locator('.command-chip')).toContainText('/help');
});

test('executes about command', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('about');
  await input.press('Enter');
  await page.waitForSelector('.about-info');
  await expect(page.locator('.command-chip')).toContainText('/about');
});

test('executes skills command', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('skills');
  await input.press('Enter');
  await page.waitForSelector('.skills-content');
  await expect(page.locator('.command-chip')).toContainText('/skills');
});

test('executes neofetch command', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('neofetch');
  await input.press('Enter');
  await page.waitForSelector('.neofetch-wrapper');
  await expect(page.locator('.neo-headline')).toContainText('HISMAR.DEV');
});

test('executes projects command', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('projects');
  await input.press('Enter');
  await page.waitForSelector('.projects-grid');
  await expect(page.locator('.command-chip')).toContainText('/projects');
});

test('executes education command', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('education');
  await input.press('Enter');
  await page.waitForSelector('.education-list');
  await expect(page.locator('.command-chip')).toContainText('/education');
});

test('executes experience command', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('experience');
  await input.press('Enter');
  await page.waitForSelector('.experience-timeline');
  await expect(page.locator('.command-chip')).toContainText('/experience');
});

test('executes cv command', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('cv');
  await input.press('Enter');
  await page.waitForSelector('.cv-content');
  await expect(page.locator('.command-chip')).toContainText('/cv');
});

test('clear command clears console', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('help');
  await input.press('Enter');
  await page.waitForSelector('.command-container');

  await input.fill('clear');
  await input.press('Enter');
  await expect(page.locator('.command-container')).toHaveCount(0);
});

test('sudo returns permission denied', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('sudo help');
  await input.press('Enter');
  await expect(page.locator('#console-output')).toContainText(/permisos|permission/i);
});

test('unrecognized command shows error', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('foobar');
  await input.press('Enter');
  await expect(page.locator('#console-output')).toContainText(/No reconocido|Unrecognized/i);
});

test('Tab key autocompletes command', async ({ page }) => {
  const input = page.locator('#command-input');
  await input.fill('ab');
  await input.press('Tab');
  await expect(input).toHaveValue('about');
});

test('language toggle switches content', async ({ page }) => {
  const langBtn = page.locator('.lang-toggle');
  const currentLabel = await langBtn.textContent();

  if (currentLabel?.trim() === 'ES') {
    await langBtn.click();
    await expect(page.locator('#command-input')).toHaveAttribute('placeholder', /Type/);
  } else {
    await langBtn.click();
    await expect(page.locator('#command-input')).toHaveAttribute('placeholder', /escribe/i);
  }
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const hamburger = page.locator('#hamburger-btn');
  const menu = page.locator('#terminal-menu');
  const overlay = page.locator('#menu-overlay');

  await hamburger.click();
  await expect(menu).toHaveClass(/active/);
  await expect(overlay).toHaveClass(/active/);

  await overlay.click();
  await expect(menu).not.toHaveClass(/active/);
});

test('command history navigation works', async ({ page }) => {
  const input = page.locator('#command-input');

  await input.fill('help');
  await input.press('Enter');
  await page.waitForSelector('.command-container');

  await input.fill('about');
  await input.press('Enter');
  await page.waitForSelector('.about-info');

  await input.press('ArrowUp');
  await expect(input).toHaveValue('about');

  await input.press('ArrowUp');
  await expect(input).toHaveValue('help');
});
