'use strict';

const assert = require('assert');

/**
 * Sort the given array, returning a new array which preserves the order of
 * equal items.
 *
 * Items in the array are ordered according to the compareItems function. See
 * JavaScript's built-in Array.prototype.sort function for details.
 *
 * Unlike Array.prototype.sort, this function implements a stable sort.
 *
 * @param {ReadonlyArray<T>} items
 * @param {(a: T, b: T) => number} compareItems
 * @return {Array<T>}
 * @template T
 */
function sortedStable(items, compareItems) {
	const indexes = [];
	for (let i = 0; i < items.length; ++i) {
		indexes.push(i);
	}
	/**
	 * @param {number} aIndex
	 * @param {number} bIndex
	 */
	function compareIndexesByItemOrByIndex(aIndex, bIndex) {
		const comparison = compareItems(items[aIndex], items[bIndex]);
		if (comparison !== 0) {
			return comparison;
		}
		return compareIndexes(aIndex, bIndex);
	}
	/**
	 * @param {number} aIndex
	 * @param {number} bIndex
	 */
	function compareIndexes(aIndex, bIndex) {
		if (aIndex < bIndex) return -1;
		if (aIndex > bIndex) return 1;
		assert.fail(`Array.prototype.sort unexpectedly asked us to compare an item with itself`);
		return 0;
	}
	indexes.sort(compareIndexesByItemOrByIndex);
	return indexes.map((index) => items[index]);
}

module.exports.sortedStable = sortedStable;
