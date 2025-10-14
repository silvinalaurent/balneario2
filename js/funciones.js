function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};

function convertDateFormat2(string) {
  var info = string.split('/');
  return info[2] + '-' + info[1] + '-' + info[0];
};

function armaFecha(fecha)
{
  var dia = ("0" + fecha.getDate()).slice(-2);
  var mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
  var fechahoy = fecha.getFullYear()+"-"+mes+"-"+dia;
  return fechahoy;          
}

function armaFecha2(fecha)
{
  var dia = ("0" + fecha.getDate()).slice(-2);
  var mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
  var fechahoy = dia+"-"+mes+"-"+fecha.getFullYear();
  return fechahoy;          
}

function formatearFecha(fecha) {
  let year = fecha.getFullYear();
  let month = String(fecha.getMonth() + 1).padStart(2, '0'); // Agregar 1 porque enero es 0
  let day = String(fecha.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


  function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  function fechaActual(elemento){
  //pone fecha actual en imput tipo date
    var hoy = new Date();
    a = hoy.getFullYear();
    m = hoy.getMonth() + 1;
    d = hoy.getDate();
    document.getElementById(elemento).value = a + "-" + m + "-" + d;
  }


  function fechaHoy()
  {
    const fecha = new Date();
    if (fecha.getHours() >= 21) {
        fecha.setDate(fecha.getDate() - 1); // Retrocede un día
     }
    let hoy = fecha.toISOString().split('T')[0]; // Extrae solo la parte de la fecha
    return hoy;
  }

  ////////////////////////////////////////////////
    function replaceAll( text, busca, reemplaza ){
      while (text.toString().indexOf(busca) != -1)
      text = text.toString().replace(busca,reemplaza);
      return text;
    };
    ///////////////////////////////////////////////
    function formatMiles(num){
      var entero = parseInt(num);
      var decimales = replaceAll(num,entero,"");
      decimales = replaceAll(decimales,".",",");
      if(!isNaN(entero)){
        entero = entero.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        entero = entero.split('').reverse().join('').replace(/^[\.]/,'');
      };
      num = entero+decimales
      return num;
    };
    ///////////////////////////////////////////////
    function pad(n, length){
       n = n.toString();
       while(n.length < length) n = "0" + n;
       return n;
    }
    //////////////////////////////////////////////////
    function hoy(){
      var f = new Date();
      var fecha;
      
      fecha = (pad(f.getDate(),2) + "/" + pad((f.getMonth() +1),2) + "/" + f.getFullYear());
      
      return fecha;
    };

    ///////////////////////////////////////////////////
    function leerGET(){ 
      var cadGET = location.search.substr(1,location.search.length); 
      var arrGET = cadGET.split("&"); 
      var asocGET = new Array(); 
      var variable = ""; 
      var valor = ""; 
      for(i=0;i<arrGET.length;i++){ 
        var aux = arrGET[i].split("="); 
        variable = aux[0]; 
        valor = aux[1]; 
        
        do {
          valor = valor.replace('%20',' ');
        } while(valor.indexOf('%20') >= 0);

        do {
          valor = valor.replace('%C3%91','Ñ');
        } while(valor.indexOf('%C3%91') >= 0);

        do {
          valor = valor.replace('%C3%B1','ñ');
        } while(valor.indexOf('%C3%B1') >= 0);
        
        asocGET[variable] = valor
      };
      return asocGET; 
    };

  //////////////////////////////////////////////
  $.fn.serializeObject = function(){

      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;

  };

  function esFechaValida(fechaIngresada, dias) {
  //cheque una fecha dada, contra la fecha actual, que no sea mas antigua que x cantidad de dias  
  // fechaIngresada formato YYYY-MM-DD
  const fecha = new Date(fechaIngresada);

  // Fecha actual (sin horas/minutos/segundos)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Fecha límite = hoy - 4 días
  const limite = new Date(hoy);
  limite.setDate(hoy.getDate() - dias);
  console.log("Fecha ", fecha, " limite ", limite, " Hoy ", hoy);
  // Controlar que no sea más antigua que el límite
  return fecha >= limite && fecha <= hoy;
}

function numeroAPesos(num) {
    const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const especiales = {
        11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince",
        16: "dieciséis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve"
    };
    const centenas = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos",
                      "seiscientos", "setecientos", "ochocientos", "novecientos"];

    function convertirMenor1000(n) {
        if (n === 0) return "";
        if (n < 10) return unidades[n];
        if (n > 10 && n < 20) return especiales[n];
        if (n < 100) {
            let d = Math.floor(n / 10);
            let u = n % 10;
            if (u === 0) return decenas[d];
            if (d === 2) return "veinti" + unidades[u];
            return decenas[d] + " y " + unidades[u];
        }
        let c = Math.floor(n / 100);
        let resto = n % 100;
        if (n === 100) return "cien";
        return centenas[c] + (resto > 0 ? " " + convertirMenor1000(resto) : "");
    }

    function convertir(num) {
        if (num === 0) return "cero";
        if (num < 1000) return convertirMenor1000(num);

        if (num < 1000000) {
            let miles = Math.floor(num / 1000);
            let resto = num % 1000;
            let milesTexto = (miles === 1 ? "mil" : convertirMenor1000(miles) + " mil");
            return milesTexto + (resto > 0 ? " " + convertirMenor1000(resto) : "");
        }

        if (num < 1000000000) {
            let millones = Math.floor(num / 1000000);
            let resto = num % 1000000;
            let millonTexto = (millones === 1 ? "un millón" : convertir(millones) + " millones");
            return millonTexto + (resto > 0 ? " " + convertir(resto) : "");
        }

        return "Número demasiado grande";
    }

    // separar parte entera y decimales
    let partes = num.toFixed(2).split(".");
    let entero = parseInt(partes[0], 10);
    let centavos = partes[1];

    let textoEntero = convertir(entero);

    return (
        textoEntero +
        (entero === 1 ? " peso" : " pesos") +
        (centavos !== "00" ? " con " + centavos + "/100" : "")
    );
}


function fecha_hora_actual()
{
  const fechaActual = new Date();
  const formatoArgentina = fechaActual.toLocaleString('es-AR', {
                                dateStyle: 'short', // Formato de fecha (puede ser 'full', 'long', 'medium', 'short')
                                timeStyle: 'short', // Formato de hora (puede ser 'full', 'long', 'medium', 'short')
                                timeZone: 'America/Argentina/Buenos_Aires', // Asegura que respete el huso horario argentino
                              });
  return formatoArgentina;

}