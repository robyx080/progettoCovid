//andamento vaccinazione
$(document).ready(function() {  // appena il documento si è caricato andiamo a fare questa funzione
    $.ajax({  //richiesta jquery ajax
        type: "GET",  //tipogolia richiesta   //con relativo url
        url: "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/anagrafica-vaccini-summary-latest.csv",
        dataType: "text",  //il tipo di dato che ci restituisce
        success: function(data) {  //se la richiesta da esito positivo andiamo a usare la funzione
            vaccini(data);     //richiamiamo la funzione vaccini
            vacGrafico(data);  //richiamiamo la funzione vacGrafico
        }
    });
});

//andamento covid
$(document).ready(function() {   // appena il documento si è caricato andiamo a fare questa funzione
    $.ajax({   //richiesta jquery ajax
        type: "GET",  //tipogolia richiesta   //con relativo url
        url: "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-andamento-nazionale/dpc-covid19-ita-andamento-nazionale.csv",
        dataType: "text",  //il tipo di dato che ci restituisce
        success: function(data) {  //se la richiesta da esito positivo andiamo a usare la funzione
            statsCovid(data);    //richiamiamo la funzione statsCovid
            statsGrafico(data);  //richiamiamo la funzione statsGrafico
        }
    });
});


function vaccini(allText) {   //funzione che ci permette di caricare nell'html il numero delle vaccinazioni
    var allTextLines = allText.split('\n');    //ci dividiamo ogni singola riga del file csv
    var headers = allTextLines[0].split(',');  //prendiamo le intestazioni del file csv
	var totVac = 0;  //variabile che contiene quante vaccinazioni sono state effettuate
    for (var i=1; i<allTextLines.length-1; i++) {  //ciclo per ottenere il totale delle vaccinazioni
        var data = allTextLines[i].split(',');  //ci prendiamo la singola riga
        totVac+=Number(data[1]);   //aggiungiamo a totVac ogni Vaccinazione per singola età
    }
    document.getElementById("vaccinazione").innerHTML = totVac;  //lo stampiamo nella pagina delle statistiche
}


function statsCovid(allText) {   //funzione che ci permette di caricare nell'html il numero delle vaccinazioni
    var allTextLines = allText.split('\n');   //ci dividiamo ogni singola riga del file csv
    var data = allTextLines[(allTextLines.length)-2].split(','); //-2 perchè nel file csv c'è una riga in più vuota senno mettavamo -1
    var guariti = Number(data[9]);  //prendo i guriti
    var positivi = Number(data[6]); //prendo i positivi
    var deceduti = Number(data[10]); //prendo i deceduti
    var date = data[0].replace('T', ' ');  //prendo la data e tolgo dalla stringa il carattere 'T'
    document.getElementById("positivi").innerHTML = positivi;  //lo stampiamo nella pagina delle statistiche
    document.getElementById("guariti").innerHTML = guariti;    //lo stampiamo nella pagina delle statistiche
    document.getElementById("decessi").innerHTML = deceduti;   //lo stampiamo nella pagina delle statistiche
    document.getElementById("data_covid").innerHTML = date;    //lo stampiamo nella pagina delle statistiche
}


function statsGrafico(allText) {   //funzione che ci permette di caricare nell'html tutti i grafici riguardanti le statistiche del covid
    var allTextLines = allText.split('\n');  //ci dividiamo ogni singola riga del file csv
    var pos=[];   //array che contiene tutte i positivi per ogni singolo giorno
    var gua=[];   //array che contiene tutte i guariti per ogni singolo giorno
    var dec=[];   //array che contiene tutte i deceduti per ogni singolo giorno
    var dates=[];  //array che contiene tutte le date
    for(var i=1;i<=(allTextLines.length)-2;i++){ //ciclo per prendere tutti i dati dal file csv
        var data = allTextLines[i].split(','); //ci dividiamo ogni singola riga del file csv
        pos.push(data[6]);  //prendo i positivi
        gua.push(data[9]);  //prendo i guariti
        dec.push(data[10])  //prendo i deceduti
        dates.push(data[0].toString().replace('T', ' ')); //prendo le date e tolgo dalla stringa il carattere 'T'
    }

    var posChart = document.getElementById('myChart').getContext('2d'); //prendo l'elemento html tramite l'id
    var chart = new Chart(posChart, {  //creazione grafico dell'andamento curva dei contagi (positivi)
       type:'line',  //tipologia di grafico
       data: {
         labels: dates,   //array da inserire come label
         datasets: [{
           label: 'POSITIVI',   //legenda
           backgroundColor: 'rgb(255, 45, 0, 0.3)',  //colore dell'area sottostante alla curva  (0.3 è l'opacità)
           borderColor: 'rgb(255, 45, 0)',           //colore della curva
           data: pos,    //array da inserire nella curva
           fill:true,    //andiamo a colorare l'area sottostante alla curva
         }]
       },
       option: {}
     });

    var guaChart = document.getElementById('myChart1').getContext('2d');  //prendo l'elemento html tramite l'id
    var chart = new Chart(guaChart, {    //creazione grafico dell'andamento curva dei guariti
       type:'line',   //tipologia di grafico
       data: {
         labels: dates,   //array da inserire come label
         datasets: [{
           label: 'GUARITI',    //legenda
           backgroundColor: 'rgb(204, 255, 153, 0.3)',   //colore dell'area sottostante alla curva  (0.3 è l'opacità)
           borderColor: 'rgb(110, 251, 0)',   //colore della curva
           data: gua,   //array da inserire nella curva
           fill:true,   //andiamo a colorare l'area sottostante alla curva
         }]
       },
       option: {}
     });

    var deChart = document.getElementById('myChart2').getContext('2d');   //prendo l'elemento html tramite l'id
    var chart = new Chart(deChart, {    //creazione grafico dell'andamento curva dei decessi
       type:'line',   //tipologia di grafico
       data: {
         labels: dates,   //array da inserire come label
         datasets: [{
           label: 'DECESSI',   //legenda
           backgroundColor: 'rgb(1, 1, 255, 0.3)',   //colore dell'area sottostante alla curva  (0.3 è l'opacità)
           borderColor: 'rgb(1, 1, 255)',    //colore della curva
           data: dec,   //array da inserire nella curva
           fill:true,   //andiamo a colorare l'area sottostante alla curva
         }]
       },
       option: {}
     });


   var allChart = document.getElementById('myChart3').getContext('2d');  //prendo l'elemento html tramite l'id
   var chart = new Chart(allChart, {   //creazione grafico dell'andamento covid  (conterrà 3 curve)
      type:'line',    //tipologia di grafico
      data: {
        labels: dates,  //array da inserire come label
        datasets: [
          {
          label: 'POSITIVI',   //legenda
          backgroundColor: 'rgb(255, 45, 0, 0.3)',  //colore dell'area sottostante alla curva  (0.3 è l'opacità)
          borderColor: 'rgb(255, 45, 0)',   //colore della curva
          data: pos,  //array da inserire nella curva
          fill:true,  //andiamo a colorare l'area sottostante alla curva
          },
          {
          label: 'GUARITI',   //legenda
          backgroundColor: 'rgb(110, 251, 0, 0.3)',  //colore dell'area sottostante alla curva  (0.3 è l'opacità)
          borderColor: 'rgb(110, 251, 0)',   //colore della curva
          data: gua,  //array da inserire nella curva
          fill:true,  //andiamo a colorare l'area sottostante alla curva
          },
          {
          label: 'DECESSI',   //legenda
          backgroundColor: 'rgb(1, 1, 255, 0.3)',  //colore dell'area sottostante alla curva  (0.3 è l'opacità)
          borderColor: 'rgb(1, 1, 255)',   //colore della curva
          data: dec,  //array da inserire nella curva
          fill:true,  //andiamo a colorare l'area sottostante alla curva
          }]
      },
      option: {}
    });
}


function vacGrafico(allText){   //funzione che ci permette di caricare nell'html il grafico riguardante le statistiche sulla vaccinazione
    var allTextLines = allText.split('\n');  //ci dividiamo ogni singola riga del file csv
    var vac = [];   //array che contiene tutte le vaccinazioni per ogni singolo età
    var age = [];   //array che contiene tutte le età
    for (var i = 1; i < (allTextLines.length) - 1; i++) {  //ciclo per ottenere i dati sulle vaccinazioni
        var data = allTextLines[i].split(','); //ci prendiamo la singola riga
        vac.push(data[1]);   //prendo il numero di vaccini
        age.push(data[0].toString());  //prendo le varie età
    }
    var vaChart = document.getElementById('myChart4').getContext('2d');  //prendo l'elemento html tramite l'id
    var chart = new Chart(vaChart, {   //creazione grafico del totale vaccinazioni
        type: 'bar',    //tipologia di grafico
        data: {
            labels: age,    //array da inserire come label
            datasets: [{
                label: 'Vaccinazioni',  //legenda
                backgroundColor: 'rgb(59, 124, 87)',  //colore dell'area della barra
                borderColor: 'rgb(59, 124, 87)',   //colore del bordo della barra
                data: vac,  //array da inserire nella curva
                fill: true,  //andiamo a colorare l'area della barra
            }]
        },
        option: {}
    });
}
