


/* The game main class: */

with(Lines_game = function(){

    /* Constructor */

}){
    /* Methods */

    prototype.create_field = function( cell_size, border_size, html_id  ){
        // The game field object:
        this.field = new Field( cell_size, border_size, html_id );
    };

}



/* The game field class: */

/*
 * Create field object.
 * cell_size   : size of each cell on screen (in px)
 * border_size : width of border line between cells (in px)
 * html_id     : id of <div> which contains svg
 **/
with(Field = function( cell_size, border_size, html_id ){

    this.obj = $( "#" + html_id );  // Saving the jQuery object of field:
    var _this = this;               // Save link to "this" property:
    $( "#" + html_id ).children().svg(
        {
            onLoad: function( svg ){
                _this.svg_obj = svg;   // Saving SVG object of field:
            }
        }
    );

    this.square_size = cell_size;    // Default size of each cell (in px):
    this.border_size = border_size;  // Default size of cell border (in px):

    this.map = new Array( 9 );       // The 2d array of Ball class objects:
    for( var i = 0; i < 9; i++ )
        this.map[ i ] = new Array( null, null, null, null, null, null, null, null, null );

    // search motion's patterns
    // each motion pattern is an array of numbers which determine
    // direction of motion:
    //
    //     7 0 1
    //      \|/
    //     6-*-2
    //      /|\
    //     5 4 3
    //
    this.figures = [
       [ [ 0, 6, 4, 2 ] ],   // square
       [ [ 1, 7, 5, 3 ] ],   // rhomb
       [ [ 2, 2, 2, 2 ], [ 0, 0, 0, 0 ], [ 1, 1, 1, 1 ], [ 3, 3, 3, 3 ] ],                          // 4-ball line
       [ [ 2, 2, 2, 2, 2 ], [ 0, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 1 ], [ 3, 3, 3, 3, 3 ] ],              // 5-ball line
       [ [ 2, 2, 2, 2, 2, 2 ], [ 0, 0, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 1, 1 ], [ 3, 3, 3, 3, 3, 3 ] ],  // 6-ball line
    ]

    // current block to remove from field
    this.figure = 2;

    // X and Y coords of selected ball (in cells):
    this.sel_ball = null;

    this.handlers();    // Set the event handlers:

}){
    ////////////////// Methods ////////////////

    /*
     * Put ball at desired position
     * nx, ny : position on map ( numbers )
     * color  : color of ball ( number )
     */
    prototype.put_ball = function( nx, ny, color ){

        if( this.map[ ny ][ nx ] ){

            // Select ball and set to it "jumping" effect:

            if( this.sel_ball ){

                if( this.sel_ball.x == nx &&
                    this.sel_ball.y == ny )
                    // don't do anything:
                    return;

                var x = this.sel_ball.x;
                var y = this.sel_ball.y;
                this.map[ y ][ x ].jump_stop( x, y );
            }
            this.sel_ball = { "x" : nx,
                              "y" : ny };
            this.map[ ny ][ nx ].jump( nx, ny );
            return;
        }

        var ball = new Ball( color, this.square_size + this.border_size );
        ball.draw( this.svg_obj, nx, ny, 1 );
        this.map[ ny ][ nx ] = ball;
    };


    /*
     * Test for existance of current figure type on the map
     * nx, ny: coordinates to start motion from
     * For example:
     *
     * figure = 1
     *
     *   012345678
     * 0 .o.......
     * 1 o.o......
     * 2 .o.......
     * 3 ..o......
     * 5 .o.o.....
     * 6 ..o....o.
     * 7 ......o..
     * 8 .......o.
     *
     * test_figrure( 0, 0 ) --> false
     * test_figrure( 1, 0 ) --> false
     * test_figrure( 1, 2 ) --> true
     * test_figrure( 2, 1 ) --> false
     * test_figrure( 2, 6 ) --> true
     * test_figrure( 7, 8 ) --> false
     *
     * TODO: color test
     */
    prototype.test_figure = function( nx, ny, ms, mark ){
        var x = nx;
        var y = ny;

        for( var i in ms )
        {
            if( ! this.map[ y ][ x ] )
                return false;

            switch( ms[ i ] ) {
                case 0: y-=1;       break;
                case 1: y-=1; x+=1; break;
                case 2: x+=1;       break;
                case 3: x+=1; y+=1; break;
                case 4: y+=1;       break;
                case 5: y+=1; x-=1; break;
                case 6: x-=1;       break;
                case 7: x-=1; y-=1; break;
            }
        }
        return true; // all OK, movies good
    };

    /*
     * This method find and removes group of balls which is
     * belong to current figure template ( box, rombs, etc. )
     * TODO: calculate scores here ?
     */
    prototype.remove_balls = function() {
        var f = this.figures[ this.figure ];  // alias...

        for( var j = 0; j < this.map.length; j++ )
            for( var i = 0; i < this.map[ j ].length; i++ )
                for( var k in f )
                    if( this.test_figure( i, j, f[ k ] ) )
                    {
                        this.test_figure( i, j, f[ k ], true );  // mark balls for deletion
                        alert( 'bla' );
                    }
    };

    prototype.handlers = function(){
        // Save link to "this" property:
        var _this = this;

        // Configure click event handler:
        this.obj.click(
            function( e ){
                // Get the margin of SVG object:
                var mx = _this.obj.children().css( "margin-left" ).replace( "px", '' );
                var my = _this.obj.children().css( "margin-top" ).replace( "px", '' );

                // X and Y coords of cursor about field object:
                var x = e.pageX - _this.obj.offset().left - mx;
                var y = e.pageY - _this.obj.offset().top - my;

                // X and Y numbers of the cell which is under mouse cursor:
                var nx = Math.floor( x / ( _this.square_size + _this.border_size ) );
                var ny = Math.floor( y / ( _this.square_size + _this.border_size ) );

                // Check the boundary conditions:
                if( ( x - ( _this.square_size + _this.border_size ) * nx > _this.square_size && nx < 8 ) ||
                    ( y - ( _this.square_size + _this.border_size ) * ny > _this.square_size && ny < 8 ) )
                    return false;

                _this.put_ball( nx, ny, _this.rand( 1, 7 ) );  // put ball to the map
                _this.remove_balls();                          // remove balls & calculate scores etc...
            }
        );
    };


    // Auxiliary method for generating random numbers in a certain range:
    prototype.rand = function( m, n ){
        m = parseInt( m );
        n = parseInt( n );
        return Math.floor( Math.random() * ( n - m + 1 ) ) + m;
    };
}



with(Ball = function( img_number, img_size ){

    /* Constructor */

    // Define the image name:
    this.img_name = undefined;
    switch( img_number ){
        case 1: this.img_name = 'red';    break;
        case 2: this.img_name = 'orange'; break;
        case 3: this.img_name = 'yellow'; break;
        case 4: this.img_name = 'green';  break;
        case 5: this.img_name = 'cyan';   break;
        case 6: this.img_name = 'blue';   break;
        case 7: this.img_name = 'purple'; break;
    }

    // The ball image size (in px):
    this.size = img_size;

}){
    /* Methods */

    prototype.draw = function( svg_obj, x, y, scale ){
        // Create jQuery object:
        this.obj = $( svg_obj.image
                      (
                           ( - this.size / 2 ),
                           ( - this.size / 2 ),
                           this.size - 1,
                           this.size - 1,
                           'images/' + this.img_name + '.png',
                           { transform:
        /*  Transformation matrix:
         *  | sx 0  tx |
         *  | 0  sy ty | ~ [ sx, 0, 0, sy, tx, ty ];
         *  | 0  0  1  |
         *
         *  sx, sy - scaling object
         *  tx, ty - translating object
         */
                             "matrix( 0, 0, 0, 0," +
                                ( x * this.size + this.size / 2 ) + ',' +
                                ( y * this.size + this.size / 2 ) +
                             ")"
                           }
                      )
                   );

        // Animate object:
        this.animate( x, y, scale, 100 );
    };


    prototype.animate = function( x, y, scale, time, structure ){
        // Save link to "this" property:
        var _this = this;

        if( ! structure )
            // callback - soother:
            var callback = function(){};
        else
            var callback =
                function(){
                    var arr = structure[ 0 ];
                    if( structure.slice( 1, 2 ).length > 0 )
                        _this.animate( x, y, arr[ 0 ],
                                             arr[ 1 ],
                                             structure.slice( 1, structure.length ) );
                    else
                        _this.animate( x, y, arr[ 0 ], arr[ 1 ] );
                }
        this.obj.animate(
            { svgTransform:
                "matrix(" +
                    scale + ", 0, 0, " + scale + "," +
                    ( x * this.size + this.size / 2 ) + ',' +
                    ( y * this.size + this.size / 2 ) +
                ")"
            }, time, callback );
    };


    prototype.jump = function( x, y ){
        // Save link to "this" property:
        var _this = this;
        // Callback's parametres:
        var structure = [ [ 1,    80 ],
                          [ 1.05, 50 ],
                          [ 1,    50 ] ]

        _this.animate( x, y, 1.08, 80, structure );

        this.obj.everyTime( 1100,
            function(){
                // Animate object:
                _this.animate( x, y, 1.08, 80, structure );
            }
        );
    };


    prototype.jump_stop = function( x, y ){
        // Stop animation:
        this.obj.stopTime();
        // Return default size:
        this.animate( x, y, 1, 1 );
    };
}


var lines;
$( document ).ready(
    function(){
        /* Game initialization after the page loads: */
        lines = new Lines_game();

        // Create field object:
        lines.create_field( 48, 2, "field" );
    }
);
