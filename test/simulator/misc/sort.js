'use strict';

const array = require('../../../lib/array')
const assert = require('../../assert');

function compareNumbers(x, y) {
	if (x < y) return -1;
	if (x > y) return 1;
	return 0;
}

function compareStrings(x, y) {
	if (x < y) return -1;
	if (x > y) return 1;
	return 0;
}

function compareStringLengths(x, y) {
	return compareNumbers(x.length, y.length);
}

function compareInitialCharCodes(x, y) {
	return compareNumbers(x.charCodeAt(0), y.charCodeAt(0));
}

describe("array.sortedWithTieBreaker", function () {
	describe("empty input", function () {
		const input = [];
		it("should sort to an empty array", function () {
			const output = array.sortedWithTieBreaker(input, compareStrings, (items) => items);
			assert.deepStrictEqual(output, []);
		});
		it("should not call the tie breaker", function () {
			const tieBreakerCalls = new Set();
			const output = array.sortedWithTieBreaker(input, compareStrings, (items) => {
				tieBreakerCalls.add(items.join(','));
				return items;
			});
			assert.deepStrictEqual(tieBreakerCalls, new Set());
		});
	});
	describe("single item input", function () {
		const input = ['hello world'];
		it("should sort to the input", function () {
			const output = array.sortedWithTieBreaker(input, compareStrings, (items) => items);
			assert.deepStrictEqual(output, ['hello world']);
		});
		it("should not call the tie breaker", function () {
			const tieBreakerCalls = new Set();
			const output = array.sortedWithTieBreaker(
				input,
				compareStrings,
				(items) => {
					tieBreakerCalls.add(items.join(','));
					return items;
				});
			assert.deepStrictEqual(tieBreakerCalls, new Set());
		});
	});
	describe("two distinct items", function () {
		const input = ['hello', 'worlds'];
		it("sorted by initial char code should sort into order", function () {
			const output = array.sortedWithTieBreaker(
				input,
				compareInitialCharCodes,
				(items) => items);
			assert.deepStrictEqual(output, ['hello', 'worlds']);
		});
		it("sorted by initial char code should not call the tie breaker", function () {
			const tieBreakerCalls = new Set();
			const output = array.sortedWithTieBreaker(
				input,
				compareInitialCharCodes,
				(items) => {
					tieBreakerCalls.push(items.join(','));
					return items;
				});
			assert.deepStrictEqual(tieBreakerCalls, new Set());
		});
		it("sorted by negative initial char code should sort into reverse order", function () {
			const output = array.sortedWithTieBreaker(
				input,
				(string1, string2) => compareNumbers(-string1.charCodeAt(0), -string2.charCodeAt(0)),
				(items) => items);
			assert.deepStrictEqual(output, ['worlds', 'hello']);
		});
		it("sorted by string length should sort into order", function () {
			const output = array.sortedWithTieBreaker(
				input,
				compareStringLengths,
				(items) => items);
			assert.deepStrictEqual(output, ['hello', 'worlds']);
		});
	});
	describe("two similar items", function () {
		const input = ['hello', 'harry'];
		it("sorted by initial char code should sort preserving input order", function () {
			const output = array.sortedWithTieBreaker(
				input,
				compareInitialCharCodes,
				(items) => items);
			assert.deepStrictEqual(output, ['hello', 'harry']);
		});
		it("sorted by initial char code should call the tie breaker with both inputs in order", function () {
			const tieBreakerCalls = new Set();
			const output = array.sortedWithTieBreaker(
				input,
				compareInitialCharCodes,
				(items) => {
					tieBreakerCalls.add(items.join(','));
					return items;
				});
			assert.deepStrictEqual(tieBreakerCalls, new Set(['hello,harry']));
		});
		it("sorted by string length should sort preserving input order", function () {
			const output = array.sortedWithTieBreaker(
				input,
				compareStringLengths,
				(items) => items);
			assert.deepStrictEqual(output, ['hello', 'harry']);
		});
		it("sorted by string length should call the tie breaker with both inputs in order", function () {
			const tieBreakerCalls = new Set();
			const output = array.sortedWithTieBreaker(
				input,
				compareStringLengths,
				(items) => {
					tieBreakerCalls.add(items.join(','));
					return items;
				});
			assert.deepStrictEqual(tieBreakerCalls, new Set(['hello,harry']));
		});
	});
	describe("a mix of similar and different items", function () {
		const input = ['the', 'turtle', 'drinks', 'the', 'tea'];
		it("sorted by initial char code should sort preserving input order for ties", function () {
			const output = array.sortedWithTieBreaker(
				input,
				compareInitialCharCodes,
				(items) => items);
			assert.deepStrictEqual(output, ['drinks', 'the', 'turtle', 'the', 'tea']);
		});
		it("sorted by initial char code should call the tie breaker with similar inputs in order", function () {
			const tieBreakerCalls = new Set();
			const output = array.sortedWithTieBreaker(
				input,
				compareInitialCharCodes,
				(items) => {
					tieBreakerCalls.add(items.join(','));
					return items;
				});
			assert.deepStrictEqual(tieBreakerCalls, new Set(['the,turtle,the,tea']))
		});
		it("sorted by string length should sort preserving input order for ties", function () {
			const output = array.sortedWithTieBreaker(
				input,
				compareStringLengths,
				(items) => items);
			assert.deepStrictEqual(output, ['the', 'the', 'tea', 'turtle', 'drinks']);
		});
		it("sorted by string length should call the tie breaker twice with similar inputs in order", function () {
			const tieBreakerCalls = new Set();
			const output = array.sortedWithTieBreaker(
				input,
				compareStringLengths,
				(items) => {
					tieBreakerCalls.add(items.join(','));
					return items;
				});
			assert.deepStrictEqual(tieBreakerCalls, new Set(['the,the,tea', 'turtle,drinks']));
		});
	});
});
