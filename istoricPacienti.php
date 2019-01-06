<?php
	session_start();

	$isLogedIn = isset($_SESSION['isLogedIn']) ? $_SESSION['isLogedIn'] : false;

	if (!$isLogedIn) {
		http_response_code(401);
		die("Unauthorized");
	}

	$conn = new mysqli('localhost', 'root', '', 'cabinet_medical');

	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	}

	$sql = "SELECT consultatii.CNP, users.nume, users.prenume, consultatii.telefon, consultatii.data, consultatii.ora,  servicii.nume_serviciu, servicii.pret FROM consultatii INNER JOIN users ON consultatii.id_pacient = users.id INNER JOIN servicii ON consultatii.id_serviciu = servicii.id";

	$result = $conn->query($sql);

	if (!$result) {
		die($conn->error);
	}

	$istoricPacienti = [];

	while ($row = $result->fetch_assoc()) {
		$istoricPacienti[$row['CNP']]['nume'] = $row['nume'] . " ". $row['prenume'];
		$istoricPacienti[$row['CNP']]['telefon'] = $row['telefon'];
		$istoricPacienti[$row['CNP']]['consultatii'][$row['data']][$row['ora']]['nume_serviciu'] = $row['nume_serviciu'];
		$istoricPacienti[$row['CNP']]['consultatii'][$row['data']][$row['ora']]['pret'] = $row['pret'];
	}

	header('Content-Type: application/json');

	print_r(json_encode($istoricPacienti));

