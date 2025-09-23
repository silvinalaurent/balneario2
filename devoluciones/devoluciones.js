/*Version: 3.0*/


function trae_devoluciones(tipooperacion,letras) {
$("#tabladevoluciones").show(); 
$("#tabladevoluciones tbody").html("");
document.getElementById("textodevolucion").innerHTML = ""; 

$.ajax({
          
              type: "POST",
              url:"../devoluciones/devoluciones.php",
              data: {accion:4, operacion:tipooperacion, caracteres:letras},
              dataType: "json",
              async: false,
              success: function(devoluciones){
                
                if (devoluciones.error==undefined){
                  for (var i in devoluciones){
                
                    if (i >= 0)
                    {
                      var unadevolucion = devoluciones[i];
                      var fecha=convertDateFormat(unadevolucion.fecha);
                      
                      var linea= "<tr><td>" + unadevolucion.id + "</td><td>"+ fecha + "</td><td>"+unadevolucion.idestadia+ "</td><td>"+unadevolucion.datos_estadia+"</td><td>"+unadevolucion.importe+ "</td><td>"+unadevolucion.motivo+ "</td>"
                      if (unadevolucion.fecha==fechaHoy())
                        linea=linea+"<td> <a href='#' onclick='borra_devolucion("+unadevolucion.id+")'><i class=\"icon-trash\"></i></a></td>";
                      /* <a href='#' onclick='modifica_devolucion("+JSON.stringify(unadevolucion)+")'><i class=\"icon-pencil\"></i></a> - */
                      else
                        linea=linea+"<td></td>";
                      linea=linea+"</tr>";
                      $("#tabladevoluciones tbody").append(linea); 
                    } 
                  }; 
                }
                else  
                  { 
                      document.getElementById("textodevolucion").innerHTML = "No se encontraron resultados";  
                      document.getElementById("devoluciones").innerHTML = "0";  
                      $("#tabladevoluciones").hide(); 
                      $("#devolucionx").val(0);

                  }    
              },
              error: function (obj, error, objError){
                  alert(error);//avisar que ocurrió un error
                  
              }

    });
};

function trae_devoluciones_caja(tipooperacion,letras,usuario) {
      
      $("#tabladevoluciones").show(); 
      $("#tabladevoluciones tbody").html("");
      document.getElementById("textodevolucion").innerHTML = ""; 
      $.ajax({
                  
                      type: "POST",
                      url:"../devoluciones/devoluciones.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras, idusuario:usuario},
                      dataType: "json",
                      async: false,
                      success: function(devoluciones){
                        
                        if (devoluciones.error==undefined){
                          for (var i in devoluciones){
                             if (i >= 0)
                             {
                                var unadevolucion = devoluciones[i];
                                var fecha=convertDateFormat(unadevolucion.fecha);
                                
                                fila="<tr><td>" +unadevolucion.id+ "</td><td>"+ fecha + "</td><td>"+unadevolucion.idestadia+ "</td><td>"+unadevolucion.apellido +" "+unadevolucion.nombres+ "</td><td>"+unadevolucion.importe+ "</td><td>"+unadevolucion.motivo+ "</td>"
                              if (tipooperacion==2)
                                  fila=fila+"<td>"+unadevolucion.usuario+"</td>";
                              fila=fila+"</tr>"
                              $("#tabladevoluciones tbody").append(fila); 

                             } 
                             
                             
                          }; 
                          calcula_total_devoluciones(letras,tipooperacion).then(r =>{
                                calcula_totalfinal()
                          }).catch(() => {
                                console.log('Algo salió mal');
                          });  
                          }
                        else  
                          { 
                              document.getElementById("textodevolucion").innerHTML = "No se encontraron resultados";  
                              document.getElementById("devoluciones").innerHTML = "0";  
                              $("#tabladevoluciones").hide(); 
                              $("#devolucionx").val(0);
                          }    
                          
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};


function trae_devoluciones2(fecha1,fecha2) {
      //trae devoluciones entre fechas
      $("#tabladevoluciones").show(); 
      $("#tabladevoluciones tbody").html("");
      var calculodevoluciones=0;
      document.getElementById("textodevolucion").innerHTML = ""; 
      $.ajax({
                      type: "POST",
                      url:"../devoluciones/devoluciones.php",
                      data: {accion:4, operacion:11, fecha1:fecha1,fecha2:fecha2},
                      dataType: "json",
                      async: false,
                      success: function(devoluciones){

                        if (devoluciones.error==undefined){
                         
                          for (var i in devoluciones){

                            
                            var unadevolucion = devoluciones[i];
                            var fecha=convertDateFormat(unadevolucion.fecha);
                            calculodevoluciones=calculodevoluciones+parseFloat(unadevolucion.importe);
                            var fila="<tr><td>" + unadevolucion.id + "</td><td>"+fecha + "</td><td>"+unadevolucion.idestadia+"</td><td>"+unadevolucion.apellido + " " + unadevolucion.nombres +"</td><td>"+unadevolucion.importe +"</td><td>"+unadevolucion.motivo+"</td><td>"+unadevolucion.usuario+"</td>";
                            fila=fila+"</tr>";
                            $("#tabladevoluciones tbody").append(fila); 
                                
                          }; 
                           
                           $("#devolucionx").val(calculodevoluciones);
                           console.log("Devoluciones ",calculodevoluciones);
                           $("#totaldevoluciones").text(parseFloat(calculodevoluciones).toLocaleString(undefined, {
                            minimumFractionDigits: 2, maximumFractionDigits: 2,}));
                            
                        }
                      else{
                          document.getElementById("textodevolucion").innerHTML = "No se encontraron resultados";  
                          document.getElementById("totaldevoluciones").textContent = '0';
                          $("#tabladevoluciones").hide(); 
                          $("#devolucionx").val('0');

                        }
                          
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};

function calcula_total_devolucion_fechas(fecha1,fecha2) {
      $.ajax({
                      type: "POST",
                      url:"../devoluciones/devoluciones.php",
                      data: {accion:4, operacion:12, fecha1:fecha1,fecha2:fecha2},
                      dataType: "json",
                      async: false,
                      success: function(devoluciones){
                            if (devoluciones.error==undefined){  
                              var total = parseFloat(devoluciones[0].total);
                              document.getElementById("devoluciones").textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
                              $("#devolucionx").val(total);
                              
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


function calcula_total_devoluciones(dia,tipooperacion) {
    
    var operacion=0;
    if (tipooperacion==1)
      operacion=5
    else
      operacion=10
    return new Promise(function(resolve, reject) {
      
      $.ajax({
                      type: "POST",
                      url:"../devoluciones/devoluciones.php",
                      data: {accion:4, operacion:operacion, caracteres:dia},
                      dataType: "json",
                      async: false,
                      success: function(devoluciones){
                        if (devoluciones.error==undefined){  
                              console.log("Devoluciones de consulta ",devoluciones[0].total);
                              var total = parseFloat(devoluciones[0].total);
                              console.log("Devoluciones convertido",total);
                              document.getElementById("devoluciones").textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,});
                              $("#devolucionx").val(total);
                              
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

function borra_devolucion(id){

 		$.ajax({
                  
                      type: "POST",
                      url:"devoluciones.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: false,
                      success: function(devoluciones){
 							            if (devoluciones.error == 0){
                            trae_devoluciones(0,"");
                          }
                          else{
                            alert(devoluciones.valor);
                          }
 							
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
};	


function blanquea(){
   
    // limpiar formulario
    $("#fecha").val('');
    $("#selestadia").val('0');
    $("#importe").val('');
    $("#motivo").val('');
    
  };

function limpia_busqueda(){
  
    // limpiar formulario
    $("#buscadescripcion").val('');
   };

function agrega_devolucion(d){
    blanquea();
    var hoy=fechaHoy();
		$("#fecha").val(hoy);
    $("#idestadia").focus();
    $("#iddevolucion").val('0');
};


function modifica_devolucion(devolucion){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar devolucion, evento css
    
    blanquea();
    $("#iddevolucion").val((devolucion.id).toString());
    $("#fecha").val(devolucion.fecha);
    $("#selestadia").val(devolucion.idestadia);
    $("#importe").val(devolucion.importe);
    $("#motivo").val(devolucion.motivo);
    document.getElementById("mostrar-modal").checked =true;
};



function guarda_devolucion() {
  
            if ($("#idestadia").val()!='' && $("#importe").val()!='')
            //&& $("#fecha").val()!='' && $("#fecha").val()<=fechaHoy()
              {
                var datos = $("form").serialize();
                var id= $("#iddevolucion").val();
                //se evalua si se esta registrando un nuevo devolucion (1) o se esta modificando uno ya existente (2)
                
                 if (id==0) {
                 		var ac=1;
                 		}
                
                else {
                		var ac=2;
                };
                
                
                datos = datos + "&accion="+ac;
                
                $.ajax({      
                          type: "post",
                          url:"devoluciones.php",
                          data:datos,
                          dataType: "json",
                          async: false,
                    
                          success: function(devoluciones){
                                 
                              if (devoluciones["error"]==0) {

                                  document.getElementById("cerrar-modal").checked =true;
                                  trae_devoluciones(0, "");

                              } 
                              else{
                                  alert(devoluciones["valor"]);
                                  
                              };                  
                },
                    
                          error: function (obj, error, objError){
                              alert(error);//avisar que ocurrió un error
                              
                          }

                    });
            }
            else
                alert('Complete los datos correctamente, por favor');
};

function filtrar_devoluciones(texto) {
      trae_devoluciones(1,texto)
};

function sin_devolucion(idestadia){
  //se controla que no se haya hecho ya una devolucion

  var resp=true;
  $.ajax({
    type: "POST",
    url:"../devoluciones/devoluciones.php",
    data: {accion:4, operacion:3, caracteres:idestadia},
    dataType: "json",
    async: false,
    success: function(devoluciones){
      console.log(devoluciones);
      if (devoluciones["error"]!=1)
      {
        resp=false;
      } 
    },
    error: function (obj, error, objError){
      alert(devoluciones["valor"]);
    }
    }); 
  return resp; 
  };
  
function chequea_importe_devolucion()
//se controla que no se cargue un importe mayor al de la estadia
{
  var importe_estadia=sessionStorage.getItem('importe_estadia');
  var importe_devolucion=$("#importe").val();
  if (importe_devolucion>importe_estadia)
  {
    alert("El importe de la devolución no puede superar el importe de la estadía");
    $("#importe").val(importe_estadia);
    
  }
}