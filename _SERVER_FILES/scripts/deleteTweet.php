<?php
	require('main.php');

	// This file will return 0 on tweet deletion and 1 on error

	$userid = $_GET['userid'];
	$tweetid = $_GET['tweetid'];

	$query = <<<SQL
		DELETE 
		FROM
			tweets 
		WHERE
			ID = '$tweetid' 
			AND FKUSER_ID = '$userid' 
			LIMIT 1;
SQL;

	$sql_data = mysqli_query($cnx, $query);

	if(!$sql_data) {
		echo "1";
	}
	else {
		echo "0";
	}

?>