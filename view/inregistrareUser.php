<?php
session_start();

const USER_TYPE_PACIENT = 1;

$id_user = 0;
$errorArray = [];
$response = [];

$error = false;

if(!empty($_POST['nume']) && (preg_match("/^[a-zA-Z ]*$/",$_POST['nume']))){
    $nume = $_POST['nume'];
} else {
    $errorArray['nume'] = "Numele nu este valid";
    $error = true;
}

if(!empty($_POST['prenume']) && (preg_match("/^[a-zA-Z ]*$/",$_POST['prenume']))){
    $prenume = $_POST['prenume'];
} else {
    $errorArray['prenume'] = "Prenumele nu este valid";
    $error = true;
}

if(!empty($_POST['username'])){
    $username =  $_POST['username'];
} else {
    $errorArray['username'] = "Trebuie introdus un username";
    $error = true;
}

if(!empty($_POST['password'])){
    $password =  $_POST['password'];
} else {
    $errorArray['password'] = "Trebuie introdus un username";
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

    $sql = "INSERT INTO users(nume, prenume, username, password, tip_user) VALUES('" . $conn->real_escape_string($nume) . "','" . $conn->real_escape_string($prenume) . "', '" . $conn->real_escape_string($username) ."', md5('" . $conn->real_escape_string($password) . "'), ". USER_TYPE_PACIENT .")";

    $result = $conn->query($sql);

    if($result > 0){
        $id_user = $conn->insert_id;
        $response['status'] = 'success';
    }
}

if($response['status'] == 'success'){
    $_SESSION['isLogedIn'] = true;
    $_SESSION['username'] = $username;
    $_SESSION['id_user'] = $id_user;
    $_SESSION['realname'] = $nume . " " . $prenume;
    $_SESSION['tip_user'] = USER_TYPE_PACIENT;
    header('Location: ../index.php');
    die();
} else {
    header('Content-Type: application/json');
    echo json_encode($response);
}


