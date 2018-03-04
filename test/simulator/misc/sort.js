'use strict';

const assert = require('assert');
const sortedStable = require('../../../lib/sort').sortedStable;

function compareNumbers(a, b) {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

function compareStringLengths(a, b) {
	return compareNumbers(a.length, b.length);
}

describe(`stable sort`, function () {
	it(`should sort an empty array`, function () {
		const input = [];
		const output = sortedStable(input, compareNumbers);
		assert.deepStrictEqual(output, []);
	});
	it(`should return a new array`, function () {
		const input = [1, 2, 3, 4];
		const output = sortedStable(input, compareNumbers);
		assert.notStrictEqual(output, input);
	});
	it(`should not mutate the input array`, function () {
		const input = [4, 3, 2, 1];
		sortedStable(input, compareNumbers);
		assert.deepStrictEqual(input, [4, 3, 2, 1]);
	});
	it(`should sort a single-number array`, function () {
		const input = [1];
		const output = sortedStable(input, compareNumbers);
		assert.deepStrictEqual(output, [1]);
	});
	it(`should sort an already-sorted array of numbers`, function () {
		const input = [1, 2, 4, 100];
		const output = sortedStable(input, compareNumbers);
		assert.deepStrictEqual(output, [1, 2, 4, 100]);
	});
	it(`should sort a reversed array of numbers`, function () {
		const input = [100, 4, 2, 1];
		const output = sortedStable(input, compareNumbers);
		assert.deepStrictEqual(output, [1, 2, 4, 100]);
	});
	it(`should sort an array of strings by length`, function () {
		const input = ['I', 'thought', 'what', 'I\'d', 'do'];
		const output = sortedStable(input, compareStringLengths);
		assert.deepStrictEqual(output, ['I', 'do', 'I\'d', 'what', 'thought']);
	});
	it(`should preserve relative word order when sorting an array of strings by length`, function () {
		const input = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'];
		const output = sortedStable(input, compareStringLengths);
		assert.deepStrictEqual(output, [
			// Three-letter words:
			'the', 'fox', 'the', 'dog',
			// Four-letter words:
			'over', 'lazy',
			// Five-letter words:
			'quick', 'brown', 'jumps',
		]);
	});
	it(`should preserve relative word order when sorting a large array of strings by length`, function () {
		// At the time of writing, Array.prototype.sort's implementation
		// in the V8 JavaScript engine uses a stable sort for arrays
		// with less than 11 items, and uses a non-stable sort for
		// larger arrays. If sortedStable uses a similar implementation,
		// this test will likely fail.
		const input = [
			'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog',
			'the', 'five', 'boxing', 'wizards', 'jump', 'quickly',
			'pack', 'my', 'box', 'with', 'five', 'dozen', 'liquor', 'jugs',
		];
		const output = sortedStable(input, compareStringLengths);
		assert.deepStrictEqual(output, [
			// Two-letter words:
			'my',
			// Three-letter words:
			'the', 'fox', 'the', 'dog', 'the', 'box',
			// Four-letter words:
			'over', 'lazy', 'five', 'jump', 'pack', 'with', 'five', 'jugs',
			// Five-letter words:
			'quick', 'brown', 'jumps', 'dozen',
			// Six-letter words:
			'boxing', 'liquor',
			// Seven-letter words:
			'wizards', 'quickly',
		]);
	});
});
