<?php

$servername = "localhost";      // hostname
$username = "prenotazionemessina";    // utente per la connessione
$password = "";  // password per l'autenticazione dell'utente
$database = "my_prenotazionemessina";   // database a cui ci dobbiamo collegare

$conn;
$conn = new mysqli($servername, $username, $password, $database ); //creazione oggetto $conn che ci permetterà di connetterci al db
if ($conn->connect_error) {  //controlliamo che la connesione non sia andata in errore altrimenti non andremo avanti con il codice (die function)
		die("Connessione al database fallita : " . $conn->connect_error);
}
