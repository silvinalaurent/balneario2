/*Version: 3.0*/

function trae_rendiciones(fecha1,fecha2)
{     
  if (fecha1<=fecha2){
                          $(".tiempo").show();
                          trae_cobros2(fecha1,fecha2);
                          trae_pagos2(fecha1,fecha2);
                          trae_devoluciones2(fecha1,fecha2);
                          //demoramos un rato para que esten todos los resultados en sus lugares  
                          setTimeout(function(){
                              var efectivo =  $("#subtotale").text();
                              var debito=  $("#subtotald").text();
                              console.log("subtotales ",efectivo,debito);
                              var subtotal=  $("#subtotalx").val();
                              var cobros = $("#cobrosx").val();
                              var pagosefectivo= parseFloat(efectivo)+parseFloat(cobros);
                              var devoluciones = $("#devolucionx").val();
                              if (devoluciones==='')
                                {devoluciones=0;}
                              devoluciones=parseFloat(devoluciones);
                              var totalfinal= parseFloat(subtotal)+parseFloat(cobros)-parseFloat(devoluciones);
                              //$("#totalfinal").text(totalfinal.toLocaleString(undefined, {
                              //    minimumFractionDigits: 2,maximumFractionDigits: 2}));
                              //Resumen General
                              $("#efectivo").text(pagosefectivo.toLocaleString(undefined, {
                                minimumFractionDigits: 2,maximumFractionDigits: 2}));
                              $("#debito").text(debito.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,maximumFractionDigits: 2}));
                              $("#devoluciones2").text(devoluciones.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,maximumFractionDigits: 2}));
                              $("#total_general").text(totalfinal.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,maximumFractionDigits: 2}));
        
                              $(".tiempo").hide();
                          }, 3000);
                         
                        }            
                        else{
                          alert("La fecha de inicio debe ser menor que la fecha de fin");
                        };  

                          
};

function total_entradas(fecha1,fecha2)
{
   $.ajax({
                  
                      type: "POST",
                      url:"../cobros/cobros.php",
                      data: {accion:4, operacion:4, fecha1:fecha1, fecha2:fecha2},
                      dataType: "json",
                      async: false,
                      success: function(cobros){
                        var uncobro = cobros[0];
                        console.log(uncobro);
                        document.getElementById("totalentradas").innerHTML = uncobro.cantidad;  
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
}

function total_parrillas(fecha1,fecha2)
{
  $.ajax({
                  
                      type: "POST",
                      url:"../cobros/cobros.php",
                      data: {accion:4, operacion:5, fecha1:fecha1, fecha2:fecha2},
                      dataType: "json",
                      async: false,
                      success: function(cobros){

                        var uncobro = cobros[0];
                        console.log(uncobro);
                        document.getElementById("totalparrillas").innerHTML = uncobro.cantidad;  
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
}
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
    console.log("FEcha hoy ",f);
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
      $.ajax({
                      type: "POST",
                      url:"../caja/caja.php",
                      data: {accion:4, operacion:operacion, caracteres:dia, idusuario:usuario},
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
                      async: true,
                      success: function(pagos){
                          if (pagos.error==undefined){  
                              var total = pagos[0].total;
                              if (total!=null)
                              {       document.getElementById("subtotald").textContent = total;
                                      console.log("Subtotal Debito ", total);
                              }
                              else
                                document.getElementById("subtotald").textContent = '0';
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


function blanquea(){
    console.log("Blanquea formulario")
    // limpiar formulario
 
  };

                                        
function guarda_pago(idestadia, forma_pago, total) {
            
             		var ac=1;
                usuario = sessionStorage.getItem('Usuario');

                datos = "idestadia="+idestadia+"&forma_pago="+forma_pago+"&total="+total+"&accion="+ac+"&idusuario="+usuario;
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


function filtrartotal(texto) {
  // blanqueamos
        console.log("filtra ",texto);
        blanquea();
        trae_pagos(2,texto)
        trae_devoluciones_caja(2,texto);
};



function totales_generales()
{
                              var entradasefectivo=parseFloat($("#totalefectivo").text());
                              var entradasdebito=parseFloat($("#totaldebito").text());
                              var carpasefectivo=parseFloat($("#subtotale").text())*1000;
                              var carpasdebito=parseFloat($("#subtotald").text())*1000;
                              console.log("Subtotal ", carpasefectivo);
                              if (isNaN(carpasdebito)) carpasdebito=0;
                              if (isNaN(entradasdebito)) entradasdebito=0;

                              if (isNaN(carpasefectivo)) carpasefectivo=0;
                              if (isNaN(entradasefectivo)) entradasefectivo=0;

                              var subtotalefectivo=entradasefectivo+carpasefectivo;
                              var subtotaldebito=entradasdebito+carpasdebito;

                              if (subtotalefectivo>0)  
                              {
                                document.getElementById("efectivo").innerHTML = subtotalefectivo.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
;
                              }
                              else
                               document.getElementById("efectivo").innerHTML = '0';   

                              if (subtotaldebito>0)  
                              {
                                document.getElementById("debito").innerHTML = subtotaldebito.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
;
                              }
                              else
                               document.getElementById("debito").innerHTML = '0';   
                                                      
                              var devoluciones=parseFloat($("#devoluciones").text())*1000;  
                              if (isNaN(devoluciones)) devoluciones=0;
                              
                              var total_general=subtotalefectivo+subtotaldebito-devoluciones;
                              //document.getElementById("totalfinal").innerHTML = total_general;  
                              console.log("total general ", total_general);
                              
                              //totales_generales();
                              document.getElementById("devoluciones2").innerHTML = devoluciones.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
;  
                              document.getElementById("total_general").innerHTML = total_general.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
;  

}

function imprime_rendicion()
{
  //tomar fechas de pantalla fdesde, fhasta
  var fecha1=$("#buscafecha1").val();
  var fecha2=$("#buscafecha2").val();


 // if ((fecha1!='') && (fecha2!='') && (fecha1>=fecha2))
 // {
    window.open("imprimerendicion.html?variable1="+fecha1+"&variable2="+fecha2,"_blank");
 // }  
}

function impresion_rendicion(fecha1,fecha2)
{
  console.log("fechas ",fecha1, " ",fecha2);
  trae_rendiciones(fecha1,fecha2);  
}