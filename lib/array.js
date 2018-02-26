'use strict';

/**
 * @param {ReadonlyArray<T>} items
 * @param {(item1: T, item2: T) => number} compareItems
 * @param {(equalItems: ReadonlyArray<T>) => ReadonlyArray<T>} breakTies
 * @return {Array<T>}
 * @template T
 */
function sortedWithTieBreaker(items, compareItems, breakTies) {
	const out = [];
	for (const group of sortedWithGroupedTies(items, compareItems)) {
		if (group.length === 1) {
			out.push(group[0]);
		} else {
			out.push(...breakTies(group));
		}
	}
	return out;
}

/**
 * @param {ReadonlyArray<T>} items
 * @param {(item1: T, item2: T) => number} compareItems
 * @return {Array<Array<T>>}
 * @template T
 */
function sortedWithGroupedTies(items, compareItems) {
	//const sortedItems = items;
	//sortedItems.sort((x, y) => {
	const sortedItems = sortStable(items, compareItems);
	return groupAdjacentEqual(sortedItems, (x, y) => compareItems(x, y) === 0);
}

/**
 * @param {ReadonlyArray<T>} items
 * @param {(item1: T, item2: T) => boolean} itemsEqual
 * @return {Array<Array<T>>}
 * @template T
 */
function groupAdjacentEqual(items, itemsEqual) {
	const groups = [];
	for (const item of items) {
		if (groups.length > 0 && itemsEqual(item, groups[groups.length - 1][0])) {
			groups[groups.length - 1].push(item);
		} else {
			groups.push([item]);
		}
	}
	return groups;
}

/**
 * @param {ReadonlyArray<T>} items
 * @param {(item1: T, item2: T) => number} compareItems
 * @return {Array<T>}
 * @template T
 */
function sortedStable(items, compareItems) {
	return sortStable(items, compareItems);
}

/**
 * @param {ReadonlyArray<T>} array
 * @param {(item1: T, item2: T) => number} compare
 * @return {Array<T>}
 * @template T
 */
// @nocommit STOLEN
function sortStable(array, compare) {
var array2 = array.map(function(v, i) { return { i: i, v: v } });
array2.sort(function(a, b) {
  var r = compare(a.v, b.v);
  return r == 0 ? a.i - b.i : r;
});
return array2.map(function(v) { return v.v });
}

module.exports.sortedStable = sortedStable;
module.exports.sortedWithTieBreaker = sortedWithTieBreaker;
