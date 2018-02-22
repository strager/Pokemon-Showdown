'use strict';

const assert = require('../../assert');
const sorted = require('../../../lib/sort').sorted;

function compareNumbers(x, y) {
	if (x < y) return -1;
	if (x > y) return 1;
	return 0;
}

function flatten(itemGroups) {
	return [].concat(...itemGroups);
}

describe("sorted", function () {
	describe("empty input", function () {
		const input = [];
		it("should sort to an empty array", function () {
			const output = sorted(input);
			assert.deepStrictEqual(output, []);
		});
	});
	describe("single item input", function () {
		const input = ['hello world'];
		it("should sort to one group with one item", function () {
			const output = sorted(input);
			assert.deepStrictEqual(output, [['hello world']]);
		});
	});
	describe("two distinct items", function () {
		const input = ['hello', 'worlds'];
		describe("sort by initial char code", function () {
			const output = sorted(input, (s) => s.charCodeAt(0), compareNumbers);
			it("should sort into order", function () {
				assert.deepStrictEqual(flatten(output), ['hello', 'worlds']);
			});
			it("should sort into two groups with one item each", function () {
				assert.deepStrictEqual(output, [['hello'], ['worlds']]);
			});
		});
		describe("sort by negative initial char code", function () {
			const output = sorted(input, (s) => -s.charCodeAt(0), compareNumbers);
			it("should sort into reverse order", function () {
				assert.deepStrictEqual(flatten(output), ['worlds', 'hello']);
			});
		});
		describe("sort by string length", function () {
			const output = sorted(input, (s) => s.length, compareNumbers);
			it("should sort into order", function () {
				assert.deepStrictEqual(flatten(output), ['hello', 'worlds']);
			});
			it("should sort into two groups with one item each", function () {
				assert.deepStrictEqual(output, [['hello'], ['worlds']]);
			});
		});
	});
	describe("two similar items", function () {
		const input = ['hello', 'harry'];
		describe("sort by initial char code", function () {
			const output = sorted(input, (s) => s.charCodeAt(0), compareNumbers);
			it("should sort preserving input order", function () {
				assert.deepStrictEqual(flatten(output), ['hello', 'harry']);
			});
			it("should sort into one group containing both items", function () {
				assert.deepStrictEqual(output, [['hello', 'harry']]);
			});
		});
		describe("sort by string length", function () {
			const output = sorted(input, (s) => s.length, compareNumbers);
			it("should sort preserving input order", function () {
				assert.deepStrictEqual(flatten(output), ['hello', 'harry']);
			});
			it("should sort into one group containing both items", function () {
				assert.deepStrictEqual(output, [['hello', 'harry']]);
			});
		});
	});
	describe("a mix of similar and different items", function () {
		const input = ['the', 'turtle', 'drinks', 'the', 'tea'];
		describe("sort by initial char code", function () {
			const output = sorted(input, (s) => s.charCodeAt(0), compareNumbers);
			it("should sort preserving input order", function () {
				assert.deepStrictEqual(flatten(output), ['drinks', 'the', 'turtle', 'the', 'tea']);
			});
			it("should sort into two groups", function () {
				assert.deepStrictEqual(output, [['drinks'], ['the', 'turtle', 'the', 'tea']]);
			});
		});
		describe("sort by string length", function () {
			const output = sorted(input, (s) => s.length, compareNumbers);
			it("should sort preserving input order", function () {
				assert.deepStrictEqual(flatten(output), ['the', 'the', 'tea', 'turtle', 'drinks']);
			});
			it("should sort into one group containing both items", function () {
				assert.deepStrictEqual(output, [['the', 'the', 'tea'], ['turtle', 'drinks']]);
			});
		});
	});
});
