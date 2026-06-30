import { chromium } from '@playwright/test';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { HELP_CALLOUT_SOURCE, REMOVE_CALLOUT_SOURCE } from './help-callout.mjs';

const baseUrl = process.env.HELP_SCREENSHOT_BASE_URL || 'http://localhost:5178';
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const storageStatePath = process.env.PLAYWRIGHT_STORAGE_STATE;
const outputDir = path.resolve('public/help/screenshots');
const gifFramesDir = path.resolve('scripts/gif-frames');
const gifBuilderScript = path.resolve('scripts/build-help-gifs.mjs');
const topicsFile = path.resolve('src/data/adminHelpTopics.ts');
const execFileAsync = promisify(execFile);

const usage = `Capture admin Help Center screenshots.

Required (one of):
  ADMIN_EMAIL + ADMIN_PASSWORD
  PLAYWRIGHT_STORAGE_STATE=playwright/.auth/admin.json

Optional:
  HELP_SCREENSHOT_BASE_URL=http://localhost:5178
  SKIP_HELP_GIFS=1

Setup auth once (headed browser):
  npm run help-screenshots:auth

Run:
  npm run help-screenshots
`;

if (process.argv.includes('--help')) {
  console.log(usage);
  process.exit(0);
}

if ((!adminEmail || !adminPassword) && !storageStatePath) {
  console.error(usage);
  console.error('Missing ADMIN_EMAIL/ADMIN_PASSWORD or PLAYWRIGHT_STORAGE_STATE.');
  process.exit(1);
}

const targets = await readTargetsFromTopicsFile();
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  ...(storageStatePath ? { storageState: storageStatePath } : {}),
});
const page = await context.newPage();

try {
  await login(page);

  const results = [];
  const animatedResults = [];
  for (const target of targets) {
    const result = await captureTarget(page, target);
    results.push(result);

    if (target.animated) {
      const animatedResult = await captureAnimatedDemo(page, target);
      animatedResults.push(animatedResult);
    }
  }

  if (animatedResults.some((result) => result.status === 'captured') && process.env.SKIP_HELP_GIFS !== '1') {
    await buildAnimatedGifs();
  }

  const captured = results.filter((result) => result.status === 'captured').length;
  const skipped = results.filter((result) => result.status === 'skipped').length;
  const animatedCaptured = animatedResults.filter((result) => result.status === 'captured').length;
  const animatedSkipped = animatedResults.filter((result) => result.status === 'skipped').length;

  console.log(`Captured ${captured} screenshot(s). Skipped ${skipped}.`);
  for (const result of results) {
    console.log(`${result.status === 'captured' ? '✓' : '-'} ${result.topicId}: ${result.message}`);
  }
  console.log(`Captured ${animatedCaptured} animated demo(s). Skipped ${animatedSkipped}.`);
  for (const result of animatedResults) {
    console.log(`${result.status === 'captured' ? '✓' : '-'} ${result.topicId}.gif: ${result.message}`);
  }

  if (skipped > 0 || animatedSkipped > 0) {
    process.exitCode = 1;
  }
} finally {
  await context.close();
  await browser.close();
}

async function readTargetsFromTopicsFile() {
  const source = await fs.readFile(topicsFile, 'utf8');
  const blocks = source.split(/id:\s*'/).slice(1);
  const targets = [];

  for (const block of blocks) {
    const topicId = block.match(/^([^']+)'/)?.[1];
    const selector = block.match(/screenshotTarget:\s*'([^']+)'/)?.[1];
    const label = block.match(/screenshotLabel:\s*'([^']+)'/)?.[1] || '';
    const animated = /animated:\s*true/.test(block);
    if (!topicId || !selector) continue;
    targets.push({ topicId, selector, label, animated });
  }

  return targets;
}

async function captureAnimatedDemo(page, target) {
  const topicDir = path.join(gifFramesDir, target.topicId);
  await fs.rm(topicDir, { recursive: true, force: true });
  await fs.mkdir(topicDir, { recursive: true });

  try {
    await preparePageForTopic(page, target.topicId);

    if (target.topicId === 'edit-mode-toggle') {
      await ensureEditModeOff(page);
      await captureViewportFrame(page, topicDir, '01-preview.png');
      await ensureEditModeOn(page);
      await captureViewportFrame(page, topicDir, '02-editing.png');
      return {
        topicId: target.topicId,
        status: 'captured',
        message: `scripts/gif-frames/${target.topicId}/ -> public/help/screenshots/${target.topicId}.gif`,
      };
    }

    if (target.topicId === 'edit-text') {
      await ensureEditModeOn(page);
      await page.locator('.visual-editor__preview').first().scrollIntoViewIfNeeded({ timeout: 10_000 }).catch(() => {});
      await page.waitForTimeout(300);
      await captureViewportFrame(page, topicDir, '01-before.png');

      const editable = page.locator('.visual-editor__preview [data-editable-type="text"]').first();
      if ((await editable.count()) === 0) throw new Error('editable text target not found');
      await editable.click();
      await page.waitForSelector('.inline-text-editor', { timeout: 10_000 });
      await page.waitForTimeout(300);
      await captureViewportFrame(page, topicDir, '02-editor.png');

      await page.locator('.inline-text-editor button:has-text("Cancel")').first().click({ timeout: 5000 }).catch(() => {});
      return {
        topicId: target.topicId,
        status: 'captured',
        message: `scripts/gif-frames/${target.topicId}/ -> public/help/screenshots/${target.topicId}.gif`,
      };
    }

    if (target.topicId === 'change-layout') {
      await ensureEditModeOn(page);
      await page.locator('.visual-editor__layout-button').first().scrollIntoViewIfNeeded({ timeout: 10_000 }).catch(() => {});
      await page.waitForTimeout(300);
      await captureViewportFrame(page, topicDir, '01-closed.png');

      const layoutButton = page.locator('.visual-editor__layout-button').first();
      if ((await layoutButton.count()) === 0) throw new Error('layout button not found');
      await layoutButton.click();
      await page.waitForSelector('.visual-editor__layout-modal', { timeout: 10_000 });
      await page.waitForTimeout(300);
      await captureViewportFrame(page, topicDir, '02-modal.png');

      await page.locator('.visual-editor__layout-modal .visual-editor__modal-close').first().click({ timeout: 5000 }).catch(() => {});
      return {
        topicId: target.topicId,
        status: 'captured',
        message: `scripts/gif-frames/${target.topicId}/ -> public/help/screenshots/${target.topicId}.gif`,
      };
    }

    return {
      topicId: target.topicId,
      status: 'skipped',
      message: 'no animated capture recipe for this topic',
    };
  } catch (error) {
    return {
      topicId: target.topicId,
      status: 'skipped',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

async function captureViewportFrame(page, topicDir, filename) {
  await page.screenshot({
    path: path.join(topicDir, filename),
    fullPage: false,
  });
}

async function buildAnimatedGifs() {
  const { stdout, stderr } = await execFileAsync(process.execPath, [gifBuilderScript], {
    cwd: path.resolve('.'),
  });
  if (stdout.trim()) console.log(stdout.trim());
  if (stderr.trim()) console.error(stderr.trim());
}

async function login(page) {
  await page.goto(`${baseUrl}/admin/dashboard`, { waitUntil: 'networkidle' });

  if (page.url().includes('/admin/dashboard')) {
    return;
  }

  if (!adminEmail || !adminPassword) {
    throw new Error('Not logged in and ADMIN_EMAIL/ADMIN_PASSWORD were not provided.');
  }

  await page.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle' });
  await page.fill('#email', adminEmail);
  await page.fill('#password', adminPassword);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/admin\/(dashboard|change-password)/, { timeout: 30_000 });

  if (page.url().includes('/admin/change-password')) {
    throw new Error('Admin account requires a password change before screenshots can be captured.');
  }
}

async function captureTarget(page, target) {
  await preparePageForTopic(page, target.topicId);

  const locator = page.locator(target.selector).first();
  const count = await locator.count();

  if (count === 0) {
    return {
      topicId: target.topicId,
      status: 'skipped',
      message: `selector not found: ${target.selector}`,
    };
  }

  try {
    await locator.scrollIntoViewIfNeeded({ timeout: 10_000 });
    await page.waitForTimeout(250);

    // Draw a callout box around the target and capture a medium contextual
    // region instead of a tightly cropped element ("massive button") shot.
    const clip = await page.evaluate(
      `(${HELP_CALLOUT_SOURCE})(${JSON.stringify({ selector: target.selector, label: target.label || '' })})`
    );

    if (!clip) {
      return {
        topicId: target.topicId,
        status: 'skipped',
        message: `callout target not found: ${target.selector}`,
      };
    }

    await page.waitForTimeout(120);
    await page.screenshot({
      path: path.join(outputDir, `${target.topicId}.png`),
      clip,
    });
    await page.evaluate(`(${REMOVE_CALLOUT_SOURCE})()`);

    return {
      topicId: target.topicId,
      status: 'captured',
      message: `public/help/screenshots/${target.topicId}.png (medium + callout)`,
    };
  } catch (error) {
    return {
      topicId: target.topicId,
      status: 'skipped',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

async function preparePageForTopic(page, topicId) {
  await page.goto(`${baseUrl}/admin/dashboard`, { waitUntil: 'networkidle' });

  if (topicId === 'events-tab') {
    await clickIfExists(page, '[data-onboarding="tab-events"]');
    await page.waitForTimeout(500);
    return;
  }

  if (topicId === 'create-event') {
    await clickIfExists(page, '[data-onboarding="tab-events"]');
    await page.waitForTimeout(400);
    await clickIfExists(page, 'button:has-text("Add New Event")');
    await page.waitForTimeout(500);
    return;
  }

  if (topicId === 'event-form') {
    await clickIfExists(page, '[data-onboarding="tab-events"]');
    await page.waitForTimeout(400);
    await clickIfExists(page, 'button:has-text("Add New Event")');
    await page.waitForSelector('.admin-dashboard__form', { timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(400);
    return;
  }

  if (topicId === 'analytics-tab') {
    await clickIfExists(page, '[data-onboarding="tab-analytics"]');
    await page.waitForTimeout(500);
    return;
  }

  if (topicId === 'admin-tab') {
    await clickIfExists(page, '[data-onboarding="tab-admin"]');
    await page.waitForTimeout(500);
    return;
  }

  if (topicId.startsWith('image-library')) {
    await ensureVisualEditorTab(page);
    await clickIfExists(page, '[data-onboarding="image-library"]');
    await page.waitForSelector('.image-library', { timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(500);
    return;
  }

  await ensureVisualEditorTab(page);

  if (topicId === 'staging-mode') {
    await ensureEditModeOn(page);
    const publishGroup = page.locator('[data-onboarding="publish-status"]');
    if ((await publishGroup.count()) === 0) {
      await stageDummyTextEdit(page);
      await page.waitForTimeout(800);
    }
    return;
  }

  if (topicId === 'change-layout') {
    await ensureEditModeOn(page);
    await page.locator('.visual-editor__layout-button').first().scrollIntoViewIfNeeded({ timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(300);
    return;
  }

  if (topicId === 'edit-mode-toggle' || topicId === 'edit-text' || topicId === 'edit-image') {
    await ensureEditModeOn(page);
  }

  if (topicId === 'edit-text') {
    await page.locator('.visual-editor__preview').first().scrollIntoViewIfNeeded({ timeout: 10_000 }).catch(() => {});
  }

  if (topicId === 'edit-image') {
    await page.locator('.visual-editor__preview img[data-section]').first().scrollIntoViewIfNeeded({ timeout: 10_000 }).catch(() => {});
  }
}

async function ensureVisualEditorTab(page) {
  await clickIfExists(page, '[data-onboarding="tab-visual-editor"]');
  await page.waitForTimeout(400);
}

async function ensureEditModeOn(page) {
  const toggle = page.locator('[data-onboarding="edit-mode-toggle"]').first();
  if ((await toggle.count()) === 0) return;

  const label = ((await toggle.textContent()) || '').toLowerCase();
  if (label.includes('preview')) {
    await toggle.click();
    await page.waitForTimeout(400);
  }
}

async function ensureEditModeOff(page) {
  const toggle = page.locator('[data-onboarding="edit-mode-toggle"]').first();
  if ((await toggle.count()) === 0) return;

  const label = ((await toggle.textContent()) || '').toLowerCase();
  if (label.includes('editing')) {
    await toggle.click();
    await page.waitForTimeout(400);
  }
}

async function stageDummyTextEdit(page) {
  const editable = page.locator('.visual-editor__preview [data-editable-type="text"]').first();
  if ((await editable.count()) === 0) return;

  await editable.click();
  const editor = page.locator('.inline-text-editor [contenteditable="true"]').first();
  if ((await editor.count()) === 0) return;

  await editor.fill('Help screenshot staging text');
  await page.locator('.inline-text-editor button:has-text("Save")').first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
}

async function clickIfExists(page, selector) {
  const locator = page.locator(selector).first();
  if ((await locator.count()) > 0) {
    await locator.click();
  }
}
