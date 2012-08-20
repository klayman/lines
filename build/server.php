<?php
error_reporting( E_ERROR );

// MySQL settings:
$host = "localhost";
$user = "root";
$pass = "";
  $db = "lines";

// Connect to the database:
$link = mysql_connect( $host, $user, $pass )
    or die( "Unable to connect to database! " . mysql_error() );
// Select the database:
mysql_select_db( $db, $link )
    or die( "Unable to select db! " . mysql_error() );
// Set UTF-8 encoding as default:
mysql_query( "SET NAMES 'utf8'" );

/*session_start();
if( isset( $_POST[ "start_game" ] ) ){
    $_SESSION[ "timestamp" ] = time();
    $_SESSION[ "score" ] = 0;
}
if( isset( $_POST[ "score" ] ) ){
    if( ! isset( $_SESSION[ "score" ] ) ){
        session_destroy();
        die( "" );
    }
    $prev_score = $_SESSION[ "score" ];
    $curt_score = ( int ) $_POST[ "score" ];
    $prev_time = $_SESSION[ "timestamp" ];
    $curt_time = time();
    $max_allowed_score = ( $curt_time - $prev_time ) * 35;
    $user_score = $curt_score - $prev_score;
    if( $user_score >= $max_allowed_score ){
        session_destroy();
        die( "" );
    }
    if( isset( $_POST[ "result" ] ) && isset( $_POST[ "name" ] ) ){
        $mode = ( int ) $_POST[ "result" ];
        $res = mysql_query( "SELECT score
                               FROM high_scores
                              WHERE mode = '" . $mode . "'
                           ORDER BY score DESC, timestamp
                              LIMIT 0, 8" );
        $arr = Array();
        while( $row = mysql_fetch_array( $res ) ){
            $arr[] = $row[ "score" ];
        }
        $name = mysql_real_escape_string( $_POST[ "name" ] );
        if( $curt_score >= $arr[ 7 ] )
            mysql_query( "INSERT INTO high_scores (mode, player, score, timestamp)
                               VALUES ('" . $mode . "', '" . $name . "', '" . $curt_score . "', '" . time() . "')" );
        session_destroy();
        die( "" );
    }
    $_SESSION[ "score" ] = $curt_score;
    $_SESSION[ "timestamp" ] = time();
}*/
if( isset( $_POST[ "get_high_scores" ] ) ){
    // Get highscores by game mode:
    $mode = ( int ) $_POST[ "get_high_scores" ];
    $res = mysql_query( "SELECT *
                           FROM high_scores
                          WHERE mode = '" . $mode . "'
                       ORDER BY score DESC, timestamp
                          LIMIT 0, 8" );
    $arr = Array();
    while( $row = mysql_fetch_array( $res ) ){
        $arr[] = Array( htmlspecialchars( stripslashes( $row[ "player" ] ) ), $row[ "score" ], $row[ "timestamp" ] );
    }
    echo json_encode( $arr );
}
?>
