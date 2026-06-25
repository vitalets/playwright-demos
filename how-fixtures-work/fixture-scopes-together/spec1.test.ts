import { test } from './fixtures';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('test 1', async ({ myTestFixture, myWorkerFixture }) => { // <-- references 'myTestFixture'
  // ...
  await delay(1000);
});

test('test 2', async ({ myTestFixture, myWorkerFixture }) => { // <-- references 'myTestFixture'
  // ...
  await delay(1000);
});
