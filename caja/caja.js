/*Version: 3.0*/

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};
  


function trae_pagos(tipooperacion,letras) {


	 		blanquea();
      var cantefectivo=0;
      var cantdebito=0;
	 		$("#tablapagos tbody").html("");
	    document.getElementById("texto").innerHTML = ""; 
      var usuario=sessionStorage.getItem('Usuario');
      $(".tiempo").show();
   		$.ajax({
                  
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras, idusuario: usuario},
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
                              var localidad='';
                              if (unpago.ciudad != null)
                              { 
                                localidad=unpago.nombreciudad;
                              }
                              else
                              {
                                localidad=unpago.dciudad;
                              }
                              if (unpago.nombreprovincia != null)
                              {
                                localidad=localidad+' '+unpago.nombreprovincia;
                              }  
                              if (unpago.forma_pago=='E') {
                                cantefectivo++;
                              }
                              else 
                                if (unpago.forma_pago=='D') {
                                  cantdebito++;
                                }

                              var adicionales= parseFloat(unpago.adicional)+parseFloat(unpago.adicional2)+parseFloat(unpago.adicional3);
                              var fila="<tr><td>" + unpago.id + "</td><td  style='text-align: center;'>"+unpago.idparcela+ "</td><td  style='text-align: center;'>"+unpago.nrocarpa+"</td><td>"+unpago.idestadia+"</td><td>"+fechad + " " + fechah +"</td><td>"+unpago.apellido +" "+unpago.nombres+"</td><td>"+localidad+"</td><td style='text-align: center;'>"+unpago.cantidad_personas+"</td><td style='text-align:right'>"+monto+"</td><td style='text-align:right'>"+adicionales+"</td><td style='text-align:right'>"+unpago.descuento+"</td><td style='text-align:right'>"+unpago.total+"</td><td  style='text-align: center;'>"+unpago.forma_pago+"</td>"
                              
                              fila=fila+"<td>"+unpago.usuario+"</td><td><a href='#' onclick='modifica_formapago("+unpago.id+","+JSON.stringify(unpago.forma_pago)+")'><i class=\"icon-pencil\"></i></a></td>";
                              fila=fila+"</tr>";
                          
                              $("#tablapagos tbody").append(fila); 
                              
        						    	}; 
                          console.log("Efectivo ",cantefectivo);
                          $('#cantidadpagos').text(cantefectivo+cantdebito);
                          $('#cantidadefectivo').text(cantefectivo);
                          $('#cantidaddebito').text(cantdebito);
                          //trae cobros
                          let suboperacion=5;
                          if (tipooperacion==2) {suboperacion=6;}
                          total_cobros(suboperacion,letras,usuario);
                          calcula_subtotale(letras,tipooperacion);//calcula subtotal efectivo
                          calcula_subtotald(letras,tipooperacion);//calcula subtotal debito
                          calcula_subtotalt(letras,tipooperacion);//calcula subtotal debito
                          calcula_total(letras,tipooperacion);  
                          trae_devoluciones_caja(tipooperacion,letras,usuario); 
                         
	                      }
                      else{
                          document.getElementById("texto").innerHTML = "No se encontraron resultados";  
                          document.getElementById("subtotale").innerHTML = "0";  
                          document.getElementById("subtotald").innerHTML = "0";  
                          document.getElementById("total").innerHTML = "0";  
                          $("#subtotalx").val(0);
                          document.getElementById("totalfinal").innerHTML = "0";  


                        }
                        $(".tiempo").hide();
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};


function trae_pagos2(fecha1,fecha2) {
      //trae pagos de carpas entre fechas
      $("#tablapagos tbody").html("");
      document.getElementById("texto").innerHTML = ""; 
      let parcelasocupadas=0;
      let acampantes=0;
      var subtotale=0;
      var subtotald=0;
      var total=0;
      var cantefectivo=0;
      var cantdebito=0;
      var  cantidadacampantes=0;
      $(".tiempo").show();
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:11, fecha1:fecha1,fecha2:fecha2},
                      dataType: "json",
                      async: false,
                      success: function(pagos){
                        if (pagos.error==undefined){
                          
                          for (var i in pagos){
                       
                              var unpago = pagos[i];
                              var fechad= convertDateFormat(unpago.fecha_ingreso);
                              var fechah= convertDateFormat(unpago.fecha_egreso);

                              parcelasocupadas=parcelasocupadas+1;
                              console.log("parcelas ocupadas ",parcelasocupadas);
                              cantidadacampantes=parseInt(unpago.cantidad_personas);
                              console.log("Acampantes ",cantidadacampantes);
                              acampantes=acampantes+cantidadacampantes;
                              console.log("Total acampantes ",acampantes, "  cantidad parcelas ",parcelasocupadas);
                              var fechad0=unpago.fecha_ingreso;
                              var fechah0=unpago.fecha_egreso;
                              var fechad1= new Date(fechad0);
                              var fechah1= new Date(fechah0);
                              var fechaDesde = fechad1.getTime();
                              var fechaHasta    = fechah1.getTime();
                              console.log("fecha desde ",fechaDesde);
                              console.log("fecha hasta  ",fechaHasta);
                              var diff = fechaHasta - fechaDesde;
                              var dias=diff/(1000*60*60*24);
                              var monto= unpago.importe *dias;

                              if (unpago.forma_pago=='E')
                                {
                                 subtotale=subtotale+parseFloat(unpago.total);
                                 cantefectivo=cantefectivo+1;
                                }                                    
                              if (unpago.forma_pago=='D')
                                {
                                  subtotald=subtotald+parseFloat(unpago.total);
                                  cantdebito=cantdebito+1;
                                }                                    
                              console.log(unpago);
                              var adicionales= parseFloat(unpago.adicional)+parseFloat(unpago.adicional2)+parseFloat(unpago.adicional3);
                              var fila="<tr><td>" +unpago.id+"</td><td style='text-align: center;'>"+ unpago.idparcela + "</td><td style='text-align: center;'>"+unpago.nrocarpa+"</td><td>"+fechad + " " + fechah +"</td><td>"+unpago.apellido +" "+unpago.nombres+"</td><td>"+unpago.ciudad+' '+unpago.nombreprovincia+"</td><td  style='text-align: center;'>"+unpago.cantidad_personas+"</td><td style='text-align:right'>"+monto+"</td><td style='text-align:right'>"+adicionales+"</td><td style='text-align:right'>"+unpago.descuento+"</td><td style='text-align:right'  >"+unpago.total+"</td><td  style='text-align: center;'>"+unpago.forma_pago+"</td>"
                              
                              fila=fila+"<td>"+unpago.usuario+"</td><td><a href='#' onclick='modifica_formapago("+unpago.id+","+JSON.stringify(unpago.forma_pago)+")'><i class=\"icon-pencil\"></i></a></td>";
                              fila=fila+"</tr>";
                              
                              $("#tablapagos tbody").append(fila); 
                              }
                                 
                        
                          //calcula_subtotale_fechas(fecha1,fecha2);//calcula subtotal efectivo
                          //calcula_subtotald_fechas(fecha1,fecha2);//calcula subtotal debito
                          //calcula_total_fechas(fecha1,fecha2);  
                          var total=subtotale+subtotald;
                          var registros=cantefectivo+cantdebito;
                          document.getElementById("cantidadpagos").textContent = registros.toLocaleString(undefined, {
                            minimumFractionDigits: 0, maximumFractionDigits: 0,});

                          document.getElementById("cantidadefectivo").textContent = cantefectivo.toLocaleString(undefined, {
                            minimumFractionDigits: 0, maximumFractionDigits: 0,});
                          
                          document.getElementById("cantidaddebito").textContent = cantdebito.toLocaleString(undefined, {
                              minimumFractionDigits: 0, maximumFractionDigits: 0,});
                            

                          document.getElementById("subtotale").textContent = subtotale.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
                          console.log('Subtotal ',subtotale.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,}));
                          document.getElementById("subtotald").textContent = subtotald.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
                          document.getElementById("total").textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
                          $("#subtotalx").val(total);
                          
                          //document.getElementById("totalfinal").textContent = total.toLocaleString(undefined, {
    //minimumFractionDigits: 2, maximumFractionDigits: 2,});  


                          //console.log("Total acampantes ",acampantes, "  cantidad parcelas ",parcelasocupadas);
                          document.getElementById("totalacampantes").innerHTML = acampantes;  
                          document.getElementById("totalparcelas").innerHTML = parcelasocupadas;  
                        
                        }
                      else{
                          document.getElementById("texto").innerHTML = "No se encontraron resultados";  
                          document.getElementById("subtotale").innerHTML = "0";  
                          document.getElementById("subtotald").innerHTML = "0";  
                          document.getElementById("total").innerHTML = "0";  
                          $("#subtotalx").val(0);
                          document.getElementById("totalfinal").innerHTML = "0";  


                        }
                        $(".tiempo").hide();  
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};


function modifica_formapago(idpago,forma)
{
  var fecha=$("#buscafecha").val();
  var formanueva='';
  
  if (confirm("Realmente desea cambiar la forma de pago?"))
  {    
    if (forma=='E')
        formanueva='D'
    else
        formanueva='E';
    
    datos="idpago="+idpago+"&forma_pago="+formanueva+"&accion=5";
    console.log("Datos ",datos);
    $.ajax({
                        type: "POST",
                        url:"../caja/caja.php",
                        data: datos,
                        dataType: "json",
                        async: true,
                        success: function(pagos){
                               console.log("se cambio ");
                                trae_pagos(2,fecha);
                                trae_devoluciones_caja(2,fecha); //desde caja*/
                            
                        },
                        error: function (obj, error, objError){
                            alert(error);//avisar que ocurrió un error
                            
                        }
              });
  }

};

function imprimecaja(fecha)
{
  if (fecha!='')
    window.open("imprimecaja.html?variable="+fecha, "_blank")
  else 
  {
    var f = new Date();
    y = f.getFullYear();
    m = f.getMonth() + 1;
    d = f.getDate();
    var hoy=y + "-" + m + "-" + d;
    window.open("imprimecaja.html?variable="+hoy, "_blank")
  }  
}

function imprimecajatotal(fecha)
{
  if (fecha!='')
    window.open("imprimecajatotal.html?variable="+fecha, "_blank")
  else 
  {
    var f = new Date();
    console.log("FEcha hoy ",f);
    y = f.getFullYear();
    m = f.getMonth() + 1;
    d = f.getDate();
    var hoy=y + "-" + m + "-" + d;
    window.open("imprimecajatotal.html?variable="+hoy, "_blank")
  }  
}


function calcula_subtotale(dia,tipooperacion) {

  //si tipooperacion es 1, es una caja individual, si tipo operaccion es 2, es todos los pagos del dia
      var operacion=0;

      console.log("tipo operacion ",tipooperacion);
      if (tipooperacion==1)
          operacion=6
      else operacion=8;
      usuario = sessionStorage.getItem('Usuario');
      console.log("Calcula subtotal en efectivo");
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:operacion, caracteres:dia, idusuario:usuario},
                      dataType: "json",
                      async: false,
                      success: function(pagos){
                          if (pagos.error==undefined){  
                              var total = parseFloat(pagos[0].total);
                              console.log("Subtotal efectivo ", total, " formateado ",total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2,}));
                              //modificacion por parrillas 24/12
                               var importecobros = parseFloat(document.getElementById("importecobros").textContent);
                              if (importecobros >0) {
                                total=total+importecobros;
                              } 
                              //fin modificacion por parrillas
                              document.getElementById("subtotale").textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
                              
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

function calcula_subtotale_fechas(fecha1,fecha2) {
  
  //
      usuario = sessionStorage.getItem('Usuario');
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:12, fecha1:fecha1, fecha2:fecha2},
                      dataType: "json",
                      async: false,
                      success: function(pagos){
                          if (pagos.error==undefined){  
                              var total = parseFloat(pagos[0].total);
                              document.getElementById("subtotale").textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
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

function calcula_subtotald(dia,tipooperacion) {
//si tipooperacion es 1, es una caja individual, si tipo operaccion es 2, es todos los pagos del dia
      var operacion=0;
      if (tipooperacion==1)
          operacion=7
      else operacion=9;
      usuario = sessionStorage.getItem('Usuario');  
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:operacion, caracteres:dia, idusuario:usuario},
                      dataType: "json",
                      async: false,
                      success: function(pagos){
                          if (pagos.error==undefined){  
                              var total = parseFloat(pagos[0].total);
                              document.getElementById("subtotald").textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
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

function calcula_subtotalt(dia,tipooperacion) {
  //si tipooperacion es 1, es una caja individual, si tipo operaccion es 2, es todos los pagos del dia
        var operacion=0;
        /*if (tipooperacion==1)
            operacion=7
        else operacion=9;*/
        operacion=17;
        usuario = sessionStorage.getItem('Usuario');  
        $.ajax({
                        type: "POST",
                        url:"../caja/caja.php",
                        data: {accion:4, operacion:operacion, caracteres:dia, idusuario:usuario},
                        dataType: "json",
                        async: false,
                        success: function(pagos){
                            if (pagos.error==undefined){  
                                var total = parseFloat(pagos[0].total);
                                document.getElementById("subtotalt").textContent = total.toLocaleString(undefined, {
      minimumFractionDigits: 2, maximumFractionDigits: 2,});
                               
                            }
                            else
                                {
                                  document.getElementById("subtotalt").textContent = '0';
                                  
                                }                              
      
                        },
                        error: function (obj, error, objError){
                            alert(error);//avisar que ocurrió un error
                            
                        }
              });
  };
  

function calcula_subtotald_fechas(fecha1,fecha2) {
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:13, fecha1:fecha1, fecha2:fecha2},
                      dataType: "json",
                      async: false,
                      success: function(pagos){
                          if (pagos.error==undefined){  
                              var total = parseFloat(pagos[0].total);
                              document.getElementById("subtotald").textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
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

function calcula_total(dia,tipooperacion) {
//si tipooperacion es 1, es una caja individual, si tipo operaccion es 2, es todos los pagos del dia
      var operacion=0;
      if (tipooperacion==1)
          operacion=5
      else operacion=10;
       usuario = sessionStorage.getItem('Usuario');
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:operacion, caracteres:dia, idusuario:usuario},
                      dataType: "json",
                      async: false,
                      success: function(pagos){
                            if (pagos.error==undefined){  
                              var total = parseFloat(pagos[0].total);
    
                                  //modificacion por parrillas 24/12
                                  // var importecobros = parseFloat(document.getElementById("importecobros").textContent);
                                  // if (importecobros >0) {
                                  //   total=total+importecobros;
                                  // }

                                  //fin modificacion por parrillas
                                  
                              document.getElementById("total").textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});



                              $("#subtotalx").val(total);
                              document.getElementById("totalfinal").textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
                              console.log("Subtotal Efectivo+Debito ", total);
                              calcula_totalfinal();

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

function calcula_total_fechas(fecha1,fecha2) {
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:14, fecha1:fecha1,fecha2:fecha2},
                      dataType: "json",
                      async: false,
                      success: function(pagos){
                            if (pagos.error==undefined){  
                              var total = parseFloat(pagos[0].total);
                              document.getElementById("total").textContent = total;
                              $("#subtotalx").val(total);
                              
                              document.getElementById("totalfinal").textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
                              
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

function calcula_totalfinal()
{
    console.log("entro a total final");
    var subtotal=  $("#subtotalx").val();
    console.log("Subtotal ",subtotal);
    var devoluciones = $("#devolucionx").val();
    if (devoluciones=='')
      {
        devoluciones=0;
      }

    console.log("Devoluciones ",devoluciones);
    var totalfinal= parseFloat(subtotal)-parseFloat(devoluciones);
    console.log("Total final ",totalfinal);
    document.getElementById("totalfinal").textContent= totalfinal.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
    
}


function blanquea(){
    console.log("Blanquea formulario")
    // limpiar formulario
 
  };

                                        
function guarda_pago(idestadia, forma_pago, total) {
                console.log("Guarda el pago de la estadia");
             		var ac=1;
                usuario = sessionStorage.getItem('Usuario');
                var hoy=new Date();
                console.log("Hoy ", hoy);
                mes = '' + (hoy.getMonth() + 1);
                dia = '' + hoy.getDate();
                anio = hoy.getFullYear();
                console.log("mes ",mes, " dia ",dia," anio ",anio);
                if (mes.length < 2) 
                {
                    console.log("mes chico");
                    mes = '0' + mes;
                };
                if (dia.length < 2) 
                {   
                  console.log("Dia chico")
                  dia = '0' + dia;
                };
                var fecha_hoy=anio+'-'+mes+'-'+dia;
                var datos = "idestadia="+idestadia+"&forma_pago="+forma_pago+"&fecha="+fecha_hoy+"&total="+total+"&accion="+ac+"&idusuario="+usuario;
                console.log(datos);
                $.ajax({      
                          type: "post",
                          url:"../caja/caja.php",
                          data:datos,
                          dataType: "json",
                          async: false,
                    
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
        //trae_devoluciones_caja(1,texto);
};


function filtrartotal(texto) {
 // blanqueamos
 console.log("filtra ",texto);
 blanquea();
 trae_pagos(2,texto)
 trae_devoluciones_caja(2,texto);
         
};




function imprimecajanueva(fecha){
  replaceAll(fecha, '-', '')

  window.open("imp_reporte_caja.html?fdesde="+fecha+"&fhasta="+fecha);
  
}



function imprimereporte(fdesde,fhasta,usuario){

  window.open("imp_reporte_caja.html?fdesde="+fdesde+"&fhasta="+fhasta+"&idusuario="+usuario);
  
}




