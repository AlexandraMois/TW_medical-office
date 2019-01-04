<?php
	session_start();

	$isLogedIn = isset($_SESSION['isLogedIn']) ? $_SESSION['isLogedIn'] : false;

	if ($isLogedIn) {
		header('Location: index.php');
		die();
	}

	include('view/login.html');
