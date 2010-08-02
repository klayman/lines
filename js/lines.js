


/* The game main class: */

with(Lines_game = function(){

    /* Constructor */

    // The game field object:
    this.field = new Field();

}){
    /* Methods */

}



/* The game field class: */

with(Field = function(){

    /* Constructor */

    // After call .init() there will be jQuery object
    // of our field:
    this.obj = null;
    // After call .init() there will be SVG object of
    // our field:
    this.svg_obj = null;
    // Default size of each cell (in px):
    this.square_size = 50;
    // The array of Ball class objects:
    this.objects_arr = [];


}){
    /* Methods */

    prototype.init = function( html_id ){
        // Save link to "this" property:
        var _this = this;
        // Saving the jQuery object of field:
        this.obj = $( "#" + html_id );
        // Saving SVG object of field:
        $( "#" + html_id ).svg(
            {
                onLoad: function( svg ){
                    _this.svg_obj = svg;
                }
            }
        );
        // Set the event handlers:
        this.handlers();
    };


    prototype.handlers = function(){
        // Save link to "this" property:
        var _this = this;
        // Configure click event handler:
        this.obj.click(
            function( e ){
                // X and Y numbers of the cell which is under mouse cursor:
                var nx = Math.ceil( ( e.pageX - $( this ).offset().left ) / _this.square_size  );
                var ny = Math.ceil( ( e.pageY - $( this ).offset().top ) / _this.square_size  );

                // Only demo of adding balls:
                var ball_obj = new Ball( _this.rand( 1, 7 ), _this.square_size, nx, ny );
                ball_obj.draw( _this.svg_obj );
                _this.objects_arr.push( ball_obj );

            }
        );
    };


    // Auxiliary method for generating random numbers
    // in a certain range:
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
        // Define the ball image (and field cell) size:
        lines.field.square_size = 50;
        // Connects an object field to html element:
        lines.field.init( "balls" );
    }
);
