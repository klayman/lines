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

if( isset( $_POST[ "new_game" ] ) && isset( $_POST[ "game_hash" ] ) ){
    $hash_id = mysql_real_escape_string( $_POST[ "game_hash" ] );
    $time = microtime( true ) * 10000;
    // Reset game score:
    mysql_query( "UPDATE games
                     SET score = '0',
                         last_update = '" . $time . "'
                   WHERE hash_id = '" . $hash_id . "'" ) or die( "" );
    if( $_POST[ "game_hash" ] == "" || mysql_affected_rows() == 0 ){
        // Create new unique game hash id:
        $hash_id = md5( $_SERVER[ "REMOTE_ADDR" ] . time() . rand( 0, 10000 ) );
        mysql_query( "INSERT INTO games (hash_id, score, last_update)
                           VALUES ('" . $hash_id . "', '0', '" . $time . "')" ) or die( "" );
        // Delete old saved games:
        mysql_query( "DELETE FROM games
                            WHERE last_update < '" . ( $time - ( 7 * 24 * 60 * 60 * 10000 ) ) . "'" ) or die( "" );
        die( $hash_id );
    }
}


if( isset( $_POST[ "update_time" ] ) && isset( $_POST[ "game_hash" ] ) ){
    $hash_id = mysql_real_escape_string( $_POST[ "game_hash" ] );
    // Resume saved game - update "last_update" field:
    mysql_query( "UPDATE games
                     SET last_update = '" . ( microtime( true ) * 10000 ) . "'
                   WHERE hash_id = '" . $hash_id . "'" ) or die( "0" );
    if( mysql_affected_rows() == 0 )
        die( "0" );
}


if( isset( $_POST[ "score" ] ) && isset( $_POST[ "game_hash" ] ) ){
    $hash_id = mysql_real_escape_string( $_POST[ "game_hash" ] );
    $res = mysql_query( "SELECT score, last_update
                           FROM games
                          WHERE hash_id = '" . $hash_id . "'" ) or die( "" );
    $row = mysql_fetch_row( $res );
    $prev_score = $row[ 0 ];
    $prev_time = $row[ 1 ];
    $curt_score = ( int ) $_POST[ "score" ];
    $curt_time = microtime( true ) * 10000;
    if( $curt_time - $prev_time >= 200000 )
        die( "" );  // Time interval is about 10 seconds. Too late.
    $max_allowed_score = ( $curt_time - $prev_time ) * 8;  // Magic number - max allowed score for this time interval
    $user_score = $curt_score - $prev_score;
    if( $user_score >= $max_allowed_score )
        die( "" );  // Cool hacking attempt :)
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
            // New record!
            mysql_query( "INSERT INTO high_scores (mode, player, score, timestamp)
                               VALUES ('" . $mode . "', '" . $name . "', '" . $curt_score . "', '" . $curt_time . "')" );
        $curt_score = 0;  // Reset score - game is finished.
    }
    // Update game score:
    mysql_query( "UPDATE games
                     SET score = '" . $curt_score . "',
                         last_update = '" . $curt_time . "'
                   WHERE hash_id = '" . mysql_real_escape_string( $_POST[ "game_hash" ] ) . "'" ) or die( "" );
}


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
