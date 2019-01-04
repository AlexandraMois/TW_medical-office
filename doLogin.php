<?php
	session_start();

	$isLogedIn = isset($_SESSION['isLogedIn']) ? $_SESSION['isLogedIn'] : false;
	
	if ($isLogedIn) {
		header('Location: index.php');
		die();
	}

	$username = isset($_POST['username']) ? $_POST['username'] : '';
	$password = $_POST['password'] ?? '';

	$conn = new mysqli('localhost', 'root', '', 'cabinet_medical');

	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	$sql = "SELECT * FROM users WHERE username = '" . $conn->real_escape_string($username) . "' AND password = md5('" . $conn->real_escape_string($password) . "')";

	$result = $conn->query($sql);

	if (!$result) {
		die($conn->error);
	}

	if ($result->num_rows > 0) {
		$_SESSION['isLogedIn'] = true;
		$_SESSION['username'] = $username;
		$row = $result->fetch_assoc();
		$_SESSION['id_user'] = $row['id'];
		$_SESSION['realname'] = $row['nume'] . " " . $row['prenume'];
		$_SESSION['tip_user'] = $row['tip_user'];
		header('Location: index.php');
		die();
	} 
	
	echo 'Incorrect username and password';
	