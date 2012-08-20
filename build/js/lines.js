/* The game main class: */

with(Lines_game = function( settings, html ){

    // Save default settings of the game and html objects:
    this.settings = settings;
    this.html = html;

}){

    prototype.init = function(){
        this.store = new Store;
        // Load saved settings if possible:
        if( this.store.load( "lines_settings" ) )
            this.settings = JSON.parse( this.store.load( "lines_settings" ) );
        // Make a async request - get texts on selected language:
        $.ajax(
            {
                   cache: true,
                     url: "js/lang_" + this.settings.lang + ".js",
                dataType: "script"
            }
        );
        this.update_settings_controls();
        // Set active page as game field:
        this.active_page = this.html.field_page;
        // Create info bar:
        this.info_bar = new Info_bar( this );
        // Create field object:
        this.field = new Field( this );
        // Load saved game if possible:
        this.load_game();
        // Update field size according to game mode:
        this.field.update_size();
        // Set event handlers:
        this.handlers();
    };


    prototype.show_page = function( page ){
        if( this.active_page.attr( "id" ) == page.attr( "id" ) )
            return;
        this.field.deselect_ball();  // deselect active ball on the field
        this.active_page.hide()
        this.active_page = page;
        page.show();
    };


    /*
     * Load game high scores table.
     */
    prototype.load_high_scores = function( check_record ){
        var page = this.html.high_score_page;
        var title = page.find( "h1" );
        switch( this.settings.mode ){
            case 0: title.text( txt.RECTANGLES ); break;
            case 1: title.text( txt.RINGS );      break;
            case 2: title.text( txt.LINES + ", 4 " + txt.IN_ROW ); break;
            case 3: title.text( txt.LINES + ", 5 " + txt.IN_ROW ); break;
            case 4: title.text( txt.LINES + ", 6 " + txt.IN_ROW ); break;
            case 6: title.text( txt.BLOCKS + ", 6 " + txt.IN_BLOCK ); break;
            case 7: title.text( txt.BLOCKS + ", 7 " + txt.IN_BLOCK ); break;
            case 8: title.text( txt.BLOCKS + ", 8 " + txt.IN_BLOCK ); break;
        }
        this.html.scores_table.text( txt.LOADING );
        var self = this;
        $.ajax(
            {
                type : "POST",
                 url : "server.php",
                data : {
                            "get_high_scores" : this.settings.mode
                       },
             success :
                function( data ){
                    self.html.scores_table.empty();
                    data = JSON.parse( data );
                    var table = $( "<table></table>" );
                    var tr = $( "<tr></tr>" );
                    tr.append(
                        $( "<th>" + txt.PLACE + "</th>" ),
                        $( "<th>" + txt.PLAYER + "</th>" ),
                        $( "<th>" + txt.SCORE + "</th>" ),
                        $( "<th>" + txt.DATE + "</th>" )
                    );
                    table.append( tr );
                    var place = 0;
                    for( var i in data ){
                        tr = $( "<tr></tr>" );
                        var date = new Date();
                        date.setTime( data[ i ][ 2 ] * 1000 );
                        var day = date.getDate();
                        var month = ( date.getMonth() + 1 ) + "";
                        month = month.length == 1 ? "0" + month : month;
                        var year = date.getFullYear();
                        tr.append(
                            $( "<td>" + ( parseInt( i ) + 1 ) + "</td>" ),
                            $( "<td>" + data[ i ][ 0 ] + "</td>" ),
                            $( "<td>" + data[ i ][ 1 ] + "</td>" ),
                            $( "<td>" + day + "." + month + "." + year + "</td>" )
                        );
                        table.append( tr );
                        if( check_record && self.score >= data[ i ][ 1 ] && place == 0 )
                            place = parseInt( i ) + 1;
                    }
                    self.html.scores_table.append( table );
                    if( check_record ){
                        if( place ){
                            var name = prompt( txt.HIGH_SCORE.replace( "%s", self.score ).replace( "%p", place ) );
                            if( name ){
                                $.ajax(
                                    {
                                          type : "POST",
                                           url : "server.php",
                                          data : {
                                                    "score" : self.score,
                                                   "result" : self.settings.mode,
                                                "game_hash" : self.game_hash,
                                                     "name" : name
                                                 },
                                       success : function(){
                                                    self.load_high_scores();
                                                    self.show_page( self.html.high_score_page );
                                                 },
                                         error : function(){
                                                    alert( txt.UNABLE_TO_CONNECT );
                                                 }
                                    }
                                );
                            }else
                                self.show_page( self.html.high_score_page );
                        }else
                            alert( txt.GAME_OVER + " " + txt.SCORE + ": " + self.score );
                    }
                },
               error :
                function(){
                   self.html.scores_table.text( txt.UNABLE_TO_CONNECT );
                }
            }
        );
    };


    /*
     * Update the game's mode icon on the appropriate button.
     */
    prototype.update_mode_button = function(){
        var css_pos = "0 0";
        this.html.mode_num.text( "" );
        switch( this.settings.mode ){
            case 0: css_pos = "-322px"; break;
            case 1: css_pos = "-368px"; break;
            case 2: css_pos = "-276px"; break;
            case 3: css_pos = "-276px"; break;
            case 4: css_pos = "-276px"; break;
            case 6: css_pos = "-414px"; break;
            case 7: css_pos = "-414px"; break;
            case 8: css_pos = "-414px"; break;
        }
        this.html.mode_btn.css( "background-position", "center " + css_pos );
        if( this.settings.mode > 1 ){
            var num = this.settings.mode;
            if( this.settings.mode > 4 )
                this.html.mode_num.css( "right", '4px' ).css( "left", "auto" );  // the digit must be on the right
            else{
                this.html.mode_num.css( "left", '4px' ).css( "right", "auto" );  // the digit must be on the left
                num += 2;  // four in row = mode 2
            }
            this.html.mode_num.text( num );
        }
    };


    prototype.update_settings_controls = function(){
        // Update html elements according to new settings:
        switch( this.settings.mode ){
            case 0: this.html.mode_radio.filter( "#rectangles" ).click(); break;
            case 1: this.html.mode_radio.filter( "#rings" ).click(); break;
           default:
                if( this.settings.mode > 1 ){
                    this.html.mode_radio.filter( "#lines" ).click();
                    this.html.row_num_sel.find( "[value='" + ( this.settings.mode + 2 ) + "']" ).attr( "selected", "selected" );
                }
                if( this.settings.mode > 4 ){
                    this.html.mode_radio.filter( "#blocks" ).click();
                    this.html.block_num_sel.find( "[value='" + ( this.settings.mode ) + "']" ).attr( "selected", "selected" );
                }
        }

        this.html.balls_type_sel.find( "[value='" + this.settings.balls_type + "']" ).attr( "selected", "selected" );

        if( this.settings.show_next )
            this.html.show_next_btn.attr( "checked", "checked" );
        this.update_mode_button();
    };


    prototype.save_settings = function(){
        this.new_settings = {};
        // Cloning settings object:
        for( var i in this.settings )
            this.new_settings[ i ] = this.settings[ i ];

        // Define the selected game mode:
        switch( this.html.mode_radio.filter( ":checked" ).attr( "id" ) ){
            case "lines":
                switch( this.html.row_num_sel.val() ){
                    case "4": this.new_settings.mode = 2; break;
                    case "5": this.new_settings.mode = 3; break;
                    case "6": this.new_settings.mode = 4; break;
                }
            break;
            case "rectangles":
                this.new_settings.mode = 0;
            break;
            case "rings":
                this.new_settings.mode = 1;
            break;
            case "blocks":
                switch( this.html.block_num_sel.val() ){
                    case "6": this.new_settings.mode = 6; break;
                    case "7": this.new_settings.mode = 7; break;
                    case "8": this.new_settings.mode = 8; break;
                }
            break;
        }

        // Define, whether is need to show next balls on the field:
        this.new_settings.show_next = ( this.html.show_next_btn.filter( ":checked" ).length > 0 ) ? true : false;
        this.settings.show_next = this.new_settings.show_next;
        if( this.settings.show_next )
            this.field.add_small_balls();
        else
            this.field.remove_small_balls();

        if( this.new_settings.mode != this.settings.mode ){
            if( this.new_settings.mode <= 1 ){
                this.new_settings.field_size = 7;
                this.new_settings.field_border = 1;
            }else{
                this.new_settings.field_size = 9;
                this.new_settings.field_border = 0;
            }
            if( this.game_started ){
                if( confirm( txt.CONFIRM_START_NEW_GAME ) )
                    // Start new game with new game mode:
                    this.start_new_game();
            }else
                this.start_new_game();
        }

        this.settings.balls_type = this.html.balls_type_sel.val();
        this.new_settings.balls_type = this.settings.balls_type;
        this.field.change_balls_type();
        this.info_bar.change_balls_type();
        this.store.save( "lines_settings", JSON.stringify( this.new_settings ) );
    };


    /*
     * Save current game to html5 store or cookie.
     */
     prototype.save_game = function(){
        if( ! this.game_started )
            return;
        var str = "[" + this.score + ",[";
        for( var i in this.field.map ){
            str += "["
            for( var j in this.field.map[ i ] ){
                str += this.field.map[ i ][ j ] ? this.field.map[ i ][ j ].num : 0;
                if( parseInt( j ) != this.field.map[ i ].length - 1 )
                    str += ",";
            }
            str += "]";
            if( parseInt( i ) != this.field.map.length - 1 )
                str += ",";
        }
        str += "],[";
        for( var i in this.field.next_balls ){
            var arr = this.field.next_balls[ i ];
            str += "[[" + arr[ 0 ][ 0 ] + "," + arr[ 0 ][ 1 ] + "],";
            str += arr[ 1 ].num + "]";
            if( parseInt( i ) != this.field.next_balls.length - 1 )
                str += ","
        }
        str += "]," + this.settings.mode + "]";
        this.store.save( "lines_game", str );
     };

     /*
      * Load saved game from html5 store or cookie.
      */
    prototype.load_game = function(){
        this.game_hash = this.store.load( "lines_game_hash" );
        if( ! this.store.load( "lines_game" ) ){
            this.start_new_game();
            return;
        }
        this.game_started = true;
        this.field.clear();
        var arr = JSON.parse( this.store.load( "lines_game" ) );
        this.info_bar.set_score( arr[ 0 ] );
        this.score = arr[ 0 ];
        for( var i in arr[ 1 ] )
            for( var j in arr[ 1 ][ i ] )
                if( arr[ 1 ][ i ][ j ] ){
                    var ball = new Ball( this.html.field_insert, arr[ 1 ][ i ][ j ], this.settings.balls_type );
                    this.field.map[ i ][ j ] = ball;
                    ball.popup( j, i, "normal" );
                }
        this.field.next_balls = [];
        for( var i in arr[ 2 ] ){
            var ball = new Ball( this.html.field_insert, arr[ 2 ][ i ][ 1 ], this.settings.balls_type );
            var x = arr[ 2 ][ i ][ 0 ][ 0 ];
            var y = arr[ 2 ][ i ][ 0 ][ 1 ];
            this.field.next_balls.push( [ [ x, y ], ball ] );
            ball.popup( x, y, "small" );
        }
        this.field.update_info_bar();
        this.settings.mode = arr[ 3 ];
        this.update_mode_button();
        this.resume_online_score();
    };


    /*
     * Delete saved game from html5 store or cookie, stop game global timer.
     */
    prototype.delete_game = function(){
        if( this.store.load( "lines_game" ) )
            this.store.delete( "lines_game" );
        if( this.timer )
            clearInterval( this.timer );
    };


    /*
     * Reset old and start new game.
     */
    prototype.start_new_game = function(){
        if( this.new_settings ){
            this.settings = this.new_settings;
            this.update_mode_button();
        }
        this.field.update_size();
        this.field.clear();
        this.field.next_round();
        this.game_started = false;
        this.info_bar.score2zero();
        this.delete_game();
        this.reset_online_score();
    };

    /*
     * Change game mode and start new game.
     */
    prototype.change_mode = function(){
        var mode = 0;
        switch( this.settings.mode ){
            case 2: mode = 0;  break;
            case 3: mode = 0;  break;
            case 4: mode = 0;  break;
            case 0: mode = 1;  break;
            case 1: mode = -6; break;
            case 6: mode = -2; break;
            case 7: mode = -2; break;
            case 8: mode = -2; break;
        }
        if( mode == -2 )
            switch( this.html.row_num_sel.val() ){
                case "4" : mode = 2; break;
                case "5" : mode = 3; break;
                case "6" : mode = 4; break;
            }
        if( mode == -6 )
            switch( this.html.block_num_sel.val() ){
                case "6" : mode = 6; break;
                case "7" : mode = 7; break;
                case "8" : mode = 8; break;
            }
        if( this.new_settings )
            this.new_settings.mode = mode;
        this.settings.mode = mode;
        this.update_mode_button();
        this.start_new_game();
    };



    /*
     * Resume saved game - update game time on the server and resume global timer.
     */
    prototype.resume_online_score = function(){
        var self = this;
        if( ! this.game_hash )
            return;
        if( this.timer )
            clearInterval( this.timer );
        $.ajax(
            {
                type : "POST",
                 url : "server.php",
                data : {
                         "update_time" : true,
                           "game_hash" : this.game_hash
                       },
             success :
                function( data ){
                    if( parseInt( data ) == 0 ){
                        alert( txt.GAME_EXPIRED );
                        self.game_hash = null;
                        self.store.delete( "lines_game_hash" );
                    }else
                        self.timer = window.setInterval(
                            self.update_online_score,
                            10000,
                            self
                        );
                },
               error :
                function(){
                    alert( txt.UNABLE_TO_CONNECT );
                }
            }
        );
    };


    /*
     * Reset game score on the server and start global update timer.
     */
    prototype.reset_online_score = function(){
        var self = this;
        if( this.timer )
            clearInterval( this.timer );
        $.ajax(
            {
                type : "POST",
                 url : "server.php",
                data : {
                            "new_game" : true,
                           "game_hash" : this.game_hash
                       },
             success :
                function( data ){
                    if( ! self.game_hash && data != "" ){
                        self.store.save( "lines_game_hash", data );
                        self.game_hash = data;
                    }
                    self.timer = window.setInterval(
                        self.update_online_score,
                        10000,
                        self
                    );
                },
               error :
                function(){
                    alert( txt.UNABLE_TO_CONNECT );
                }
            }
        );
    };


    /*
     * Update current game score on the server.
     */
    prototype.update_online_score = function( self ){
        var score = ( self ) ? self.score : this.score;
        var game_hash = ( self ) ? self.game_hash : this.game_hash;
        $.ajax(
            {
                type : "POST",
                 url : "server.php",
                data : {
                                "score" : score,
                            "game_hash" : game_hash
                       }
            }
        );
    };


    prototype.handlers = function(){
        var self = this;
        this.html.new_game_btn.click(
            function(){
                self.show_page( self.html.field_page );
                self.start_new_game();
            }
        );
        this.html.mode_btn.click(
            function(){
                self.show_page( self.html.field_page );
                self.change_mode();
            }
        );
        this.html.options_btn.click(
            function(){
                self.show_page( self.html.options_page );
            }
        );
        this.html.help_btn.click(
            function(){
                self.show_page( self.html.help_page );
            }
        );
        this.html.high_score_btn.click(
            function(){
                self.load_high_scores();
                self.show_page( self.html.high_score_page );
            }
        );
        this.html.cancel_opt_btn.click(
            function(){
                self.show_page( self.html.field_page );
                self.update_settings_controls();
            }
        );
        this.html.save_opt_btn.click(
            function(){
                self.show_page( self.html.field_page );
                self.save_settings();
            }
        );
        this.html.container.click(
            function( event ){
                event.stopPropagation();
            }
        );
        $( document ).click(
            function(){
                self.html.cancel_opt_btn.click();
            }
        );
    };

}



/* The game info bar class: */

with(Info_bar = function( game_obj ){

    this.game = game_obj;  // Link to the main game object
    this.obj = this.game.html.info_bar;  // Saving the jQuery object of info bar
    this.obj_score = this.game.html.score;
    // Array of the Ball class objects
    this.balls = [];
    // Game score:
    this.game.score = 0;
}){
    /*
     * Set new score value
     */
    prototype.set_score = function( score ){
        this.obj_score.text( score );
    };

    /*
     * Plus score and set it to bar
     */
    prototype.plus_score = function( score ){
        this.game.score += score;
        this.set_score( this.game.score );
    };

    /*
     * Set game score to zero
     */
    prototype.score2zero = function(){
        this.game.score = 0;
        this.set_score( 0 );
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
     * Change balls type:
     */
    prototype.change_balls_type = function(){
        for( var i in this.balls )
            this.balls[ i ].change_type( this.game.settings.balls_type );
    };

    /*
     * Draw balls on the own SVG object:
     * arr   : array of colors of balls
     * size  : size of the field cell (in px)
     */
    prototype.put_balls = function( arr ){
        for( var i in arr ){
            var rec = arr[ i ];
            var ball = new Ball( this.obj, rec[ 1 ].num, this.game.settings.balls_type );
            ball.popup( i * 1, 0, "small" );
            this.balls.push( ball );
        }
    };
}



/* The game field class: */

/*
 * Create field object.
 * game_obj     : object of Lines_game class
 */
with(Field = function( game_obj ){

    this.game = game_obj;  // Link to the main game object
    this.obj = this.game.html.field_page;  // Saving the jQuery object of field

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
    ];

    // X and Y coords of selected ball (in cells):
    this.selected_ball = null;

    this.game.game_started = false;

    this.handlers();    // Set the event handlers:

}){
    ////////////////// Methods ////////////////

    /*
     * Generate 3 new colors & positions of balls and return them in array:
     */
    prototype.gen_next_balls = function() {
        var arr = [];
        var s = this.game.settings.field_size;
        var dl = this.game.settings.field_border;
        var cnt = s * s - this.balls_count();
        if( cnt > 3 ) cnt = 3;
        for( var i = 0; i < cnt; i++ ) {
            var color = this.rand( 1, 7 );
            do {
                var nx = this.rand( 0 + dl, 8 - dl );
                var ny = this.rand( 0 + dl, 8 - dl );
                var unique = true;
                for( var j in arr )
                    if( arr[ j ][ 0 ][ 0 ] == nx && arr[ j ][ 0 ][ 1 ] == ny )
                        unique = false;  // don't take empty place on the map twice
            } while( this.map[ ny ][ nx ] || ! unique );
            var ball = new Ball( this.game.html.field_insert, color, this.game.settings.balls_type )
            arr.push( [ [ nx, ny ], ball ] );
        }
        return arr;
    };


    /*
     * Update the Info_bar class object balls:
     */
    prototype.update_info_bar = function(){
        // Remove old "next" balls from the info bar:
        this.game.info_bar.remove_balls();
        // Put new "next" balls on the info bar:
        this.game.info_bar.put_balls( this.next_balls );
    };

    /*
     * starts new round: put new balls on map,
     *                   remove new possible combinations
     */
    prototype.next_round = function() {
        this.put_balls( this.next_balls );          // put 3 balls which was generated before
        this.remove_balls();                        // put_balls can create new true figres...
        this.game.save_game();                      // Save the current game
        var s = this.game.settings.field_size;
        if( this.balls_count() == s * s )
        {
            this.game.load_high_scores( true );
            this.game.game_started = false;
            this.next_balls = [];
            this.game.delete_game();
            return;
        }
        this.next_balls = this.gen_next_balls();    // generate 3 new "next" balls
        if( this.game.settings.show_next )
            this.add_small_balls();
        this.update_info_bar();                     // update info bar "next" balls
    };

    /*
     * Draw balls on the field:
     * arr : array of positions & balls,
     *       i.e. [ [ [x,y], ball ], [ [x,y], ball ], ... ]
     */
    prototype.put_balls = function( arr ){
        var dl = this.game.settings.field_border;
        for( var i in arr ){
            var rec = arr[ i ];
            var nx = rec[ 0 ][ 0 ];
            var ny = rec[ 0 ][ 1 ];
            var ball = new Ball( this.game.html.field_insert, rec[ 1 ].num, this.game.settings.balls_type );
            if( this.map[ ny ][ nx ] )     // user can send ball to this place
            {
                do {
                    nx = this.rand( 0 + dl, 8 - dl );
                    ny = this.rand( 0 + dl, 8 - dl );
                } while( this.map[ ny ][ nx ] );   // find new place...
            }
            // Popup at position which was stored earlier:
            if( this.game.game_started && this.game.settings.show_next )
                ball.popup( nx, ny, "transition" );
            else
                ball.popup( nx, ny, "normal" );

            this.map[ ny ][ nx ] = ball;    // store real ball on the map, hint-ball will be destroyed automatically
            rec[ 1 ].erase();               // after this remove old ball's html object
        }
    };


    /*
     * Remove all balls from the field and generates new next_balls
     */
    prototype.clear = function(){
        this.game.html.field_insert.empty();
        this.map = new Array( 9 );
        for( var i = 0; i < 9; i++ )
            this.map[ i ] = new Array( null, null, null, null, null, null, null, null, null );
        this.selected_ball = null;
        this.next_balls = this.gen_next_balls();
    };

    /*
     * Remove all "small balls":
     */
    prototype.remove_small_balls = function(){
        for( var i in this.next_balls )
            if( this.next_balls[ i ][ 1 ].obj )
                this.next_balls[ i ][ 1 ].erase();
    };

    /*
     * Add "small balls" to the field:
     */
    prototype.add_small_balls = function(){
        for( var i in this.next_balls ){
            var nx = this.next_balls[ i ][ 0 ][ 0 ];
            var ny = this.next_balls[ i ][ 0 ][ 1 ];
            this.next_balls[ i ][ 1 ].popup( nx, ny, "small" );
        }
    };

    prototype.find_path = function( f_x, f_y, to_x, to_y ) {
        var stack = Array( );           // stack for multiple purposes
        var dl = this.game.settings.field_border;

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
                if( ( x >= 0 + dl ) && ( y >= 0 + dl ) && ( x <= 8 - dl ) && ( y <= 8 - dl ) &&
                    ! this.map[ y ][ x ] && ! arr[ y ][ x ] )
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
        if( ! this.selected_ball )
            return false;

        var nx = this.selected_ball.x;
        var ny = this.selected_ball.y;
        path = this.find_path( nx, ny, to_x, to_y );

        if( path.length > 0 ){
            var old_ball = this.map[ ny ][ nx ];
            this.map[ ny ][ nx ] = null;

            // we must create new ball, because of two parallel animations:
            // hiding old ball & popupping new ball
            var new_ball = new Ball( this.game.html.field_insert, old_ball.num, this.game.settings.balls_type );

            this.map[ to_y ][ to_x ] = new_ball;

            old_ball.remove();
            this.selected_ball = null;

            var after_move = function( self ){
                // Moving sucessfull:
                callback( self );
            };

            new_ball.popup( to_x, to_y, "normal", after_move, this );

            return true;
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

            if( this.selected_ball ){

                if( this.selected_ball.x == nx &&
                    this.selected_ball.y == ny )
                    // don't do anything:
                    return;

                var x = this.selected_ball.x;
                var y = this.selected_ball.y;
                this.map[ y ][ x ].stop_jump();
            }
            this.selected_ball = { "x" : nx,
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
     * test_path( 0, 0, [ 1, 7, 5, 3 ] ) --> false
     * test_path( 1, 0, [ 1, 7, 5, 3 ] ) --> false
     * test_path( 1, 2, [ 1, 7, 5, 3 ] ) --> true
     * test_path( 2, 1, [ 1, 7, 5, 3 ] ) --> false
     * test_path( 2, 6, [ 1, 7, 5, 3 ] ) --> true
     * test_path( 7, 8, [ 1, 7, 5, 3 ] ) --> false
     *
     */
    prototype.test_path = function( nx, ny, ms, mark ){
        var x = nx;
        var y = ny;
        var dl = this.game.settings.field_border;
        var num = this.map[ y ][ x ].num;  // save color of ball (number)

        for( var i in ms )
        {
            if( x < 0 + dl || y < 0 + dl || x > 8 - dl || y > 8 - dl )
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
     * belong to current figure path ( box, rombs, etc. )
     */
    prototype.remove_path = function() {
        var f = this.figures[ this.game.settings.mode ];  // alias...

        for( var j = 0; j < this.map.length; j++ )
            for( var i = 0; i < this.map[ j ].length; i++ )
                if( this.map[ j ][ i ] )
                    for( var k in f )
                        if( this.test_path( i, j, f[ k ] ) )
                            this.test_path( i, j, f[ k ], true );  // mark balls for deletion

        function remove_group( nx, ny, self ) {
            var stack = Array( );   // stack for siblings
            var cnt = 0;            // count of removed balls
            var dl = self.game.settings.field_border;

            stack.push( [ nx, ny ] );
            while( stack.length )
            {
                var pos  = stack.splice( 0,1 )[ 0 ];         // take first element and remove them
                var ball = self.map[ pos[ 1 ] ][ pos[ 0 ] ];

                if( !ball )  // ball may be sheduled for deletion in stack more than one time
                    continue;

                ball.remove();                               // animate & destroy SVG
                self.map[ pos[ 1 ] ][ pos[ 0 ] ] = null;    // remove from map
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
                                var res = self.move_xy( pos[ 0 ], pos[ 1 ], mov );

                                if( res[ 0 ] >= 0 + dl && res[ 1 ] >= 0 + dl && res[ 0 ] <= 8 - dl && res[ 1 ] <= 8 - dl )  // test boundaries
                                {
                                    var tmp = self.map[ res[ 1 ] ][ res[ 0 ] ];
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

        var cnt_min = this.figures[ this.game.settings.mode ][ 0 ].length;

        return ( cnt - cnt_min + 1 ) * cnt;  // return scores for removed path
    };


    /*
     * count balls in each block and can del balls
     */
    prototype.test_block = function( nx, ny, del ) {
        var num = this.map[ ny ][ nx ].num;  // save color of ball (number)
        var stack = Array();                 // ball's siblings
        var cnt = 0;                         // count of balls in block
        var dl = this.game.settings.field_border;

        stack.push( [ nx, ny ] );
        this.map[ ny ][ nx ].marked = true;  // don't add this ball as sibling
        while( stack.length )
        {
            var pos = stack.splice( 0,1 )[ 0 ];  // take first element and remove them
            cnt++;                               // increase count of balls in group
            if( del )
            {
                this.map[ pos[ 1 ] ][ pos[ 0 ] ].remove();  // animate & destroy SVG
                this.map[ pos[ 1 ] ][ pos[ 0 ] ] = null;    // ... and remove from map
            }

            for( var dy = -1; dy <= 1; dy++ )
                for( var dx = -1; dx <= 1; dx++ )
                {
                    var x = pos[ 0 ] + dx;
                    var y = pos[ 1 ] + dy;
                    if( Math.abs( dx ) ^ Math.abs( dy )  &&    // logical XOR ( only one direction { up, down, left, right } is allowed )
                        x >= 0 + dl && x <= 8 - dl && y >= 0 + dl && y <= 8 - dl ) // boundary conditions
                    {
                        var tmp = this.map[ y ][ x ];
                        if( tmp && tmp.num == num && !tmp.marked )  // ... same color && not added early
                        {
                            tmp.marked = true;
                            stack.push( [ x, y ] );
                        }
                    }
                }
        }

        // after all remove all marks from balls
        for( var j = 0; j < this.map.length; j++ )
            for( var i = 0; i < this.map[ j ].length; i++ )
                if( this.map[ j ][ i ] )
                    this.map[ j ][ i ].marked = false;

        return cnt;
    };

    /*
     * same as remove_path, but group of balls will be
     * founded by another algorithm.
     */
    prototype.remove_block = function() {
        var cnt = 0;
        var cnt_min = this.game.settings.mode;  // minimal count of balls in block
        for( var j = 0; j < this.map.length; j++ )
            for( var i = 0; i < this.map[ j ].length; i++ )
                if( this.map[ j ][ i ] && ( this.test_block( i, j ) >= cnt_min ) )
                    cnt += this.test_block( i, j, true );

        return ( cnt - cnt_min + 1 ) * cnt;  // return scores for removed block
    };

    /*
     * this method combine abilities of remove_block / remove_path with
     * updating scores in GUI element.
     */
    prototype.remove_balls = function() {
        var score = 0;
        if( this.game.settings.mode > 4 )
            score += this.remove_block();
        else
            score += this.remove_path();

        this.game.info_bar.plus_score( score );

        return score;
    };

    prototype.balls_count = function() {
        var cnt = 0;
        for( var j = 0; j < this.map.length; j++ )
            for( var i = 0; i < this.map[ j ].length; i++ )
                if( this.map[ j ][ i ] )
                    cnt++;
        return cnt;
    }


    /*
     * Change balls type.
     */
    prototype.change_balls_type = function(){
        for( var i in this.map )
            for( var j in this.map[ i ] )
                if( this.map[ i ][ j ] )
                    this.map[ i ][ j ].change_type( this.game.settings.balls_type );

        for( var i in this.next_balls )
            if( this.next_balls[ i ][ 1 ].obj )
                this.next_balls[ i ][ 1 ].change_type( this.game.settings.balls_type );
    };


    /*
     * Update field size according to current game mode.
     */
    prototype.update_size = function(){
        var url;
        if( this.game.settings.mode <= 1 ){
            this.game.settings.field_size = 7;
            this.game.settings.field_border = 1;
            url = this.game.html.field_small_img;
        }else{
            this.game.settings.field_size = 9;
            this.game.settings.field_border = 0;
            url = this.game.html.field_img;
        }
        this.obj.css( "background-image", 'url(' + url + ')' );
    };


    prototype.handlers = function(){
        // Save link to "this" property:
        var self = this;

        // Configure click event handler:
        this.obj.mousedown(
            function( e ){
                // Get the padding of field html object:
                var px = self.obj.css( "padding-left" ).replace( "px", '' );
                var py = self.obj.css( "padding-top" ).replace( "px", '' );
                // X and Y coords of cursor about field object:
                var x = e.pageX - self.obj.offset().left - px;
                var y = e.pageY - self.obj.offset().top - py;

                // X and Y numbers of the cell which is under mouse cursor:
                var nx = Math.floor( x / ( self.game.html.cell_size ) );
                var ny = Math.floor( y / ( self.game.html.cell_size ) );
                var dl = self.game.settings.field_border;

                // Check the boundary conditions:
                if( ( x - ( self.game.settings.html ) * nx > self.game.settings.html && nx < 8 - dl ) ||
                    ( y - ( self.game.settings.html ) * ny > self.game.settings.html && ny < 8 - dl ) )
                    return false;

                self.select_ball( nx, ny );     // try to select ball on the map

                var callback = function( self ){
                    if( ! self.remove_balls() )   // user does not build new figure...
                        self.next_round();        // go to the next round

                    self.game.save_game();
                };

                if( self.move_ball( nx, ny, callback ) )  // try move selected ball to new position
                    self.game.game_started = true;
            }
        );
    };


    /*
     * Deselect active ball.
     */
    prototype.deselect_ball = function(){
        if( ! this.selected_ball )
            return;
        var x = this.selected_ball.x;
        var y = this.selected_ball.y;
        var ball = this.map[ y ][ x ];
        ball.stop_jump();
        this.selected_ball = null;
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




with(Ball = function( parent_obj, number, type ){

    // Saving the link to parent html object:
    this.parent = parent_obj;

    // Save the ball image number:
    this.num = number;

    // Save the ball type (matte or glossy):
    this.type = type;

}){


    prototype.change_type = function( new_type ){
        this.obj.removeClass( this.type );
        this.type = new_type;
        this.obj.addClass( this.type );
    };


    /*
     * Destroy internal html object.
     */
    prototype.erase = function(){
        if( this.obj ){
            this.obj.hide();
            this.obj.remove();  // remove html object
        }
    }

    /*
     * Popup ball with animation at position ( nx, ny )
     */
    prototype.popup = function( nx, ny, anim_type, callback, clbk_param ){
        // Define the css class:
        var css_class;
        switch( this.num ){
            case 1: css_class = 'red';    break;
            case 2: css_class = 'white';  break;
            case 3: css_class = 'yellow'; break;
            case 4: css_class = 'green';  break;
            case 5: css_class = 'cyan';   break;
            case 6: css_class = 'blue';   break;
            case 7: css_class = 'purple'; break;
        }
        this.obj = $( "<figure></figure>" ).addClass( css_class ).addClass( this.type );
        this.obj.css( "left", nx + "em" );
        this.obj.css( "top", ny + "em" );
        this.x = nx;
        this.y = ny;
        switch( anim_type ){
            case "small"      : this.obj.addClass( "popup_small" ); break; // Draw a small ball
            case "normal"     : this.obj.addClass( "popup" ); break;       // Draw a ball with normal size
            case "transition" : this.obj.addClass( "popup_from_small" ); break;  // Draw the "transition" growing animation
        }
        this.parent.append( this.obj );
        var self = this;
        var evts = [ "animationend", "webkitAnimationEnd", "oanimationend", "MSAnimationEnd" ];
        var listener = function( event ){
            self.obj.removeClass( "popup popup_small popup_from_small" );
            for( var i in evts )
                self.obj[ 0 ].removeEventListener( evts[ i ], listener, false );
            if( callback )
                callback( clbk_param );
        }
        if( callback || anim_type != "small" )
            for( var i in evts )
                this.obj[ 0 ].addEventListener( evts[ i ], listener, false );
    };


    /*
     * Remove ball with animation.
     * After animation html object will be destroyed.
     */
    prototype.remove = function(){
        this.obj.addClass( "remove" );
        var self = this;
        var listener = function( event ){
            self.erase();
        }
        var evts = [ "animationend", "webkitAnimationEnd", "oanimationend", "MSAnimationEnd" ];
        for( var i in evts )
            this.obj[ 0 ].addEventListener( evts[ i ], listener, false );
    };


    /*
     * Animate jumping :)
     */
    prototype.jump = function(){
        this.obj.addClass( "jumping" ).removeClass( "popup popup_small popup_from_small" );
    };


    /*
     * Stop jumping animation.
     */
    prototype.stop_jump = function(){
        this.obj.removeClass( "jumping" );
    };
}



/*
 * Class for storing data into html5 store (if available) or cookies (otherwise):
 */
with(Store=function(){

    this.html5 = this.check_html5_support();

}){
    prototype.check_html5_support = function(){
        try{
            return 'localStorage' in window && window[ 'localStorage' ] !== null;
        }catch( error ){
            return false;
        }
    };


    prototype.load = function( item ){
        if( this.html5 )
            return localStorage.getItem( item );
        else{
            var arr = document.cookie.split( ";" );
            for( var i = 0; i < arr.length; i++ ){
                var x = arr[ i ].substr( 0, arr[ i ].indexOf( "=" ) );
                var y = arr[ i ].substr( arr[ i ].indexOf( "=" ) + 1 );
                x = x.replace( /^\s+|\s+$/g, "" );
                if( x == item )
                    return unescape( y );
            }
        }
        return null;
    };


    prototype.save = function( item, value ){
        if( this.html5 )
            localStorage.setItem( item, value );
        else{
            var exdate = new Date;
            exdate.setDate( exdate.getDate() + 365 );  // Expire to 1 year
            document.cookie = item + "=" + escape( value ) + "; expires=" + exdate.toUTCString();
        }
    };


    prototype.delete = function( item ){
        if( this.html5 )
            localStorage.removeItem( item );
        else
            document.cookie = item + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    };
}


$( document ).ready(
    function(){
        /* Game initialization after the page loads: */
        // Set default game settings:
        /*
         * balls_type     : type of the game balls (one of the 'matte' and 'glossy')
         * show_next      : next balls showing enabled or not (boolean)
         * mode           : game mode (number from 0 to 8)
         * field_size     : game field size (in cells)
         * field_border   : the inner boundary of the field (in cells) - we can't put a ball on it
         */
        var settings =
            {
                 "balls_type" : "matte",
                       "lang" : "ru",
                  "show_next" : false,
                       "mode" : 3,
                 "field_size" : 9,
               "field_border" : 0
            };

        // html objects and their attributes:
        var html =
            {
                  "cell_size" : 50,  // the field's cell size (in px)
                   "info_bar" : $( "#balls-preview" ),
                      "score" : $( "#score" ),
                  "container" : $( "#container" ),
                 "field_page" : $( "#field" ),
               "field_insert" : $( "#field-insert" ),
                  "field_img" : "images/field.png",
            "field_small_img" : "images/field-small.png",
                "options_btn" : $( "#options" ),
               "options_page" : $( "#options-page" ),
                 "mode_radio" : $( 'input[name="mode"]' ),
                "row_num_sel" : $( 'select[name="line-num"]' ),
              "block_num_sel" : $( 'select[name="block-num"]' ),
             "balls_type_sel" : $( 'select[name="balls-skin"]' ),
              "show_next_btn" : $( '#next' ),
               "save_opt_btn" : $( '#ok' ),
             "cancel_opt_btn" : $( '#cancel' ),
                   "help_btn" : $( "#help" ),
                  "help_page" : $( "#help-page" ),
             "high_score_btn" : $( "#scores" ),
            "high_score_page" : $( "#scores-page" ),
               "scores_table" : $( "#scores-table" ),
               "new_game_btn" : $( "#restart" ),
                   "mode_btn" : $( "#mode" ),
                   "mode_num" : $( "#num-balls" )
            };

        var lines = new Lines_game( settings, html );
        lines.init();
    }
);
