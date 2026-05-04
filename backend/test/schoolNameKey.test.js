const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeSchoolName } = require('../src/utils/schoolNameKey');

test('normalizeSchoolName trims and collapses internal spaces', () => {
  assert.equal(normalizeSchoolName('  โรงเรียน   ตัวอย่าง  '), 'โรงเรียน ตัวอย่าง');
});

test('normalizeSchoolName lowercases latin letters', () => {
  assert.equal(normalizeSchoolName('ABC School '), 'abc school');
});

test('normalizeSchoolName handles empty', () => {
  assert.equal(normalizeSchoolName(''), '');
  assert.equal(normalizeSchoolName(null), '');
});
