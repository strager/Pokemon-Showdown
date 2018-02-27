// @nocommit
'use strict';

const Battle = require('./sim/battle');
const array = require('./lib/array');
const dex = require('./sim/dex');

function quoteRegExp(s) {
	// HACK(strager): This is good enough for now.
	return s;
}

function getAllEvents() {
	const eventHandlerRegExp = /^on(?:Ally|Any|Foe|Source|)(.*)$/;
	const eventNames = new Set();
	for (const effectGroup of Object.values(dex.data)) {
		for (const effect of Object.values(effectGroup)) {
			for (const possibleEventHandlerName of Object.keys(effect)) {
				const match = eventHandlerRegExp.exec(possibleEventHandlerName);
				if (match !== null) {
					eventNames.add(match[1]);
				}
			}
		}
	}
	return eventNames;
}

function findCollisions(eventName) {
	const eventHandlerRegExp = new RegExp(`.*${quoteRegExp(eventName)}$`, '');

	const effectsWithHandlerForEvent = [];
	for (const effectGroup of Object.values(dex.data)) {
		for (const [effectID, effect] of Object.entries(effectGroup)) {
			const possibleEventHandlerNames = Object.keys(effect);
			if (possibleEventHandlerNames.some((handlerName) => eventHandlerRegExp.test(handlerName))) {
				effect.id = effectID; // HACK(strager)
				effectsWithHandlerForEvent.push(effect);
			}
		}
	}

	array.sortedWithTieBreaker(effectsWithHandlerForEvent, Battle.comparePriority, (tiedEffects) => {
		console.log(`tie for ${eventName}: ${tiedEffects.map((e) => e.id).join(', ')}`);
		return tiedEffects;
	});
}

console.log(getAllEvents());
for (const event of getAllEvents()) {
	findCollisions(event);
}
