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