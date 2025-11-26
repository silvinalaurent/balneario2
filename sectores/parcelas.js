/*Version: 3.0*/
function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};



function arma_tabla2() {
      //se crea la tabla con todas parcelas, y dentro va un boton nombrado como B+numero de parcela
      $("#tablaparcelas tbody").html("");
      c=1;//c: numero de parcela
      for (var a = 1; a < 26; a++) { //a:indicador de fila
        $("#tablaparcelas tbody").append("<tr>");
         for (var b = 1; b < 21; b++) { //b indicador de
            if (c<=500)
              $("#tablaparcelas tbody").append("<td id="+'celda'+c+"><input type='button' class='estiloparcela'   onclick='ver_parcela2(this.id)'  id='"+c+"' value='"+c+"'></td>");
            c=c+1;
        }
        $("#tablaparcelas tbody").append("</tr>");
       //var hoy = new Date().toISOString();
       var hoy= fechaHoy();
      }
       setTimeout(muestra_ocupaciones(hoy), 2000);
}

      
function mostrar_parcelas() {
      $.ajax({
                      type: "POST",
                      url:"parcelas.php",
                      data: {accion:4, operacion:0, caracteres:''},
                      dataType: "json",
                      async: true,
                      success: function(parcelas){
                          for (var i in parcelas){
                                var unaparcela = parcelas[i];
                                if (unaparcela.estado=='O')
                                  //color rojo
                                  document.getElementById(unaparcela.numero).style.backgroundColor="#FA161B";

                                else

                                  if (unaparcela.estado=='L')
                                    //color verde
                                    document.getElementById(unaparcela.numero).style.backgroundColor="#26DE74";
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
      //mostrar estadias vencidas
    /*  $.ajax({
                      type: "POST",
                      url:"../estadias/estadias.php",
                      data: {accion:4, operacion:11},
                      dataType: "json",
                      async: true,
                      success: function(estadias){
                          for (var i in estadias){
                                var unaestadia = estadias[i];
                                 document.getElementById(unaestadia.idparcela).style.backgroundColor="#A349A4";

                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
      */
};

function reset_parcelas() {
  
  //Entra a resetear matriz en verde
      for (var a = 1; a < 501; a++) {
            document.getElementById(a).style.backgroundColor="#26DE74";
        //  }    
        }

};


function muestra_estadias(fecha) { 

  var cantidadc=0;//cantidad de carpas
  var cantidadr=0;//cantidad de motorhome/trailer/casilla
  var cantidada=0;//cantidad vencidos
  var cantidadi=0;//cantidad de invitados
  var cantidadg=0;//cantidad de guardas
  var cantidadt=0;//cantidad total
  var parcela=0;
//incorporar control de horario 10:00 18:00
  $.ajax({
                  type: "POST",
                  url:"../estadias/estadias.php",
                  data: {accion:4, operacion:9, caracteres:fecha},
                  //se traen las estadias que tengan estado N Normal (no finalizado) y aquellas cuya fecha de ingreso y egreso
                  //encierre a la fecha actual
                  dataType: "json",
                  async: false,
                  success: function(estadias){
                    if (estadias.error==undefined){
                    
                      for (var i in estadias){
                            
                            cantidadt=cantidadt+1;//cantidad total
                            var unaestadia = estadias[i];
                            
                            if (unaestadia.idparcela!=parcela) 
                          
                            {
                                if (unaestadia.fecha_egreso > fecha)
                                {
                                 
                                  if ((unaestadia.tipo_alojamiento>10 && unaestadia.tipo_alojamiento<17) || (unaestadia.tipo_alojamiento>25 && unaestadia.tipo_alojamiento<27)) 
                                  {
                                    //si es un trailer, motorhome, etc.
                                    document.getElementById(unaestadia.idparcela).style.backgroundColor="#8e2a1f";
                                    cantidadr=cantidadr+1;//cuenta trailers
                                  }
                                  else
                                  {
                                    //invitado especial  
                                    if (unaestadia.tipo_alojamiento==25)
                                      {
                                        document.getElementById(unaestadia.idparcela).style.backgroundColor="#F4D03F";
                                        cantidadi=cantidadi+1;//cuenta invitados
                                    
                                      }
                                      else
                                      if (unaestadia.tipo_alojamiento==28)
                                      //guarda mensual 
                                      {
                                        document.getElementById(unaestadia.idparcela).style.backgroundColor="#FF8000";
                                        cantidadg=cantidadg+1;//cuenta guardas
                                      }
                                      else
                                      {
                                        //ocupado carpa
                                        document.getElementById(unaestadia.idparcela).style.backgroundColor="#FA161B";
                                        cantidadc=cantidadc+1;//cuenta carpa
                                  
                                      }
   
                                  }
                                }
                                else 
                                {
                                  //estadia vencida
                                  document.getElementById(unaestadia.idparcela).style.backgroundColor="#A349A4";
                                  cantidada=cantidada+1;//cuenta vencidos
                                   //agregar si tiene media estadia paga
                                   //chequear horario


                                }
                            }
                          parcela=unaestadia.idparcela;
                      };
                      //console.log("cantidad total ",cantidadt)
                      //console.log("Carpas ",cantidadc,' Reservas', cantidadr,' Vencidos', cantidada);
                      $("#carpas").text(cantidadc);
                      $("#rodados").text(cantidadr);
                      $("#vencidos").text(cantidada);
                      $("#invitados").text(cantidadi);
                      $("#guardas").text(cantidadg);
                    }; 
                  },
                  error: function (obj, error, objError){
                      alert(error);//avisar que ocurrió un error
                  }
        });
  
  
};

function calcula_dias() {
  //04/12/24 tendria que chequear que no guarden estadias de fechas posteriores a la actual
   var fechad=$("#fechad").val();
   var fechah=$("#fechah").val();
   if (fechah!='')
    {
    if (fechah > fechad)
    { 
      var fechad1= new Date(fechad);
      var fechah1= new Date(fechah);
      
      var fechaDesde=fechad1.getTime();
      var fechaHasta=fechah1.getTime();

      var diff = fechaHasta - fechaDesde;

      var dias=diff/(1000*60*60*24);

      $("#dias").text(dias);
      calculaestadia();
    }
    else
      alert("Por favor, corrija las fechas");
    }
};



function calculaestadia()

{
  const unidad_tarifa = localStorage.getItem("unidad_tarifa");
  var dias= document.getElementById("dias").textContent;
  if (dias=='') {dias=0};
  var tarifa= document.getElementById("importe").value;
  if (tarifa=='') {tarifa=0};
  var descuento= document.getElementById("descuento").value;
  if (descuento=='') {descuento=0};
 /*  var adicional= document.getElementById("adicional").value;
  if (adicional=='') {adicional=0};
  var adicional2= document.getElementById("adicional2").value;
  if (adicional2=='') {adicional2=0};
  */ 
  var adicional=0;
  var adicional2=0;
  var adicional3= document.getElementById("adicional3").value;
  if (adicional3=='') {adicional3=0};
  var importe_estadia=0;
  if (unidad_tarifa=='DIA')
  {
     importe_estadia=parseFloat(tarifa)*parseInt(dias);
  }
  else  
  {
    if (unidad_tarifa=='PERSONA-DIA')
    //si el tipo de alojamiento elegido es uno que tiene unidad de cobro por dia por persona
      {
        var personas= parseInt(document.getElementById("cantidad").value);
        if (personas >=0)
        {
          importe_estadia= parseFloat(tarifa)*parseInt(dias)*personas;  
        }
      }
    else
    {
      if (unidad_tarifa=='MES')
        //si el tipo de alojamiento elegido es uno que tiene unidad de cobro por mes
        {
          importe_estadia= parseFloat(tarifa);
          //si es por mes la fecha de egreso se puede calcular sumando un mes a fecha de ingreso
          let fecha_ingreso= document.getElementById('fechad').value;
          let fecha_egreso = new Date(fecha_ingreso); // 10 de junio de 2024
          // Incrementar un mes
          fecha_egreso.setMonth(fecha_egreso.getMonth() + 1);
          let fechaFormateada = armaFecha(fecha_egreso);
          document.getElementById("fechah").value = fechaFormateada;
          //calcula_dias();
        }
    }
  }
  document.getElementById("importedias").value=importe_estadia;
  //document.getElementById("adicionaldias").value= parseFloat(adicional)*parseInt(dias);
  //document.getElementById("adicional2dias").value= parseFloat(adicional2)*parseInt(dias);
  var totalestadia= importe_estadia+parseInt(dias)*parseFloat(adicional)+parseInt(dias)*parseFloat(adicional2)+parseFloat(adicional3);
  var montodescuento=0;

  montodescuento= totalestadia * parseFloat(descuento)/100;
  
  totalestadia= totalestadia - montodescuento;
  
  document.getElementById("montodescuento").textContent=montodescuento;
  document.getElementById("total").textContent=totalestadia;
}; 



function ver_parcela2(parcela){
    window.open("parcela.html?variable="+parcela,"_self") 
}; 

function muestra_ocupaciones(fecha) {

      reset_parcelas();
      //muestra_reservas(fecha);
      muestra_estadias(fecha);
};

function ver_parcela(parcela)
{
  //buscar datos sobre parcela
  //si esta libre, dar posibilidad de hacer reserva o ocupacion
  //si esta reservada o ocupada, mostrar datos
      $.ajax({
                  
                      type: "POST",
                      url:"parcelas.php",
                      data: {accion:4, operacion:1, caracteres:parcela},
                      dataType: "json",
                      async: true,
                      success: function(parcelas){
 
                          for (var i in parcelas){
                       
                              var unaparcela = parcelas[i];

                              if (unaparcela.estado=='L')
                                    if (confirm("Registra una estadia?"))
                                    {                     
                                        agrega_estadia(unaparcela.numero);
                                    } 
                              else
                                if (unaparcela.estado='O')
                                    {                     
                                        muestra_estadia(unaparcela.numero);
                                    }
                                if (unaparcela.estado=='R') 
                                    {
                                        muestra_reserva(unaparcela.numero);
                                    }
                          }; 

                          document.getElementById("mostrar-modal").checked =true;
                          
                      },

                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });

};

function cambiar_estado(parcela)
{
      
      $.ajax({
                  
                      type: "POST",
                      url:"parcelas.php",
                      data: {accion:5, parcela:parcela},
                      dataType: "json",
                      async: true,
                      success: function(parcelas){
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
           });
};

function liberar_parcela(parcela)
{
  
      $.ajax({
                  
                      type: "POST",
                      url:"parcelas.php",
                      data: {accion:6, parcela:parcela},
                      dataType: "json",
                      async: true,
                      success: function(parcelas){
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
           });
};

function parcela_disponible(parcela){
//chequear que sea un numero valido de parcela
if ((parcela >=1) && (parcela <= 500))
{
  return new Promise(function(resolve, reject) {

      $.ajax({
                      type: "POST",
                      url:"parcelas.php",
                      data: {accion:4, opcion:1, caracteres:parcela},
                      dataType: "json",
                      async: true,
                      success: function(parcelas){
                          unaparcela = parcelas[0];
                          console.log(unaparcela);
                          if (unaparcela.estado == "L"){
                            console.log("la parcela esta disponible");
                            
                            resolve(true);
                          }      
                          else 
                            resolve(false);
                      },
                      error: function (obj, error, objError){
                          reject(alert(error));//avisar que ocurrió un error
                      }
      });
    });
}
else
  alert("Por favor ingrese un numero de parcela apropiado");
}



function limpia_parcelas(){
      var hoy = new Date().toISOString();
      console.log("hoy ", hoy);
      var contador=0;
      var liberados=0;
      $.ajax({
                      type: "POST",
                      url:"../sectores/parcelas.php",
                      data: {accion:4, operacion:0, caracteres:''},
                      dataType: "json",
                      async: false,
                      success: function(parcelas){
                          for (var i in parcelas){
                              var unaparcela = parcelas[i];
                                if (unaparcela.estado=='O')
                                {           
                                    var parcela=unaparcela.numero;
                                    console.log("Parcela ",parcela);
                                    contador=contador+1;
                                    $.ajax({
                                          type: "POST",
                                          url:"../estadias/estadias.php",
                                          //ver si corresponde numero de operacion
                                          data: {accion:4, operacion:8, caracteres:parcela},
                                          dataType: "json",
                                          async: false,
                                          success: function(estadias){
                                              //chequear que haya algun resultado;
                                                  var unaestadia = estadias[0];
                                                  console.log("Fecha egreso ",unaestadia.fecha_egreso);
                                                  if (unaestadia.fecha_egreso < hoy){
                                                      console.log("Se libera ",parcela);
                                                      liberados=liberados+1;
                                                      liberar_parcela(parcela);
                                                    };
                                          },
                                          error: function (obj, error, objError){
                                              alert(error);//avisar que ocurrió un error
                                          }
                                    });
                                }        
                              
                          }; 
                          console.log("Estadias total ",contador, " liberados ", liberados);
                          
                      },

                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};



function guarda_turista()
{
   $("#nuevoturista").hide();
};


function guarda_parcela(numero) {
// se uso para carga inicial de parcelas, hay que arreglar para carga normal
              var total=$("")
                datos="numero="+numero+ "&accion="+1;
                $.ajax({      
                          type: "post",
                          url:"parcelas.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                          success: function(parcelas){
                                 
                                        if (parcelas["error"]==0) {

                                            console.log("parcela creada ", numero);
                                        } 
                                        else{
                                            alert(sectores["valor"]);
                                            
                                        };                  
                          },
                          error: function (obj, error, objError){
                              alert(error);//avisar que ocurrió un error
                              
                          }
                    });
};

function datos_pago(forma_pago)
{
  console.log(forma_pago);
  if (forma_pago=='D'){
    $("div[name='datos_debito']").show();
  }
  else{
    $("div[name='datos_debito']").hide();
  }
}