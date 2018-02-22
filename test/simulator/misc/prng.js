'use strict';

const assert = require('./../../assert');
const PRNG = require('./../../../sim/prng');

function shuffle(items, prng) {
	// @nocommit test that original is not mutated
	if (items.length === 2) {
		const shuffledItems = [];
		const index = prng.next(2)
		shuffledItems.push(items[index]);
		shuffledItems.push(items[1 - index]);
		return shuffledItems;
	}
	return items;
}

describe("shuffle", function () {
	describe("empty input", function () {
		const input = [];
		it("should shuffle to an empty array", function () {
			const prng = new PRNG([0, 0, 0, 0]);
			const output = shuffle(input, prng);
			assert.deepStrictEqual(output, []);
		});
	});
	describe("single-item input", function () {
		const input = [42];
		it("should shuffle to itself", function () {
			const prng = new PRNG([0, 0, 0, 0]);
			const output = shuffle(input, prng);
			assert.deepStrictEqual(output, [42]);
		});
	});
	describe("two-item input", function () {
		const input = [42, 9001];
		it("should shuffle to itself 50% of the time and the reverse 50% of the time", function () {
			const prng = new PRNG([0, 0, 0, 0]);
			let numberOfSameOrderSamples = 0;
			let numberOfReverseOrderSamples = 0;
			for (let i = 0; i < 1000; ++i) {
				const output = shuffle(input, prng);
				assert.strictEqual(output.length, 2);
				if (output[0] === 42 && output[1] === 9001) {
					numberOfSameOrderSamples += 1;
				}
				if (output[0] === 9001 && output[1] === 42) {
					numberOfReverseOrderSamples += 1;
				}
			}
			assert.bounded(numberOfSameOrderSamples, [460, 540], 'the shuffled array should be the same as the input 50% of the time');
			assert.bounded(numberOfReverseOrderSamples, [460, 540],  'the shuffled array should be the reverse of the input 50% of the time');
			assert.strictEqual(numberOfSameOrderSamples + numberOfReverseOrderSamples, 1000, 'the shuffled array should be a permutation of the input');
		});
	});
});
