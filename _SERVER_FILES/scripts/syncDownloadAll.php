<?php

	require('main.php');
	$params = json_decode(file_get_contents('php://input'),true);

	$id = $params['id'];

	$query = <<<SQL
		SELECT
			CONTENT 
		FROM
			tweets 
		WHERE
			FKUSER_ID = '$id';
SQL;

	$sql_data = mysqli_query($cnx, $query);
	$json = mysqli_fetch_all($sql_data, MYSQLI_NUM);

	// This will send an array of tweets, if any. Otherwise, it will send a 1
	if(sizeof($json) > 0) {
		echo json_encode($json);
	}
	else
	{
		echo "1";
	}
?>