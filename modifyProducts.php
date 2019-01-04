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
                $pretNou = $arrayValue['pret'];
                $sql = "update produse set pret =" . $pretNou . "where id=" . $conn->real_escape_string($idProdus);
                print_r($sql);
                $result = $conn->query($sql);

            }
        }
    }
