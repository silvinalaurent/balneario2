/*Version: 3.0*/

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};


function trae_reservas(tipooperacion,letras,donde) {
	 		
	 		$("#tablareservas tbody").html("");
	    
   		$.ajax({
                  
                      type: "POST",
                      url:"../reservas/reservas.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(reservas){
                          console.log("logra encontrar reservas");
        							    for (var i in reservas){
        					     
                           if (i >= 0)
                           {

        							        var unareserva = reservas[i];
                              console.log("Reserva ",unareserva);
                              var fechad = convertDateFormat(unareserva.fecha_ingreso);
                              var fechah = convertDateFormat(unareserva.fecha_egreso);

                              var fila="<tr><td>" + unareserva.idparcela + "</td><td>"+unareserva.apellido+" "+unareserva.nombres+"</td><td>"+fechad+"</td><td>"+fechah+"</td><td>"+unareserva.descripcion+"</td><td>"+unareserva.observaciones+"</td><td>";
                              if (tipooperacion != 7)
                              {                                
                                fila =fila +"<a href='#' onclick='modifica_reserva("+JSON.stringify(unareserva)+")' title='Modifica la Reserva'><i class=\"icon-pencil\"></i></a> <a href='#' onclick='borra_reserva("+unareserva.id+")' title='Borra la Reserva'><i class=\"icon-trash\"></i></a>";
                                
                                if (donde=="P") //de parcela
                                    fila= fila+"<a href='#' onclick='checkin_reserva("+JSON.stringify(unareserva)+")' title='CHECKIN de Reserva'><i class=\"icon-ok-circled2\"></i></a>";
                              }  
                              fila=fila+"</td> </tr>";
                              $("#tablareservas tbody").append(fila); 
                              
      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};

function busca_reservas() {
      
      $("#tablareservas tbody").html("");
      //chequear que las fechad1 sea menor a la fechah1
      var fechad1=$("#buscareservafecha").val();
      var fechah1=$("#buscareservafecha2").val();
      if (fechad1<=fechah1)
      {  
        console.log("Busca reservas entre fechas ",fechad1, " - ", fechah1);
        $.ajax({
                    
                        type: "POST",
                        url:"../reservas/reservas.php",
                        data: {accion:5, fechad:fechad1, fechah:fechah1},
                        dataType: "json",
                        async: true,
                        success: function(reservas){
   
                            for (var i in reservas){
                         
                             if (i >= 0)
                             {

                                var unareserva = reservas[i];
                                var fechad = convertDateFormat(unareserva.fecha_ingreso);
                                var fechah = convertDateFormat(unareserva.fecha_egreso);

                                $("#tablareservas tbody").append("<tr><td>" + unareserva.idparcela + "</td><td>"+unareserva.apellido+" "+unareserva.nombres+"</td><td>"+fechad+"</td><td>"+fechah+"</td><td>"+unareserva.descripcion+"</td><td> <a href='#' onclick='borra_reserva("+unareserva.id+")'><i class=\"icon-trash\"></i></a></td> </tr>"); 
                                console.log("Agregue reserva");
                                
                             } 
                         
                            }; 
                            
                        },
                        error: function (obj, error, objError){
                            alert(error);//avisar que ocurrió un error
                            
                        }

              });
      }
      else
        alert("Por favor, introduzca un intervalo de fechas valido");
  };

function anula_reservas_caidas()
{
      $.ajax({
                      type: "POST",
                      url:"../reservas/reservas.php",
                      data: {accion:7},
                      dataType: "json",
                      async: true,
                      success: function(reservas){
                        if (reservas.error==undefined){
                       
                          for (var i in reservas){
                                var unareserva = reservas[i];
                                console.log("reserva anulada",unareserva);
                                
                          };
                        }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};


function muestra_reservas(fecha) {

      console.log("Muestra reservas ");    
      var cantidadr=0;
      $.ajax({
                      type: "POST",
                      url:"../reservas/reservas.php",
                      data: {accion:4, operacion:6, caracteres:fecha},
                      dataType: "json",
                      async: true,
                      success: function(reservas){
                        if (reservas.error==undefined){
                       
                          for (var i in reservas){
                                var unareserva = reservas[i];
                                console.log("reserva ",unareserva);
                                //se pone en amarillo
                                document.getElementById(unareserva.idparcela).style.backgroundColor="#F4D03F";
                                cantidadr=cantidadr+1;
                          };
                          console.log("reservas ",cantidadr);
                          $("#reservas").text(cantidadr);
                        }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });

       
};

function ultimareserva(){
return new Promise(function(resolve, reject) {
      $.ajax({
                  
                      type: "POST",
                      url:"../reservas/reservas.php",
                      data: {accion:4, operacion:2},
                      dataType: "json",
                      async: true,
                      success: function(reservas){
                          console.log("Resultado de reservas ",reservas);
                          if (reservas.error==1)
                          {
                            resolve(0);
                          }
                          else 
                            {
                              console.log("La ultima reserva es ",reservas[0].ultimo);
                              resolve(reservas[0].ultimo);
                           }
                      },
                      error: function (obj, error, objError){
                          
                          reject(alert(error));//avisar que ocurrió un error
                          
                      }
            });
     });
};

function checkin_reserva(reserva){
  console.log("entra en checkin_reserva");
      //completa datos de formulario modal en parcela
      //cambia el estado de la reserva a C chequeado, sino es N normal
      //document.getElementById("numeroparcela2").textContent=reserva.idparcela;
      $("#numeroparcela2").val(reserva.idparcela);
      $("#idreservaprevia").val(reserva.id);
      console.log("Datos para checkin ", reserva);
      $("#fechad").val(reserva.fecha_ingreso);
      $("#fechah").val(reserva.fecha_egreso);
      calcula_dias();
      $("#cantidad").val(reserva.cantidad_personas);
      $("#idparcela").val(reserva.idparcela);
      $("#listadotarifas").val(reserva.tipo_alojamiento);
      eligetarifa(reserva.tipo_alojamiento)

      //agrega turista
      cargaturista(reserva.idturista);
      document.getElementById("mostrar-modal").checked =true;
/*

*/
      
};


function confirma_checkin(idreserva){
       $.ajax({
                  
                      type: "POST",
                      url:"../reservas/reservas.php",
                      data: {accion:6, reserva:idreserva},
                      dataType: "json",
                      async: true,
                      success: function(reservas){
                         
                            console.log("Checkin confirmado");
                            trae_reservas(3,reserva.idparcela,"P");
                         
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
};


function comprobar_disponibilidad(parcela, fechad, fechah)
{
  var bandera=true;
  console.log("Fecha Inicio estadia ",fechad);
  console.log("Fecha Fin estadia ",fechah);
                                
  $.ajax({
                      
                      type: "POST",
                      url:"../reservas/reservas.php",
                      data: {accion:4, operacion:3, caracteres:parcela},
                      dataType: "json",
                      async: false,
                      success: function(reservas){
                          
                          console.log("Bandera ",bandera);                          
                          for (var i in reservas){
                           var unareserva= reservas[i];
                           console.log("Reserva a controlar fecha ",unareserva);
                           if (i >= 0){
                            //controlo si la fecha desde de la reserva esta dentro de una reserva
                               
                                if ((fechad>=unareserva.fecha_ingreso)  && (fechad<unareserva.fecha_egreso)) {
                                    //no se puede usar la parcela
                                    console.log("la primer fecha esta dentro de una reserva");
                                    bandera=false;
                                    break;
                                  }         
                                //controlar si no se choca la fechah con alguna reserva
                                if ((fechah>=unareserva.fechaingreso) && (fechah<unareserva.fecha_egreso))
                                  {  
                                    bandera=false;
                                    console.log("la segunda fecha esta dentro de una reserva");
                                    break;
                                  }
                           }
                          };
                          console.log("Bandera salida ",bandera);
                          
                           

                          
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
                      
            });
  return bandera;
  
};  





function borra_reserva(id){

   if (confirm("Desea realmente eliminar la RESERVA ?")) {
     var usuarioactivo = sessionStorage.getItem("Usuario");
     var fecha = new Date();
     fechaformateada= fecha.toLocaleDateString();

 		 var comentario = "ANULADA - USUARIO "+usuarioactivo+", " +fechaformateada+" "+ prompt("Por que se anula la RESERVA ? ");
     $.ajax({
                  
                      type: "POST",
                      url:"../reservas/reservas.php",
                      data: {accion:3, codigo:id, comentario:comentario},
                      dataType: "json",
                      async: true,
                      success: function(reservas){
 							            if (reservas.error == 0){
                            if ( document.getElementById( "numeroparcela" )) {
                                var idparcela=document.getElementById('numeroparcela').textContent;
                                console.log("Parcela de donde se borra reserva ",idparcela);
                                if (idparcela > 0)
                                    trae_reservas(3,idparcela,"");
                                else
                                    trae_reservas(0,"","");
                            }
                          else
                              trae_reservas(0,"","");
                          }
                          else{
                            alert(reservas.valor);
                          }
 							
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
  };    
};	

function blanquea_reserva()
{
     console.log("Blanquea ");
    // limpiar formulario
    $("#idreserva").val('');
    $("#numeroparcelar").val('');
    $("#fechadr").val('');
    $("#fechahr").val('');
    $("#listadotarifasr").val('-1');
    $("#cantidadr").val('');
    $("#listaturistasr").val('-1');
    $("#observacionesr").val('');

};

function blanquea_formulario(){
   console.log("Blanquea ");
    // limpiar formulario
    $("#idreserva").val('');
    $("#numeroparcela").val('');
    $("#fechad").val('');
    $("#fechah").val('');
    $("#listadotarifas").val('-1');
    $("#cantidad").val('');
    $("#listaturistas").val('-1');

  };

/*
function limpia_busqueda(){
  
    // limpiar formulario
    $("#buscareserva").val('');
   };
*/
function agrega_reserva(parcela){
    //chequear el blanquea
    blanquea_reserva();
    console.log("parcela para hacer reserva ",parcela);
    $("#numeroparcelar").val(parcela);
    $("#numeroparcelar").focus();
    $("#idreserva").val('0');
    
    
    
};


function modifica_reserva(reserva){
   
    console.log("Reserva a modificar ",reserva); 
    blanquea_reserva();
    $("#idreserva").val(reserva.id);
    $("#numeroparcelar").val(reserva.idparcela);
    $("#fechadr").val(reserva.fecha_ingreso);
    $("#fechahr").val(reserva.fecha_egreso);
    $("#listadotarifasr").val(reserva.tipo_alojamiento);
    $("#cantidadr").val(reserva.cantidad_personas);
    $("#listaturistasr").val(reserva.idturista);
    $("#observacionesr").val(reserva.observaciones);
    $("#numeroparcelar").prop('disabled', true);
    $("#fechadr").prop('disabled', true);
    $("#fechahr").prop('disabled', true);
    $("#listaturistasr").prop('disabled', true);
    document.getElementById("mostrar-modal2").checked =true;
};



function guarda_reserva() {

//ver como hacer para modificar solo la carpa

          console.log("guarda reserva");
          var id=$("#idreserva").val();
          var numeroparcela=$("#numeroparcelar").val();
          var fechad=$("#fechadr").val();
          var fechah=$("#fechahr").val();
          var tarifa=$("#listadotarifasr").val();
          var cantidad=$("#cantidadr").val();
          var turista=$("#listaturistasr").val();
          var observaciones=$("#observacionesr").val();
          console.log("Id Reserva ",id);
          console.log("Numero de parcela ", numeroparcela);
          console.log("Turista ",turista);

            if (fechad!='' && fechah!='' && numeroparcela!='' && turista!='0' && turista!='' )
            {
              //para guardar debe tener fechas, turista, parcela
              if (id==0)
                  {var booleano=comprobar_disponibilidad(numeroparcela,fechad,fechah);}
              else
                  {var booleano=true;}
              console.log("booleano ",booleano);
              if (booleano)            
              
              {
                var datos = "numeroparcela="+numeroparcela+"&fechad="+fechad+"&fechah="+fechah+"&listadotarifas="+tarifa+"&cantidad="+cantidad+"&listaturistas="+turista+"&observaciones="+observaciones+"&idreserva="+id;

                console.log("Datos de la reserva ",datos);
                
                //se evalua si se esta registrando un nuevo reserva (1) o se esta modificando uno ya existente (2)
                
                if (id==0) {
                 		var ac=1;
                 		}
                else {
                		var ac=2;
                };
                
                datos = datos + "&accion="+ac;
                
                $.ajax({      
                          type: "post",
                          url:"../reservas/reservas.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(reservas){
                                 
                                        if (reservas["error"]==0) {

                                           //aca deberia enviar el mail
                                           if (id==0)
                                              //buscar ultima reserva y enviar mail
                                               {
                                                  enviar_mail_reserva();
                                                }                                                                   
                                           else
                                              //preguntar si quiere reenviar la reserva
                                              {
                                                }                                                                   
                                           document.getElementById("cerrar-modal2").checked =true;

                                           trae_reservas(3, numeroparcela,"R");
                                           //ver_parcela2(numeroparcela);
                                           //deberia cambiar el estado de la parcela???

                                         } 
                                        else{
                                            alert(reservas["valor"]);
                                            
                                        };                  
                          },
                    
                          error: function (obj, error, objError){
                              alert(error);//avisar que ocurrió un error
                              
                          }

                    });
                }
                else
                  alert('La parcela no esta disponible en esas fechas');
                 } 
            else
                alert('Complete los datos por favor');

};
/*
function filtrar_reservas(texto) {
  //filtrar por parcela
    if (texto=='')
      trae_reservas(0,"","R")
    else
      trae_reservas(3,texto,"R")
};

function filtrar_reservas_fecha(texto) {
  //filtrar por parcela
    
      trae_reservas(5,texto,"R")
};
*/
function enviar_mail_reserva() {

  ultimareserva("").then(r =>{
  //la ultima reserva
      arma_mail_reserva(r)
  }).catch(() => {
      console.log('Algo salió mal');
  });  
};


function arma_mail_reserva(reserva) {
      //primero busca los datos de la reserva
      console.log("Arma mail de Reserva ",reserva);
      $.ajax({
                      type: "POST",
                      url:"../reservas/reservas.php",
                      data: {accion:4, operacion:4, caracteres:reserva},
                      dataType: "json",
                      async: false,
                      success: function(reservas){
 
                              var unareserva = reservas[0];
                              console.log("Reserva para enviar por mail ",unareserva);    
                              var idreserva= unareserva.id;
                              var turista = unareserva.apellido + ' ' + unareserva.nombres  + ' DNI ' + unareserva.nro_documento;
                              var mail= unareserva.correo;
                              var parcela = unareserva.idparcela;// hay que traer el numero/codigo de la parcela
                              var fechad = convertDateFormat(unareserva.fecha_ingreso);
                              var fechah = convertDateFormat(unareserva.fecha_egreso);
                              var descripcion = unareserva.descripcion;
                              var cantidad_personas = unareserva.cantidad_personas;
                              

                              //llamada a otro ajax para enviar mail
                              var datosmail = "idreserva="+idreserva+"&turista="+turista+"&idparcela="+parcela+"&fechad="+fechad+"&fechah="+fechah+"&descripcion="+descripcion+"&cantidad_personas="+cantidad_personas+"&mail="+mail;
                              console.log("Datos para mail ", datosmail);
                              $.ajax({
                                        type: "POST",
                                        url:"../reservas/mailreserva.php",
                                        data: datosmail,
                                        dataType: "json",
                                        async: true,
                                        success: function(mail){
                                            console.log("Mail enviado");
                                        },
                                        error: function (obj, error, objError){
                                            alert(error);//avisar que ocurrió un error
                                        },
                                      });
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
  
};
