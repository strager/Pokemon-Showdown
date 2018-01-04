'use strict';

const PRNG = require('./../../../sim/prng');
const assert = require('./../../assert');

const testSeed = [1, 2, 3, 4];

describe('PRNG', function () {
	describe('flipCoin(numerator=0, denominator=1)', function () {
		it('should always return false', function () {
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				assert.ok(!prng.flipCoin(0, 1));
			}
		});
	});
	describe('flipCoin(numerator=1, denominator=1)', function () {
		it('should always return true', function () {
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				assert.ok(prng.flipCoin(1, 1));
			}
		});
	});
	describe('flipCoin(numerator=256, denominator=256)', function () {
		it('should always return true', function () {
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				assert.ok(prng.flipCoin(256, 256));
			}
		});
	});
	describe('flipCoin(numerator=1, denominator=2)', function () {
		it('should return true 45-55% of the time', function () {
			const prng = new PRNG(testSeed);
			let trueCount = 0;
			let falseCount = 0;
			for (let i = 0; i < 100; ++i) {
				if (prng.flipCoin(1, 2)) {
					trueCount += 1;
				} else {
					falseCount += 1;
				}
			}
			const minExpectedTrueCount = 45;
			const maxExpectedTrueCount = 55;
			assert.atLeast(trueCount, minExpectedTrueCount);
			assert.atLeast(falseCount, 100 - maxExpectedTrueCount);
		});
		it('should be identical to (next(2) == 0)', function () {
			// This invariant is important for battle logs.
			const coinPRNG = new PRNG(testSeed);
			const numberPRNG = new PRNG(testSeed);
			for (let i = 0; i < 10; ++i) {
				assert.strictEqual(numberPRNG.next(2) === 0, coinPRNG.flipCoin(1, 2));
			}
		});
	});
	describe('flipCoin(numerator=217, denominator=256)', function () {
		it('should return true 80%-90% of the time', function () {
			const prng = new PRNG(testSeed);
			let trueCount = 0;
			let falseCount = 0;
			for (let i = 0; i < 100; ++i) {
				if (prng.flipCoin(217, 256)) {
					trueCount += 1;
				} else {
					falseCount += 1;
				}
			}
			const minExpectedTrueCount = 80;
			const maxExpectedTrueCount = 90;
			assert.atLeast(trueCount, minExpectedTrueCount);
			assert.atLeast(falseCount, 100 - maxExpectedTrueCount);
		});
		it('should be identical to (next(256) < 217)', function () {
			// This invariant is important for battle logs.
			const coinPRNG = new PRNG(testSeed);
			const numberPRNG = new PRNG(testSeed);
			for (let i = 0; i < 10; ++i) {
				assert.strictEqual(numberPRNG.next(256) < 217, coinPRNG.flipCoin(217, 256));
			}
		});
	});
});
