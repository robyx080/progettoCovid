function setDate(id){   //funzione per ritornare la data attuale a aggiungerla come attributo di un input date (id + l'id dell'input a cui aggiungere la data)
    //creazione data
    var today = new Date();    //oggetto Date
    var day = today.getDate();  //prendiamo il giorno
    var month = today.getMonth() + 1 ; //prendiamo il mese  (Gennaio è 0 per getMonth per questo aggiungiamo 1)
    var year = today.getFullYear(); //prendiamo l'anno

    //se il giorno e il mese sono inferiori al 10 aggiungiamo uno 0 davanti per farli diventare 01  02  03 ecc
    if(day<10){
        day='0' + day;
    }

    if(month<10){
        month='0' + month;
    }

    //creiamo la variabile che useremo come data
    today= year + '-' + month + '-' + day;
    //in base all'id che passiamo come parametro inseriamo nell'input date max o min della data creata
    switch (id) {
        case "data_nascita":
            document.getElementById(id).setAttribute("max", today);
            break;

        case "dataPrenotazioneVaccino":
            document.getElementById(id).setAttribute("min", today);
            break;
    }
}

//funzione che ci permette di mostrare un determinato div all'interno della dashboard
function changeDivDashboard(divM,div1,div2){   //primo parametro è l'id del div da mostrare,gli altri parametri sono gli id dei div da nascondere
    document.getElementById(divM).style.display="block";
    document.getElementById(div1).style.display="none";
    document.getElementById(div2).style.display="none";
}

//funzione che ci permette di mostrare un determinato div all'interno dell'index e settare in grassetto il link della navbar
function changeDivIndex(divM,div1,div2,div3,div4,div5,linkS) { //primo parametro è l'id del div da mostrare,gli altri parametri sono gli id dei div da nascondere e linkS è l'indice del link da settare in grassetto
    document.getElementById(divM).style.display="block";
    document.getElementById(div1).style.display="none";
    document.getElementById(div2).style.display="none";
    document.getElementById(div3).style.display="none";
    document.getElementById(div4).style.display="none";
    document.getElementById(div5).style.display="none";

    for(i=0;i<6;i++)  //setto il link della navbar cliccato in grassetto e tutti gli altri no.  La variabile link la creeremo su index.html
        link[i].style.fontWeight="";
    link[linkS].style.fontWeight="bold";
}

//funzione che ci permette di mostrare un determinato div
function changeDiv(divM,divN) { //primo parametro è l'id del div da mostrare, secondo parametro è l'id del div da nascondere
    document.getElementById(divM).style.display="block";
    document.getElementById(divN).style.display="none";
}

//funzione che ci permette di mostrare il div del form della prenotazione dei vaccini all'interno della dashboard_profilo
function showForm(){
    document.getElementById("formPrenotazioneVaccino").style.display="block";
    document.getElementById("prenotazioneSuc").style.display="none";
    document.getElementById("prenotazioneErr").style.display="none";
    document.getElementById("prenotazioneExist").style.display="none";
}

//funzione che ci permette di registrare un utente al sito
function signup(){
    let data={};  //ci creaimo un oggetto e lo usiamo come un json e inseriamo i dati al suo interno (i dati li prende dal form della registrazione su signinup.html)
    data.nome = document.getElementById("nome").value;
    data.cognome = document.getElementById("cognome").value;
    data.cf = document.getElementById("cf").value;
    data.indirizzo = document.getElementById("indirizzo").value;
    data.data_nascita = document.getElementById("data_nascita").value;
    data.luogo_nascita = document.getElementById("luogo_nascita").value;
    data.emailReg = document.getElementById("emailReg").value;
    data.passwordReg = cifra(document.getElementById("passwordReg").value);   //usiamo la funzione cifra(pwd) per cifrare la password con l'algoritmo sha1
    data.checkPassword = cifra(document.getElementById("checkPassword").value);  //usiamo la funzione cifra(pwd) per cifrare la password con l'algoritmo sha1
    data = JSON.stringify(data);   //ci convertiamo l'oggetto in una stringa json

    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){  //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            switch (xhr.response) {  //in base alla risposta che otteniamo andiamo a cambiare il div su signinup.html
                case "signup successful":
                    changeDiv("formRegSuc","formReg");  //funzione che ci permette di cambiare div
                    break;
                case "email or cf error":
                    changeDiv("formRegEC","formReg");  //funzione che ci permette di cambiare div
                    break;
                case "password error":
                    changeDiv("formRegPas","formReg"); //funzione che ci permette di cambiare div
                    break;
            }
        }
    }
    xhr.open('POST','serverV3.php/signup/',true);   //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  //informazioni che passiamo all'interno della richiesta
    xhr.send(data);  //apriamo la connessione e inviamo la richiesta al server
}

//funzione che ci permette di effettuare il login al sito
function login(){
    let data={};  //ci creaimo un oggetto e lo usiamo come un json e inseriamo i dati al suo interno (i dati li prende dal form del login su signinup.html)
    data.email = document.getElementById("email").value;
    data.password = cifra(document.getElementById("password").value); //usiamo la funzione cifra(pwd) per cifrare la password con l'algoritmo sha1
    data = JSON.stringify(data);  //ci convertiamo l'oggetto in una stringa json

    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){  //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            switch (xhr.response) {  //in base alla risposta che otteniamo andiamo a cambiare la pagina nelle varie dashboard o cambiamo il div du signinup.html per dire che c'è stato un errore nel login
                case "login error":
                    changeDiv("formRisp","form");  //funzione che ci permette di cambiare div
                    break;
                case "dashboard_profilo.html":
					window.location.replace("dashboard_profilo.html")   //ci permette di cambiare pagina del sito
					break;
                case "dashboard_personale.html":
                    window.location.replace("dashboard_personale.html")   //ci permette di cambiare pagina del sito
                    break;
                case "dashboard_amministratore.html":
                    window.location.replace("dashboard_amministratore.html")   //ci permette di cambiare pagina del sito
                    break;
            }
        }
    }
    xhr.open('POST','serverV3.php/login/',true);  //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  //informazioni che passiamo all'interno della richiesta
    xhr.send(data);  //apriamo la connessione e inviamo la richiesta al server
}

//funzione che ci permette di effettuare il logout dal sito
function logout(){
    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){   //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            window.location.href = xhr.response;  //dopo che viene effuato il logout ritorniamo nella pagina che ci manda il server (index.html)
        }
    }
    xhr.open('GET','serverV3.php/logout/',true);  //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  //informazioni che passiamo all'interno della richiesta
    xhr.send();  //apriamo la connessione e inviamo la richiesta al server
}

//funzione che ci permette di convalidare l'account
function validation(){
    let data={};  //ci creaimo un oggetto e lo usiamo come un json e inseriamo i dati al suo interno (i dati li prende dal form di convalida su varifica.html)
    data.email = document.getElementById("email").value;
    data.token = document.getElementById("token").value;
    data = JSON.stringify(data);  //ci convertiamo l'oggetto in una stringa json
    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){  //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            //console.log(xhr.response);
            switch (xhr.response) {  //in base alla risposta che otteniamo andiamo a cambiare il div su varifica.html
                case "validation successful":
                    changeDiv("formValSuc","form"); //funzione che ci permette di cambiare div
                    break;
                case "email or token error":
                    changeDiv("formValEr","form"); //funzione che ci permette di cambiare div
                    break;
            }
        }
    }
    xhr.open('PUT','serverV3.php/validation/',true);  //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  //informazioni che passiamo all'interno della richiesta
    xhr.send(data);  //apriamo la connessione e inviamo la richiesta al server
}

//funzione che ci permette di ottenere le informazioni del singolo paziente
function profilo(){
    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){  //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            var rows = document.getElementById("tableProfilo").rows[1].cells;  //andiamo a prendere i singoli td del primo tr della tabella del profilo del paziente
            var res=JSON.parse(xhr.response);  //trasformiamo la risposta in un json
            var i = 0; //indice di comodo
            for (var key in res){  //per ogni chiave della risposta json andiamo a prendere il valore e lo inseriamo nel singolo td
                var value = res[key];
                rows[i].innerHTML= value;
                i++;
            }
        }
    }
    xhr.open('GET','serverV3.php/profilo/',true);  //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  //informazioni che passiamo all'interno della richiesta
    xhr.send();  //apriamo la connessione e inviamo la richiesta al server
}

//funzione che ci permette di ottenere le prenotazione del vaccino del singolo paziente
function showPrenotazione(){
    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){  //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            if(xhr.response=="nessuna prenotazione"){  //se la risposta che ottiamo sarà nessuna prenotazione andiamo a mostrare il div NoPrenotazione
                document.getElementById("NoPrenotazione").style.display="block";
            }else{                                                                  //altrimenti andiamo a mostrare le prenotazioni
            	var row1 = document.getElementById("tablePrenotazione").rows[1].cells;  //andiamo a prendere i singoli td del primo tr della tabella della prenotazione del vaccino del paziente
            	var row2 = document.getElementById("tablePrenotazione").rows[2].cells;  //andiamo a prendere i singoli td del secondo tr della tabella della prenotazione del vaccino del paziente
                document.getElementById("divTablePrenotazione").style.display="block";  //andiamo a mostrare il div della tabella della prenotazione del vaccino
                var res=JSON.parse(xhr.response); //trasformiamo la risposta in un array       es:   [ { primo : json } , { secondo : json} ]
                var jres=JSON.parse(res[0]); //trasformiamo l'array con indice 0 in un json (conterra il json con i dati della prima vaccinazione)
                var i = 0;  //indice di comodo
                for(var key in jres){  //per ogni chiave della risposta json andiamo a prendere il valore e lo inseriamo nel singolo td
                    var value = jres[key];
                    row1[i].innerHTML= value;
                    i++;
                }
                i=0;  //indice di comodo
                jres=JSON.parse(res[1]);  //trasformiamo l'array con indice 1 in un json (conterra il json con i dati della seconda vaccinazione)
                for(var key in jres){     //per ogni chiave della risposta json andiamo a prendere il valore e lo inseriamo nel singolo td
                    var value = jres[key];
                    row2[i].innerHTML= value;
                    i++;
                }
            }
        }
    }
    xhr.open('GET','serverV3.php/showPrenotazione/',true);  //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  //informazioni che passiamo all'interno della richiesta
    xhr.send();  //apriamo la connessione e inviamo la richiesta al server
}


//funzione che ci permette di ottenere le informazioni dei vaccini e degli ospedali cosi da inserirli come option dei select
function infoVaccino(){
    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){  //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            var res=JSON.parse(xhr.response); //trasformiamo la risposta in un array   es:   [   [ {json : primo vac} , {json : sec vac} ] , [ { ospedale : nome } , {ospedale : nomeO} ]   ]
            var selectVac=document.getElementById("selectVaccino");  //andiamo a prendere la select del vaccino che si trova nel form della prenotazione del vaccino
            var selectOsp=document.getElementById("selectOspedale");  //andiamo a prendere la select dell'ospedale che si trova nel form della prenotazione del vaccino
			for(var i=0;i<res[0].length;i++){ //per ogni json che si trova all'interno dell'array[0] andiamo a prendere il valore e lo inseriamo nella option e successivamente inseriamo l'option nella select
            	var jsonOption=JSON.parse(res[0][i]);        //trasformiano l'array[0][i] (ovvero uno dei json) in json
                var opt = document.createElement('option');  //creiamo una option
            	for(var key in jsonOption){                  //per ogni chiave della risposta json andiamo a prendere il valore e lo inseriamo nella singola option
                    var value = jsonOption[key];
                    if(key=="CodVaccino"){
                    	opt.value = value;                   //inseriamo nella option come value il valore della chiave
                    }
                    if(key=="DescVaccino"){
                    	opt.innerHTML = value;               //inseriamo nella option come testo da mostrare il valore della chiave
                    }
                }
            	selectVac.appendChild(opt);                  //insriamo nella select dei vaccini la singola option
            }
            for(var i=0;i<res[1].length;i++){                //per ogni json che si trova all'interno dell'array[1] andiamo a prendere il valore e lo inseriamo nella option e successivamente inseriamo l'option nella select
                var jsonOption=JSON.parse(res[1][i]);        //trasformiano l'array[1][i] (ovvero uno dei json) in json
                var opt = document.createElement('option');  //creiamo una option
            	for(var key in jsonOption){                  //per ogni chiave della risposta json andiamo a prendere il valore e lo inseriamo nella singola option
                    var value = jsonOption[key];
                    if(key=="CodOspedale"){
                    	opt.value = value;                  //inseriamo nella option come value il valore della chiave
                    }
                    if(key=="NomeOspedale"){
                    	opt.innerHTML = value;              //inseriamo nella option come testo da mostrare il valore della chiave
                    }
                }
            	selectOsp.appendChild(opt);               //insriamo nella select degli ospedali la singola option
            }
        }
    }
    xhr.open('GET','serverV3.php/infoVaccino/',true);  //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  //informazioni che passiamo all'interno della richiesta
    xhr.send();  //apriamo la connessione e inviamo la richiesta al server
}


//funzione che ci permette di effettuare la prenotazione del vaccino
function prenotazioneVaccino(){
    let data={};  //ci creaimo un oggetto e lo usiamo come un json e inseriamo i dati al suo interno (i dati li prende dal form di prenotazione del vaccino su dashboard_profilo.html)
    data.vaccino = document.getElementById("selectVaccino").value;
    data.ospedale = document.getElementById("selectOspedale").value;
    data.dataPre = document.getElementById("dataPrenotazioneVaccino").value;
    data.ora = document.getElementById("ora").value;
    data.minuti = document.getElementById("minuti").value;
    data = JSON.stringify(data);  //ci convertiamo l'oggetto in una stringa json

    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){   //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            switch (xhr.response) {   //in base alla risposta che otteniamo andiamo a cambiare il div su dashboard_profilo.html
                case "prenotazione successful":
                    changeDiv("prenotazioneSuc","formPrenotazioneVaccino");  //funzione che ci permette di cambiare div
                    break;
                case "prenotazione not successful":
                    changeDiv("prenotazioneErr","formPrenotazioneVaccino");  //funzione che ci permette di cambiare div
                    break;
                case "prenotazione già effettuata":
                    changeDiv("prenotazioneExist","formPrenotazioneVaccino");  //funzione che ci permette di cambiare div
                    break;
            }
        }
    }
    xhr.open('POST','serverV3.php/prenotazioneVaccino/',true);  //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");   //informazioni che passiamo all'interno della richiesta
    xhr.send(data);   //apriamo la connessione e inviamo la richiesta al server
}

//funzione che ci permette di cambiare password
function changePassword(){
    let data={}; //ci creaimo un oggetto e lo usiamo come un json e inseriamo i dati al suo interno (i dati li prende dal form di modifica della password su dashboard_profilo.html o dashboard_personale.html)
    data.password = cifra(document.getElementById("password").value);    //usiamo la funzione cifra(pwd) per cifrare la password con l'algoritmo sha1
    data.Npassword = cifra(document.getElementById("Npassword").value);  //usiamo la funzione cifra(pwd) per cifrare la password con l'algoritmo sha1
    data.Cpassword = cifra(document.getElementById("Cpassword").value);  //usiamo la funzione cifra(pwd) per cifrare la password con l'algoritmo sha1
    data = JSON.stringify(data);     //ci convertiamo l'oggetto in una stringa json

    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){  //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            switch (xhr.response) {   //in base alla risposta che otteniamo andiamo a cambiare il div su dashboard_profilo.html o dashboard_personale.html
                case "change password successful":
                    changeDiv("changeSucc","formPassword");  //funzione che ci permette di cambiare div
                    setTimeout(function(){                   //siccome abbiamo cambiato password effettuoil logout per far rifare il login, tutto questo verrà effettuato dopo 5 secondi
                        logout();
                    }, 5000);
                    break;
                case "password non uguale":
                    changeDiv("TwoPasswordErr","formPassword");  //funzione che ci permette di cambiare div
                    break;
                case "password vecchia diversa":
                    changeDiv("passwordErr","formPassword");  //funzione che ci permette di cambiare div
                    break;
                case "password vecchia uguale a nuova":
                    changeDiv("passwordUguali","formPassword");  //funzione che ci permette di cambiare div
                    break;
            }
        }
    }
    xhr.open('PUT','serverV3.php/changePassword/',true);  //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");   //informazioni che passiamo all'interno della richiesta
    xhr.send(data);   //apriamo la connessione e inviamo la richiesta al server
}


//funzione che ci permette di cancellare la prenotazione del vaccino
function deletePrenotazione() {
    if (document.getElementById("cancella").checked == true){  //controllo che la checkbox per la conferma dell'eliminazione della prenotazione sia selezionata
        let xhr = new XMLHttpRequest();   //ci creiamo l'oggetto per la richiesta http
        xhr.onreadystatechange = function(){   //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
                switch (xhr.response) {   //in base alla risposta che otteniamo andiamo a cambiare il div su dashboard_profilo.html
                    case "delete successful":
                        changeDiv("NoPrenotazione","divTablePrenotazione");  //funzione che ci permette di cambiare div
                        break;
                    case "delete error":
                        changeDiv("deleteErr","formCancellaPrenotazione");  //funzione che ci permette di cambiare div
                        break;
                }
            }
        }
        xhr.open('DELETE','serverV3.php/deletePrenotazione/',true);   //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");   //informazioni che passiamo all'interno della richiesta
        xhr.send();   //apriamo la connessione e inviamo la richiesta al server
    }
}

//funzione che ci permette di ottenere le informazioni degli utenti del sito
function utenti(){
    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){   //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            var res=JSON.parse(xhr.response);  //trasformiamo la risposta in un array   es:  [ { } , { } , { } ]
            //console.log(res);
            createTable("tableUtenti",res);   //funzione che ci permette di popolare una tabella

        }
    }
    xhr.open('GET','serverV3.php/utenti/',true);   //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");   //informazioni che passiamo all'interno della richiesta
    xhr.send();    //apriamo la connessione e inviamo la richiesta al server
}

//funzione che ci permette di popolare una tabella
function createTable(idTable,json){
    var table = document.getElementById(idTable); //prendiamo la tabella dall'idTable che ci siamo passati come parametro
    var tbody = table.getElementsByTagName('tbody')[0];  //prendiamo il tbody della tabella
    for(var j=0;j<json.length;j++){      //per ogni json che si trova all'interno dell'array andiamo a prendere i vari valore e li inseriamo nei vari td che andremo a inserire nei singoli tr e successivamente andremo a inserire il tr all'interno del tbody
        var tr = document.createElement('tr');  //creazione tr
        var jres=JSON.parse(json[j]);    //trasformiamo l'array[j] in un json
        for(var key in jres){   //per ogni chiave della risposta json andiamo a prendere il valore e lo inseriamo nel singolo td
            var value = jres[key];
            var td = document.createElement('td');  //creazione td
            var cellText = document.createTextNode(value);  //creazione textnode per inserire il testo nel td
            td.appendChild(cellText);  //inseriamo il testo nel td
            tr.appendChild(td);        //inseriamo il td nel tr
            //console.log("key " + key + " value " + value);
        }
        tbody.appendChild(tr);   //inseriamo il tr nel tbody
    }
}

//funzione che ci permette di ottenere le informazioni dei reparti e degli ospedali cosi da inserirli come option dei select
function infoPe(){
    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){   //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            var res=JSON.parse(xhr.response);  //trasformiamo la risposta in un array   es:   [   [ {json : primo rep} , {json : sec rep} ] , [ { ospedale : nome } , {ospedale : nomeO} ]   ]
            //console.log(res[0][0]);
            var selectRep=document.getElementById("selectReparto");  //andiamo a prendere la select del reparto che si trova nel form della creazione di un personale
            var selectOsp=document.getElementById("selectOspedale");  //andiamo a prendere la select dell'ospedale che si trova nel form della creazione di un personale
			for(var i=0;i<res[0].length;i++){   //per ogni json che si trova all'interno dell'array[0] andiamo a prendere il valore e lo inseriamo nella option e successivamente inseriamo l'option nella select
            	var jsonOption=JSON.parse(res[0][i]);   //trasformiano l'array[0][i] (ovvero uno dei json) in json
                //console.log("jsonOption=  " + jsonOption);
                var opt = document.createElement('option');  //creiamo una option
            	for(var key in jsonOption){   //per ogni chiave della risposta json andiamo a prendere il valore e lo inseriamo nella singola option
                    var value = jsonOption[key];
                    var value2;
                    if(key=="CodReparto"){
                    	//console.log("key=  " + key + " value=  " + value);
                    	opt.value = value;  //inseriamo nella option come value il valore della chiave
                    }
                    if(key=="NomeReparto"){
                        //console.log("key=  " + key + " value=  " + value);
                    	//opt.innerHTML = value;
                        value2=value;
                    }
                    if(key=="NomeOspedale"){
                        //console.log("key=  " + key + " value=  " + value);
                    	opt.innerHTML = value2+" "+"--"+" "+value;  //inseriamo nella option come testo da mostrare il valore della chiave
                    }
                }
            	selectRep.appendChild(opt);  //inseriamo nella select dei reparti la singola option
            }
            for(var i=0;i<res[1].length;i++){  //per ogni json che si trova all'interno dell'array[1] andiamo a prendere il valore e lo inseriamo nella option e successivamente inseriamo l'option nella select
                var jsonOption=JSON.parse(res[1][i]);  //trasformiano l'array[1][i] (ovvero uno dei json) in json
                //console.log("jsonOption=  " + jsonOption);
                var opt = document.createElement('option');   //creiamo una option
            	for(var key in jsonOption){   //per ogni chiave della risposta json andiamo a prendere il valore e lo inseriamo nella singola option
                    var value = jsonOption[key];
                    if(key=="CodOspedale"){
                    	//console.log("key=  " + key + " value=  " + value);
                    	opt.value = value;         //inseriamo nella option come value il valore della chiave
                    }
                    if(key=="NomeOspedale"){
                        //console.log("key=  " + key + " value=  " + value);
                    	opt.innerHTML = value;   //inseriamo nella option come testo da mostrare il valore della chiave
                    }
                }
            	selectOsp.appendChild(opt);  //inseriamo nella select degli ospedali la singola option
            }
        }
    }
    xhr.open('GET','serverV3.php/infoPe/',true);   //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  //informazioni che passiamo all'interno della richiesta
    xhr.send();    //apriamo la connessione e inviamo la richiesta al server
}

//funzione che ci permette di cifrare la password
function cifra(pwd){
    var hashObj = new jsSHA("SHA-1", "TEXT", {numRounds: 1});  //creiamo l'oggetto che ci permetto di cifrare
    hashObj.update(pwd);  //inseriamo all'interno dell'oggetto la password da cifrare
    var hash = hashObj.getHash("HEX");  //ci facciamo restituire la password cifrata
    return hash;  //ritorniamo la password cifrata
}

//funzione che ci permette di aggiungere un personale tramite la dashboard_amministratore
function aggiungiPersonale(){
    let data={};  //ci creaimo un oggetto e lo usiamo come un json e inseriamo i dati al suo interno (i dati li prende dal form di creazione di un personale su dashboard_amministratore.html)
    data.nome = document.getElementById("nome").value;
    data.cognome = document.getElementById("cognome").value;
    data.cf = document.getElementById("cf").value;
    data.domicilio = document.getElementById("domicilio").value;
    data.telefono = document.getElementById("telefono").value;
    data.tipo = document.getElementById("tipo").value;
    data.capoSala = document.getElementById("capoSala").value;
    if(data["tipo"]=="P"){
    	data["capoSala"]="";
    }
    data.selectOspedale = document.getElementById("selectOspedale").value;
    data.selectReparto = document.getElementById("selectReparto").value;
    data.email = document.getElementById("email").value;
    data.password = cifra(document.getElementById("password").value);
    data = JSON.stringify(data);  //ci convertiamo l'oggetto in una stringa json
    //console.log(data);
    let xhr = new XMLHttpRequest();   //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){  //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            //console.log(xhr.response);
            switch (xhr.response) {   //in base alla risposta che otteniamo andiamo a cambiare il div su dashboard_amministratore.html
                case "successful":
                    changeDiv("formSuc","formAggiungi");  //funzione che ci permette di cambiare div
                    break;
                case "error":
                    changeDiv("formErr","formAggiungi");  //funzione che ci permette di cambiare div
                    break;
            }
        }
    }
    xhr.open('POST','serverV3.php/aggiungiPersonale/',true);   //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");   //informazioni che passiamo all'interno della richiesta
    xhr.send(data);  //apriamo la connessione e inviamo la richiesta al server
}


//funzione che ci mostra le informazioni del personale
function profiloPersonale(){
    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){  //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            var rows = document.getElementById("tableProfiloPersonale").rows[1].cells;  //andiamo a prendere i singoli td del primo tr della tabella del profilo del personale
            var res=JSON.parse(xhr.response); //trasformo la risposta in un json
            var i = 0;  //indice di comodo
            //console.log(res);
            for (var key in res){   //per ogni chiave della risposta json andiamo a prendere il valore e lo inseriamo nel singolo td
                var value = res[key];
                //console.log("key " + key + " value " + value);
                rows[i].innerHTML= value;
                i++;
            }
        }
    }
    xhr.open('GET','serverV3.php/profiloPersonale/',true);   //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  //informazioni che passiamo all'interno della richiesta
    xhr.send();  //apriamo la connessione e inviamo la richiesta al server
}

//funzione che ci permette di mostrare tutte le prenotazioni
function showAllPrenotazioni(){
    let xhr = new XMLHttpRequest();  //ci creiamo l'oggetto per la richiesta http
    xhr.onreadystatechange = function(){  //teniamo traccia dello stato dell'evento e se l'evento raggiuge lo stato di DONE e avrà come status code 200 (richiesta andata a buon fine) andremo a vedere la risposta e a gestirla
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
        	if(xhr.response=="nessuna prenotazione"){   //se la risposta da nessuna prenotazione andiamo a mostrare un div
           		changeDiv("preNull","tableShowPrenotazioni")   //funzione che ci permette di cambiare div
            }else{
            	var res=JSON.parse(xhr.response);   //trasformo la risposta in un json
            	//console.log(res);
            	createTable("tableShowPrenotazioni",res);  //funzione che ci permette di popolare una tabella
            }
        }
    }
    xhr.open('GET','serverV3.php/showAllPrenotazioni/',true);    //inizializiamo la richiesta http con: 1) il metodo http che dobbiamo utilizzare. 2) l'url della richiesta. 3) se è true avverra una richiesta asincrona se è false avverra una richiesta sincrona
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");   //informazioni che passiamo all'interno della richiesta
    xhr.send();   //apriamo la connessione e inviamo la richiesta al server
}
