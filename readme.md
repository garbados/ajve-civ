# AjveCiv

[![Build Status](https://travis-ci.org/garbados/ajve-civ.svg?branch=master)](https://travis-ci.org/garbados/ajve-civ)
[![Coverage Status](https://coveralls.io/repos/garbados/ajve-civ/badge.svg)](https://coveralls.io/r/garbados/ajve-civ)
[![npm version](https://badge.fury.io/js/ajve-civ.svg)](http://badge.fury.io/js/ajve-civ)


Guide an engineered people as they settle an alien world.

To play, use [node](https://nodejs.org/):

    npm install -g ajve-civ
    # watch basic AI go at it
    ajve-civ
    # fight against the AI yourself
    ajve-civ -p repl,basic
    # output the game report in raw json
    ajve-civ -r json > report.json
    # need more help?
    ajve-civ --help

Alternatively, you can write AI to play for you, or even worlds and scenarios of your own.

## The Game

You are a guiding principle, and so set the values of your people. They do the rest. Specifically, they affect their environment, and other developing peoples. If your people die out, you lose.

At the end of 100 turns, whichever surviving people has the greatest Yield and Population wins.

### Values

Values are the lived priorities of your people. Each turn, the game confronts them with a choice between these values, and they must decide which is most important to them in that moment in time.

* Conquer: Exploit others for your own benefit.
* Exchange: Benefit yourself and others through trade.
* Discover: Research better solutions to societal problems.
* Expand: Grow through population or proselytization.
* Develop: Build infrastructure, at the cost of ecological balance.
* Consent: Affirm the voluntary nature of your society.

Choosing one value over others increases it, and may have lasting effects on your people's society, and even the world.

### The World

The world your people settle will host other civilizations, perhaps indigenous, perhaps alien like you. It has a `yield` that represents its capacity to support life, and a `feels` matrix that represents global diplomacy. It's an array of arrays, like this:

    [
        [0, 0, 1],  // player 1's feelings towards players [1,2,3]
        [-5, 0, 1], // player 2's feelings towards players [1,2,3]
        [-1, 0, 0], // player 3's feelings towards players [1,2,3]
    ]

Positive numbers mean you like a player, negatives mean dislike.
    
The world also has a list of all societies. By default, the first of them is yours. Each society has a `nation` with its `yield` and `population`, and a `values` object with your devotion to each value.

### Turns

Every turn, your people choose a value to act on. Whichever choice they make, will affect the world. It will also increase your society's devotion to that value by 1.

#### Conquer

Choosing the Conquer value inspires your people to raid another, increasing your nation's yield by your devotion to Conquer, and decreasing by the same amount the yield of whoever you like least. The raided society feeling change by -5 toward you, and all other societies change by -1 toward you.

#### Exchange

Choosing Exchange increases your society's yield by your devotion to Exchange. In addition, whichever society you like most increases their yield by their own devotion to Exchange. The society you traded with improves their feelings towards you by 1.

#### Discover

Choosing Discover increases your society's yield by your devotion to Discover.

#### Expand

Your society's population increases by your devotion to Expand. If your population ever exceeds `world.yield + world.societies[you].nation.yield`, your people will starve until there are only as many people as can be supported.

#### Develop

Your society's yield increases by 3 times your devotion to Develop, but global yield decreases by your devotion to Develop. Global disposition towards you drops by 1.

#### Consent

Global yield increases by your devotion to Consent, and global disposition toward you increases by the same.

### Inflections

Every 10 turns, natural events, scientific revelations, and other revolutionary phenomena will provoke your society to consult its three highest values and choose among them. The chosen value increases by 2, while the others decrease by 1 each.

This forces societies to specialize in the face of hardship.

## AI Implementors

Although you can play as yourself right out of the box, you can also write custom AI and pit them against themselves, built-in AI, and AI written by others.

To write an AI for AjveCiv, you must implement an AI's `turn` and `inflection` methods, and inherit the rest from AjveCiv. For example:

```javascript
var civ = require('ajve-civ');

var ai = civ.ai.extend({
    turn: function (choices, world, done) {
        ...
        done(any_problems, a_choice);
    },
    inflection: function (choices, world, done) {
        ...
        done(any_problems, a_choice);
    }
    init: function () {
      // runs when the world is first instantiated
      // shares `this` with `turn` and `inflection`
      this.something = true;
      ...
      return;
    }
    });

civ
// 3 player game
.game([ai, ai, ai])
// 4 player game!
.game([ai, ai, ai, ai])
// 5 player game!! etc.
.game([ai, ai, ai, ai, ai])
// run the allotted games in series
.play()
// print a final report to stdout
.report()
// export the report JSON to a file
.report('./series_1.json')
// do something custom with the report
.report(function (report, done) {
    ...
    done();
    });
```

Executing that program with `node` would play three games, pitting the custom AI against itself in three variations, before printing a game report to stdout, files, or wherever else your heart fancies.

The arguments to both `turn` and `inflection` are the same:

* `choices`: an array of strings, one of which must be passed to `done`. Each represents the values you must choose between. It is a randomly selected subset of the fields of `world.societies[you].values`.
* `world`: an object containing the state of the world. See the next section for an example; it's quite large.
* `done`: a function that takes two arguments: an error (if any), and your choice for that turn or inflection point.

### The World

    {
        // see: 'feels'
        feels: [...],
        // see: 'societies'
        societies: [...],
        yield: Number
    }

### Feels

    [
        ...
        [Number...], // player n's feelings about 
        ...          // every other player in order
    ]

### Societies

    {
        values: {
            develop: Number,
            ...
        },
        nation: {
            population: Number,
            yield: Number
        }
    }

## World Implementors

Worlds must implement a `turn` and `inflection` method, which each take an array of `choices` with the most recent `world`, and uses them to update and return the `world`. For example:

```javascript
var civ = require('ajve-civ');

var world = civ.worlds.extend({
    turn: function (choices, world, done) {
        ...
        done(null, new_world);
    },
    inflection: function (choices, world, done) {
        ...
        done(null, new_world);
    },
    init: function () {
      // runs when the world is first instantiated
      // shares `this` with `turn` and `inflection`
      this.something = true;
      ...
      return;
    }
    });

civ
.world(world)
.game([
    civ.ai.basic.discover,
    civ.ai.basic.conquer
])
.play();
```

## Reference

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
        world: [func],  // set the ruleset to use for a series of games
        common: {...},  // common functions, useful to AI and Worlds
        game: [func],   // register another game to run
        play: [func],   // play all registered games in series
        report: [func]  // print the game report somewhere
    }

## Tests

    git clone https://github.com/garbados/ajve-civ.git
    cd ajve-civ
    npm install
    npm test

## License

Game, code, et al is provided under [ISC](http://en.wikipedia.org/wiki/ISC_license).
