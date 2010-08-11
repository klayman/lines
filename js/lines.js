


/* The game main class: */

with(Lines_game = function( settings ){

    /* Constructor */

    // Save default settings of the game:
    this.settings = settings;
    // Active page id:
    this.active_page = this.settings.field_id;
    // Create info bar object:
    this.create_info_bar();
    // Create field object:
    this.create_field();
    // Create button objects:
    this.init_buttons();
    // Set the event handlers:
    this.handlers();
}){
    /* Methods */

    prototype.create_info_bar = function(){
        // The game field object:
        this.info_bar = new Info_bar( this.settings.info_bar_id, this.settings.score_id );
    };

    prototype.create_field = function(){
        // The game field object:
        this.field = new Field( this.settings.cell_size, this.settings.border_size,
                                this.settings.field_id, this.info_bar );
    };

    prototype.init_buttons = function(){
        // Button, which opens "option" page:
        this.options_btn = new Button(
            this.settings.opt_btn_id, // html id
            "click",                  // Event name
            function( event ){        // Event handler
                var _this = event.data._this;
                _this.page( _this.settings.opt_page_id ); // Open "options" page
            },
            { _this : this }       // A map of data that will be passed to the event handler.
        );
        // "at least N balls in row" radio group:
        this.opt_row_n_rd = new Radio_group(
            this.settings.opt_row_n_name
        );
        // "at least N balls in block" radio group:
        this.opt_blk_n_rd = new Radio_group(
            this.settings.opt_blk_n_name
        );
        // Game "mode" radio group:
        this.opt_mode_rd = new Radio_group(
            this.settings.opt_mode_name,
            "change",
            function( event ){
                var _this = event.data._this;
                switch( _this.opt_mode_rd.sel_id() ){

                    case "lines":  _this.opt_row_n_rd.enable();
                                   _this.opt_blk_n_rd.disable();
                                   break;

                    case "blocks": _this.opt_blk_n_rd.enable();
                                   _this.opt_row_n_rd.disable();
                                   break;

                    default:       _this.opt_row_n_rd.disable();
                                   _this.opt_blk_n_rd.disable();
                }
            },
            { _this : this }
        );
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
        $( "html" ).click(
            function(){
                if( _this.active_page != _this.settings.field_id )
                    // If the current page isn't "field", open it:
                    _this.page( _this.settings.field_id );
            }
        );

    };

}



/* The game radio group class: */

/*
 * html_name   : name of radio group
 * [ evt ]     : event name (example: "click")
 * [ func ]    : handler function
 * [ f_param ] : data for the handler function
 **/
with(Radio_group = function( html_name, evt, func, f_param ){

    /* Constructor: */

    this.obj = $( "input[name='" + html_name + "']" );
    if( evt )
        this.bind( evt, func, f_param );
}){

    prototype.bind = function( evt, func, f_param ){
        this.obj.bind(
            evt,       // Event name (example: "click")
            f_param,   // A map of data that will be passed to the event handler.
            func       // A function to execute each time the event is triggered.
        );
    };

    prototype.sel_id = function(){
        return this.obj.filter( ":checked" ).attr( "id" ); // Return id of the selected element of radio group
    };

    prototype.disable = function(){
        this.obj.attr( "disabled", true );  // Disable radio group
    };

    prototype.enable = function(){
        this.obj.removeAttr( "disabled" );  // Enable radio group
    };
}



/* The game button class: */

/*
 * Links html object to the event handler.
 * html_id     : id of html object
 * [ evt ]     : event name (example: "click")
 * [ func ]    : handler function
 * [ f_param ] : data for the handler function
 **/
with(Button = function( html_id, evt, func, f_param ){

    /* Constructor: */

    this.obj = $( "#" + html_id );
    if( evt )
        this.bind( evt, func, f_param );
}){

    prototype.bind = function( evt, func, f_param ){
        this.obj.bind(
            evt,       // Event name (example: "click")
            f_param,   // A map of data that will be passed to the event handler.
            func       // A function to execute each time the event is triggered.
        );
    };
}



/* The game info bar class: */

with(Info_bar = function( html_id, score_id ){

    /* Constructor: */

    this.obj = $( "#" + html_id );  // Saving the jQuery object of info bar
    this.obj_score = $( "#" + score_id );

    var _this = this;               // Save link to "this" property
    $( "#" + html_id ).children( "div" ).children().svg(
        {
            onLoad: function( svg ){
                _this.svg_obj = svg;   // Saving SVG object of field
            }
        }
    );

    // Array of the Ball class objects
    this.balls = [];

}){
    /* Methods */

    /*
     * Set new score value
     */
    prototype.set_score = function( score ){
        this.obj_score.text( score );
    };

    /*
     * Remove all balls from the own SVG object:
     */
    prototype.remove_balls = function(){
        for( var i in this.balls )
            this.balls[ i ].erase();
        this.balls = [];
    };

    /*
     * Draw balls on the own SVG object:
     * arr   : array of colors of balls
     * size  : size of the field cell (in px)
     */
    prototype.put_balls = function( arr, size ){
        for( var i in arr ){
            var color = arr[ i ];
            var ball = new Ball( this.svg_obj, color, size );
            ball.popup( i * 1, 0, 1 );
            this.balls.push( ball );
        }
    };
}



/* The game field class: */

/*
 * Create field object.
 * cell_size   : size of each cell on screen (in px)
 * border_size : width of border line between cells (in px)
 * html_id     : id of <div> which contains svg
 **/
with(Field = function( cell_size, border_size, html_id, info_bar_obj ){

    this.obj = $( "#" + html_id );  // Saving the jQuery object of field
    var _this = this;               // Save link to "this" property
    $( "#" + html_id ).children().svg(
        {
            onLoad: function( svg ){
                _this.svg_obj = svg;   // Saving SVG object of field
            }
        }
    );

    this.square_size = cell_size;    // Default size of each cell (in px)
    this.border_size = border_size;  // Default size of cell border (in px)

    this.map = new Array( 9 );       // The 2d array of Ball class objects
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
    this.figure = 1;

    // X and Y coords of selected ball (in cells):
    this.sel_ball = null;

    this.score = 0;

    // Link to the Info_bar class object:
    this.info_bar_obj = info_bar_obj;

    // Put 3 first balls on the field:
    this.put_balls( this.gen_next_balls() );

    // Array of "next" colors of balls, which will appear at the field in the next turn:
    this.next_balls = this.gen_next_balls();
    // Update info bar balls:
    this.update_info_bar();


    this.handlers();    // Set the event handlers:

}){
    ////////////////// Methods ////////////////

    /*
     * Generate 3 new colors of balls and return them in array:
     */
    prototype.gen_next_balls = function() {
        var arr = [];
        for( var i = 0; i < 3; i++ ) {
            var color = this.rand( 1, 7 );
            arr.push( color );
        }
        return arr;
    };


    /*
     * Update the Info_bar class objec balls:
     */
    prototype.update_info_bar = function(){
        // Remove old "next" balls from the info bar:
        this.info_bar_obj.remove_balls();
        // Put new "next" balls on the info bar:
        this.info_bar_obj.put_balls( this.next_balls, this.square_size + this.border_size );
    };


    /*
     * Draw balls on the own SVG object:
     * arr : array of colors of balls
     */
    prototype.put_balls = function( arr ){
        for( var i in arr ){
            var color = arr[ i ];
            do {
                var nx = this.rand( 0, 8 );
                var ny = this.rand( 0, 8 );
            } while( this.map[ ny ][ nx ] );
            var ball = new Ball( this.svg_obj, color, this.square_size + this.border_size );
            this.map[ ny ][ nx ] = ball;
            ball.popup( nx, ny, 1 );
        }
    };


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

    prototype.move_ball = function( to_x, to_y, callback ) {
        if( ! this.sel_ball )
            return false;

        var nx = this.sel_ball.x;
        var ny = this.sel_ball.y;
        path = this.find_path( nx, ny, to_x, to_y );

        if( path.length > 0 ){
            var old_ball = this.map[ ny ][ nx ];
            this.map[ ny ][ nx ] = null;

            // we must create new ball, bacause of two parallel animations:
            // hiding old ball & popupping new ball
            var new_ball = new Ball( this.svg_obj, old_ball.num, this.square_size + this.border_size );

            this.map[ to_y ][ to_x ] = new_ball;

            old_ball.remove();
            this.sel_ball = null;

            var after_move = function( _this ){
                // Moving sucessfull:
                callback( _this );
            };

            new_ball.popup( to_x, to_y, 1, after_move, this );
        }
        // Moving faild!
        return false;
    }

    /*
     * Try to select ball on the field
     * nx, ny : position on the field ( numbers )
     */
    prototype.select_ball = function( nx, ny ){

        if( this.map[ ny ][ nx ] ){

            // Select ball and set to it "jumping" effect:

            if( this.sel_ball ){

                if( this.sel_ball.x == nx &&
                    this.sel_ball.y == ny )
                    // don't do anything:
                    return;

                var x = this.sel_ball.x;
                var y = this.sel_ball.y;
                this.map[ y ][ x ].jump_stop();
            }
            this.sel_ball = { "x" : nx,
                              "y" : ny };
            this.map[ ny ][ nx ].jump();
            return;
        }

    };


    /*
     * Test for existance of figure on the map
     * nx, ny : coordinates to start motion from
     * ms     : motions which describe figure
     * mark   : if true mark balls on the path
     *
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
     * test_figrure( 0, 0, [ 1, 7, 5, 3 ] ) --> false
     * test_figrure( 1, 0, [ 1, 7, 5, 3 ] ) --> false
     * test_figrure( 1, 2, [ 1, 7, 5, 3 ] ) --> true
     * test_figrure( 2, 1, [ 1, 7, 5, 3 ] ) --> false
     * test_figrure( 2, 6, [ 1, 7, 5, 3 ] ) --> true
     * test_figrure( 7, 8, [ 1, 7, 5, 3 ] ) --> false
     *
     * TODO: color test
     */
    prototype.test_figure = function( nx, ny, ms, mark ){
        var x = nx;
        var y = ny;
        var num = this.map[ y ][ x ].num;  // save color of ball (number)

        for( var i in ms )
        {
            if( x < 0 || y < 0 || x > 8 || y > 8 )
                return false;

            if( ! this.map[ y ][ x ] || this.map[ y ][ x ].num != num )  // broken path or wrong color
                return false;

            if( mark )
                this.map[ y ][ x ].marked = true;

            var res = this.move_xy( x, y, ms[ i ] );
            x = res[ 0 ];
            y = res[ 1 ];
        }
        return true; // all OK, movies are good
    };

    /*
     * This is tool-function, which return new coordinates.
     * x,y : old coordinates
     * mov : motion direction ( number )
     */
    prototype.move_xy = function( x, y, mov ) {
        var nx = x;
        var ny = y;
        switch( mov ) {
            case 0: ny-=1;        break;
            case 1: ny-=1; nx+=1; break;
            case 2: nx+=1;        break;
            case 3: nx+=1; ny+=1; break;
            case 4: ny+=1;        break;
            case 5: ny+=1; nx-=1; break;
            case 6: nx-=1;        break;
            case 7: nx-=1; ny-=1; break;
        }
        return [ nx, ny ]; // return new coords
    }

    /*
     * This method find and removes group of balls which is
     * belong to current figure template ( box, rombs, etc. )
     * TODO: calculate scores here ?
     */
    prototype.remove_balls = function() {
        var f = this.figures[ this.figure ];  // alias...

        for( var j = 0; j < this.map.length; j++ )
            for( var i = 0; i < this.map[ j ].length; i++ )
                if( this.map[ j ][ i ] )
                    for( var k in f )
                        if( this.test_figure( i, j, f[ k ] ) )
                            this.test_figure( i, j, f[ k ], true );  // mark balls for deletion

        function remove_group( nx, ny, _this ) {
            var stack = Array( );   // stack for siblings
            var cnt = 0;            // count of removed balls

            stack.push( [ nx, ny ] );
            while( stack.length )
            {
                var pos  = stack.splice( 0,1 )[ 0 ];         // take first element and remove them
                var ball = _this.map[ pos[ 1 ] ][ pos[ 0 ] ];

                if( !ball )  // ball may be sheduled for deletion in stack more than one time
                    continue;

                ball.remove();                               // animate & destroy SVG
                _this.map[ pos[ 1 ] ][ pos[ 0 ] ] = null;    // remove from map
                cnt++;                                       // count it...

                var use = {};
                for( var k in f )                     // try all templates
                    for( var m in f[ k ] )            // ... and each motion direction from template
                        if( !use[ f[ k ][ m ] ] )     // ... use each motion only once
                        {
                            use[ f[ k ][ m ] ] = true;
                            for( var t = 0; t <= 1; t++ ) // test forward / backward pairs
                            {
                                var mov = ( f[ k ][ m ] + t * 4 ) % 8;   // by 4 we rotate f[ k ][ m ] at 180 degree
                                var res = _this.move_xy( pos[ 0 ], pos[ 1 ], mov );

                                if( res[ 0 ] >= 0 && res[ 1 ] >= 0 && res[ 0 ] <= 8 && res[ 1 ] <= 8 )  // test boundaries
                                {
                                    var tmp = _this.map[ res[ 1 ] ][ res[ 0 ] ];
                                    if( tmp && tmp.marked )    // we found marked ball..
                                        stack.push( res );     // add its position to search from for new balls
                                }
                            }
                        }
            }
            return cnt;
        }

        var cnt = 0;  // count of removed balls
        for( var j = 0; j < this.map.length; j++ )
            for( var i = 0; i < this.map[ j ].length; i++ )
                if( this.map[ j ][ i ] && this.map[ j ][ i ].marked )
                    cnt += remove_group( i, j, this );

        return cnt;
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

                var callback = function( _this ){
                    var cnt = _this.remove_balls();                  // find and remove groups of balls
                    if( cnt ){
                        var cnt_min = _this.figures[ _this.figure ][ 0 ].length;
                        _this.score += ( cnt - cnt_min + 1 ) * cnt;
                        _this.info_bar_obj.set_score( _this.score );
                    } else {
                        _this.put_balls( _this.next_balls );         // put 3 new balls on the field
                        _this.remove_balls();                        // put_balls can create new true figres...  TODO: do not add scores
                        _this.next_balls = _this.gen_next_balls();   // generate 3 new "next" balls
                        _this.update_info_bar();                     // update info bar "next" balls
                    }
                };

                _this.move_ball( nx, ny, callback );  // try move selected ball to new position
            }
        );
    };


    /*
     * Auxiliary method for generating random numbers in a certain range:
     */
    prototype.rand = function( m, n ){
        m = parseInt( m );
        n = parseInt( n );
        return Math.floor( Math.random() * ( n - m + 1 ) ) + m;
    };
}



with(Ball = function( svg_obj, img_number, img_size ){

    /* Constructor */

    this.svg_obj = svg_obj;

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

    /*
     * This method create new SVG object and place it on the screen.
     * If SVG already exist then it will be destroyed first so you can
     * call draw multiple times to immediately place ball at new position
     * without animation.
     */
    prototype.draw = function( x, y, scale ){
        this.erase();  // first erase old SVG object

        /*
         * Create jQuery object:
         * Here some magic... Image is created with its center at ( 0, 0 ) and
         * then moved through transform matrix to exact position.
         * This is due to draw position ( first two arguments of svg_obj.image ) is not
         * stored to transform matrix. I.e. object always created with this
         * transform matrix:
         * [ sx  0   tx ]  sx = sy = 1
         * [ 0   sy  ty ]  tx = ty = 0
         * [ 0   0   1  ]
         */
        this.obj = $( this.svg_obj.image(
                           ( - this.size / 2 ),  // image center equal to coordinates origin ( 0, 0 )
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
                             "matrix( " + scale +", 0, 0, " + scale + "," +
                                ( x * this.size + this.size / 2 ) + ',' +
                                ( y * this.size + this.size / 2 ) +
                             ")"
                           }
                      )
                   );

        this.x = x;
        this.y = y;
    };


    /*
     * Destroy internal SVG object.
     */
    prototype.erase = function(){
        if( this.obj )
            this.obj.remove();  // remove SVG object
    }


    /*
     * Popup ball with animation at position ( nx, ny )
     */
    prototype.popup = function( nx, ny, scale, callback, clbk_param ){
        this.draw( nx, ny, 0 );                      // create new SVG object with zero size
        this.animate( [ [ nx, ny, scale, 100 ] ], callback, clbk_param );  // ... and animate to desired size
    };


    /*
     * Remove ball with animation.
     * After animation SVG object will be destroyed.
     */
    prototype.remove = function(){
        var _this = this;
        callback = function() { _this.erase(); }

        this.jump_stop( true ); // hard stop of jumping animation
        this.animate( [ [ this.x, this.y, 0, 100 ] ], callback );  // animate to zero scale
    };


    /*
     * Very flexible method to animate existing SVG ball object.
     * structure  : array of structures [ new_x, new_y, new_scale, time ]
     * callback   : callback to call after all animation steps.
     * clbk_param : callback function parameter
     *
     * For example:
     *
     * this.animate( [ [ 1, 1, 1, 100 ], [ 2, 2, 1.1, 200 ] ], function() { alert( 'bla' ) } );
     *
     * 1 step : animate from current position and scale to x = 1, y = 1, scale = 1 during 100 ms
     * 2 step : animate to x = 2, y = 2, scale = 1.1 during 200 ms
     * after this alert will be shown.
     */
    prototype.animate = function( structure, callback, clbk_param ){
        var _this = this;  // save link to this...

        // ... send part of structure to next animation step
        var func = function(){
            _this.animate( structure.slice( 1 ) );
        };
        if( structure.length == 1 )  // we on the last step,
            if( callback ){
                func = function(){
                    callback( clbk_param );  // ...at the end of animation call this callback
                };
            }else
                func = function(){};


        var arr = structure[ 0 ]; // take parameters for animation

        this.obj.animate(
            { svgTransform:
                "matrix(" +
                    arr[ 2 ] + ", 0, 0, " + arr[ 2 ] + "," +
                    ( arr[ 0 ] * this.size + this.size / 2 ) + ',' +
                    ( arr[ 1 ] * this.size + this.size / 2 ) +
                ")"
            }, arr[ 3 ], func );  // animate and go to next step or call callback
    };


    /*
     * Animate jumping :)
     * For stop this animation call jump_stop.
     * Inside hard usage of animate method...
     */
    prototype.jump = function( ){
        // animation parameters...
        var structure = [ [ this.x, this.y, 1.08, 80 ],
                          [ this.x, this.y, 1,    80 ],
                          [ this.x, this.y, 1.05, 50 ],
                          [ this.x, this.y, 1,    50 ] ]

        this.animate( structure ); // animate this immediately

        var _this = this;
        this.obj.everyTime( 1100,
            function(){
                _this.animate( structure );  // do animation cycle every 1100 ms
            }
        );
    };


    /*
     * Stop jumping animation.
     * hard : if true do not revert to scale = 1.0, otherwise
     *        animate to standard scale.
     */
    prototype.jump_stop = function( hard ){
        // Stop animation:
        this.obj.stopTime();
        if( ! hard )
            // Return default size:
            this.animate( [ [ this.x, this.y, 1, 1 ] ] );
    };
}



var lines;
$( document ).ready(
    function(){
        /* Game initialization after the page loads: */
        // Set default game settings:
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
         * opt_mode_name  : name of "game mode" radio group
         * opt_row_n_name : name of "at least N balls in row" radio group
         * opt_blk_n_name : name of "at least N balls in block" radio group
         **/
        var settings =
            {
                "show_bars"     : true,
                "cell_size"     : 48,
                "border_size"   : 2,
                "info_bar_id"   : "info_bar",
                "info_bar_h"    : 71,
                "score_id"      : "score",
                "footer_bar_id" : "footer_bar",
                "footer_bar_h"  : 71,
                "field_id"      : "field",
                "opt_btn_id"    : "options",
                "opt_page_id"   : "options_page",
                "opt_mode_name" : "mode",
                "opt_row_n_name": "in_line",
                "opt_blk_n_name": "in_block"
            };
        lines = new Lines_game( settings );
    }
);
