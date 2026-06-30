import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const baseUrl = process.env.HELP_SCREENSHOT_BASE_URL || 'http://localhost:5178';
const authDir = path.resolve('playwright/.auth');
const storageStatePath = path.join(authDir, 'admin.json');

await fs.mkdir(authDir, { recursive: true });

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

try {
  await page.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle' });

  if (!page.url().includes('/admin/dashboard')) {
    console.log('Sign in to the admin dashboard in the opened browser window.');
    console.log('When you reach /admin/dashboard, press Enter here to save the session.');
    const rl = readline.createInterface({ input, output });
    await rl.question('');
    rl.close();
  }

  await page.waitForURL(/\/admin\/dashboard/, { timeout: 120_000 });
  await context.storageState({ path: storageStatePath });
  console.log(`Saved Playwright auth state to ${storageStatePath}`);
  console.log('Run: npm run help-screenshots');
} finally {
  await context.close();
  await browser.close();
}
