## Xtris

A toy Tetris clone in JavaScript, utilizing the HTML5 canvas.


## Gameplay

Start/restart the game with the button below the game area.

Move the dropping pieces left and right with the arrow keys. Rotate
with up arrow. Drop the piece all the way down with the down arrow.

You can pause the game, and restart again, with the P key. 

The scoring mechanism is currently simplistic - 10 points for each
piece that gets placed, and 100 points for a cleared row. This could
be made arbitrarily more complex, e.g. rewarding stuff like clearing more than
one row at a time, dropping pieces a long distance, etc. Not currently
planning to dive deep into it, however, as this is more or less a toy
program.

The game speeds up slowly as it progresses. The algorithm for this is
also very simplistic at the moment: every time a row is cleared, the
dropping of the pieces happens a few milliseconds faster.


## Requirements

Uses the canvas and some other relatively recent JavaScript APIs, so
requires a "modern" browser. Exact versions not checked.


## TODO

* UI polishing
* storing high scores


## Copyright and License

(c) Ville Siltanen, 2015. MIT License
