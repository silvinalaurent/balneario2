/*Version: 3.0*/

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};

function trae_estadias(tipooperacion,letras,bandera){

  //bandera, puede ser E, si se lo llama de Estadia o P si se lo llama desde parcela. 
      //L desde activas
      $("#tablaestadias tbody").html("");
      var usuarioactivo = sessionStorage.getItem("Usuario");
      //console.log("Usuario activo ",usuarioactivo);
      var cantidadpersonas=0;
      var cantidadcarpas=0;
      var cantidadestadias=0;
      $.ajax({
                  
                      type: "POST",
                      url:"../estadias/estadias.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: false,
                      success: function(estadias){
                          
                          for (var i in estadias){
                       
                           if (i >= 0)
                           {
                              var unaestadia = estadias[i];
                              var fechad = convertDateFormat(unaestadia.fecha_ingreso);
                              var fechah = convertDateFormat(unaestadia.fecha_egreso);
                              var fila= "<tr><td>" +unaestadia.id+"</td><td>"+ unaestadia.idparcela + "</td><td>"+unaestadia.nrocarpa+"</td><td>"+unaestadia.apellido+" "+unaestadia.nombres+"</td><td>"+fechad+"</td><td>"+fechah+"</td><td>"+unaestadia.descripcion+"</td><td>"+unaestadia.patente+"</td>";

                              if ((bandera=="E") || (bandera=="L"))  //si la llamada es de estadias se muestra el total, si es para el listado de carpas activas no
                              {
                                
                                //"<td>"+unaestadia.forma_pago+"</td>
                                fila=fila+"<td>"+unaestadia.total+"</td><td><p><a href='#' title='Turistas de estadia' onclick='consulta_turistas("+unaestadia.id+")'><i class=\"icon-group\"></i></a></p></td>";
                              }
                              if (bandera=="I")
                              {  
                                fila=fila+"<td>"+unaestadia.forma_pago+"</td>";  
                              } 
                              if (bandera=="P") //si la llamada es desde parcela
                                {
                                 //14/01/25 se agrega que permita imprimir el comprobante   
                                 if (unaestadia.estado=='N')
                                 {
                                  fila= fila + "<td> <a href='#' title='Imprimir' onclick='imprimir_estadia("+unaestadia.id+")'><i class=\"icon-print\"> </i></a>&nbsp;&nbsp;&nbsp;<a href='#' title='CheckOUT' onclick='checkout_estadia("+unaestadia.id+","+unaestadia.idparcela+")'><i class=\"icon-logout\"></i></a>&nbsp;&nbsp;&nbsp;<a href='#' title='Extiende estadia' onclick='extiende_estadia("+JSON.stringify(unaestadia)+")'>+</a>";
                                  
                                  //si usuario es de anabella o administrador
                                  //permitir editar
                                  //<a href='#' title='Elimina Estadia' onclick='borra_estadia("+unaestadia.id+","+unaestadia.idparcela+")'><i class=\"icon-trash\"></i></a>  - 
                                  if ((usuarioactivo==7) || (usuarioactivo==1))
                                      fila=fila+"&nbsp;&nbsp;&nbsp;<a href='#' title='Edita Estadia' onclick='modifica_estadia("+JSON.stringify(unaestadia)+")'> <i class=\"icon-pencil\"></i></a>";
                                  }
                                 fila=fila+" </td></tr>";
                                 }

                              else  fila=fila+"<td></td></tr>";
                              
                              $("#tablaestadias tbody").append(fila); 
                              cantidadpersonas=cantidadpersonas+parseInt(unaestadia.cantidad_personas);
                              cantidadcarpas=cantidadcarpas+1;
                              //document.getElementById('suma_estadia').innerHTML='';
                           } 
                          

                          if (bandera=="I")
                          {
                           document.getElementById("cantidadpersonas").textContent=cantidadpersonas;
                           document.getElementById("cantidadcarpas").textContent=cantidadcarpas;
                          }
                          cantidadestadias=cantidadestadias+1;
                          }; 
                         
                          if (bandera=='P')
                          {  
                            var longitud=Object.keys(estadias).length;
                           
                            if (longitud>0)
                            {
                              document.getElementById("suma_estadia").style.visibility="hidden";
                            }
                            if (estadias.error==1)
                            {
                              document.getElementById("suma_estadia").style.visibility="visible";
                            }
                          }
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
            
            if (bandera='E')
            {
              document.getElementById("datos_estadias").textContent=cantidadestadias;
            }

};

function traeEstadias() {

	$("#tablaestadias tbody").html("");

  var cantidadpersonas=0;
  var cantidadcarpas=0;
  var cantidadestadias=0;
  var consulta = $("#buscaestadia").serializeObject();
  consulta.accion = 4;
  consulta.operacion = 21;

	$.ajax({
    type: "POST",
    url:"../estadias/estadias.php",
    data: consulta,
    dataType: "json",
    async: false,
    success: function(estadias){
	    for(var i in estadias){
        if(i >= 0){
          var unaestadia = estadias[i];
          var fechad = convertDateFormat(unaestadia.fecha_ingreso);
          var fechah = convertDateFormat(unaestadia.fecha_egreso);
          
          $("#tablaestadias tbody").append(`
            <tr>
              <td>
                ${unaestadia.id}
              </td>
              <td>
                ${unaestadia.idparcela}
              </td>
              <td>
                ${unaestadia.nrocarpa}
              </td>
              <td>
                ${unaestadia.apellido+" "+unaestadia.nombres}
              </td>
              <td>
                ${fechad}
              </td>
              <td>
                ${fechah}
              </td>
              <td>
                ${unaestadia.descripcion}
              </td>
              <td>
                ${unaestadia.patente}
              </td>
              <td>
                ${unaestadia.total}
              </td>
              <td>
                <p>
                  <a href='#' title='Turistas de estadia' onclick='consulta_turistas(${unaestadia.id})'>
                    <i class="icon-group"></i>
                  </a>
                </p>
              </td>
            </tr>
          `); 
          cantidadpersonas += parseInt(unaestadia.cantidad_personas);
          cantidadcarpas += 1;
        };
      };
    }
  });

  $("#datos_estadias").text(cantidadestadias);
     
};




function lista_estadias(nombreselector) {
      
      $("#"+nombreselector).empty();
      $("#"+nombreselector).append('<option value="0">Ninguno</option>');
      $.ajax({
                  
                      type: "POST",
                      url:"../estadias/estadias.php",
                      data: {accion:4, operacion:1},
                      dataType: "json",
                      async: false, 
                      success: function(estadias){
                          for (var i in estadias){
                              var unaestadia = estadias[i];
                              var fechai= convertDateFormat(unaestadia.fecha_ingreso);
                              var fechae= convertDateFormat(unaestadia.fecha_egreso);
                              $("#"+nombreselector).append('<option value="'+unaestadia.id+'">'+"Carpa "+unaestadia.nrocarpa+" - "+unaestadia.apellido+" "+unaestadia.nombres+" "+fechai+ " a "+fechae+ " "+'</option>');
                               
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};



function busca_estadia(idestadia) {
  if (sin_devolucion(idestadia))
  {
      $.ajax({
              type: "POST",
              url:"../estadias/estadias.php",
              data: {accion:4, operacion:17, idestadia:idestadia},
              dataType: "json",
              async: false,
              success: function(estadias){
                  
                    if (estadias.length!=undefined)
                    {
                      var unaestadia = estadias[0];
                      //controles
                      //Controlar que el pago asociado tenga estado N: Normal
                      if (unaestadia.estado=='N')
                      {
                        //Controlar que la estadia sea reciente (2/3 dias)
                        if (esFechaValida(unaestadia.fecha_ingreso,3)) 
                        {
                          $("#textoestadia").text("Secuencia: "+unaestadia.id+"- Parcela "+unaestadia.idparcela+" - Turista "+unaestadia.apellido+" "+unaestadia.nombres+" - Forma de pago: "+unaestadia.forma_pago+ "\n Importe $ "+ unaestadia.total +" Fecha de ingreso: "+ convertDateFormat(unaestadia.fecha_ingreso)+ "  Fecha de egreso: "+ convertDateFormat(unaestadia.fecha_egreso));
                          $("#importe").val(unaestadia.total);
                          //sessionStorage.setItem('forma_pago_estadia', unaestadia.forma_pago);
                          sessionStorage.setItem('importe_estadia', unaestadia.total);
                        }
                        else
                          alert('No se puede realizar devolucion de esta estadia');
                        }
                      else
                        alert('No se puede realizar devolucion de esta estadia');
                    }
                    else
                    {
                      alert("No existe una estadia "+idestadia+", por favor introduzca nuevamente el dato");
                      $("#idestadia").val('');
                      $("#textoestadia").text('');
                      $("#importe").val(0); 
                      $("#fecha").focus();
                    }
              },
              error: function (obj, error, objError){
                  alert(error);//avisar que ocurrió un error
              }
    });
  }
  else
    {
      alert("Esta estadia ya tiene devolucion hecha");
      $("#idestadia").val('');
      $("#idestadia").focus;
    }
};

function busca_estadias() {
      // busca estadias para listado de estadias
      $("#tablaestadias tbody").html("");
      //chequear que las fechad1 sea menor a la fechah1
      var fechad1=$("#buscaestadiai").val();
      var fechah1=$("#buscaestadiaf").val();
      var contador=0;
      if (fechad1<=fechah1)
      {  
        
        $.ajax({
                    
                        type: "POST",
                        url:"../estadias/estadias.php",
                        data: {accion:4, operacion:7, fechad:fechad1, fechah:fechah1},
                        dataType: "json",
                        async: false,
                        success: function(estadias){
   
                          for (var i in estadias){       
                            if (i >= 0)
                            {
                                
                                var unaestadia = estadias[i];
                                var fechad = convertDateFormat(unaestadia.fecha_ingreso);
                                var fechah = convertDateFormat(unaestadia.fecha_egreso);
                                contador=contador+1;
                                //console.log("Cantidad Estadias ",contador);
                                var fila= "<tr><td>" +unaestadia.id+"</td><td>"+ unaestadia.idparcela + "</td><td>"+unaestadia.nrocarpa+"</td><td>"+unaestadia.apellido+" "+unaestadia.nombres+"</td><td>"+fechad+"</td><td>"+fechah+"</td><td>"+unaestadia.descripcion+"</td></tr>"
                                  $("#tablaestadias tbody").append(fila); 
                                
                              
                            }
                          }
                          
                          document.getElementById("datos_estadias").textContent=contador;    
                        },
                        error: function (obj, error, objError){
                            alert(error);//avisar que ocurrió un error
                            
                        }

              });
          

      }
      else
        {
          alert("Por favor, introduzca un intervalo de fechas valido");
        }
      
  };



function ultimaestadia(){
return new Promise(function(resolve, reject) {
      $.ajax({
                  
                      type: "POST",
                      url:"../estadias/estadias.php",
                      data: {accion:4, operacion:2},
                      dataType: "json",
                      async: false,
                      success: function(estadias){
                          
                          if (estadias.error==1)
                          {
                            resolve(0);
                          }
                          else 
                            {
                              //console.log("La ultima estadia es ",estadias[0].ultimo);
                              resolve(estadias[0].ultimo);
                           }
                      },
                      error: function (obj, error, objError){
                          
                          reject(alert(error));//avisar que ocurrió un error
                          
                      }
            });
     });
};


function borra_estadia(idestadia,idparcela){
//Al borrar una estadia, debemos completar 3 pasos
//1) Poner el Estado en A (Anulado) de la estadia
//2) Libero la parcela, que vuelve a Estado L (Libre)
//3) Elimino el pago, poniendo el estado en A (Anulado)
 	if (confirm("¿Desea eliminar realmente la estadia?"))
  {  
    //Paso 1

    $.ajax({
                  
                      type: "POST",
                      url:"../estadias/estadias.php",
                      data: {accion:3, codigo:idestadia},
                      dataType: "json",
                      async: false,
                      success: function(estadias){
 							            if (estadias.error == 0){
                            trae_estadias(3,idparcela,"P");
                            
       
                          }
                          else{
                            alert(estadias.valor);
                          }
 							
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
    //Paso 2
    //cambia el estado de la parcela a L Libre
    $.ajax({
                  
                      type: "POST",
                      url:"../sectores/parcelas.php",
                      data: {accion:6, parcela:idparcela},
                      dataType: "json",
                      async: false,
                      success: function(parcelas){
                          if (parcelas.error == 0){
                            //console.log("Parcela Liberada");
                            
                          }
                          else{
                            alert(estadias.valor);
                          }
              
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });

    //Paso 3
    $.ajax({
                  
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:3, codigo:idestadia},
                      dataType: "json",
                      async: false,
                      success: function(pagos){
                          if (pagos.error == 0){
                            //console.log("Pago anulado");  
                          }
                          else{
                            alert(pagos.valor);
                          }
              
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
    };
};	

function finaliza_estadia(idestadia, idparcela)
{
  $.ajax({
                  
                      type: "POST",
                      url:"../estadias/estadias.php",
                      data: {accion:6, estadia:idestadia},
                      dataType: "json",
                      async: false,
                      success: function(estadias){
                          if (estadias.error == 0){
                            trae_estadias(3,idparcela,"P");
                          }
                          else{
                            alert(estadias.valor);
                          }
              
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
}

function checkout_estadias_viejas()
{ 
  $.ajax({
                  
                      type: "POST",
                      url:"../estadias/estadias.php",
                      data: {accion:4, operacion:20},
                      dataType: "json",
                      async: false,
                      success: function(estadias){
                        // if (estadias.error == 0){
                            for (var i in estadias){
                                  var unaestadia = estadias[i];
                                  //cambia estado a estadia a Finalizado F
                                  finaliza_estadia(unaestadia.id,unaestadia.idparcela);
                                  //cambia el estado de la parcela a L Libre
                                  //libera_parcela(unaestadia.idparcela);
                              }
                         /*}
                          else{
                            alert(estadias.valor);
                          }*/
              
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
}

function libera_parcela(idparcela)
{
  $.ajax({
                  
                      type: "POST",
                      url:"../sectores/parcelas.php",
                      data: {accion:6, parcela:idparcela},
                      dataType: "json",
                      async: false,
                      success: function(parcelas){
                          if (parcelas.error == 0){
                            console.log("Parcela liberada");
                            
                          }
                          else{
                            alert(parcelas.valor);
                          }
              
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
  };


function checkout_estadia(idestadia,idparcela){
if (confirm("¿Desea registrar el termino de la estadia?"))
  {    
      //cambia estado a estadia a Finalizado F
      finaliza_estadia(idestadia,idparcela);

      //cambia el estado de la parcela a L Libre
      libera_parcela(idparcela);      
  };  
};

function blanquea_formulario(){
   
    // limpiar formulario
    $("#idestadia").val('');
    $("#idparcela").val('');
    $("#nrocarpa").val('');
    $("#listasectores").val('');
    $("#numeroparcela2").val('');
    //$("#numeroparcela2").innerHTML('');
    $("fechad").val('');
    $("#fechah").val('');
    $("#dias").innerHTML('');
    $("#cantidad").val('');
    $("#listadotarifas").val('');
    $("#importe").val('');
    $("#adicional").val('');
    $("#observaciones").val('');
    $("#descuento").val('');
    $("#montodescuento").val('');
    $("#total").val('');
    $("#patente").val('');
    $("#discapacidad").prop("checked", false);
    $("#mascotas").prop("checked", false);

  };

function modifica_estadia(estadia){
  $("#fechaegreso2").val(estadia.fecha_egreso);
  $("#idestadia").val(estadia.id);
  sessionStorage.setItem('fecha_ingreso', estadia.fecha_ingreso);
  sessionStorage.setItem('fecha_egreso', estadia.fecha_egreso);
  document.getElementById("mostrar-modal3").checked =true;
};


function modifica_egreso(){
  var fecha_egreso2= $("#fechaegreso2").val();
  var idestadia=  $("#idestadia").val();
  var fecha_ingreso= sessionStorage.getItem('fecha_ingreso');
  var fecha_egreso= sessionStorage.getItem('fecha_egreso');
  var idparcela= $("#idparcela").val();
  if (fecha_egreso2<fecha_egreso)
  {
    if (fecha_ingreso<fecha_egreso2)
    {          
          //console.log("modifica estadia ",idestadia, " fecha de egreso nueva ",fecha_egreso2);
          $.ajax({
                  
                      type: "POST",
                      url:"../estadias/estadias.php",
                      data: {accion:5, idestadia:idestadia,fecha_egreso:fecha_egreso2},
                      dataType: "json",
                      async: false,
                      success: function(estadias){
                          
                          alert('Se realizo el cambio');
                          trae_estadias(3,idparcela,"P");
                      },
                      error: function (obj, error, objError){
                          
                          alert(error);//avisar que ocurrió un error
                          
                      }
            });
      }
      else
        alert("Corrija la fecha, no puede ser menor a la fecha de ingreso");
    
    }
    else
      alert("La fecha ingresada no puede ser mayor que la fecha de la estadia original");      

    document.getElementById("mostrar-modal3").checked =false;
    
}

function extiende_estadia(estadia){
    
    blanquea_formulario();
    sessionStorage.setItem("operacion", "E"); //Extiende estadia
    sessionStorage.setItem("idestadia", estadia.id);
    sessionStorage.setItem("idparcela", estadia.idparcela);
    var fecha_egreso=estadia.fecha_egreso;
    $("#idestadia").val(0);
    $("#idparcela").val(estadia.idparcela);
    $("#numeroparcela2").val(estadia.idparcela);
    $("#nrocarpa").val(estadia.nrocarpa);
    $("#listasectores").val(estadia.idsector);
    $("#fechad").val(estadia.fecha_egreso);
    $("#cantidad").val(estadia.cantidad_personas);
    $("#listadotarifas").val(estadia.tipo_alojamiento);
    eligetarifa(estadia.tipo_alojamiento);
     
    $("#importe").val(estadia.importe);
    $("#detalleadicional").val(estadia.detalleadicional);
    $("#adicionaldias").val(estadia.adicional);
    $("#detalleadicional2").val(estadia.detalleadicional2);
    $("#adicional2dias").val(estadia.adicional2);
    $("#detalleadicional3").val(estadia.adicional3);
    $("#adicional3").val(estadia.adicional3);
    
    $("#observaciones").val(estadia.observaciones);
    $("#descuento").val();
    $("#montodescuento").val(estadia.descuento);
    $("#patente").val(estadia.patente);
    $("#total").html(estadia.total);
    

    //cargar a tabla turista acompañantes
    cargaturista(estadia.idturista);

    document.getElementById("mostrar-modal").checked =true;
};


function agrega_estadia(parcela)
{
    haysesion();
    blanquea_formulario();
    $("#numeroparcela2").val(parcela);
    $("#idparcela").val(parcela);
    $('#nrocarpa').focus();
};


function chequea_estadia()
{//controlar
  //
   var fechad=$("#fechad").val();
   var fechah=$("#fechah").val();
   if (fechah >= fechad)
   { 
      
      calcula_dias()

   }
   else
      alert("Por favor, corrija las fechas");
};

function chequea_periodo(parcela){
//chequear que sea un numero valido de parcela

  return new Promise(function(resolve, reject) {

      $.ajax({
                      type: "POST",
                      url:"estadias.php",
                      data: {accion:3, opcion:1, caracteres:parcela},
                      dataType: "json",
                      async: false,
                      success: function(estadias){
                          unaparcela = estadias[0];
                          
                          if (unaparcela.estado == "L"){
                            //console.log("la parcela esta disponible");
                            
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
};


function envio_mail_estadia(idestadia, idturista)
{
  if (tiene_email(idturista))
  {
    //trae datos de la estadia
    
    $.ajax({
      type: "POST",
      url:"../estadias/estadias.php",
      data: {accion:4, operacion:4, caracteres:idestadia},
      dataType: "json",
      async: false,
      success: function(estadias){

              var unaestadia = estadias[0];

                //armado y envio de mail
                const datosCorreo = {
                  email: unaestadia.correo,
                  asunto: "Estadia Balneario San José, Nro. "+idestadia,
                  mensaje: "Felicitaciones\nQue disfrute su estadia en el Balneario Camping San Jose\nNro. de Estadia: "+idestadia+"\nUbicacion: "+unaestadia.idparcela+"\nTurista: "+unaestadia.apellido+" "+unaestadia.nombres+"\nDesde : "+unaestadia.fecha_ingreso+"  - Hasta "+unaestadia.fecha_egreso+"\nTipo: "+unaestadia.descripcion+"\nGrupo acompañante  : "+unaestadia.cantidad_personas+"\nAdicional: "+unaestadia.adicional+"\nObservaciones: "+unaestadia.observaciones+"\nDescuento: "+unaestadia.descuento+"\n\nTotal: "+unaestadia.total+"\n"+"Fecha y Hora :"+unaestadia.fecha_hora+"\n"
              };
              
              fetch('../estadias/mailestadia.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(datosCorreo)
              })
                  .then(response => response.text())
                  .then(data => console.log(data))
                  .catch(error => console.error('Error:', error));
                        
                },
                error: function (obj, error, objError){
                    alert(error);//avisar que ocurrió un error
                    
          }

      });

  }
  

}

function guarda_estadia()
{ 
  //15/01 Pidieron cambiar de parcela
  //controlo que la parcela en el input numeroparcela2 sea distinta a la parcela en el input oculto idparcela
  //22/02/21 confirmar si la parcela no tiene una estadia actual o una reserva para esos dias
  //13/11/2024 cada tanto se guarda dos o tres veces una estadia
  //04/12/2024 se garego control de llamama al ajax para resolver que no se repitan
  //10/01/2025 se guarda estadia con valor Nan puede ser porque no se controla que la fecha de finalizacion no sea nula
  //13/01/2025 se pregunta si se quiere imprimir, si tiene mail se envia por mail

  if (window.confirm("Desea realmente confirmar la ESTADIA ?")) {
    $(".tiempo").show();
    let datos_enviados=false;
 
    var idreserva= 0;
    var idparcela= $("#idparcela").val();
    idreserva= $("#idreservaprevia").val();
    var numeroparcela2 = $("#numeroparcela2").val();
    var bandera=false;
    if (idparcela!=numeroparcela2)
    {  //
        
        var bandera= parcela_disponible(numeroparcela2).then(r =>{      
          console.log("parcela disponible");
        }).catch(() => {
          console.log('Algo salió mal');
        });  


    }
    else bandera=true;

    
    if (bandera)
    {  
    
      var datos = $("#form_estadia").serialize();
      
      var total= $("#total").text();
      var montodescuento= $("#montodescuento").text();
      
      var forma_pago= $("#forma_pago").val();
      var usuarioactivo = sessionStorage.getItem("Usuario");
      var lote=$("#lote").val();
      var cupon=$("#cupon").val();
     
      //tomar valor de la tabla

      //1 - guardo datos de la estadia, con el turista a cargo
      //2 - guardo el grupo de turistas
      //controlar, si los datos importantes estan cargados, por ejemplo si hay un turista cargado al menos
      // controlar si se cargo la forma de pago tb!!! y si las fechas estan cargadas

          //buscamos el primer turista para guardar con la estadia
           var turista ='';
           var nro=0;
           var parcela=$("#numeroparcela2").val(); //antes era id parcela  pero luego se vio la opcion de cambiar la parcela reservada
           $('#tablaturistas tr').each(function () 
                    {
                      //console.log("Turista ",$(this).find("td").eq(0).html());
                      if (nro==1)  {
                                    turista=$(this).find("td").eq(0).html();
                                    
                                  }
                      nro=nro+1;
                    });
           
           var cantidad=$("#cantidad").val()
           //controles antes de grabar
           if (($("#listadotarifas").val()!=null) && (turista!='') && (parcela>0) && (cantidad!='') && !datos_enviados && 
           ($("#fechad").val()!=null) && ($("#fechah").val()!=null) && ($("#fechad").val()<=$("#fechah").val()))
           {
             if ($("#forma_pago").val()=='D' && ($("#lote").val()=='' || $("#cupon").val()==''))
              {
                alert('Ingrese Lote y Cupon de pago del Debito, gracias');
              }
              else
              {
                datos=datos+ "&total="+total+"&montodescuento="+montodescuento+"&forma_pago="+forma_pago+"&turista="+turista+"&usuario="+usuarioactivo+"&lote="+lote+"&cupon="+cupon+"&accion="+1;
                datos_enviados=true;
                $.ajax({      
                    type: "post",
                    url:"../estadias/estadias.php",
                    data:datos,
                    dataType: "json",
                    async: false,
              
                    success: function(estadias){
                          
                                  if (estadias["error"]==0) {

                                    
                                    document.getElementById("cerrar-modal").checked =true;

                                    //finaliza la estadia anterior si es una estension
                                    if (sessionStorage.getItem("operacion")=='E')
                                    {
                                      var idestadiaanterior= sessionStorage.getItem("idestadia");
                                      var idparcela= sessionStorage.getItem("idparcela");
                                      finaliza_estadia(idestadiaanterior,idparcela);
                                    }

                                    //pone ocupada a la parcela                                         
                                    cambiar_estado(parcela);
                                    //registrar pago, con el dato de idestadia
                                    var idestadia= estadias["ultimoid"];
                                          
                                            //enviar reglamento por email y comprobante de estadia, chequear si tiene mail
                                            envio_mail_estadia(idestadia,turista);

                                            $("#numeroparcela2").focus();
                                          
                                            //imprime pago, opcioneal preguntar si desea hacerlo
                                            window.open("../estadias/imprimeestadia.html?variable="+idestadia);


                                            //vamos a guardar a los acompañantes 
                                            var nro=0;
                                            $('#tablaturistas tr').each(function () {
                                                            if (nro>1) {
                                                              var idturista=$(this).find("td").eq(0).html();
                                                              guarda_acompanante(idturista, idestadia);

                                                            } 
                                                            nro=nro+1; 
                                                            
                                                          });
                                            trae_estadias(3,parcela,"P");//corrobar que sea esta busqueda
                                    
                                  } 
                                  else{
                                      alert(estadias["valor"]);
                                      
                                  };                  
                                  $(".tiempo").hide();      
                    },
              
                    error: function (obj, error, objError){
                        alert(error);//avisar que ocurrió un error
                        
                    }

              });
          }
        }        
        else
          alert("Por Favor, complete la informacion ");
    }
    else
    alert("Esa parcela no esta disponible");
  }

};


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
function imprime_pago_estadia(estadia) {
      //primero busca los datos de la estadia
      $.ajax({
              type: "POST",
              url:"../estadias/estadias.php",
              data: {accion:4, operacion:4, caracteres:estadia},
              dataType: "json",
              async: false,
              success: function(estadias){

                      var unaestadia = estadias[0];
                      
                      var fecha_pago=convertDateFormat(unaestadia.fecha_pago);
                      var fecha_egreso=convertDateFormat(unaestadia.fecha_egreso);

                      var visitante = unaestadia.apellido + ' ' + unaestadia.nombres;  
                      //calcula dias
                      if (unaestadia.nro_documento != '')
                          visitante=visitante+' DNI '+unaestadia.nro_documento;
                      var fechad=unaestadia.fecha_ingreso;
                      var fechah=unaestadia.fecha_egreso;
                      var fechad1= new Date(fechad);
                      var fechah1= new Date(fechah);
                      var fechaDesde = fechad1.getTime();
                      var fechaHasta    = fechah1.getTime();
                      var diff = fechaHasta - fechaDesde;
                      var dias=diff/(1000*60*60*24);
                      var adicionales= parseFloat(unaestadia.adicional)+parseFloat(unaestadia.adicional2)+parseFloat(unaestadia.adicional3);
                      var importe_estadia=0;
                      
                      if (unaestadia.unidad=='DIA')
                      {
                        importe_estadia=parseFloat(unaestadia.importe)*dias;
                      }
                      else
                      {
                        if (unaestadia.unidad=='PERSONA-DIA')
                            {
                              var personas= parseInt(unaestadia.cantidad_personas);
                              if (personas >=0)
                              {
                      
                                importe_estadia= parseFloat(unaestadia.importe*dias*personas);
                              }
                              else 
                                {importe_estadia=parseFloat(unaestadia.importe)*dias};

                            }
                        else{
                          if (unaestadia.unidad=='MES')
                          {
                            importe_estadia=unaestadia.importe;
                          }
                        }  
                      }
                      
                      var forma_pago='';
                      if (unaestadia.forma_pago=='E')
                        {forma_pago='Efectivo' }
                      else
                      {
                        if (unaestadia.forma_pago=='D')
                          {forma_pago='Debito' };
                      }
                      
                      var fecha_hora_impresion=fecha_hora_actual();
                      //original
                      document.getElementById("secuencia").textContent=unaestadia.idpago;
                      document.getElementById("fecha").textContent=fecha_pago;
                      document.getElementById("estadia").textContent=unaestadia.id;
                      document.getElementById("visitante").textContent=visitante;
                      document.getElementById("tipo").textContent=unaestadia.descripcion;
                      document.getElementById("nparcela").textContent=unaestadia.idparcela;
                      document.getElementById("nrocarpa").textContent=unaestadia.nrocarpa;
                      document.getElementById("sector").textContent=unaestadia.sector;
                      document.getElementById("montoestadia").textContent=importe_estadia;
                      document.getElementById("adicionales").textContent=adicionales;
                      document.getElementById("fvence").textContent=fecha_egreso;
                      document.getElementById("detalleadicional3").textContent=unaestadia.detalleadicional3;
                      document.getElementById("observaciones").textContent=unaestadia.observaciones;
                      document.getElementById("personas").textContent=unaestadia.cantidad_personas;
                      document.getElementById("descuento").textContent=unaestadia.descuento;
                      document.getElementById("total").textContent=unaestadia.total;
                      document.getElementById("forma_pago").textContent=forma_pago;
                      
                      document.getElementById("fecha_hora").textContent=fecha_hora_impresion;
                      //duplicado
                      document.getElementById("secuenciad").textContent=unaestadia.idpago;
                      document.getElementById("fechad").textContent=fecha_pago;
                      document.getElementById("estadiad").textContent=unaestadia.id;
                      document.getElementById("visitanted").textContent=visitante;
                      document.getElementById("tipod").textContent=unaestadia.descripcion;
                      document.getElementById("montoestadiad").textContent=importe_estadia;;
                      document.getElementById("nparcelad").textContent=unaestadia.idparcela;
                      document.getElementById("nrocarpad").textContent=unaestadia.nrocarpa;
                      document.getElementById("sectord").textContent=unaestadia.sector;
                      document.getElementById("adicionalesd").textContent=adicionales;
                      document.getElementById("fvenced").textContent=fecha_egreso;
                      document.getElementById("detalleadicional3d").textContent=unaestadia.detalleadicional3;
                      document.getElementById("observacionesd").textContent=unaestadia.observaciones;
                      document.getElementById("personasd").textContent=unaestadia.cantidad_personas;
                      document.getElementById("descuentod").textContent=unaestadia.descuento;
                      document.getElementById("totald").textContent=unaestadia.total;
                      document.getElementById("forma_pagod").textContent=forma_pago;
                      document.getElementById("fecha_horad").textContent=fecha_hora_impresion;
                      
              },
              error: function (obj, error, objError){
                  alert(error);//avisar que ocurrió un error
                  
              }

    });
  
};

function filtrarfechai(valor)
{
  trae_estadias(5, valor, "E");
}

function filtrarfechaf(valor)
{
  trae_estadias(6, valor, "E");
}

function filtrar_estadias_activas()
{
      //console.log('Filtra estadias activas');
      trae_estadias(18, "", "L");
}

function filtrar_estadias_vencidas()
{
      //console.log('Filtra estadias vencidas');
      trae_estadias(19, "", "L");
}
function filtrarturistaestadia(texto)
{
  if (texto.length > 3)
  {      
    trae_estadias(12, texto, "E");
  }
   
}

function filtrarparcelaestadia(texto)
{
      trae_estadias(13, texto, "E");
}

function filtrarcarpaestadia(texto)
{
      trae_estadias(14, texto, "E");
}

function filtrarpatenteestadia(texto)
{
      trae_estadias(16, texto, "E");
}

function imprimeestadias()
{
  window.open("listadoestadias.html", "_blank");
}

function imprime_listado_estadias()
{
  trae_estadias(1,"","I")
}

function imprimir_estadia(id)
{
  window.open("../estadias/imprimeestadia.html?variable="+id);
}

function formatea_patente(patente){
  let resultado = patente.replace(/\s+/g, '').toUpperCase();
  $("#patente").val(resultado);
}