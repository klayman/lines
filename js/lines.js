


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

with(Field = function( cell_size, border_size, html_id ){

    /* Constructor */

    // Saving the jQuery object of field:
    this.obj = $( "#" + html_id );
    // Save link to "this" property:
    var _this = this;
    $( "#" + html_id ).children().svg(
        {
            onLoad: function( svg ){
                // Saving SVG object of field:
                _this.svg_obj = svg;
            }
        }
    );
    // Default size of each cell (in px):
    this.square_size = cell_size;
    // Default size of cell border (in px):
    this.border_size = border_size;
    // The array of Ball class objects:
    this.objects_arr = [];
    // Set the event handlers:
    this.handlers();

}){
    /* Methods */

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
                var nx = Math.ceil( x / ( _this.square_size + _this.border_size ) );
                var ny = Math.ceil( y / ( _this.square_size + _this.border_size ) );

                // Check the boundary conditions:
                if( ( x - ( _this.square_size + _this.border_size ) * ( nx - 1 ) > _this.square_size &&
                      nx < 9 ) ||
                    ( y - ( _this.square_size + _this.border_size ) * ( ny - 1 ) > _this.square_size &&
                      ny < 9 ) )
                    return false;

                // Only demo of adding balls:
                var ball_obj = new Ball( _this.rand( 1, 7 ), _this.square_size + _this.border_size, nx, ny );
                ball_obj.draw( _this.svg_obj );
                _this.objects_arr.push( ball_obj );

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
                           { transform: "translate(" + ( ( this.x - 1 ) * this.size + this.size / 2 ) + ',' +
                                                       ( ( this.y - 1 ) * this.size + this.size / 2 ) + ")"
                           }
                      )
                   );
        // Animate object:
        this.obj.animate( { svgOpacity: "1.0" }, 500 );
    };
}



$( document ).ready(
    function(){
        /* Game initialization after the page loads: */
        var lines = new Lines_game();
        // Create field object:
        lines.create_field( 48, 2, "field" );
    }
);
