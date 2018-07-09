<?php
	require('main.php');

	// This file will return 0 on tweet upload and 1 on error
	$userid = $_GET['id'];
	$content = $_GET['content'];

	$content = mysqli_real_escape_string($cnx, $content);
	$query = <<<SQL
		INSERT INTO tweets 
		SET FKUSER_ID = '$userid',
		CONTENT = '$content';
SQL;

	$sql_data = mysqli_query($cnx, $query);

	if(!$sql_data) {
		echo "1";
	}
	else {
		echo "0";
	}

?>