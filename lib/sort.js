'use strict';

// @nocommit rename
function sorted(items, getKey, compareKeys) {
	// @nocommit test that original is not mutated
	//const sortedItems = items;
	//sortedItems.sort((x, y) => {
	const sortedItems = sortStable(items, (x, y) => {
		return compareKeys(getKey(x), getKey(y));
	});
	return groupAdjacent(sortedItems, (x, y) => compareKeys(getKey(x), getKey(y)) === 0);
}

function groupAdjacent(items, itemsEqual) {
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

// @nocommit STOLEN
function sortStable(array, compare) {
var array2 = array.map(function(v, i) { return { i: i, v: v } });
array2.sort(function(a, b) {
  var r = compare(a.v, b.v);
  return r == 0 ? a.i - b.i : r;
});
return array2.map(function(v) { return v.v });
}

module.exports.sorted = sorted;
