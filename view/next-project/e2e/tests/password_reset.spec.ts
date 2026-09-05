import { expect, test } from '@playwright/test';

const apiURL = process.env.API_URL || 'http://api:1323';

async function waitForService(url: string) {
  const deadline = Date.now() + 120_000;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return;
      }
      lastError = new Error(`HTTP ${res.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Service did not become ready: ${url}. Last error: ${String(lastError)}`);
}

test.beforeAll(async () => {
  await waitForService(`${apiURL}/`);
  await waitForService(`${process.env.BASE_URL || 'http://view:3000'}/`);
}, 120_000);

test('パスワードリセット申請後に再設定メール送信の完了表示が出る', async ({ page }) => {
  const email = `e2e-reset-${Date.now()}@example.com`;

  await page.goto('/reset_password/request');

  const requestPromise = page.waitForRequest(
    (request) =>
      request.url().includes('/password_reset/request') && request.method() === 'POST',
  );

  await page.getByPlaceholder('test@example.com').fill(email);
  await page.getByRole('button', { name: '再設定メールの送信' }).click();

  const resetRequest = await requestPromise;
  const resetRequestURL = new URL(resetRequest.url());
  expect(resetRequestURL.searchParams.get('email')).toBe(email);

  await expect(page.getByText('再設定メールを送信しました')).toBeVisible();
});
