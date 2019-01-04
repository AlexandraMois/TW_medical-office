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

	$sql1 = "SELECT specializari.id as id_specializare, specializari.nume_specializare, doctori.id as id_doctor, doctori.nume, doctori.prenume, program.luni, program.marti,program.miercuri, program.joi, program.vineri, servicii.id as id_serviciu, servicii.nume_serviciu, servicii.pret FROM specializari INNER JOIN doctori ON specializari.id = doctori.id_specializare INNER JOIN program ON program.id_doctor = doctori.id INNER JOIN servicii ON servicii.id_doctor = doctori.id";

	$result1 = $conn->query($sql1);

	if (!$result1) {
		die($conn->error);
	}

	$sql2 ="SELECT servicii.id_doctor, consultatii.data, consultatii.ora FROM servicii INNER JOIN consultatii ON servicii.id = consultatii.id_serviciu";

	$result2 = $conn->query($sql2);

	if (!$result2) {
		die($conn->error);
	}

	$dateOcupate = [];

	while ($row = $result2->fetch_assoc()) {
		$dateOcupate[$row['id_doctor']][$row['data']][] = $row['ora'];
	}

	$date = [];
		
	while ($row = $result1->fetch_assoc()) {
		$date[$row['nume_specializare']][$row['id_doctor']]['nume'] = $row['nume'];
		$date[$row['nume_specializare']][$row['id_doctor']]['prenume'] = $row['prenume'];
		$date[$row['nume_specializare']][$row['id_doctor']]['orar']['luni'] = $row['luni'];  
		$date[$row['nume_specializare']][$row['id_doctor']]['orar']['marti'] = $row['marti'];  
		$date[$row['nume_specializare']][$row['id_doctor']]['orar']['miercuri'] = $row['miercuri'];  
		$date[$row['nume_specializare']][$row['id_doctor']]['orar']['joi'] = $row['joi'];  
		$date[$row['nume_specializare']][$row['id_doctor']]['orar']['vineri'] = $row['vineri'];  
		$date[$row['nume_specializare']][$row['id_doctor']]['servicii'][$row['id_serviciu']][$row['nume_serviciu']] = $row['pret'];
		if(!empty($dateOcupate[$row['id_doctor']])) {
			$date[$row['nume_specializare']][$row['id_doctor']]['date_ocupate'] = $dateOcupate[$row['id_doctor']];
		}
	}

	header('Content-Type: application/json');

	print_r(json_encode($date));

