/* eslint-disable no-undef */
const sum = require('../client/src/sum.js');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// testing