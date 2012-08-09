/* The game main class: */

with(Lines_game = function( settings, html ){

    // Save default settings of the game and html objects:
    this.settings = settings;
    this.html = html;
    this.init();

}){

    prototype.init = function(){
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



var lines;
$( document ).ready(
    function(){
        /* Game initialization after the page loads: */
        // Set default game settings:
        /*
         * cell_size      : the field's cell size (in px)
         * balls_type     : type of the game balls (one of the 'matte' and 'glossy')
         * show_next      : next balls showing enabled or not (boolean)
         * mode           : game mode (number from 0 to 8)
         * field_size     : game field size (in cells)
         * field_b        : "border" on the field (in cells) - we can't put a ball on it
         */
        var settings =
            {
              "cell_size" : 50,
             "balls_type" : "matte",
                   "lang" : "ru",
              "show_next" : false,
                   "mode" : 3,
             "field_size" : 9,
                "field_b" : 0
            };

        // If there is a cookie "settings" - get game settings from it:
        /*
         * TODO: write loading/saving settings from/to cookies (on pure JavaScript) or from/to html5 store
         */

        // html objects and their attributes:
        var html =
            {
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
                   "mode_btn" : $( "#mode" )
            };

        lines = new Lines_game( settings, html );
    }
);
