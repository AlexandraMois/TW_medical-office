<?php
	session_start();

	function valideazaCNP($CNP) {
		$aEroriCNP = [];

	    if(!preg_match("/^[1-9][0-9]{12}$/", $_POST['CNP'])){
	    	$aEroriCNP[] = "CNP-ul trebuie sa fie format din 13 cifre";
	    }

	    $aCNP['cnp_primit'] = $_POST['CNP'];
		// prima cifra din cnp reprezinta sexul si nu poate fi decat 1,2,5,6 (pentru cetatenii romani) 
	    // 1, 2 pentru cei nascuti intre anii 1900 si 1999
	    // 5, 6 pentru cei nsacuti dupa anul 2000
		$aCNP['sex'] = $aCNP['cnp_primit']{0};        

		// cifrele 2 si 3 reprezinta anul nasterii
		$aCNP['an'] = $aCNP['cnp_primit']{1}.$aCNP['cnp_primit']{2};

		// cifrele 4 si 5 reprezinta luna (nu poate fi decat intre 1 si 12) 
		$aCNP['luna']    = $aCNP['cnp_primit']{3}.$aCNP['cnp_primit']{4};      

		// cifrele 6 si 7 reprezinta ziua (nu poate fi decat intre 1 si 31)
		$aCNP['zi']    = $aCNP['cnp_primit']{5}.$aCNP['cnp_primit']{6};                                 

		// cifrele 8 si 9 reprezinta codul judetului (nu poate fi decat intre 1 si 52)
		$aCNP['judet'] = $aCNP['cnp_primit']{7}.$aCNP['cnp_primit']{8};  

		// cifrele 10,11,12 reprezinta un nr. poate fi intre 001 si 999. 
	    // Numerele din acest interval se impart pe judete, 
	    // birourilor de evidenta a populatiei, astfel inct un anumit numar din acel 
	    // interval sa fie alocat unei singure persoane intr-o anumita zi.

	    // cifra 13 reprezinta cifra de control aflata in relatie cu 
	    // toate celelate 12 cifre ale CNP-ului.
	    // fiecare cifra din CNP este inmultita cu cifra de pe aceeasi pozitie 
	    // din numarul 279146358279; rezultatele sunt insumate, 
	    // iar rezultatul final este impartit cu rest la 11. Daca restul este 10, 
	    // atunci cifra de control este 1, altfel cifra de control este egala cu restul.
		$aCNP['suma_de_control'] = $aCNP['cnp_primit']{0} * 2 + $aCNP['cnp_primit']{1} * 7 + 
	        $aCNP['cnp_primit']{2} * 9 + $aCNP['cnp_primit']{3} * 1 + $aCNP['cnp_primit']{4} * 4 + 
	        $aCNP['cnp_primit']{5} * 6 + $aCNP['cnp_primit']{6} * 3 + $aCNP['cnp_primit']{7} * 5 + 
	        $aCNP['cnp_primit']{8} * 8 + $aCNP['cnp_primit']{9} * 2 + $aCNP['cnp_primit']{10} * 7 + 
	        $aCNP['cnp_primit']{11} * 9;

	    $aCNP['rest'] = fmod($aCNP['suma_de_control'], 11);

	    if($aCNP['sex'] != 1 && $aCNP['sex'] != 2 && $aCNP['sex'] != 5 && $aCNP['sex'] != 6) {
	    	$aEroriCNP[] = 'Prima cifra din CNP - eronata!';
	    }

	    if ($aCNP['luna'] > 12 || $aCNP['luna'] == 0 ) {
	    	$aEroriCNP[] = 'Luna este incorecta!';
	    }

	    if ($aCNP['zi'] > 31 || $aCNP['zi'] == 0) {
	    	$aEroriCNP[] = 'Ziua este incorecta!';
	    }

	    if (! checkdate($aCNP['luna'], $aCNP['zi'], $aCNP['an'])) {
	    	$aEroriCNP[] = 'Data de nastere specificata este incorecta!';
	    }

	    if ($aCNP['judet'] > 52 || $aCNP['judet'] == 0) {
	    	$aEroriCNP[] = 'Codul judetului este eronat!';
	    }

	    if (($aCNP['rest'] < 10 && $aCNP['rest'] != $aCNP['cnp_primit']{12})
	        || ($aCNP['rest'] >= 10 && $aCNP['cnp primit']{12} != 1)) {
	        $aEroriCNP[] = 'Cifra de control este gresita! (CNP-ul nu este valid)';
	    }

	    return $aEroriCNP;
	}

	$errorArray = [];
	$response = [];

	$error = false;


	$aEroriCNP = valideazaCNP($_POST['CNP']);

	if(empty($aEroriCNP)){
		$CNP = $_POST['CNP'];
	} else {
		$errorArray['CNP'] = $aEroriCNP;
		$error = true;
	}

	if(!empty($_POST['specializare'])){
		$id_specializare = $_POST['specializare'];
	} else {
		$errorArray['specializare'] = "Trebuie selectata specializarea";
		$error = true;
	}

	if(!empty($_POST['doctor'])){
		$id_doctor = $_POST['doctor'];
	} else {
		$errorArray['doctor'] = "Trebuie selectat doctorul";
		$error = true;
	}

	if(!empty($_POST['serviciu'])){
		$id_serviciu = $_POST['serviciu'];
	} else {
		$errorArray['serviciu'] = "Trebuie selectat serviciul";
		$error = true;
	}

	if(!empty($_POST['data'])){
		$data = date('Y-m-d', strtotime(str_replace('/', '-', $_POST['data'])));
	} else {
		$errorArray['data'] = "Trebuie selectata data";
		$error = true;
	}

	if(!empty($_POST['ora'])){
		$ora = $_POST['ora'];
	} else {
		$errorArray['ora'] = "Trebuie selectata ora";
		$error = true;
	}

	if(!empty($_POST['telefon']) && (!preg_match("/^[a-zA-Z ]*$/",$_POST['telefon']))){
		$telefon = $_POST['telefon'];
	} else {
		$errorArray['telefon'] = "Numarul de telefon nu este valid";
		$error = true;
	}

	if($error==true){
			$response['status'] = 'errors';
			$response['errors'] = $errorArray;
	}
	else{
		$conn = new mysqli('localhost', 'root', '', 'cabinet_medical');

		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		} 

		$sql = "INSERT INTO consultatii(id_pacient, CNP, telefon, id_serviciu, data, ora) VALUES('" . 
		$conn->real_escape_string($_SESSION['id_user']) . "','" . 
		$conn->real_escape_string($CNP) . "','" . 
		$conn->real_escape_string($telefon) . "','" .
		$conn->real_escape_string($id_serviciu) . "','" . 
		$conn->real_escape_string($data) . "','" . 
		 $conn->real_escape_string($ora) . "')";
			
		$result = $conn->query($sql);
		
		if($result > 0){
			$response['status'] = 'success';
			$response['id_comanda'] = $conn->insert_id;
		}
	}

if($response['status'] == 'success'){
	header('Location: index.php');
	die();
} else {
	header('Content-Type: application/json');
	echo json_encode($response);
}


?>