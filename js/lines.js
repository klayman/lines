


/* The game main class: */

with(Lines_game = function( settings ){

    /* Constructor */

    // Save default settings of the game:
    /*
     * show_bars      : visible or not info bars up and below the field (boolean)
     * cell_size      : the field's cell size (in px)
     * border_size    : the field's cell border size (in px)
     * info_bar_id    : id of the DOM element with the score bar
     * info_bar_h     : info bar height (in px)
     * footer_bar_id  : id of the settings bar
     * footer_bar_h   : footer bar height (in px)
     * field_id       : id of the game's field DOM element
     * opt_btn_id     : id of options button
     * opt_page_id    : id of options page
     **/
    this.settings = settings;
    // Active page id:
    this.active_page = this.settings.field_id;
    // Create field object:
    this.create_field();
    // Set the event handlers:
    this.handlers();
}){
    /* Methods */

    prototype.create_field = function(){
        // The game field object:
        this.field = new Field( this.settings.cell_size, this.settings.border_size,
                                this.settings.field_id );
    };


    prototype.info_bars = function(){
        // Time for animation (in ms):
        var t = 200;
        if( this.settings.show_bars ){
            // Hide bars:
            $( "#" + this.settings.info_bar_id ).animate( { height: "0px" }, t );
            $( "#" + this.settings.footer_bar_id ).animate( { height: "0px" }, t );
            this.settings.show_bars = false;
        }else{
            // Show bars:
            $( "#" + this.settings.info_bar_id ).animate( { height: this.settings.info_bar_h + "px" }, t );
            $( "#" + this.settings.footer_bar_id ).animate( { height: this.settings.footer_bar_h + "px" }, t );
            this.settings.show_bars = true;
        }
    };


    prototype.page = function( page ){
        // Save link to "this" property:
        var _this = this;
        // Time for animation (in ms):
        var t = 250;

        if( this.active_page == page )
            page = this.settings.field_id;

        $( "#" + this.active_page ).fadeOut( t,
            function(){
                $( "#" + page ).fadeIn( t );
                _this.active_page = page;
            } );

    };


    prototype.handlers = function(){
        // Save link to "this" property:
        var _this = this;
        // Set the hot keys handlers:
        $( document ).keyup(
            function( e ){
                switch( e.keyCode ){
                    // Show or hide info bars up and below the field:
                    case 90: _this.info_bars(); break;
                }
            }
        );
        var f = function( e ){
            // w3c standard method:
            e.stopPropagation();
        };
        // Stop click events propagation:
        $( "#" + this.settings.field_id ).click( f );
        $( "#" + this.settings.opt_page_id ).click( f );
        $( "#" + this.settings.footer_bar_id ).click( f );
        // Set the click handler on the options button:
        $( "#" + this.settings.opt_btn_id ).click(
            function(){
                // Open options page:
                _this.page( _this.settings.opt_page_id );
            }
        );
        $( "html" ).click(
            function(){
                if( _this.active_page != _this.settings.field_id )
                    // If the current page isn't "field", open it:
                    _this.page( _this.settings.field_id );
            }
        );

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

    prototype.put_balls = function() {
        for( var i = 0; i < 3; i++ ) {
            var color = this.rand( 1, 7 );
            do {
                var nx = this.rand( 0, 8 );
                var ny = this.rand( 0, 8 );
            } while( this.map[ ny ][ nx ] );

            var ball = new Ball( color, this.square_size + this.border_size );
            ball.draw( this.svg_obj, nx, ny, 1 );
            this.map[ ny ][ nx ] = ball;
        };
    }

    prototype.find_path = function( f_x, f_y, to_x, to_y ) {
        var stack = Array( );           // stack for multiple purposes

        var arr = new Array( 9 );       // 2d array for back-path
        for( var i = 0; i < 9; i++ )
            arr[ i ] = new Array( null, null, null, null, null, null, null, null, null );


        stack.push( [ f_x, f_y ] );

        while( stack.length )
        {
            var pos = stack.splice( 0,1 )[ 0 ];  // take first element and remove them

            var d = [ [ 1, 0 ], [ -1, 0 ], [ 0, 1 ], [ 0, -1 ] ];   // allowed motions
            for( var i in d )
            {
                var x = pos[ 0 ] + d[ i ][ 0 ];
                var y = pos[ 1 ] + d[ i ][ 1 ];
                if( ( x >= 0 ) && ( y >= 0 ) && ( x <= 8 ) && ( y <= 8 ) && !this.map[ y ][ x ] && ! arr[ y ][ x ] )
                {
                    arr[ y ][ x ] = pos;    // we go to position ( x, y ) from position pos
                    stack.push( [ x, y ] ); // add new place...
                }
            }
        }

        if( !arr[ to_y ][ to_x ] )
            return [];

        var x = to_x;
        var y = to_y;
        while( x != f_x || y != f_y )
        {
            var pos = arr[ y ][ x ];
            stack.push( [ x, y ] );
            x = pos[ 0 ];
            y = pos[ 1 ];
        }

        return stack;
    }

    prototype.move_ball = function( to_x, to_y ) {
        if( !this.sel_ball )
            return;

        var nx = this.sel_ball.x;
        var ny = this.sel_ball.y;
        path = this.find_path( nx, ny, to_x, to_y );

        if( path.length > 0 ){
            var color_num = this.map[ ny ][ nx ].num;
            // Remove ball:
            this.map[ ny ][ nx ].jump_stop( nx, ny, true );
            this.map[ ny ][ nx ].remove( nx, ny );
            this.map[ ny ][ nx ] = null;
            // Add ball at the new position:
            var ball = new Ball( color_num, this.square_size + this.border_size );
            this.map[ path[ 0 ][ 1 ] ][ path[ 0 ][ 0 ] ] = ball;
            ball.draw( this.svg_obj, path[ 0 ][ 0 ], path[ 0 ][ 1 ], 1 );
            this.sel_ball = null;
            // Moving sucessfull:
            return true;
        }
        /*for( i in path )
        {
            // TODO: this is concept code ;)
            var ball = new Ball( 6, this.square_size + this.border_size );
            ball.draw( this.svg_obj, path[ i ][ 0 ], path[ i ][ 1 ], 0.3 );
        }*/
        // Moving faild!
        return false;
    }

    /*
     * Put ball at desired position
     * nx, ny : position on map ( numbers )
     * color  : color of ball ( number )
     */
    prototype.select_ball = function( nx, ny ){

        //alert( this.map[ ny ][ nx ] );
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
            if( x < 0 || y < 0 || x > 8 || y > 8 )
                return false;

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
                        //alert( 'bla' );
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

                _this.select_ball( nx, ny );     // try to select ball on the map
                if( _this.move_ball( nx, ny ) ){ // try move selected ball to new position
                    _this.put_balls();           // put 3 new balls on the field
                    _this.remove_balls();        // remove balls & calculate scores etc...
                }
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

    // Save the ball image number:
    this.num = img_number;

    // Define the image name:
    this.img_name = undefined;
    switch( this.num ){
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


    prototype.remove = function( x, y ){
        this.animate( x, y, 0, 100 );
    };


    prototype.animate = function( x, y, scale, time, structure ){
        // Save link to "this" property:
        var _this = this;

        if( ! structure )
            var callback = function(){
                if( scale == 0 )
                    // Remove the ball jQuery object:
                    _this.obj.remove();
            };
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
                };
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


    prototype.jump_stop = function( x, y, hard ){
        // Stop animation:
        this.obj.stopTime();
        if( ! hard )
            // Return default size:
            this.animate( x, y, 1, 0 );
    };
}


var lines;
$( document ).ready(
    function(){
        /* Game initialization after the page loads: */
        // Set default game settings:
        var settings =
            {
                "show_bars"     : true,
                "cell_size"     : 48,
                "border_size"   : 2,
                "info_bar_id"   : "info_bar",
                "info_bar_h"    : 71,
                "footer_bar_id" : "footer_bar",
                "footer_bar_h"  : 71,
                "field_id"      : "field",
                "opt_btn_id"    : "options",
                "opt_page_id"   : "options_page",
            };
        lines = new Lines_game( settings );
        lines.field.put_balls();
    }
);
