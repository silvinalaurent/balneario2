/*Version: 3.0*/

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};


  

function recaudacion_mensual(tipooperacion,letras) {
	 		blanquea();
	 		$("#tablarecaudacion tbody").html("");
	    document.getElementById("texto").innerHTML = ""; 
   		$.ajax({
                  
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: false,
                      success: function(pagos){
                        if (pagos.error==undefined){
        							   
                          for (var i in pagos){
        					     
                              var unpago = pagos[i];
                              var fechad= convertDateFormat(unpago.fecha_ingreso);
                              var fechah= convertDateFormat(unpago.fecha_egreso);

                              var fechad0=unpago.fecha_ingreso;
                              var fechah0=unpago.fecha_egreso;
                              var fechad1= new Date(fechad0);
                              var fechah1= new Date(fechah0);
                              var fechaDesde = fechad1.getTime();
                              var fechaHasta    = fechah1.getTime();
                              var diff = fechaHasta - fechaDesde;
                              var dias=diff/(1000*60*60*24);
                              var monto= unpago.importe *dias;

                              console.log(unpago);
                              var adicionales= parseFloat(unpago.adicional)+parseFloat(unpago.adicional2)+parseFloat(unpago.adicional3);
                              $("#tablapagos tbody").append("<tr><td>" + unpago.idparcela + "</td><td>"+fechad + " " + fechah +"</td><td>"+unpago.apellido +" "+unpago.nombres+"</td><td>"+unpago.descripcion+"</td><td>"+unpago.cantidad_personas+"</td><td>"+monto+"</td><td>"+adicionales+"</td><td>"+unpago.descuento+"</td><td>"+unpago.total+"</td><td>"+unpago.forma_pago+"</td> </tr>"); 
                              
        						    	}; 
                        calcula_subtotale(letras);//calcula subtotal efectivo
                        calcula_subtotald(letras);//calcula subtotal debito
                        
                        calcula_total(letras);  
                        
	                      }
                      else{
                          document.getElementById("texto").innerHTML = "No se encontraron resultados";  
                          document.getElementById("subtotale").innerHTML = "0";  
                          document.getElementById("subtotald").innerHTML = "0";  
                          document.getElementById("total").innerHTML = "0";  
                          $("#subtotalx").val(0);
                          document.getElementById("totalfinal").innerHTML = "0";  


                        }
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};

function imprimecaja(fecha)
{
  if (fecha!='')
    window.open("imprimecaja.html?variable="+fecha, "_blank")
  else 
  {
    var f = new Date();
    console.log("FEcha hoy ",f);
    y = f.getFullYear();
    m = f.getMonth() + 1;
    d = f.getDate();
    var hoy=y + "-" + m + "-" + d;
    window.open("imprimecaja.html?variable="+hoy, "_blank")
  }  
}



function calcula_subtotale(dia) {
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:6, caracteres:dia},
                      dataType: "json",
                      async: true,
                      success: function(pagos){
                          if (pagos.error==undefined){  
                              var total = pagos[0].total;
                              document.getElementById("subtotale").textContent = total;
                              console.log("Subtotal Efectivo ", total);
                              }    
                              else
                              {
                                document.getElementById("subtotale").textContent = '0';
                              }                              
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }
            });
};

function calcula_subtotald(dia) {
      
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:7, caracteres:dia},
                      dataType: "json",
                      async: true,
                      success: function(pagos){
                          if (pagos.error==undefined){  
                              var total = pagos[0].total;
                              document.getElementById("subtotald").textContent = total;
                              console.log("Subtotal Debito ", total);
                          }
                          else
                              {
                                document.getElementById("subtotald").textContent = '0';
                                
                              }                              
    
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }
            });
};

/////Calcula total de devoluciones entre dos fechas
function calcula_devoluciones_fechas(fecha1,fecha2) {
      console.log("entra a calcula_devoluciones_fecha");
      $.ajax({
                      type: "POST",
                      url:"../devoluciones/devoluciones.php",
                      data: {accion:4, operacion:12, fecha1:fecha1,fecha2:fecha2},
                      dataType: "json",
                      async: false,
                      success: function(devoluciones){
                            if (devoluciones.error==undefined){  
                              var total = devoluciones[0].total;
                              document.getElementById("devoluciones").textContent = total;
                              $("#devolucionx").val(total);
                              console.log("Devoluciones ", total);
                              
                            }
                            else
                              {
                                document.getElementById("devoluciones").textContent = '0';
                                ("#devolucionx").val('0');
                              }                              

                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};


function calcula_total(dia) {
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:5, caracteres:dia},
                      dataType: "json",
                      async: true,
                      success: function(pagos){
                            if (pagos.error==undefined){  
                              var total = pagos[0].total;
                              document.getElementById("total").textContent = total;
                              $("#subtotalx").val(total);
                              document.getElementById("totalfinal").textContent = total;
                              console.log("Subtotal Efectivo+Debito ", total);
                            }
                            else
                              {
                                document.getElementById("total").textContent = '0';
                                ("#subtotalx").val('0');
                              }                              

                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};

/*function calcula_total(dia) {
 return new Promise(function(resolve, reject) {
     
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:5, caracteres:dia},
                      dataType: "json",
                      async: true,
                      success: function(pagos){
 
                              var total = pagos[0].total;
                              document.getElementById("total").textContent = total;
                              
                               $("#subtotalx").val(total);
                               resolve(true);
                          
                      },
                      error: function (obj, error, objError){
                          reject(alert(error));//avisar que ocurrió un error
                          
                      }

            });
       });
};*/
function calcula_totalfinal()
{
    console.log("entro a total final");
    var subtotal=  $("#subtotalx").val();
    console.log("Subtotal ",subtotal);
    var devoluciones = $("#devolucionx").val();
    console.log("Devoluciones ",devoluciones);
    var totalfinal= parseFloat(subtotal)-parseFloat(devoluciones);
    document.getElementById("totalfinal").textContent= totalfinal;
}

/*
function borra_pago(id){

 		$.ajax({
                  
                      type: "POST",
                      url:"../pagoes/pagoes.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: true,
                      success: function(pagoes){
 							            if (pagoes.error == 0){
                            trae_pagoes(0,"");
                            
       
                          }
                          else{
                            alert(pagoes.valor);
                          }
 							
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
};	

*/
function blanquea(){
    console.log("Blanquea formulario")
    // limpiar formulario
  /*  document.getElementById("subtotale").innerHTML = "0";  
    document.getElementById("subtotald").innerHTML = "0";  
    document.getElementById("total").innerHTML = "0";  
    $("#subtotalx").val(0);
    document.getElementById("devoluciones").innerHTML = "0";  
    $("#devolucionx").val(0);
    document.getElementById("totalfinal").innerHTML = "0";  
    */
  };

/*
function limpia_busqueda(){
  
    // limpiar formulario
    $("#buscapago").val('');
   };

function agrega_pago(d){
    blanquea_formulario();
    $("#nombre").focus();
    $("#idpago").val('0');
    $("#buscaprovincia").val('-1');
    //setTimeout(function() {initialize();}, 2000);  
};


function modifica_pago(pago){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar pago, evento css
    
    blanquea_formulario();
    $("#idpago").val((pago.id).toString());
    $("#nombre").val(pago.pago);
    $("#buscaprovincia").val(pago.idprovincia);
    document.getElementById("mostrar-modal").checked =true;
};

*/
   
                                        
function guarda_pago(idestadia, forma_pago, total) {
            
             		var ac=1;
               
                datos = "idestadia="+idestadia+"&forma_pago="+forma_pago+"&total="+total+"&accion="+ac;
                console.log(datos);
                $.ajax({      
                          type: "post",
                          url:"../caja/caja.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(pagos){
                                 
                                        if (pagos["error"]==0) {

                                           console.log("Pago registrado");
                                        } 
                                        else{
                                            alert(pagos["valor"]);
                                            
                                        };                  
                          },
                    
                          error: function (obj, error, objError){
                              alert(error);//avisar que ocurrió un error
                              
                          }

                    });
            }
            

function filtrar(texto) {
  // blanqueamos
        console.log("filtra ",texto);
        blanquea();
        trae_pagos(1,texto)
        trae_devoluciones_caja(1,texto);
};


