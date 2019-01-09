<?php
	session_start();

	$isLogedIn = isset($_SESSION['isLogedIn']) ? $_SESSION['isLogedIn'] : false;

	if (!$isLogedIn) {
		header("Location: login.php");
		die();
	}

	$username = $_SESSION['username'];
	$realname = $_SESSION['realname'];


//	if($_SESSION['tip_user'] == 1){
//		include('web/index.html');
//	} else {
//		include('web/index.html');
//	}

    if($_SESSION['tip_user'] == 1){
        include('web/index.html');
    } else {
        include('web/admin.html');
    }

	
