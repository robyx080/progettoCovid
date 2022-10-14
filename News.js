//notizie covid
$(document).ready(function() {  // appena il documento si è caricato andiamo a fare questa funzione
    $.ajax({   //richiesta jquery ajax
        type: "GET",  //tipogolia richiesta   //con relativo url
        url: "https://api.newscatcherapi.com/v2/search?q=covid&lang=it&sort_by=date&search_in=title",
        dataType: "json",  //il tipo di dato che ci restituisce
        headers: { 'x-api-key': 'PiNa47sJbAxclGfvSUS5D9Okmhdxls0bj5RmxlvVoAQ' },  //chiave di autenticazione api
        success: function(data) {  //se la richiesta da esito positivo andiamo a usare la funzione
            for(var i=0;i<4;i++){  //ciclo che ci permette di prendere le prime 4 notizie riguardante il covid
                //prendiamo gli elementi della singola card per inserire le informazioni della notizia
                var titleDoc = document.getElementById("card"+(i+1)+"_title");
                var textDoc = document.getElementById("card"+(i+1)+"_text");
                var dateDoc = document.getElementById("card"+(i+1)+"_date");
                var imgDoc = document.getElementById("card"+(i+1)+"_img");
                var linkDoc = document.getElementById("card"+(i+1)+"_link");

                //singoli valori della notizia
                var title = data.articles[i].title;
                var link = data.articles[i].link;
                var img = data.articles[i].media;
                var date = data.articles[i].published_date;
                var summary = data.articles[i].summary;

                //inseriamo nei vari elementi html il valore precedentemente trovato
                titleDoc.innerHTML=title;
                if(summary.length<201){   //se il riassunto della notizia supera i 200 caratteri andremo a mettere i ...
                    textDoc.innerHTML=summary.slice(0,200);
                }else{
                    textDoc.innerHTML=summary.slice(0,200)+"....";
                }
                dateDoc.innerHTML=date;
                imgDoc.src=img;
                linkDoc.href=link;
            }
        }
    });
});


//notizie vaccini covid
setTimeout(() => {   //andremo a ritardare l'esecuzione di questa funzione poichè possiamo effettuare soltanto una richiesta ogni 1 secondo all'api delle news
    $(document).ready(function() {  // appena il documento si è caricato andiamo a fare questa funzione
        $.ajax({   //richiesta jquery ajax
            type: "GET",    //tipogolia richiesta   //con relativo url
            url: "https://api.newscatcherapi.com/v2/search?q=vaccini covid&lang=it&sort_by=date&search_in=title",
            dataType: "json",  //il tipo di dato che ci restituisce
            headers: { 'x-api-key': 'PiNa47sJbAxclGfvSUS5D9Okmhdxls0bj5RmxlvVoAQ' },  //chiave di autenticazione api
            success: function(data) {   //se la richiesta da esito positivo andiamo a usare la funzione
                for(var i=0;i<4;i++){
                    //prendiamo gli elementi della singola card per inserire le informazioni della notizia
                    var titleDoc = document.getElementById("card"+(i+5)+"_title");
                    var textDoc = document.getElementById("card"+(i+5)+"_text");
                    var dateDoc = document.getElementById("card"+(i+5)+"_date");
                    var imgDoc = document.getElementById("card"+(i+5)+"_img");
                    var linkDoc = document.getElementById("card"+(i+5)+"_link");

                    //singoli valori della notizia
                    var title = data.articles[i].title;
                    var link = data.articles[i].link;
                    var img = data.articles[i].media;
                    var date = data.articles[i].published_date;
                    var summary = data.articles[i].summary;

                    //inseriamo nei vari elementi html il valore precedentemente trovato
                    titleDoc.innerHTML=title;
                    if(summary.length<201){  //se il riassunto della notizia supera i 200 caratteri andremo a mettere i ...
                        textDoc.innerHTML=summary.slice(0,200);
                    }else{
                        textDoc.innerHTML=summary.slice(0,200)+"....";
                    }
                    dateDoc.innerHTML=date;
                    imgDoc.src=img;
                    linkDoc.href=link;
                }
            }
        });
    });
}, "1500") //ritardo la funzione di 1,5 secondi
