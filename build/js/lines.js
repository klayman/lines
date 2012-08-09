/* The game main class: */

with(Lines_game = function( settings, html ){

    // Save default settings of the game and html objects:
    this.settings = settings;
    this.html = html;

}){

    prototype.init = function(){
        // Load saved settings if possible:
        if( this.store.load( "settings" ) )
            this.settings = eval( "(" + this.store.load( "settings" ) + ")" );
        this.update_settings_controls();
        // Set active page as game field:
        this.active_page = this.html.field_page;
        // Set event handlers:
        this.handlers();
    };


    prototype.show_page = function( page ){
        if( this.active_page.attr( "id" ) == page.attr( "id" ) )
            return;
        this.active_page.hide()
        this.active_page = page;
        page.show();
    };


    // Update the game's mode icon on the appropriate button:
    prototype.update_mode_button = function(){
        var css_pos = "0 0";
        this.html.mode_num.text( "" );
        switch( this.settings.mode ){
            case 0: css_pos = "center -322px"; break;
            case 1: css_pos = "center -368px"; break;
            case 2: css_pos = "center -276px"; break;
            case 3: css_pos = "center -276px"; break;
            case 4: css_pos = "center -276px"; break;
            case 6: css_pos = "center -414px"; break;
            case 7: css_pos = "center -414px"; break;
            case 8: css_pos = "center -414px"; break;
        }
        this.html.mode_btn.css( "background-position", css_pos );
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

        if( this.new_settings.mode != this.settings.mode ){
            if( this.new_settings.mode <= 1 ){
                this.new_settings.field_size = 7;
                this.new_settings.field_border = 1;
            }else{
                this.new_settings.field_size = 9;
                this.new_settings.field_border = 0;
            }
            /*
             * TODO: make confirm of these changes if the game was started
             */
            this.settings.mode = this.new_settings.mode;
            this.update_mode_button();
        }

        // Define, whether is need to show next balls on the field:
        this.new_settings.show_next = ( this.html.show_next_btn.filter( ":checked" ).length > 0 ) ? true : false;

        var str = "{";
        for( var i in this.new_settings ){
            var val = this.new_settings[ i ];
            var str_val = ( typeof val == "string" ) ? '"' + val + '"' : val.toString();
            str += '"' + i + '":' + str_val + ',';
        }
        str = str.substr( 0, str.length - 1 ) + "}";
        this.store.save( "settings", str );
    };


    prototype.handlers = function(){
        var self = this;
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
            alert( item + "=" + escape( value ) + "; expires=" + exdate.toUTCString() );
        }
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
                   "info_bar" : $( "header" ),
                      "score" : $( "#score" ),
                  "container" : $( "#container" ),
                 "field_page" : $( "#field" ),
                  "field_img" : "field.png",
                "field_s_img" : "field-small.png",
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
               "new_game_btn" : $( "#restart" ),
                   "mode_btn" : $( "#mode" ),
                   "mode_num" : $( "#num-balls" )
            };

        var store = new Store;
        var lines = new Lines_game( settings, html );
        lines.store = store;
        lines.init();
    }
);
