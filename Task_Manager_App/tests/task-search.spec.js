import { expect, test } from '@playwright/test';

const tasks = [
  { id: 1, title: 'Write quarterly report', status: 'todo' },
  { id: 2, title: 'Book flights', status: 'todo' },
  { id: 3, title: 'Pay invoices', status: 'todo' },
];

async function mockTasks(page, response = tasks) {
  let requests = 0;
  await page.route('**/api/tasks', async (route) => {
    requests += 1;
    await route.fulfill({ json: response });
  });
  return () => requests;
}

async function visibleTitles(page) {
  return page.locator('.task-list li > span:first-child').allTextContents();
}

test('filters titles immediately, ignores case, and restores original order without extra requests', async ({
  page,
}) => {
  const getRequestCount = await mockTasks(page);
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Search tasks by title' });

  await expect(page.locator('.task-list li')).toHaveCount(3);
  const requestsAfterInitialLoad = getRequestCount();
  await search.fill('book');
  await expect(page.locator('.task-list li')).toHaveCount(1);
  expect(await visibleTitles(page)).toEqual(['Book flights']);

  await search.fill('BOOK');
  expect(await visibleTitles(page)).toEqual(['Book flights']);

  await search.fill('');
  expect(await visibleTitles(page)).toEqual(tasks.map((task) => task.title));
  expect(getRequestCount()).toBe(requestsAfterInitialLoad);
});

test('shows no rows or empty-state message when a search has no matches', async ({ page }) => {
  await mockTasks(page);
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search tasks by title' }).fill('missing');

  await expect(page.locator('.task-list li')).toHaveCount(0);
  await expect(page.getByText('No tasks yet.')).toHaveCount(0);
  await expect(page.getByText(/no results/i)).toHaveCount(0);
});

test('matches whitespace literally rather than trimming the query', async ({ page }) => {
  await mockTasks(page, [
    { id: 1, title: 'Book flights', status: 'todo' },
    { id: 2, title: 'Invoices', status: 'todo' },
  ]);
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search tasks by title' }).fill(' ');

  expect(await visibleTitles(page)).toEqual(['Book flights']);
});

test('does not render malformed task titles and remains usable with valid records', async ({ page }) => {
  await mockTasks(page, [
    { id: 1, title: null, status: 'todo' },
    { id: 2, status: 'todo' },
    { id: 3, title: 42, status: 'todo' },
    { id: 4, title: 'Valid task', status: 'todo' },
  ]);
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Search tasks by title' });

  expect(await visibleTitles(page)).toEqual(['Valid task']);
  await search.fill('valid');
  expect(await visibleTitles(page)).toEqual(['Valid task']);
});

test('shows the initial load error without presenting it as an empty task list', async ({ page }) => {
  await page.route('**/api/tasks', (route) =>
    route.fulfill({ status: 500, json: { error: 'Task load failed' } }),
  );
  await page.goto('/');

  await expect(page.getByText('Task load failed')).toBeVisible();
  await expect(page.getByText('No tasks yet.')).toHaveCount(0);
});

test('shows the empty-state message when the loaded task collection is empty', async ({ page }) => {
  await mockTasks(page, []);
  await page.goto('/');

  await expect(page.getByText('No tasks yet.')).toBeVisible();
  await expect(page.locator('.task-list li')).toHaveCount(0);
});

test('reports an invalid task collection response through the existing error UI', async ({ page }) => {
  await mockTasks(page, { unexpected: true });
  await page.goto('/');

  await expect(page.getByText('Invalid task list response')).toBeVisible();
  await expect(page.getByText('No tasks yet.')).toHaveCount(0);
});

test('preserves loaded source order when multiple titles match', async ({ page }) => {
  await mockTasks(page, [
    { id: 1, title: 'Plan flight routes', status: 'todo' },
    { id: 2, title: 'Book flights', status: 'todo' },
    { id: 3, title: 'Pay invoices', status: 'todo' },
  ]);
  await page.goto('/');

  await page.getByRole('searchbox', { name: 'Search tasks by title' }).fill('flight');

  expect(await visibleTitles(page)).toEqual(['Plan flight routes', 'Book flights']);
});

test('continues applying the active query after adding and reloading tasks', async ({ page }) => {
  let loadedTasks = [
    { id: 1, title: 'Book flights', status: 'todo' },
    { id: 2, title: 'Pay invoices', status: 'todo' },
  ];

  await page.route('**/api/tasks', async (route) => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      loadedTasks = [
        ...loadedTasks,
        { id: 3, title: body.title, status: 'todo' },
      ];
      await route.fulfill({ json: loadedTasks[loadedTasks.length - 1] });
      return;
    }
    await route.fulfill({ json: loadedTasks });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search tasks by title' }).fill('flight');
  await expect(page.locator('.task-list li')).toHaveCount(1);

  await page.getByPlaceholder('New task title').fill('Plan flight routes');
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.locator('.task-list li')).toHaveCount(2);
  expect(await visibleTitles(page)).toEqual(['Book flights', 'Plan flight routes']);
});
