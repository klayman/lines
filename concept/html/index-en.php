<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content="Head and Hands" />

    <title>Lines</title>

    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <link rel="icon" href="favicon.ico" />
</head>

<body>
    <!--============== Background gradient and Khokhloma decor ===============-->
    <div id="background">
        <svg id="back-gradient" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" preserveAspectRatio="none">
            <radialGradient id="gradient-dark" cx="50%" cy="50%" r="70.71%">
                <stop id="dark-center" stop-color="hsl(207, 16%, 74%)" offset="0%"   />
                <stop id="dark-edge"   stop-color="hsl(213, 60%, 22%)" offset="100%" />
            </radialGradient>
            <rect id="background-rect" width="100" height="100" x="0" y="0" fill="url(#gradient-dark)" />
        </svg>
        <svg id="back-decor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 100 100">
            <radialGradient id="gradient-bright" cx="50%" cy="50%" r="50%">
                <stop id="bright-center" stop-color="hsla(207, 95%, 80%, 0.1)" offset="45%"   />
                <stop id="bright-edge"   stop-color="hsla(213, 100%, 65%, 0.4)" offset="100%" />
            </radialGradient>
            <mask id="decor-mask">
                <image width="100" height="100" x="0" y="0" xlink:href="images/temp-mask.png" />
            </mask>
            <rect id="decor-rect" width="100" height="100" x="0" y="0" transform="rotate(12.345 50 50)" mask="url(#decor-mask)" fill="url(#gradient-bright)" />
        </svg>
    </div>

    <!--==== Container for header, game field (or text pages) and footer ====-->
    <div id="container">
        <!--============= Header with next balls and score info =============-->
        <header>
            <div id="balls-preview" title="Next balls">
                <figure class="purple"></figure>
                <figure class="yellow"></figure>
                <figure class="blue"></figure>
            </div>
            <span id="score" title="Score">1234</span>
        </header>

        <!--========================= Main content ==========================-->

        <!-- Game field -->
        <div id="field">
            <div id="field-insert">
                <figure style="left: 3em; top: 1em" class="red"></figure>
                <figure style="left: 0em; top: 5em" class="white"></figure>
                <figure style="left: 7em; top: 3em; z-index: 1;
                               transform: scale(2,2);
                           -ms-transform: scale(2,2);
                       -webkit-transform: scale(2,2);
                            -o-transform: scale(2,2);
                          -moz-transform: scale(2,2);" class="cyan"></figure>
                <figure style="left: 5em; top: 6em" class="yellow"></figure>
            </div>
        </div>
        
        <!-- Options -->
        <div id="options-page">
            <h1>Settings</h1>
            <form>
                <fieldset>
                    <legend>Language/Язык:</legend>
                    <select name="language">
                        <option value="russian" selected="selected">русский</option>
                        <option value="english">English</option>
                    </select>
                </fieldset>
                <fieldset>
                    <legend>Default mode:</legend>
                    <input id="lines" type="radio" name="mode" checked="checked" />
                        <label for="lines">lines</label>, at least
                            <select name="line-num">
                                <option value="4">4</option>
                                <option value="5" selected="selected">5</option>
                                <option value="6">6</option>
                            </select> in row<br />
                    <input id="rectangles" type="radio" name="mode" /> <label for="rectangles">rectangles</label><br />
                    <input id="rings" type="radio" name="mode" /> <label for="rings">rings</label><br />
                    <input id="blocks" type="radio" name="mode" />
                        <label for="blocks">blocks</label>, at least of
                            <select name="block-num">
                                <option value="6">6</option>
                                <option value="7" selected="selected">7</option>
                                <option value="8">8</option>
                            </select>
                </fieldset>
                <fieldset>
                    <legend>Balls skin:</legend>
                    <select name="balls-skin">
                        <option value="matte" selected="selected">matte</option>
                        <option value="glossy">glossy</option>
                    </select>
                </fieldset>
                <fieldset>
                    <legend>Next balls:</legend>
                    <input id="next" type="checkbox" /> <label for="next">display next balls positions</label><br />
                </fieldset>
                <input type="button" id="ok" value="ok" />
                <input type="button" id="cancel" value="cancel" />
            </form>
        </div>

        <!-- Help -->
        <div id="help-page">
            <h1>Help</h1>
            <p>The game is played on a 9×9 or 7×7 field, depending on the mode selected. Each turn three new balls chosen out of seven possible colors are added to the random field squares. <em>The goal</em> is to survive as long as possible, by removing figures of balls of the same color. The specific form of the figure depends on game mode. In order to assemble the figure, the player can move one ball per turn, if there is a path (set of adjacent empty cells) between the current and the destination squares.</p>
      
            <p>Player earns points for each complete figure according to the formula (<i>n-n</i><sub>min</sub>+1)‧<i>n</i>, where <i>n</i> is the number of balls in the assembled figure, and <i>n</i><sub>min</sub> — the minimum number of balls in the figure of the current game mode. After the final move, when complete figure disappears, next three balls aren't added (the player gains one turn).</p>

            <h2>Game modes:</h2>
            <dl>
                <dt id="dt-lines">Lines</dt>
                    <dd>Classic mode in which the figure is a vertical, horizontal or diagonal line. The minimum number of balls by default — 5, but it's possible to select 4 or 6 in the settings. Field size is 9×9.</dd>
                <dt id="dt-rectangles">Rectangles</dt>
                    <dd>Minimum figure is a 2×2 square. It's possible to remove 4 or 6 balls per turn. Game field is 7×7 in size.</dd>
                <dt id="dt-rings">Rings</dt>
                    <dd>The figure contains at least 4 balls arranged at the corners of the rotated by 45 degrees square. The maximum number of balls in the figure is 9. Field size — 7×7.</dd>
                <dt id="dt-blocks">Blocks</dt>
                    <dd>The block is a figure of arbitrary shape, made up of adjacent balls. The minimum possible number of balls in the block is defined in the settings (7 by default). 9×9 field.</dd>
            </dl>
        </div>

        <!-- High scores -->
        <div id="scores-page">
            <h1>Lines, 5 in row</h1>
            <table>
                <thead>
                    <tr><th>Place</th><th>Player</th><th>Score</th><th>Date</th></tr>
                </thead>
                <tbody>
                    <tr><td>1</td><td>Test player 1</td><td>1000</td><td>12.08.2010</td></tr>
                    <tr><td>2</td><td>Test player 2</td><td>900</td><td>12.08.2010</td></tr>
                    <tr><td>3</td><td>Test player 3</td><td>800</td><td>12.08.2010</td></tr>
                    <tr><td>4</td><td>Test player 4</td><td>700</td><td>12.08.2010</td></tr>
                    <tr><td>5</td><td>Test player 5</td><td>600</td><td>12.08.2010</td></tr>
                    <tr><td>6</td><td>Test player 6</td><td>500</td><td>12.08.2010</td></tr>
                    <tr><td>7</td><td>Test player 7</td><td>400</td><td>12.08.2010</td></tr>
                    <tr><td>8</td><td>Test player 8</td><td>300</td><td>12.08.2010</td></tr>
                </tbody>
            </table>
        </div>

        <!--==================== Footer with some links =====================-->
        <footer>
            <a id="logo" href="http://semyonfilippov.net/gallery/2d-works/2010/"><span class="tooltip">Gallery Page</span></a>
            <a id="cc" rel="license" href="http://creativecommons.org/licenses/by-nd/3.0/"><span class="tooltip">Creative Commons</span></a>
            <a id="options"><span class="tooltip">Settings</span></a>
            <a id="help"><span class="tooltip">Help</span></a>
            <a id="scores"><span class="tooltip">High Scores</span></a>
            <a id="mode"><span id="num-balls">5</span><span class="tooltip">Change Mode</span></a>
            <a id="restart"><span class="tooltip">New Game</span></a>
        </footer>
    </div>

</body>

</html>

