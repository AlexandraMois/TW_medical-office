<?php
session_start();

$conn = new mysqli('localhost', 'root', '', 'proiect1');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

while( list( $field, $value ) = each( $_POST )) {
    if( is_array( $value )) {
        while( list( $arrayField, $arrayValue ) = each( $value )) {
            $idProdus = $arrayValue['id'];
            $stocNou = $arrayValue['stoc'];
            $sql = "update produse set stoc =" . $stocNou . " where id=" . $conn->real_escape_string($idProdus);
            $result = $conn->query($sql);
        }
    }
}
$sql = "SELECT * FROM produse";

$result = $conn->query($sql);

if (!$result) {
    die($conn->error);
}

$products = [];


while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

header('Content-Type: application/json');
//header('Content-Type: text/plain');
//print_r(json_encode("view/gel_de_dus.jpg"));

print_r(json_encode($products));