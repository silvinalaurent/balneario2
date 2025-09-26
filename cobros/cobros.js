/*Version: 3.0*/
function establece_turno()
{
  var today = new Date();
  // obtener la hora en la configuración regional de EE. UU.
  var ahora = today.getHours();
  console.log("Hora ",ahora);
  if (ahora<=14) 
    { 
      console.log("es menor de 14");
      $('#lturno').text('Mañana');
 
    }
  else
    { 
      $('#lturno').text('Tarde');

    }
 }


function trae_cobros(tipooperacion,letras) {
	 	//por fecha
    usuario=sessionStorage.getItem('Usuario');
    console.log("Usuario ",usuario);
	 		$("#tabla tbody").html("");
      var linea ='';
   		$.ajax({
                      type: "POST",
                      url:"../cobros/cobros.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras, caracteres2: usuario},
                      dataType: "json",
                      async: false,
                      success: function(cobros){
         							    for (var i in cobros){
                          if (i >= 0)
                           {
                              var uncobro = cobros[i];
                              var fecha=convertDateFormat(uncobro.fecha);
                              linea="<tr><td>" + uncobro.id+"</td><td>"+ fecha+"</td><td>"+uncobro.turno+"</td><td>"+uncobro.talonario+"</td><td>"+uncobro.ticket_desde+"</td><td>"+uncobro.ticket_hasta+"</td><td>"+uncobro.concepto+"</td><td>"+uncobro.monto+ "</td> <td>";
                             /*  if (usuario==7 || usuario==1) 
                              {//admin o anabella
                                linea=linea+"<a href='#' onclick='borra_cobro("+uncobro.id+")'><i class=\"icon-trash\"></i></a> "
                              } */
                              linea=linea+"</td></tr>";
                              $("#tabla tbody").append(linea); 
                              //<td><a href='#' onclick='modifica_cobro("+JSON.stringify(uncobro)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_cobro("+uncobro.id+")'><i class=\"icon-trash\"></i></a> </td>"

      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};
//no se utiliza, se traen los pagos desde reporte
/* function total_cobros(tipooperacion,letras,usuario) {
  $.ajax({
                 type: "POST",
                 url:"../cobros/cobros.php",
                 data: {accion:4, operacion:tipooperacion, caracteres:letras, usuario:usuario},
                 dataType: "json",
                 async: false,
                 success: function(cobro){
                  const importeTotal = cobro[0].total;
                  console.log('Importe Cobros ',importeTotal);
                  // Verificamos si el valor es nulo o undefined
                  const valorAsignar = importeTotal != null ? importeTotal : 0;
                  // Asignamos el valor al label
                  document.getElementById('importecobros').textContent = valorAsignar;     
                  console.log('Total cobros ', valorAsignar);                
                 },
                 error: function (obj, error, objError){
                  console.error('Error al realizar la petición AJAX');
                  document.getElementById('importecobros').textContent = 0;
                 }
       });
}; */

function trae_cobros2(fecha1,fecha2)
{     
      $("#tablacobros tbody").html("");
      var totalmonto=0;
      
      $.ajax({
                      type: "POST",
                      url:"../cobros/cobros.php",
                      data: {accion:4, operacion:3, fecha1:fecha1, fecha2:fecha2},
                      dataType: "json",
                      async: false,
                      success: function(cobros){
                        for (var i in cobros){
                          //falta poner texto si no hay cobros
                          
                           if (i >= 0)
                           {
                             // va a ver que discriminar termas aparte 
                              var uncobro = cobros[i];
                              var fecha=convertDateFormat(uncobro.fecha);
                              var montoactual=parseFloat(uncobro.monto);
                              totalmonto=totalmonto+montoactual;
                              $("#tablacobros tbody").append("<tr><td>" +uncobro.id+"</td><td>"+ fecha+"</td><td>"+uncobro.concepto+"</td><td>"+uncobro.talonario+"</td><td>"+uncobro.ticket_desde+'-'+uncobro.ticket_hasta+"</td><td style='float:right'>"+uncobro.monto+"</td><td>"+uncobro.usuario+ "</td> <td></td></tr>"); 
                           } 
                          }
                          document.getElementById("totalcobros").innerHTML = totalmonto;  
                          document.getElementById("cobrosx").value = totalmonto;  
                      },
                      error: function (obj, error, objError){
                            alert(error);//avisar que ocurrió un error
                      }
            });
}



/* function borra_pago_cobro(id){
//se cambia de estado el pago
 if (window.confirm("Desea realmente anular este pago"))
 {
 		$.ajax({
                  
                      type: "POST",
                      url:"../cobros/cobros.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: false,
                      success: function(pagos){
 							            if (pagos.error == 0){
                            trae_pagos_cobros();
                          }
                          else{
                            alert(pagos.valor);
                          }
 							
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
  }
};	 */


function blanquea_cobro(){
   
    // limpiar formulario
    $("#fecha_cobro").val('');
    //$("#lturno").text('');
    $("#tipo_cobro").val('');
    $("#monto").text('');
    $("#talonario").val('');
    $("#ticket_desde").val('');
    $("#ticket_hasta").val('');
    $("#observaciones").val('');
    $("#efectivo").val('');
    
  };

function limpia_busqueda(){
  
    // limpiar formulario
    //$("#buscatipocobro").val('');
   };

function agrega_cobro(d){
    blanquea_cobro();
    $("#idcobro").val('0');
    var hoy=new Date();
    var fechahoy=armaFecha2(hoy);
    $("#fecha_cobro").text(fechahoy);
    $("#tipo_cobro").focus();
    ultimoticket().then(function(ultimo) {
         $("#desde_ticket").val(parseInt(ultimo)+1);
});
}

/* 
function modifica_cobro(cobro){
   //no se utiliza
    
    blanquea_cobro();
    $("#idcobro").val((cobro.id).toString());
    $("#fecha_cobro").text(convertDateFormat(cobro.fecha));
    if (cobro.turno==1)
        $("#lturno").text("Mañana")
    else 
      if (cobro.turno==2)
         $("#lturno").text("Tarde");   
    
    $("#tipo_cobro").val(cobro.id_tipocobro);
    $("#monto").text(cobro.monto);
    $("#forma_pago").val(cobro.forma_pago);
    $("#observaciones").val(cobro.observaciones);
    document.getElementById("mostrar-modal").checked =true;
};*/

/* function ultimocobro(){
return new Promise(function(resolve, reject) {
      $.ajax({
                  
                      type: "POST",
                      url:"../cobros/cobros.php",
                      data: {accion:4, operacion:2},
                      dataType: "json",
                      async: false,
                      success: function(cobros){
                          
                          if (cobros.error==1)
                          {
                            resolve(0);
                          }
                          else 
                            {
                              console.log("El ultimo cobro fue ",cobros[0].ultimo);
                              resolve(cobros[0].ultimo);
                           }
                      },
                      error: function (obj, error, objError){
                          
                          reject(alert(error));//avisar que ocurrió un error
                          
                      }
            });
     });
}; */



function guarda_cobro() {
  if (window.confirm("Desea realmente confirmar el COBRO ?")) {
            let datos_enviados=false;
            var usuario=sessionStorage.getItem('Usuario');
            
            if (($("#turno").val()!='') &&  ($("#efectivo").val()!='') && ($("#tipo_cobro").val()!='') && !datos_enviados )
              {
                datos_enviados=true;
                var datos = $("form").serialize();
                var fecha_cobro = $("#fecha_cobro").text();
                var monto =parseFloat($("#total").text());
                datos=datos+"&fecha_cobro="+fecha_cobro+"&idusuario="+usuario;
                var id= $("#idcobro").val();
                //se evalua si se esta registrando un nuevo tipo_cobro (1) o se esta modificando uno ya existente (2)
                 if (id==0) {
                 		var ac=1;}
                else {
                		var ac=2;};
                datos = datos +"&idcobro="+id+ "&accion="+ac;
                $.ajax({      
                          type: "post",
                          url:"../cobros/cobros.php",
                          data:datos,
                          dataType: "json",
                          async: false,
                          success: function(cobro){
                                        if (cobro["error"]==0) {
                                           document.getElementById("cerrar-modal").checked =true;
/*
                                           //imprime pago
                                           var idcobro= ultimocobro().then(r =>{
                                              console.log("id Cobro ",r);
                                              window.open("../cobros/imprimecobro.html?variable="+r,"_blank") 
                                           
                                            }).catch(() => {
                                                    console.log('Algo salió mal');
                                            });  
*/
                                           trae_cobros(0, "");
                                        } 
                                        else{
                                            alert(cobro["valor"]);
                                            
                                        };                  
                          },
                    
                          error: function (obj, error, objError){
                              console.log(error);
                              alert(error);//avisar que ocurrió un error
                          }
                    });
            }
            else
               alert('Complete el turno, cobro e importe, por favor');
  }
};

function busca_cobros(){

      var turno=$("#buscaturno").val();
      var fecha=$("#buscafecha").val();
      console.log("Turno ", turno);
      console.log("Fecha ", fecha);
      trae_cobros(1,fecha);
};


function calculamonto(tipo_cobro)
{
  var importe=obtiene_monto_tipo(tipo_cobro).then(r =>{
  // controlar que haya valores de tickets
        var monto= r;
        $("#monto").text(monto);
        var cantidad=0;
        var hasta=parseInt($("#hasta_ticket").val());
        var desde=parseInt($("#desde_ticket").val());
        cantidad=hasta-desde+1;
        var importe=cantidad*monto;
        $("#importe").text(importe);
        $("#efectivo").val(importe);
        $("#debito").val(0);


  }).catch(() => {
                  console.log('Algo salió mal');
                 });  
                                                
}


function imprime_cobro(idcobro) {
      //primero busca los datos del cboro
      $.ajax({
                      type: "POST",
                      url:"../cobros/cobros.php",
                      data: {accion:4, operacion:4, caracteres:idcobro},
                      dataType: "json",
                      async: false,
                      success: function(cobros){
 
                              var uncobro = cobros[0];
                              var fecha=convertDateFormat(uncobro.fecha);
                              if (uncobro.turno== '1')
                                { 
                                  var turno='1- Mañana';
                                }
                              else
                                { 
                                  var turno='2- Tarde';
                                }
                              
                              var detalle='Talonario: '+uncobro.talonario+' Tickets: '+uncobro.ticket_desde+ '-' +uncobro.ticket_hasta;

                              if (uncobro.observaciones != '')
                                {
                                  detalle=detalle+'  '+uncobro.observaciones;
                                } return
                              //original
                              console.log(uncobro.id);
                              document.getElementById("idcobro").textContent=uncobro.id;
                              document.getElementById("fecha").textContent=fecha;
                              document.getElementById("turno").textContent=turno;
                              document.getElementById("concepto").textContent=uncobro.concepto;
                              document.getElementById("usuario").textContent=uncobro.usuario;
                              document.getElementById("observaciones").textContent=detalle;
                              document.getElementById("total").textContent=uncobro.monto;
                              
                              //duplicado
                               document.getElementById("idcobrod").textContent=uncobro.id;
                              document.getElementById("fechad").textContent=fecha;
                              document.getElementById("turnod").textContent=turno;
                              document.getElementById("conceptod").textContent=uncobro.concepto;
                              document.getElementById("usuariod").textContent=uncobro.usuario;
                              document.getElementById("observacionesd").textContent=detalle;
                              document.getElementById("totald").textContent=uncobro.monto;
                              
                              
                              
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
  
};

function trae_pagos_cobros() {
   $("#tabla tbody").html("");
   var linea ='';
    $.ajax({
                   type: "POST",
                   url:"../cobros/cobros.php",
                   data: {accion:4, operacion:7},
                   dataType: "json",
                   async: false,
                   success: function(pagos){
                        for (var i in pagos){
                       if (i >= 0)
                        {
                           var unpago = pagos[i];
                           var fecha=convertDateFormat(unpago.fecha);
                           linea="<tr><td>" + unpago.id+"</td><td>"+ fecha+"</td><td>"+unpago.importe+"</td><td>"+unpago.forma_pago+"</td><td><a href='#' onclick='borra_pago_cobro("+unpago.id+")'><i class=\"icon-trash\"></i></a></td></tr>";
                           $("#tabla tbody").append(linea); 
                          }
                           
                        } 
                       
                   },
                   error: function (obj, error, objError){
                       alert(error);//avisar que ocurrió un error
                       
                   }

         });
};


function ultimoticket() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: "POST",
      url: "../cobros/cobros.php",
      data: { accion: 4, operacion: 8 },
      dataType: "json",
      success: function(response) {
        if (response.error == 1) {
          
          resolve(0);
        } else {
          
          resolve(response[0].ultimo);
        }
      },
      error: function(xhr, status, error) {
        console.error("Error en AJAX:", status, error);
        reject(error);
      }
    });
  });
}

