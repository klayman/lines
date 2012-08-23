<?php
    $browser = get_browser();
    if( $browser -> browser == 'MSIE' and $browser -> version < 9.0 ) {
        require( 'ie.php' );
        exit;
    }

    if( isset( $_COOKIE[ 'lang' ] ) ) {
        $lang = $_COOKIE[ 'lang' ];
    } else {
        $lang = ( stripos( $_SERVER[ 'HTTP_ACCEPT_LANGUAGE' ], 'ru' ) < stripos( $_SERVER[ 'HTTP_ACCEPT_LANGUAGE' ], 'en' ) )? 'ru' : 'en';
        setcookie( 'lang', $lang, time() + 60*60*24*365, '/' );
    }

    require( 'index-' . $lang . '.php' );
?>
