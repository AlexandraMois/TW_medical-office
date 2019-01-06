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

	$sql = "SELECT doctori.nume as nume_doctor, doctori.prenume as prenume_doctor, consultatii.data, consultatii.ora, users.nume as nume_pacient, users.prenume as prenume_pacient, servicii.nume_serviciu, servicii.pret FROM consultatii INNER JOIN servicii ON consultatii.id_serviciu = servicii.id INNER JOIN users ON consultatii.id_pacient = users.id INNER JOIN doctori ON servicii.id_doctor = doctori.id";

	$result = $conn->query($sql);

	if (!$result) {
		die($conn->error);
	}

	$istoricDoctori = [];

	while ($row = $result->fetch_assoc()) {
		$istoricDoctori[$row['nume_doctor'] . " " . $row['prenume_doctor']]
			['consultatii'][$row['data']][$row['ora']]['nume_serviciu'] = $row['nume_serviciu'];
		$istoricDoctori[$row['nume_doctor'] . " " . $row['prenume_doctor']]
			['consultatii'][$row['data']][$row['ora']]['pret'] = $row['pret'];
		$istoricDoctori[$row['nume_doctor'] . " " . $row['prenume_doctor']]
			['consultatii'][$row['data']][$row['ora']]['nume_pacient'] = $row['nume_pacient'] . " " . $row['prenume_pacient'];
	}

	header('Content-Type: application/json');

	print_r(json_encode($istoricDoctori));

