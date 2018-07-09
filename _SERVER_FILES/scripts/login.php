<?php
	require('main.php');
	$params = json_decode(file_get_contents('php://input'),true);

	// This file returns numbers as status IDs 
	// 0 = everything is fine
	// 1 = wrong username/password
	// 2 = unknown error (errors that shouldn't happen)

	$username = trim( $params['username'] );
	$password = trim( $params['password'] );
	$username = strtolower($username);
	
	if($username == "" || $password == "") {
		$data = array('status' => "2");
		echo json_encode($data);
		die();
	}

	// Add username to DB
	$query = "SELECT * FROM users WHERE USERNAME = '$username'";
	$sql_data = mysqli_fetch_assoc(mysqli_query($cnx, $query));
	
	if($sql_data['PASSWORD'] == $password) {

		// Retrieve cloud tweets
		$query = <<<SQL
		SELECT
			CONTENT 
		FROM
			tweets 
		WHERE
			FKUSER_ID = '$sql_data[ID]';
SQL;

		$sql_data2 = mysqli_query($cnx, $query);
		$tweets = mysqli_fetch_all($sql_data2, MYSQLI_NUM);

		$data = array(
			'status' => "0",
			'username' => $sql_data['USERNAME'], 
			'id' => $sql_data['ID'],
			'tweets' => $tweets);
			echo json_encode($data);
	}
	else {
		$data = array('status' => "1");
		echo json_encode($data);
	}
?>