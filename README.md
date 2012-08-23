About
-----

This is a simple puzzle browser game on JavaScript (using popular library [jQuery](http://github.com/jquery/jquery)),
html5, PHP and MySQL (the last two were used for the online high scores table).

Requirements
------------

* Web server
* PHP 5.2.0+
* MySQL database

Installation
------------

1. Import database tables using the `dump.sql` file, which is placed in project `build/` directory.
2. Edit MySQL connect settings in `server.php` script (the same dir as above).
3. Request `index.php` script from your browser.
4. Enjoy!

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
