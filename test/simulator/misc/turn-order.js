'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

// @nocommit
false && describe('Mega Evolution', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause mega ability to affect the order of the turn in which it happens', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Banette', ability: 'frisk', item: 'banettite', moves: ['psychup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind']}]);
		const pranksterMega = battle.p1.active[0];
		battle.p1.chooseMove('psychup', null, true);
		battle.commitDecisions();
		assert.statStage(pranksterMega, 'spa', 0);
	});

	it('should cause an ability copied with Trace by a mega to affect the order of the turn in which it happens', function () {
		battle = common.createBattle([
			[{species: "Politoed", ability: 'drizzle', item: '', moves: ['scald']}, {species: "Kingdra", ability: 'swiftswim', item: '', moves: ['dragondance']}],
			[{species: "Marowak", ability: 'rockhead', item: '', moves: ['earthquake']}, {species: "Alakazam", ability: 'magicguard', item: 'alakazite', moves: ['psychup']}],
		]);
		battle.p1.chooseSwitch(2).foe.chooseSwitch(2);
		battle.p1.chooseMove('dragondance').foe.chooseMove('psychup', null, true);
		assert.statStage(battle.p1.active[0], 'atk', 1);
		assert.statStage(battle.p2.active[0], 'atk', 0);
		assert.species(battle.p2.active[0], 'Alakazam-Mega');
	});

	it('should cause base ability to not affect the order of the turn in which it happens', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sableye', ability: 'prankster', item: 'sablenite', moves: ['psychup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind']}]);
		const noPranksterMega = battle.p1.active[0];
		battle.p1.chooseMove('psychup', null, true);
		battle.commitDecisions();
		assert.statStage(noPranksterMega, 'spa', 1);
	});

	it('should cause mega forme speed to decide turn order', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Beedrill', ability: 'swarm', item: 'beedrillite', moves: ['xscissor']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Hoopa-Unbound', ability: 'magician', moves: ['psyshock']}]);
		const fastBase = battle.p2.active[0];
		battle.p1.chooseMove('xscissor', null, true);
		battle.commitDecisions();
		assert.fainted(fastBase);
	});

	it('should cause ultra forme speed to decide turn order', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Necrozma-Dusk-Mane', ability: 'swarm', item: 'ultranecroziumz', moves: ['xscissor']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Hoopa-Unbound', ability: 'magician', moves: ['darkpulse']}]);
		const fastBase = battle.p2.active[0];
		battle.p1.chooseMove('xscissor', null, 'ultra');
		battle.commitDecisions();
		assert.strictEqual(fastBase.hp, 0);
	});
});

// @nocommit
false && describe('Mega Evolution [Gen 6]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not cause mega ability to affect the order of the turn in which it happens', function () {
		battle = common.gen(6).createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Banette', ability: 'frisk', item: 'banettite', moves: ['psychup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind']}]);
		const pranksterMega = battle.p1.active[0];
		battle.p1.chooseMove('psychup', null, true);
		battle.commitDecisions();
		assert.statStage(pranksterMega, 'spa', 1);
	});

	it('should not cause an ability copied with Trace by a mega to affect the order of the turn in which it happens', function () {
		battle = common.gen(6).createBattle([
			[{species: "Politoed", ability: 'drizzle', item: '', moves: ['scald']}, {species: "Kingdra", ability: 'swiftswim', item: '', moves: ['dragondance']}],
			[{species: "Marowak", ability: 'rockhead', item: '', moves: ['earthquake']}, {species: "Alakazam", ability: 'magicguard', item: 'alakazite', moves: ['psychup']}],
		]);
		battle.p1.chooseSwitch(2).foe.chooseSwitch(2);
		battle.p1.chooseMove('dragondance').foe.chooseMove('psychup', null, true);
		assert.statStage(battle.p1.active[0], 'atk', 1);
		assert.statStage(battle.p2.active[0], 'atk', 1);
		assert.species(battle.p2.active[0], 'Alakazam-Mega');
	});

	it('should cause base ability to affect the order of the turn in which it happens', function () {
		battle = common.gen(6).createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sableye', ability: 'prankster', item: 'sablenite', moves: ['psychup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind']}]);
		const noPranksterMega = battle.p1.active[0];
		battle.p1.chooseMove('psychup', null, true);
		battle.commitDecisions();
		assert.statStage(noPranksterMega, 'spa', 0);
	});

	it('should cause base forme speed to decide turn order', function () {
		battle = common.gen(6).createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Beedrill', ability: 'swarm', item: 'beedrillite', moves: ['xscissor']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Hoopa-Unbound', ability: 'magician', moves: ['psyshock']}]);
		const fastMega = battle.p1.active[0];
		battle.p1.chooseMove('xscissor', null, true);
		battle.commitDecisions();
		assert.fainted(fastMega);
	});
});

describe('speed ties', function () {
	afterEach(function () {
		battle.destroy();
	});

	function getTurnOrder(battle) {
		const turn1Index = battle.log.indexOf('|turn|1');
		assert.notEqual(turn1Index, -1);
		const turn2Index = battle.log.indexOf('|turn|2');
		assert.notEqual(turn2Index, -1);
		const turn1Log = battle.log.slice(turn1Index + 1, turn2Index);

		const turnOrder = [];
		for (const logEntry of turn1Log) {
			switch (logEntry) {
				case '|move|p1a: Magikarp|Splash|p1a: Magikarp':
					turnOrder.push('p1a');
					break;
				case '|move|p2a: Magikarp|Splash|p2a: Magikarp':
					turnOrder.push('p2a');
					break;
				default:
					// Ignore unknown log entries.
					break;
			}
		}
		return turnOrder;
	}

	function getTurnOrderHistogram(turnOrderSamples) {
		const histogram = new Map();
		for (const sample of turnOrderSamples) {
			if (!histogram.has(sample)) {
				histogram.set(sample, 0);
			}
			histogram.set(sample, histogram.get(sample) + 1);
		}
		return histogram;
	}

	it('should cause either user to move first', function () {
		const p1Team = [{species: 'Magikarp', moves: ['splash']}];
		const p2Team = [{species: 'Magikarp', moves: ['splash']}];
		const turnOrderSamples = [];
		for (let i = 0; i < 100; ++i) {
			const seed = [0, 0, 0, i];
			battle = common.gen(3).createBattle({seed: seed});
			battle.join('p1', 'Guest 1', 1, p1Team);
			battle.join('p2', 'Guest 2', 1, p2Team);
			battle.commitDecisions();
			const turnOrder = getTurnOrder(battle);
			turnOrderSamples.push(turnOrder.join(','));
		}
		const turnOrderHistogram = getTurnOrderHistogram(turnOrderSamples);
		assert(turnOrderHistogram.get('p1a,p2a') >= 45, 'p1a should move before p2b ~50% of the time');
		assert(turnOrderHistogram.get('p1a,p2a') <= 55, 'p1a should move before p2b ~50% of the time');
		assert(turnOrderHistogram.get('p2a,p1a') >= 45, 'p2a should move before p1b ~50% of the time');
		assert(turnOrderHistogram.get('p2a,p1a') <= 55, 'p2a should move before p1b ~50% of the time');
	});
});
