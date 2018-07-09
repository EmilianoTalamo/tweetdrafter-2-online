<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Credentials: true");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

	// DATABASE CONECTION PARAMETERS
	define('SQL_SERVER', '127.0.0.1'); // Database Host
	define('SQL_USER', 'DBUSER'); // Database username
	define('SQL_PASS', 'DBPASS'); // Database password

	define('SQL_DB', 'tweetdrafter'); // Database name

	$cnx = mysqli_connect(SQL_SERVER, SQL_USER, SQL_PASS, SQL_DB);
	@mysqli_set_charset($cnx, 'utf8');
?>