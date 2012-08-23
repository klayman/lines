<?php
    // Check for old Internet Explorer
    $match = preg_match( "/MSIE ([0-9].[0-9])/", $_SERVER[ "HTTP_USER_AGENT"], $res );
    if( $match && ( float ) $res[ 1 ] < 10 ){
        require( "ie.htm" );
        exit;
    }
    preg_match( '/ru/i', $_SERVER[ "HTTP_ACCEPT_LANGUAGE" ], $ru );
    if( ! count( $ru ) )
        require( "index_en.htm" );
    else
        require( "index_ru.htm" );
?>
