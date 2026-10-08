import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const redirects = JSON.parse(await readFile(new URL('../data/wordpress-legacy-redirects.json', import.meta.url), 'utf8'));
const base = process.env.SIGUE_BASE_URL || 'https://siguenetwork.org';
const origin = new URL(base).origin;
const failures = [];

for (const [source, target] of Object.entries(redirects)) {
  try {
    const response = await fetch(new URL(`${source}/?migration=1`, origin), { redirect: 'manual' });
    const location = response.headers.get('location');
    assert.ok([301, 308].includes(response.status), `${source}: HTTP ${response.status}`);
    assert.ok(location, `${source}: no Location header`);
    const destination = new URL(location, origin);
    assert.equal(destination.pathname, target, `${source}: destination`);
    assert.equal(destination.search, '?migration=1', `${source}: query string`);
  } catch (error) {
    failures.push(error.message);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`${Object.keys(redirects).length} legacy redirects verified on ${origin}`);
}
