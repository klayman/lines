About
-----

This is a simple puzzle game on JavaScript (using popular library [jQuery](http://github.com/jquery/jquery))
and html5.

Game rules
----------

The game starts with a 9×9 board with three balls chosen out of seven different colours. The player can move
one ball per turn, and the player may only move a ball to a particular place if there is a path (linked set
of vertical and horizontal empty cells) between the current position of the ball and the desired destination.
The goal is to remove balls by forming lines (horizontal, vertical or diagonal) of at least five balls of the
same colour. If the player does form such lines of at least five balls of the same colour, the balls in those
lines disappear, and he gains one turn, i.e. he can move another ball. If not, three new balls are added, and
the game continues until the board is full.

[Wikipedia](http://en.wikipedia.org/wiki/Lines_\(video_game\))
