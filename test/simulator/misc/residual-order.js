'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

describe(`Light Screen`, function () {
	function assertLightScreenEndsForP1BeforeP2(battle) {
		const p1LightScreenEndIndex = battle.log.indexOf('|-sideend|p1: Guest 1|Light Screen');
		assert.atLeast(p1LightScreenEndIndex, 0);
		const p2LightScreenEndIndex = battle.log.indexOf('|-sideend|p2: Guest 2|Light Screen');
		assert.atLeast(p2LightScreenEndIndex, 0);
		const firstLightScreenEndPlayer = p1LightScreenEndIndex < p2LightScreenEndIndex ? 'p1' : 'p2';
		assert.strictEqual(firstLightScreenEndPlayer, 'p1');
	}

	const battleAttempts = 10;

	it(`should fade for p1 before p2 if users are tied in speed`, function () {
		for (let i = 0; i < battleAttempts; ++i) {
			const seed = [0, 0, 0, i];
			const battle = common.gen(4).createBattle({seed: seed});
			battle.join('p1', 'Guest 1', 1, [{
				species: "Smeargle",
				ability: 'technician',
				moves: ['lightscreen', 'splash'],
			}]);
			battle.join('p2', 'Guest 2', 1, [{
				species: "Smeargle",
				ability: 'technician',
				moves: ['lightscreen', 'splash'],
			}]);
			battle.makeChoices('move lightscreen', 'move lightscreen');
			battle.makeChoices('move splash', 'move splash');
			battle.makeChoices('move splash', 'move splash');
			battle.makeChoices('move splash', 'move splash');
			battle.makeChoices('move splash', 'move splash');
			assertLightScreenEndsForP1BeforeP2(battle);
		}
	});

	it(`should fade for p1 before p2 if users are tied in speed (stress test)`, function () {
		// Test with as many residual effects as possible happening on
		// the same turn:
		//
		// * Future Sight finishes its three-turn delay
		// * Light Screen finishes its five-turn duration
		// * Protect stops protecting its user for the turn
		// * Speed Boost or Moody changes stats
		// * Sticky Barb or Black Sludge deals damage
		// * Yarn finishes its two-turn delay
		//
		// Why? At the time of writing, Array.prototype.sort's
		// implementation in the V8 JavaScript engine uses a stable sort
		// for arrays with less than 11 items, and uses a non-stable
		// sort for larger arrays. If the algorithm for ordering
		// residual effects relies on a stable sorting algorithm, this
		// test will likely fail if Array.prototype.sort is used.
		for (let i = 0; i < battleAttempts; ++i) {
			const seed = [0, 0, 0, i];
			const battle = common.gen(4).createBattle({seed: seed});
			battle.join('p1', 'Guest 1', 1, [{
				species: "Smeargle",
				ability: 'speedboost',
				item: 'stickybarb',
				moves: ['lightscreen', 'protect', 'futuresight', 'yawn'],
			}]);
			battle.join('p2', 'Guest 2', 1, [{
				species: "Smeargle",
				ability: 'moody',
				item: 'blacksludge',
				moves: ['lightscreen', 'protect', 'futuresight', 'yawn'],
			}]);
			battle.makeChoices('move lightscreen', 'move lightscreen');
			battle.makeChoices('move protect', 'move protect');
			battle.makeChoices('move futuresight', 'move futuresight');
			battle.makeChoices('move yawn', 'move yawn');
			battle.makeChoices('move protect', 'move protect');
			assertLightScreenEndsForP1BeforeP2(battle);
		}
	});
});
