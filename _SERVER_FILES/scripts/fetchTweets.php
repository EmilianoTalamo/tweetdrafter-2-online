<?php
	require('main.php');

	$id = $_GET['id'];

	$query = <<<SQL
		SELECT
			ID, CONTENT 
		FROM 
			tweets
		WHERE FKUSER_ID = '$id';
SQL;

	$sql_data = mysqli_query($cnx, $query);
	$json = mysqli_fetch_all($sql_data, MYSQLI_ASSOC);

	if(sizeof($json) > 0) {
		echo json_encode($json);
	}
	else
	{
		echo "1";
	}

?>