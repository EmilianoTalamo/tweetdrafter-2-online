<?php
	require('main.php');
	$params = json_decode(file_get_contents('php://input'),true);

	// This file returns numbers as status IDs 
	// 0 = everything is fine
	// 1 = user already exists
	// 2 = unknown error (errors that shouldn't happen)

	$username = trim( $params['username'] );
	$password = trim( $params['password'] );
	$username = strtolower($username);
	
	if(
		$username == "" || 
		$password == "" || 
		strlen($username) < 4 ||
		strlen($password) < 4 ||
		strlen($username) > 15 ||
		strlen($password) > 15 ) {
		$data = array('status' => "2");
		echo json_encode($data);
		die();
	}

	// Add username to DB
	$query = <<<SQL
		INSERT INTO users
		SET
			USERNAME = '$username',
			PASSWORD = '$password';
SQL;
	$sql_data = mysqli_query($cnx, $query);

	// Get first word of sql error, if any
	$sql_error = explode(' ',trim(mysqli_error($cnx)))[0];

	// User duplicated
	if($sql_error == "Duplicate")
	{
		$data = array('status' => "1");
		echo json_encode($data);
	}
	// Unknown error
	else if(!$sql_data) {
		$data = array('status' => "2");
		echo json_encode($data);
	}
	// Success
	else if(mysqli_error($cnx) == "") {
		$query = <<<SQL
		SELECT
			ID 
		FROM
			users 
		WHERE
			USERNAME = '$username';
SQL;
		$sql_data2 = mysqli_query($cnx, $query);
		$id = mysqli_fetch_all($sql_data2, MYSQLI_ASSOC);
		$id = $id[0]['ID'];
		$data = array(
			'status' => "0",
			'username' => $username, 
			'id' => $id);
			echo json_encode($data);
	}
	// Other unknown error
	else {
		$data = array('status' => "2");
		echo json_encode($data);
		die();
	}
?>