'use strict';

const assert = require('./../../assert');

function compareNumbers(x, y) {
	if (x < y) return -1;
	if (x > y) return 1;
	return 0;
}

function sorted(items, getKey, compareKeys) {
	// @nocommit test that original is not mutated
	return items.sort((x, y) => {
		return compareKeys(getKey(x), getKey(y));
	}).map((x) => [x]);
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
		const input = ['hello', 'world'];
		describe("sort by initial char code", function () {
			const output = sorted(input, (s) => s.charCodeAt(0), compareNumbers);
			it("should sort into two groups", function () {
				assert.strictEqual(output.length, 2);
			});
			it("should sort into order", function () {
				assert.deepStrictEqual(flatten(output), ['hello', 'world']);
			});
			it("should sort into two groups with one item each", function () {
				assert.deepStrictEqual(output, [['hello'], ['world']]);
			});
		});
		describe("sort by negative initial char code", function () {
			const output = sorted(input, (s) => -s.charCodeAt(0), compareNumbers);
			it("should sort into reverse order", function () {
				assert.deepStrictEqual(flatten(output), ['world', 'hello']);
			});
		});
	});
	/*
	describe("two similar items", function () {
		const input = ['hello', 'harry'];
		describe("sort by initial char code", function () {
			const output = sorted(input, (s) => s.charCodeAt(0), compareNumbers);
			it("should sort by into two groups", function () {
				assert.deepStrictEqual(output, [['hello', 'harry']]);
			});
		});
	});
	*/
});
