//quando la pagina signinup.html sarà caricata andremo a
//far partire questa funzione che ci permette di creare un istanza di "accedi con google"
window.onload = function() {
    google.accounts.id.initialize({  //crea un'istanza client di Accedi con Google
        client_id: "511675397421-24hu4lk9kjfjntreusurkhencofukgb2.apps.googleusercontent.com",  //l'ID client della tua applicazione
        callback: handleCredentialResponse,   //funzione che gestisce il token ID restituito dalla richiesta per accedere con google
        ux_mode: "popup"  //modalità grafica di accesso
    });
    google.accounts.id.renderButton(  //esegue il rendering di un pulsante "Accedi con Google"
        document.getElementById("googleLogin"), { //prendo l'elemento html tramite l'id di dove dobbiamo inserire il bottone di accesso
            theme: "outline",  //tema del pulsante
            size: "large"   //dimensione del pulsante
        }
    );
}

function handleCredentialResponse(response) {   //funzione che gestisce il token ID restituito dalla richiesta per accedere con google
  //console.log("Encoded JWT ID token: " + response.credential);

  var userObject = decodeJWT(response.credential);  //json con tutte le credenziale dell'utente loggato prese tramite la funzione decodeJWT che scompone il token dato da google

  //console.log(userObject);

  let data = {};   //creazione json dei dati presi dal token
  data.email = userObject.email;
  data.nome = userObject.given_name;
  data.cognome = userObject.family_name;
  data = JSON.stringify(data);

  let xhr = new XMLHttpRequest(); //ci creiamo l'oggetto per la richiesta http

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        //console.log(xhr.response);
        //var res = JSON.parse(xhr.response);
        var dati = JSON.parse(data); //prendiamo i dati dal json
        switch (xhr.response) { //in base alla risposta che otteniamo andiamo ad eseguire determinato codice
            case "dashboard_profilo.html":  //se siamo già registrati e abbiamo l'account verificato andiamo alla dashboard_profilo
                window.location.replace("dashboard_profilo.html");  //andiamo a cambiare pagina del sito
                break;
            case "signup successful":   //ci saremo registrati nel sito però dobbiamo verificare l'account inserendo altri dati
                document.getElementById("nomeG").value=dati.nome;   //immettiamo nel form di completamento account il nome restituito dal token
                document.getElementById("cognomeG").value=dati.cognome;   //immettiamo nel form di completamento account il cognome restituito dal token
                document.getElementById("emailG").value=dati.email; //immettiamo nel form di completamento account l'email restituita dal token
                changeDiv("formGoogle","form");   //funzione che ci permette di cambiare div
                break;
            case "account to verify":  //siamo già registrati ma dobbiamo ancora verificare l'account inserendo altri dati
                document.getElementById("nomeG").value=dati.nome;   //immettiamo nel form di completamento account il nome restituito dal token
                document.getElementById("cognomeG").value=dati.cognome;   //immettiamo nel form di completamento account il cognome restituito dal token
                document.getElementById("emailG").value=dati.email;   //immettiamo nel form di completamento account l'email restituita dal token
                changeDiv("formGoogle","form"); //funzione che ci permette di cambiare div
                break;
            case "email already exists":   //se l'email di accesso con google risulta essere già registrata nel sistema tramite login classico mostreremo un errore
                changeDiv("formGoogleExists","form");  //funzione che ci permette di cambiare div
                break;
            }
    }
}
  xhr.open('POST','serverV3.php/googleLogin/',true);  //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded"); //informazioni che passiamo all'interno della richiesta
  xhr.send(data);  //apriamo la connessione e inviamo la richiesta al server
}

function decodeJWT (token) {  //funzione per decodifica token per avere i dati dell'utente loggato
  /*
  struttura JWT TOKEN :       xxxxxxxxx.yyyyyyyyyyy.zzzzzzzzzzz
  il token è diviso in 3 parti delimitate dal .
  queste parti sono:
            HEADER (ALGORITHM & TOKEN TYPE) ,
            PAYLOAD (DATA) ,
            VERIFY SIGNATURE
  noi ricaviamo i dati dell'utente tramite il payload.
  */
  var base64Url = token.split('.')[1];   //prendiamo la parte di token del payload
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');  //se ci sono determinati caratteri li andiamo a sostituire    (andiamo a sostituire solamente - _    il comando / /g va a fare una ricerca globale sulla stringa )
  return credential = JSON.parse(window.atob(base64)); //ritorniamo tramite json le credenziali decodificate dal token tramite atob()
}


function completeGoogle(){   //funzione che ci permette di completare l'account con google e renderlo verificato
    let data={};   //creazione json dei dati presi dal form di completamento account google
    data.nome = document.getElementById("nomeG").value;
    data.cognome = document.getElementById("cognomeG").value;
    data.cf = document.getElementById("cfG").value;
    data.indirizzo = document.getElementById("indirizzoG").value;
    data.data_nascita = document.getElementById("data_nascitaG").value;
    data.luogo_nascita = document.getElementById("luogo_nascitaG").value;
    data.email = document.getElementById("emailG").value;
    data = JSON.stringify(data);

    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http

    xhr.onreadystatechange = function(){   //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            //console.log(xhr.response);
            if(xhr.response=="dashboard_profilo.html") { //se il completamento dell'account è andato a buon fine andiamo alla dashboard_profilo
                window.location.replace("dashboard_profilo.html");  //andiamo a cambiare pagina del sito
            }
        }
    }
    xhr.open('POST','serverV3.php/completeGoogle/',true);  //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");   //informazioni che passiamo all'interno della richiesta
    xhr.send(data);   //apriamo la connessione e inviamo la richiesta al server
}
