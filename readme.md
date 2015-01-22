# AjveCiv

Guide an engineered people as they settle an alien planet.

To play, use [node]():

	npm install -g ajve-civ
	ajve-civ

Alternatively, you can write AI to play for you, or even worlds and scenarios of your own.

## Mechanics

You are a guiding principle, and so set the values of your people. They do the rest. Specifically, they affect their environment, and other developing peoples.

### Basic concepts

* Values: The lived priorities of your people.
* Society: Your people.
* Inflections: Critical, momentary choices that alter or advance your values.
* Nation: The environment of your people.
* Globe: The environment of the world your people inhabit.
* Diplomacy: Interacting with other forces. Can result in war, trade, etc.

### Values

* Conquer: Benefit from conflict.
* Exchange: Benefit from peace.
* Discover: Research better solutions to societal problems.
* Expand: Grow through population or proselytization.
* Develop: Build up your local infrastructure.
* Consent: Affirm the voluntary nature of your society.

These values affect how your society makes moment-to-moment choices.

### Society

Every turn, your society consults your values in order to select an action. In order to prevent a society's AI from min-maxing by its values, societies are presented with three values randomly to choose between. Whichever value they select is raised by 1, and something happens to your environment, and potentially the world, depending on the value chosen:

#### Conquer

Another society's yield drops by (Conquer), and your yield increases by (Conquer). Reduces your society's population by 1. Reduces that society's disposition towards you by 5, and global disposition towards you by 1.

#### Exchange

Your society's yield increases by your (Exchange) and another society's yield increases by their (Exchange). Increases that society's disposition towards you by 1.

#### Discover

Your society's yield increases by (Discover).

#### Expand

Your society's population increases by (Expand), but not beyond your society's yield.

#### Develop

Your society's yield increases by (Develop * 3) but global yield decreases by (Develop). Global disposition towards you drops by 1.

#### Consent

TODO wtf is consent good for

### Inflections

Every 10 turns, natural events, scientific revelations, and other revolutionary phenomena will provoke your society to consult its three highest values and choose among them. The chosen value increases by 2, while the others decrease by 1 each.

Inflections bring all dispositions closer to 0 by 2.

This forces societies to specialize in the face of hardship.

### Nation

Physical and material statistics about your people, such as:

* Population
* Yield
* Your Dispositions Towards Others
* Their Dispositions Towards You

### Globe

The world is made of stuff. How fertile that world is for habitation is expressed as its Yield. This total is added to the yields of every nation during calculations.

## AI Implementors

In order to play, you must implement an AI's `turn` and `inflection` methods, and inherit the rest from AjveCiv. For example:

	var civ = require('ajve-civ');

	var ai = civ.ai.extend({
		turn: function (choices, world, done) {

		},
		inflection: function (choices, world, done) {

		}
		});

	// free-for-all
	civ
	.game(ai, ai, ai)
	// 2v2
	.game([ai, ai], [ai, ai])
	// 3v1
	.game([ai, ai, ai], ai)
	// run the allotted games in series
	.play({
		// print a play-by-play to stdout
		spectate: true
		})
	// print a final report to stdout
	.report({
		summary: true
		})
	// export the report JSON to a file
	.report('./series_1.json')
	// do something custom with the report
	.report(function (report, done) {
		...
		done();
		});

Executing that program with `node` would play three games, pitting the custom AI against itself in three variations, before printing a game report to stdout, files, or wherever else your heart fancies.

The arguments to both `turn` and `inflection` are the same:

* `choices`: an array of strings, one of which must be passed to `done`. Each represents the values you must choose between. It is a randomly selected subset of the fields of `world.societies[you].values`.
* `world`: an object containing the state of the world. See the next section for an example; it's quite large.
* `done`: a function that takes two arguments: an error (if any), and your choice for that turn or inflection point. If that choice would necessitate a target society, enter as a third argument that society's index `i`, corresponding to `world.societies[i]`.

### The World

	{
		// see: 'societies'
		societies: [...],
		yield: Number
	}

### Societies

	{
		values: {
			develop: Number,
			...
		},
		nation: {
			population: Number,
			yield: Number
		},
		dispositions: {
			// integers `i` corresponding 
			// to a `world.societies[i]`
			of: [Number, ...],
			from: [Number, ...]
		}
	}

## World Implementors

Worlds must implement a `turn` and `inflection` method, which each take an array of `choices` with the most recent `world`, and uses them to update and return the `world`. For example:

	var civ = require('ajve-civ');

	var world = civ.world.extend({
		turn: function (choices, world, done) {
			...
			done(null, new_world);
		},
		inflection: function (choices, world, done) {
			...
			done(null, new_world);
		}
		});

	civ
	.world(world)
	.game([
		civ.ai.basic.discover,
		civ.ai.basic.conquer
	])
	.play({
		spectate: true
		});

## Civ Reference

This is what you get from `require('ajve-civ')`:

	{
		ai: {
			// the 'AI' used to let humans
			// play the game turn by turn
			repl: {
				turn: [func],
				inflection: [func]
			}
			basic: {
				// some very basic AI
			},
			extend: [func]
		},
		worlds: {
			original: {
				turn: [func],
				inflection: [func]
			},
			extend: [func]
		},
		game: [func],
		report: [func],
		play: [func]
	}

## Tests

	git clone [repo]
	cd ajve-civ
	npm install
	npm test

## License

Game, code, et al is provided under [ISC]().
