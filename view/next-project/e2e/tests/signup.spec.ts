import { expect, test } from '@playwright/test';

const apiURL = process.env.API_URL || 'http://api:1323';

async function waitForService(url: string) {
  const deadline = Date.now() + 60_000;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
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
});

test('新規登録後に current_user が 404 にならず My Page に遷移する', async ({ page }) => {
  const currentUserStatuses: number[] = [];
  const page404Responses: string[] = [];

  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('/current_user')) {
      currentUserStatuses.push(response.status());
    }
    if (response.status() === 404) {
      page404Responses.push(url);
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: '新規登録' }).click();

  const timestamp = Date.now();
  const email = `e2e-signup-${timestamp}@example.com`;
  const name = `E2E Signup ${timestamp}`;

  await page.locator('input[type="text"]').nth(0).fill(name);
  await page.locator('input[type="text"]').nth(1).fill(email);
  await page.locator('input[type="password"]').nth(0).fill('password123');
  await page.locator('input[type="password"]').nth(1).fill('password123');

  const signupRequestPromise = page.waitForRequest(
    (request) => request.url().includes('/mail_auth/signup') && request.method() === 'POST',
  );

  await page.getByRole('button', { name: '登録' }).click();

  const signupRequest = await signupRequestPromise;
  const signupRequestURL = new URL(signupRequest.url());
  const signupRequestBody = JSON.parse(signupRequest.postData() ?? '{}');

  expect(signupRequestURL.search).toBe('');
  expect(signupRequestBody).toMatchObject({
    email,
    password: 'password123',
    name,
    bureau_id: 1,
    role_id: 1,
  });

  await expect(page).toHaveURL(/\/my_page/);
  await expect(page.getByRole('heading', { name: 'My Page' })).toBeVisible();

  expect(currentUserStatuses).toContain(200);
  expect(currentUserStatuses).not.toContain(404);
  expect(page404Responses).toEqual([]);
});
