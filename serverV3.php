<?php

	include 'db.php';  //includiamo nel codice la connessione al db

    function login($data,$conn){  //funzione che ci permette di effetuare il login classico al sito
    	$salt = "progetto";      //stringa che aggiungiamo alla password cosi da fortificare la cifratura
    	$password_encrypted = sha1($data['password'].$salt); //cifro la password con l'algoritmo sha1
    	//echo var_dump($data["email"]);

		//query per vedere se l'utente è registrato al sito ed ha l'account verificato e il tipo di accesso è tramite email e password
        $sql="SELECT * FROM login WHERE Email = '".$data['email']."' and Password = '".$password_encrypted."' and EmailConfermata = 1  and tipoA='N' ";
        //echo $sql;
        $risultato= $conn->query($sql);
        //echo $risultato;
        if(mysqli_num_rows($risultato)==1){  //se l'utente risulta registrato
            while($row = $risultato->fetch_assoc() ){  //andiamo a vedere di che tipologia di utente si tratta
                $tipo=$row['tipo'];
            }
			session_start();                        //apriamo la sessione
            $_SESSION['email']=$data['email'];      //inseriamo l'email all'interno della sessione
            switch ($tipo) {                        //in base al tipo di utente che effettua il login andiamo a indirizzarlo nella dashboard corretta
                case "PA":                          //case 'PA' ovvero paziente
                    echo "dashboard_profilo.html";  //risposta http
                    break;                          //usciamo dal case 'PA'
                case "PE":                            //case 'PE' ovvero personale
                    echo "dashboard_personale.html";  //risposta http
                    break;                            //usciamo dal case 'PE'
                case "AM":                                  //case 'AM' ovvero amministratore
                    echo "dashboard_amministratore.html";   //risposta http
                    break;                                  //usciamo dal case 'AM'
            }
        }
        else{                    //se l'utente non risulta registrato daremo errore
            echo "login error";  //risposta http
        }
    }


	function googleLogin($data, $conn){   //funzione che ci permette di effetuare il login google al sito
	  $nome = $data["nome"];
	  $cognome = $data["cognome"];
	  $email = $data["email"];

	  //query per vedere se l'utente è registrato al sito ed ha l'account verificato e il tipo di accesso è tramite google
	  $risultato = $conn->query("SELECT * from login WHERE Email = '".$data['email']."' and EmailConfermata = 1 and tipoA='G' ");
	  if(mysqli_num_rows($risultato)==1){  //se l'utente risulta registrato
		session_start();             //apriamo la sessione
		$_SESSION['email'] = $email;  //inseriamo l'email all'interno della sessione
		echo "dashboard_profilo.html";  //risposta http
	  }
	  else{
		  //query per vedere se l'email è già registrata in maniera classica
		  $risultato = $conn->query("SELECT * from login WHERE Email = '".$data['email']."' and tipoA='N' ");
		  if (mysqli_num_rows($risultato)==0){
			  //query per vedere se l'utente è gia registrato con google ma non ha verificato l'account
			  $risultato = $conn->query("SELECT * from login WHERE Email = '".$data['email']."' and EmailConfermata = 0 and tipoA='G' ");
			  if (mysqli_num_rows($risultato)==0){ //se non è registrato lo registro
				  $password_encrypted = sha1(str_shuffle('qwertzuiopasdfghjklyxcvbnmQWERTZUIOPASDFGHJKLYXCVBNM0123456789').$salt);
				  //query di insimento dell'utente nella tabella login
				  $query="INSERT INTO login (Email,Password,tipo,EmailConfermata,token,tipoA) VALUES ('".$data['email']."','".$password_encrypted."','PA','0', '','G')";
				  $conn->query($query);
				  echo "signup successful";  //risposta http
			  }
			  else{  //se è gia registrato con google ma non ha verificato l'account
				  echo "account to verify";  //risposta http
			  }
		  }
		  else{  //se l'email è già registrata in maniera classica
			  echo "email already exists";  //risposta http
		  }
	  }
	}


	function completeGoogle($data, $conn){   //funzione che ci permette di completare la registrazione con google
		$cf = strtoupper($data['cf']);    //mettiamo in maiuscolo il cf
		//query di insimento dell'utente nella tabella paziente
		$sql="INSERT INTO paziente (CF,Cognome,Nome,Indirizzo,DataNascita,LuogoNascita,Email) VALUES ('".$cf."','".$data['cognome']."','".$data['nome']."','".$data['indirizzo']."','".$data['data_nascita']."','".$data['luogo_nascita']."','".$data['email']."') ";
		$risultato= $conn->query($sql);
		//query per la modifica della validazione
		$sql="UPDATE login SET EmailConfermata=1 WHERE Email='".$data['email']."' ";
		$risultato= $conn->query($sql);
		//dopo la validazione dell'account entriamo direttamnete nella dashboard_profilo
		session_start();   //apriamo la sessione
		$_SESSION['email'] = $data['email'];   //inseriamo l'email all'interno della sessione
		echo "dashboard_profilo.html";    //risposta http
	}


    function signup($data,$conn){       //funzione che ci permette di registrare un paziente al sito
        $tipo = "PA";                   //la tipologia di utente che andremo a registrare
        $salt = "progetto";             //stringa che aggiungiamo alla password cosi da fortificare la cifratura
        $cf = strtoupper($data['cf']);  //mettiamo in maiuscolo il cf

        if(strcmp($data['passwordReg'],$data['checkPassword'])==0){   //se le password coincidono andiamo davanti
			//query per vedere se l'utente non è già registrato nel sito
            $sql="SELECT * FROM paziente WHERE Email = '".$data['emailReg']."' or CF = '".$cf."'  ";
            $risultato= $conn->query($sql);
            if(mysqli_num_rows($risultato)==0){   //se non risulta nessun utente andiamo a registrare l'utente
                $token = 'qwertzuiopasdfghjklyxcvbnmQWERTZUIOPASDFGHJKLYXCVBNM0123456789';    //stringa che ci permette di validare l'account
                $token = str_shuffle($token);          //mescola casualmente la stringa token
                $token = substr($token, 0, 10);        //prendo solo i primi 10 caratteri della stringa mescolata

                $password_encrypted = sha1($data['passwordReg'].$salt); //cifro la password con l'algoritmo sha1

				//query di insimento dell'utente nella tabella login e nella tabella paziente
                $sql2="INSERT INTO login (Email,Password,tipo,emailConfermata,token,tipoA) VALUES ('".$data['emailReg']."','$password_encrypted','$tipo','0','$token','N') ";
                $sql3="INSERT INTO paziente (CF,Cognome,Nome,Indirizzo,DataNascita,LuogoNascita,Email) VALUES ('".$cf."','".$data['cognome']."','".$data['nome']."','".$data['indirizzo']."','".$data['data_nascita']."','".$data['luogo_nascita']."','".$data['emailReg']."') ";
                $conn->query($sql2);
                $conn->query($sql3);

                // definisco mittente e destinatario della mail
                $nome_mittente = "Prenotazione Messina";
                $mail_mittente = "Prenotazione_Messina@noreply.com";
                $mail_destinatario = $data['emailReg'];

                // definisco il subject ed il body della mail
                $mail_oggetto = "Codice OTP!";
                $mail_corpo =
                            '<html>
                                <head></head>
                                <body>
                                    <h1>Codice OTP per verificare email</h1>
                                    <p>Ecco il codice per verificare la tua email:<br><br>
                                        '.$token.' <br><br>
                                        <a href="http://prenotazionemessina.altervista.org/verifica.html">Clicca qua per inserire il codice</a>
                                    </p>
                                </body>
                            </html>';

                $headers[] = 'MIME-Version: 1.0';
                $headers[] = 'Content-type: text/html; charset=iso-8859-1';
                if (mail($mail_destinatario, $mail_oggetto, $mail_corpo, implode("\r\n", $headers)))
                    echo "signup successful";  //se tutto è andato a buon fine questa sarà la risposta http
            }else{           //se l'utente è gia registrato
                echo "email or cf error";   //risposta http
            }
		}else {                                 //se le password non combaciano
            echo "password error";              //risposta http
        }
    }

	function validation($data,$conn){       //funzione che ci permette di validare un account
		//query per vedere se l'utente non ha già verificato l'account
        $sql="SELECT * FROM login WHERE Email = '".$data['email']."' and token = '".$data['token']."' and EmailConfermata = 0 ";
        $risultato= $conn->query($sql);
        if(mysqli_num_rows($risultato)==1){   //se non ha verificato l'account e il token è giusto andiamo a verificarlo
			//query per la validazione dell'account
            $sql2="UPDATE login SET emailConfermata=1, token='' WHERE Email='".$data['email']."' ";
            $conn->query($sql2);
            echo "validation successful";  //risposta http se la validazione va a buon fine
        }
        else{     //se l'utente è già registrato o ha sbagliato token
            echo "email or token error";   //risposta http
        }
    }

	function logout(){      //funzione che ci permette di effettuare il logout dal sito
        session_start();    //apriamo la sessione
        $_SESSION = array();  // elimina le variabili di sessione impostate
        session_destroy();    // elimina la sessione
        echo "index.html";    //risposta http per farci reindirizzare all'index.html
    }

	function profilo($conn){   //funzione che restituisce come risposta http le informazioni del singolo paziente
		session_start();       //apriamo la sessione
		$email=$_SESSION['email'];   //prendiamo l'email dalla sessione
		//query per prendere le informazioni del profilo del paziente
		$sql="SELECT * FROM paziente WHERE Email = '".$email."' ";
		$risultato= $conn->query($sql);
        $json;  //variabile che useremo come json e che invieremo come risposta
		while($row = $risultato->fetch_assoc() ){   //ogni valore che otteniamo dalla query lo andiamo a inserire nel json con chiave : valore
        	$json->nome=$row['Nome'];
			$json->cognome=$row['Cognome'];
			$json->cf=$row['CF'];
            $_SESSION['CF']=$row['CF'];     //ci mettiamo il cf nella sessione perchè servirà in altre funzioni
			$json->indirizzo=$row['Indirizzo'];
			$json->dataNascita=$row['DataNascita'];
			$json->luogoNascita=$row['LuogoNascita'];
			$json->email=$row['Email'];
		}
        echo json_encode($json);    //risposta http (json object)
	}

	function showPrenotazione($conn){  //funzione che restituisce come risposta http le prenotazioni dei vaccini del paziente
		session_start();               //apriamo la sessione
		//$email=$_SESSION['email'];
		$cf=$_SESSION['CF'];           //prendiamo il cf dalla sessione
		$json;                         //variabile che useremo come json e che invieremo come risposta
		$array=array();                //array che ci conterrà i due json delle prenotazioni
		//query per prendere le prenotazioni del vaccino del singolo utente
		$sql="SELECT p.CF, p.DataP,p.ora,p.minuti,p.dose, o.Nome as NomeO,v.descrizione as NomeV FROM prenotazione AS p, ospedale AS o, vaccino AS v, laboratorio as l WHERE p.CF = '".$cf."' and p.CodVaccino=v.CodVaccino and p.CodLab=l.CodLab and l.CodO=o.CodO";
		$risultato= $conn->query($sql);
        //echo var_dump($sql);
		if(mysqli_num_rows($risultato)==0){   //se non ci sono prenotazioni
			echo "nessuna prenotazione";      //risposta http
		}else{                                          //se ci sono prenotazioni
			while($row = $risultato->fetch_assoc() ){   //per ogni valore che otteniamo dalla query lo andiamo a inserire nel json con chiave : valore  (una riga è un json)
				$json->cf=$row['CF'];
				$json->dataP=$row['DataP'];
				//$json->ora=$row['ora'];
				//$json->minuti=$row['minuti'];
                $orario=$row['ora']." : ".$row['minuti'];  //inseriamo ora e minuti come unico valore
                $json->orario=$orario;
				$json->nomeO=$row['NomeO'];
				$json->nomeV=$row['NomeV'];
				$json->dose=$row['dose'];
				array_push($array,json_encode($json)); //inseriamo uno dei json all'interno dell'array
			}
			echo json_encode($array); //risposta http (json object)
		}
	}


	function infoVaccino($conn){   //funzione che restituisce come risposta http le informazioni dei vaccini e degli ospedali che poi inseriremo nelle select tramite js
		$jsonVac;  //json dei vaccini
        $jsonOsp;  //json degli ospedali
		$array=array();  //array che ci conterrà l'array dei vaccini e l'array degli ospedali
		$arrayVac=array();   //array che ci conterrà i json dei vaccini
		$arrayOsp=array();   //array che ci conterrà i json degli ospedali

		//query per prendere codice e descrizione del vaccino
		$sql="select CodVaccino,Descrizione from vaccino";
		$risultato= $conn->query($sql);
		while($row = $risultato->fetch_assoc() ){        //per ogni valore che otteniamo dalla query lo andiamo a inserire nel json con chiave : valore  (una riga è un json)
			$jsonVac->CodVaccino=$row['CodVaccino'];
			$jsonVac->DescVaccino=$row['Descrizione'];
			array_push($arrayVac,json_encode($jsonVac));  //inseriamo uno dei json all'interno dell'array
		}
		//query per prendere codice e nome dell'ospedale
		$sql="select CodO,Nome from ospedale";
		$risultato= $conn->query($sql);
		while($row = $risultato->fetch_assoc() ){     //per ogni valore che otteniamo dalla query lo andiamo a inserire nel json con chiave : valore  (una riga è un json)
			$jsonOsp->CodOspedale=$row['CodO'];
			$jsonOsp->NomeOspedale=$row['Nome'];
			array_push($arrayOsp,json_encode($jsonOsp));  //inseriamo uno dei json all'interno dell'array
		}
		array_push($array,$arrayVac,$arrayOsp);  //inseriamo gli array di json all'interno di $array
		echo json_encode($array);  //risposta http (json object)
	}




	function prenotazioneVaccino($data,$conn){  //funzione che ci permette di effettuare la prenotazione delle due vaccinazioni
    	session_start();   //apriamo la sessione
		//$email=$_SESSION['email'];
		$cf=$_SESSION['CF'];   //prendiamo il cf dalla sessione
		$idOsp=$data['ospedale'];
		$idVac=$data['vaccino'];
		$dataP=$data['dataPre'];
		$ora=$data['ora'];
		$minuti=$data['minuti'];
		$dataP2 = strtotime ( '+3 week' , strtotime ( $dataP ) ) ; // aggiungiamo 3 settimane alla data di prenotazione cosi creiamo anche la dat della prenotazione per la seconda dose
		$dataP2 = date ( 'Y-m-d' , $dataP2 ); //trasformiamo la data nel formato accettato dal db YYYY-MM-DD
		$dose1="prima";
		$dose2="seconda";

		//query per prendere id del laboratorio dove verrà effettuato il vaccino
		$sql="SELECT CodLab FROM laboratorio WHERE CodO = '".$idOsp."' ";
		$risultato= $conn->query($sql);
		while($row = $risultato->fetch_assoc() ){
			$codLab=$row['CodLab'];
		}

		//query per vedere se l'utente ha gia prenotato la vaccinazione
		$sql="SELECT * FROM prenotazione WHERE CF = '".$cf."' ";
		$risultato= $conn->query($sql);
		if(mysqli_num_rows($risultato)==0){   //se non ha prenotato la vaccinazione
			//query per vedere se in quel preciso orario non ci sono più di 10 prenotazioni, se già ci sono 10 prenotazioni l'utente non si potrà prenotare in quel orario
			$sql="SELECT * FROM prenotazione WHERE DataP = '".$dataP."' and ora = '".$ora."' and minuti = '".$minuti."' and CodLab = '".$codLab."' ";
			$risultato= $conn->query($sql);
			if(mysqli_num_rows($risultato)<10){  //se ci sono meno di 10 prenotazioni
				//query per la creazione delle due prenotazioni
				$sql="INSERT INTO prenotazione (CF,CodVaccino,DataP,ora,CodLab,minuti,dose) VALUES ('$cf','$idVac','$dataP','$ora','$codLab','$minuti','$dose1') ";
				$conn->query($sql);
				$sql="INSERT INTO prenotazione (CF,CodVaccino,DataP,ora,CodLab,minuti,dose) VALUES ('$cf','$idVac','$dataP2','$ora','$codLab','$minuti','$dose2') ";
				$conn->query($sql);

				echo "prenotazione successful";   //risposta http
			}else{
				echo "prenotazione not successful";  //risposta http (nel caso le prneotazioni siano gia 10)
			}
		}else{
			echo "prenotazione già effettuata"; //risposta http (nel caso in cui la prenotazione è gia stata effettuata)
		}
	}


	function changePassword($data,$conn){   //funzione che ci permette di cambiare password ad un utente
		session_start();    //apriamo la sessione
		$email=$_SESSION['email'];   //prendiamo l'email
		$salt = "progetto";   //stringa che aggiungiamo alla password cosi da fortificare la cifratura

		//cifriamo le password con l'algoritmo sha1
		$password = $data['password'];
		$password_encrypted = sha1($password.$salt);

		$Npassword = $data['Npassword'];
		$Npassword_encrypted = sha1($Npassword.$salt);

		$Cpassword = $data['Cpassword'];
		$Cpassword_encrypted = sha1($Cpassword.$salt);

		//query per contrallare che la password attuale sia corretta
		$sql="SELECT * FROM login WHERE Email = '".$email."' and Password = '".$password_encrypted."' ";
		$risultato= $conn->query($sql);
		if(mysqli_num_rows($risultato)==1){  //se è corretta andiamo avanti
			if ($Npassword_encrypted==$Cpassword_encrypted){  //andiamo avanti se la password nuova è uguale a quella di conferma
            	if($password_encrypted==$Npassword_encrypted){  //se la password attuale è uguale a quella nuova diamo errore
                	echo "password vecchia uguale a nuova";  //risposta http
                }else{
					//query per la modifica della password
                	$sql="UPDATE login SET Password = '".$Npassword_encrypted."' WHERE Email = '".$email."' ";
					$conn->query($sql);

					echo "change password successful"; //risposta http
				}
			}else{
				echo "password non uguale"; //risposta http  (nel caso la password nuova è diversa da quella di conferma)
			}
		}else{
			echo "password vecchia diversa"; //risposta http (nel caso la password attuale sia diversa)
		}
	}

	function deletePrenotazione($conn){   //funzione che ci permette ci cancellare le prenotazioni dei vaccini del singolo utente
		session_start();    // apriamo la sessione
		$cf=$_SESSION['CF'];   // prendiamo il cf dell'utente
		//query per la cancellazione delle prenotazioni
		$sql="DELETE FROM prenotazione WHERE CF='$cf' ";
		$risultato= $conn->query($sql);
		if($risultato==true){
			echo "delete successful";   //risposta http (se la query va a buon fine)
		}else{
			echo "delete error";     //risposta http (se la query non va a buon fine)
		}
	}

	function utenti($conn){   //funzione che restituisce come risposta http le informazioni di tutti gli utenti registrati nel sito
		$json; //variabile che useremo come json e che invieremo come risposta
		$array = array();  //array che ci conterrà tutti i json degli utenti
		//query per vedere le informazioni degli utenti
		$sql="SELECT * FROM login";
		$risultato= $conn->query($sql);
		if(mysqli_num_rows($risultato)==0){ //se non da risultato mandiamo un errore
			echo "errore";               //risposta http
		}else{     //se abbiamo un risultato
			while($row = $risultato->fetch_assoc() ){  //per ogni valore che otteniamo dalla query lo andiamo a inserire nel json con chiave : valore  (una riga è un json)
				$json->email=$row['Email'];
				$json->password=$row['Password'];
				$json->tipo=$row['tipo'];
				$json->emailConfermata=$row['EmailConfermata'];
				$json->token=$row['token'];
				array_push($array,json_encode($json)); //inseriamo uno dei json all'interno dell'array
			}
			echo json_encode($array);  //risposta http (json object)
		}
	}



	function infoPe($conn){   //funzione che restituisce come risposta http le informazioni dei reperti e degli ospedali che poi inseriremo nelle select tramite js
		$jsonRep;   //json dei reparti
        $jsonOsp;   //json degli ospedali
		$array=array();  //array che ci conterrà l'array dei reparti e l'array degli ospedali
		$arrayRep=array();  //array che ci conterrà i json dei reparti
		$arrayOsp=array();  //array che ci conterrà i json degli ospedali

		//query per prendere il codice e il nome del reparto e in quale ospedale è
		$sql= "select r.CodR,r.Nome,o.Nome as nomeOspedale from reparto as r,ospedale AS o where r.CodO=o.CodO";
		$risultato= $conn->query($sql);
		while($row = $risultato->fetch_assoc() ){   //per ogni valore che otteniamo dalla query lo andiamo a inserire nel json con chiave : valore  (una riga è un json)
			$jsonRep->CodReparto=$row['CodR'];
			$jsonRep->NomeReparto=$row['Nome'];
            $jsonRep->NomeOspedale=$row['nomeOspedale'];
			array_push($arrayRep,json_encode($jsonRep));  //inseriamo uno dei json all'interno dell'array
		}

		//query per prendere il codice e il nome dell'ospedale
		$sql= "select CodO,Nome from ospedale";
		$risultato= $conn->query($sql);
		while($row = $risultato->fetch_assoc() ){  //per ogni valore che otteniamo dalla query lo andiamo a inserire nel json con chiave : valore  (una riga è un json)
			$jsonOsp->CodOspedale=$row['CodO'];
			$jsonOsp->NomeOspedale=$row['Nome'];
			array_push($arrayOsp,json_encode($jsonOsp));  //inseriamo uno dei json all'interno dell'array
		}
		array_push($array,$arrayRep,$arrayOsp); //inseriamo gli array di json all'interno di $array
		echo json_encode($array); //risposta http (json object)
	}

	function aggiungiPersonale($data,$conn){   //funzione che ci permette di registrare un personale al sito
		$salt = "progetto";  //stringa che aggiungiamo alla password cosi da fortificare la cifratura
		$ruolo = "PE";       //tipo di utente che stiamo registrando nel sito
		$cf = strtoupper($data['cf']);   //mettiamo in maiuscolo il cf
		//query per vedere se l'utente non è già registarto nel sito
		$sql ="SELECT Email,CF from personale WHERE Email = '".$data['email']."' or CF= '".$cf."' ";
		$risultato= $conn->query($sql);
		if(mysqli_num_rows($risultato)==0){  //se non risulta nessun utente andiamo a registrare l'utente
			$password_encrypted = sha1($data['password'].$salt); //cifro la password con l'algoritmo sha1
			//query di insimento dell'utente nella tabella login e nella tabella personale
			$sql="INSERT INTO login (Email,Password,tipo,emailConfermata) VALUES ('".$data['email']."','$password_encrypted','$ruolo','1') ";
			$conn->query($sql);
			$sql="INSERT INTO personale (CF,Nome,Cognome,Domicilio,Telefono,Tipo,CapoSala,CodO,CodR,Email) VALUES ('$cf','".$data['nome']."','".$data['cognome']."','".$data['domicilio']."','".$data['telefono']."','".$data['tipo']."','".$data['capoSala']."','".$data['selectOspedale']."','".$data['selectReparto']."','".$data['email']."') ";
			$conn->query($sql);
			echo "successful";  //risposta http (se tutto è andato a buon fine)
		}else{
			echo "error";    //risposta http (se l'utente è gia registrato)
		}
	}


	function profiloPersonale($conn){  //funzione che restituisce come risposta http le informazioni del singolo personale
		session_start();   //apriamo la sessione
		$email=$_SESSION['email'];  //prendiamo l'email dalla sessione
		//query per prendere le informazioni del profilo del personale
		$sql="SELECT p.CF, p.Nome, p.Cognome, p.Domicilio, p.Telefono, p.Tipo, p.CapoSala,p.Email, o.Nome as NomeO, r.Nome as NomeR FROM personale AS p, ospedale AS o, reparto AS r WHERE p.Email = '".$email."' and p.CodO=o.CodO and p.CodR=r.CodR ";
		$risultato= $conn->query($sql);
		while($row = $risultato->fetch_assoc() ){  //ogni valore che otteniamo dalla query lo andiamo a inserire nel json con chiave : valore
			$json->nome=$row['Nome'];
			$json->cognome=$row['Cognome'];
			$json->cf=$row['CF'];
			$json->domicilio=$row['Domicilio'];
			$json->telefono=$row['Telefono'];
			$json->nomeOspedale=$row['NomeO'];
			$json->nomeReparto=$row['NomeR'];
			if($row['Tipo']=="P"){  //se l'utente risulta un primario mettiamo come tipo 'primario' e come capo sala '' perchè abbiamo considerato che un capo sala non possa essere un primario
				$json->tipo="Primario";
				$json->capoSala="";
			}else{   //se l'utente risulta un infermiere mettiamo come tipo 'infermiere' e mettiamo se è un capo sala o meno
				$json->tipo="Infermiere";
				if($row['CapoSala']=="SI"){
					$json->capoSala="SI";
				}else{
					$json->capoSala="NO";
				}
			}
			$json->email=$row['Email'];
		 }
		 echo json_encode($json);  //risposta http (json object)
	}


	function showAllPrenotazioni($conn){  //funzione che restituisce come risposta http le prenotazioni dei vaccini dei paziente nei singoli ospedali
		session_start();   //apriamo la sessione
		$email=$_SESSION['email'];  //prendiamo l'email dalla sessione

		//query per prendere l'ospedale in cui lavora e se è un infermiere o primario
		$sql="SELECT CodO,Tipo FROM personale WHERE Email='".$email."' ";
		$risultato= $conn->query($sql);
		while($row = $risultato->fetch_assoc() ){
			$codO=$row['CodO'];
			$tipo=$row['Tipo'];
		}

		//query per prendere il codice del laboratorio dell'ospedale in cui è effettuato il vaccino
		$sql="SELECT CodLab FROM laboratorio WHERE CodO='".$codO."' ";
        $risultato= $conn->query($sql);
        while($row = $risultato->fetch_assoc() ){
        	$codLab=$row['CodLab'];
        }

		$json;  //variabile che useremo come json e che invieremo come risposta
		$array = array();  //array che ci conterrà tutti i json degli utenti

		if($tipo=="P"){   //se l'utente è un primario
			//query per prendere lo storico di tutte le vaccinazioni in quell'ospedale
			$sql="SELECT ID, CF, CodVaccino, DataP, ora, minuti, CodLab, dose FROM prenotazione WHERE CodLab='".$codLab."' ";
			$risultato= $conn->query($sql);
			if(mysqli_num_rows($risultato)==0){  //se non ci sono prenotazioni
				echo "nessuna prenotazione";     //risposta http
			}else{   //se ci sono prenotazioni
				while($row = $risultato->fetch_assoc() ){  //per ogni valore che otteniamo dalla query lo andiamo a inserire nel json con chiave : valore  (una riga è un json)
					$json->id=$row['ID'];
					$json->cf=$row['CF'];
					$json->codVac=$row['CodVaccino'];
					$json->dataP=$row['DataP'];
					$json->ora=$row['ora'];
					$json->minuti=$row['minuti'];
					$json->codLab=$row['CodLab'];
					$json->dose=$row['dose'];
					array_push($array,json_encode($json));  //inseriamo uno dei json all'interno dell'array
				}
				echo json_encode($array);  //risposta http (json object)
			}
		}
		if($tipo=="I"){  //se l'utente è un infermiere
			$dataAttuale=str_replace("/", "-" ,date('Y/m/d'));  //data attuale trasformata nel formato accettato dal db YYYY-MM-DD
			//query per prendere le prenotazioni giornaliere in quel ospedale
			$sql="SELECT ID, CF, CodVaccino, DataP, ora, minuti, CodLab, dose FROM prenotazione WHERE CodLab='".$codLab."' and DataP='".$dataAttuale."' ";
			$risultato= $conn->query($sql);
			if(mysqli_num_rows($risultato)==0){   //se non ci sono prenotazioni
				echo "nessuna prenotazione";      //risposta http
			}else{     //se ci sono prenotazioni
				while($row = $risultato->fetch_assoc() ){   //per ogni valore che otteniamo dalla query lo andiamo a inserire nel json con chiave : valore  (una riga è un json)
					$json->id=$row['ID'];
					$json->cf=$row['CF'];
					$json->codVac=$row['CodVaccino'];
					$json->dataP=$row['DataP'];
					$json->ora=$row['ora'];
					$json->minuti=$row['minuti'];
					$json->codLab=$row['CodLab'];
					$json->dose=$row['dose'];
					array_push($array,json_encode($json));  //inseriamo uno dei json all'interno dell'array
				}
				echo json_encode($array);   //risposta http (json object)
			}
		}
	}




	//inizio Codice



    $method = $_SERVER['REQUEST_METHOD'];          //mi prendo dalla richiesta HTTP il metodo che utilizza (POST , GET , PUT , DELETE)
    $request = explode('/', trim($_SERVER['PATH_INFO'],'/'));      //mi prendo l'azione che devo fare   ES: come pathinfo abbiamo  '/signup/' e ci prendiamo 'signup' che è l'azione che dobbiamo compiere
    $input = json_decode(file_get_contents('php://input'),true);   //mi prendo i dati che passo nella send e creo il json (php object)

    if(isset($method) && isset($request) || isset($input) ) {   //andiamo avanti solo se le variabili sono settate e non sono vuote

		switch ($method) {                                         //usiamo uno switch per la gestione dei metodi POST GET PUT DELETE
            case 'POST':                                           //case 'POST' dello switch($method)
                switch ($request[0]) {                             //usiamo un ulteriore switch per la gestione delle varie azione che dobbiamo compiere
                    case 'login':                                  //case 'login' dello switch($request[0])
                        login($input,$conn);					   //funzione che ci permette di effettuare il login classico al sito
                        break;                                     //usciamo dal case 'login'

                    case 'signup':                                 //case 'signup' dello switch($request[0])
                        signup($input,$conn);                      //funzione che ci permette di registrare un paziente al sito
                        break;                                     //usciamo dal case 'signup'

					case 'googleLogin':                            //case 'googleLogin' dello switch($request[0])
						googleLogin($input,$conn);                 //funzione che ci permette di effettuare il login google al sito
						break;                                     //usciamo dal case 'googleLogin'

					case 'completeGoogle':                         //case 'completeGoogle' dello switch($request[0])
						completeGoogle($input,$conn);              //funzione che ci permette di effettuare la validazione dell'account con google
						break;                                     //usciamo dal case 'googleLogin'

						case 'prenotazioneVaccino':                    //case 'prenotazioneVaccino' dello switch($request[0])
		                    prenotazioneVaccino($input,$conn);         //funzione che ci permette di effettuare la prenotazione delle due vaccinazioni
		                    break;                                     //usciamo dal case 'prenotazioneVaccino'

	                    case 'aggiungiPersonale':                      //case 'aggiungiPersonale' dello switch($request[0])
	                    	aggiungiPersonale($input,$conn);           //funzione che ci permette di registrare un personale al sito
	                        break;                                     //usciamo dal case 'aggiungiPersonale'

	                    default:                                       //case di default dello switch($request[0])

	                        break;                                     //usciamo dal case di default
	                }
	                break;                                             //usciamo dal case 'POST'

	            case 'GET':                                            //case 'GET' dello switch($method)
	                switch ($request[0]) {                             //usiamo un ulteriore switch per la gestione delle varie azione che dobbiamo compiere
	                    case 'logout':                                 //case 'logout' dello switch($request[0])
	                        logout();                                  //funzione che ci permette di effettuare il logout dal sito
	                        break;                                     //usciamo dal case 'logout'

						case 'profilo':                                //case 'profilo' dello switch($request[0])
	                    	profilo($conn);							   //funzione che restituisce come risposta http le informazioni del singolo paziente
	                        break;                                     //usciamo dal case 'profilo'

	                    case 'showPrenotazione':                       //case 'showPrenotazione' dello switch($request[0])
	                    	showPrenotazione($conn);                   //funzione che restituisce come risposta http le prenotazioni dei vaccini del paziente
	                        break;                                     //usciamo dal case 'showPrenotazione'

	                    case 'infoVaccino':                            //case 'infoVaccino' dello switch($request[0])
							infoVaccino($conn);                        //funzione che restituisce come risposta http le informazioni dei vaccini e degli ospedali che poi inseriremo nelle select tramite js
							break;                                     //usciamo dal case 'infoVaccino'

	                    case 'infoPe':                                 //case 'infoPe' dello switch($request[0])
							infoPe($conn);                             //funzione che restituisce come risposta http le informazioni dei reperti e degli ospedali che poi inseriremo nelle select tramite js
							break;                                     //usciamo dal case 'infoPe'

	                    case 'utenti':                                 //case 'utenti' dello switch($request[0])
							utenti($conn);                             //funzione che restituisce come risposta http le informazioni di tutti gli utenti registrati nel sito
							break;                                     //usciamo dal case 'utenti'

	                    case 'profiloPersonale':                       //case 'profiloPersonale' dello switch($request[0])
	                    	profiloPersonale($conn);                   //funzione che restituisce come risposta http le informazioni del singolo personale
	                        break;                                     //usciamo dal case 'profiloPersonale'

	                    case 'showAllPrenotazioni':                    //case 'showAllPrenotazioni' dello switch($request[0])
	                    	showAllPrenotazioni($conn);                //funzione che restituisce come risposta http le prenotazioni dei vaccini dei paziente nei singoli ospedali
	                        break;                                     //usciamo dal case 'showAllPrenotazioni'

	                    default:                                       //case di default dello switch($request[0])

	                        break;                                     //usciamo dal case di default
	                }
	                break;                                             //usciamo dal case 'GET'

	            case 'PUT':                                            //case 'PUT' dello switch($method)
	                switch ($request[0]) {                             //usiamo un ulteriore switch per la gestione delle varie azione che dobbiamo compiere
	                    case 'validation':                             //case 'validation' dello switch($request[0])
	                        validation($input,$conn);                  //funzione che ci permette di validare un account
	                        break;                                     //usciamo dal case 'validation'

						case 'changePassword':                        //case 'changePassword' dello switch($request[0])
							changePassword($input,$conn);             //funzione che ci permette di cambiare password ad un utente
							break;                                    //usciamo dal case 'changePassword'

	                    default:                                      //case di default dello switch($request[0])

	                        break;                                    //usciamo dal case di default
	                }
	                break;                                            //usciamo dal case 'PUT'

	            case 'DELETE':                                        //case 'DELETE' dello switch($method)
					switch ($request[0]) {                            //usiamo un ulteriore switch per la gestione delle varie azione che dobbiamo compiere
						case 'deletePrenotazione':                    //case 'deletePrenotazione' dello switch($request[0])
							deletePrenotazione($conn);                //funzione che ci permette ci cancellare le prenotazioni dei vaccini del singolo utente
							break;                                    //usciamo dal case 'deletePrenotazione'

						default:                                      //case di default dello switch($request[0])

							break;                                    //usciamo dal case di default
					}
					break;                                            //usciamo dal case 'DELETE'


	            default:                                              //case di default dello switch($method)

	                break;                                            //usciamo dal case di default
	        }
	    }
	?>
