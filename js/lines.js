


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

    // different types of balls block to search for
    this.figures = [
       [ [ 1,1 ],
         [ 1,1 ] ],

       [ [ 0,1,0 ],
         [ 1,0,1 ],
         [ 0,1,0 ] ],
    ]

    // current block to remove from field
    this.figure = 1;

    this.handlers();    // Set the event handlers:

}){
    ////////////////// Methods ////////////////

    /*
     * Put ball at desired position
     * nx, ny : position on map ( numbers )
     * color  : color of ball ( number )
     */
    prototype.put_ball = function( nx, ny, color ){

        if( this.map[ ny ][ nx ] )   // exit if cell is not empty
            return;

        var ball = new Ball( color, this.square_size + this.border_size, nx, ny );
        ball.draw( this.svg_obj );
        this.map[ ny ][ nx ] = ball;
    };


    /*
     * Test for existance of current figure type on the map
     * nx, ny: position on the map to put template to
     * For example:
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
     * test_figrure( 0, 0 ) --> true
     * test_figrure( 1, 0 ) --> false
     * test_figrure( 1, 3 ) --> true
     * test_figrure( 6, 6 ) --> false
     *
     * TODO: color test
     */
    prototype.test_figure = function( nx, ny ){
        var f = this.figures[ this.figure ];               // alias for figures...

        if( nx + f[ 0 ].length > 9 || ny + f.length > 9 )  // exit if template is out of map
            return;

        for( var i = 0; i < f.length; i++ )
            for( var j = 0; j < f[ 0 ].length; j++ )
            {
                if( f[ i ][ j ] && ( ! this.map[ ny + i ][ nx + j ] ) )   // 1 in figure and none on map...
                    return false;
            }
        return true;  // all ok, figure exists
    };

    /*
     * This method find and removes group of balls which is
     * belong to current figure template ( box, rombs, etc. )
     * TODO: calculate scores here ?
     */
    prototype.remove_balls = function() {
        for( var j = 0; j < this.map.length; j++ )
            for( var i = 0; i < this.map[ j ].length; i++ )
                if( this.test_figure( i, j ) )
                    alert( 'remove at (' + i + ',' + j + ')' );
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
                _this.remove_balls( );                         // remove balls & calculate scores etc...
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



with(Ball = function( img_number, img_size, img_x, img_y ){

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

    // X and Y coords of the ball (in cells):
    this.x = img_x;
    this.y = img_y;

    // The ball image size (in px):
    this.size = img_size;

}){
    /* Methods */

    prototype.draw = function( svg_obj ){
        // Create jQuery object:
        this.obj = $( svg_obj.image
                      (
                           ( - this.size / 2 ),
                           ( - this.size / 2 ),
                           this.size - 1,
                           this.size - 1,
                           'images/' + this.img_name + '.png',
                           { transform: "translate(" + ( this.x * this.size + this.size / 2 ) + ',' +
                                                       ( this.y * this.size + this.size / 2 ) + ")"
                           }
                      )
                   );

        // Animate object:
        this.obj.animate( { svgOpacity: "1.0" }, 500 );
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
