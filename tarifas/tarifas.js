/*Version: 3.0*/

function trae_tarifas(tipooperacion,letras) {
	 	//para Tarifas.html	
	 	$("#tabla tbody").html("");
	    $.ajax({
                  
                      type: "POST",
                      url:"tarifas.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(tarifas){
						 for (var i in tarifas){
                           if (i >= 0)
                           {
        				    var unatarifa = tarifas[i];

                            var fecha_inicio='';
                            if (unatarifa.fecha_inicio!=null) { 
                                fecha_inicio=convertDateFormat(unatarifa.fecha_inicio);}
                            var fecha_fin='';
                            if (unatarifa.fecha_fin!=null) {
                                fecha_fin=convertDateFormat(unatarifa.fecha_fin);}
                              $("#tabla tbody").append("<tr><td>" + unatarifa.descripcion + "</td><td>"+unatarifa.unidad+ "</td><td>"+unatarifa.tarifa+ "</td><td>"+fecha_inicio+ "</td><td>"+fecha_fin+ "</td><td><a href='#' onclick='modifica_tarifa("+JSON.stringify(unatarifa)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='precios_tarifa("+JSON.stringify(unatarifa)+")'> $ </a> -  <a href='#' onclick='borra_tarifa("+unatarifa.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 

      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};

function lista_tarifas(nombreselector) {
    //trae las tarifas actuales
      $("#"+nombreselector).append('<option value="0">Ninguno</option>');
      $.ajax({
                      type: "POST",
                      url:"../tarifas/tarifas.php",
                      data: {accion:4, operacion:0, caracteres:''},
                      dataType: "json",
                      async: true,
                      success: function(tarifas){
                          var claseEstilo;

                           
                          for (var i in tarifas){
                              var unatarifa = tarifas[i];
                              //mostra difrentes colores segun la unidad de la tarifa Diaria/Diaria por persona/Mensual
                               // 1. Determinar la clase CSS a aplicar
                            if (unatarifa.unidad == 'MES') {
                                claseEstilo = 'tarifa-mes';
                            } else if (unatarifa.unidad == 'DIA') {
                                claseEstilo = 'tarifa-dia';
                            } else {
                                // Estilo por defecto para cualquier otra unidad (Diaria por persona, etc.)
                                claseEstilo = 'tarifa-otros';
                            }      
                              $("#"+nombreselector).append('<option value="'+unatarifa.id+ '" class="' + claseEstilo +'">'+unatarifa.descripcion+" - $ "+unatarifa.tarifa+'</option>');
                               
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};
 

function eligetarifa(idtarifa){
    //hay que modificar para obtener el precio que corresponde al periodo actual

      $.ajax({
                      type: "POST",
                      url:"../tarifas/tarifas.php",
                      data: {accion:4, operacion:1, caracteres:idtarifa},
                      dataType: "json",
                      async: true,
                      success: function(tarifas){
                              //modificado 14-10-25 
                              var unatarifa = tarifas[0];
                              var unidadactual=localStorage.getItem("unidad_tarifa");
                              const inputFecha = $("#fechah");
                              if (unatarifa.unidad=="MES")
                              {
                                    $("#dias").text('30');//la cantidad de dias es 30
                                    inputFecha.prop("readonly", true);
                                    $("#cantidad").focus();
                              }
                              else{
                                    inputFecha.prop("readonly", false);
                                    $("#fechah").focus();
                              }
                              //si pasa de una tarifa mensual a una tarifa dia o persona dia, debe refrescarse a la fecha a una cercana/ 1 dia mas
                              if ((unidadactual=='MES') && (unatarifa.unidad=='DIA'))
                              {
                                    console.log('paso de mes a dia');
                                   //como la fecha esta corrida un mes, hay que retrocederla
                                   //permitir cambiarla quiar readonly
                                   document.getElementById("fechah").readOnly = false;
                                   //deberia blanquear dias
                                   diaSiguiente("fechah");
                                   document.getElementById("fechah").value = diaSiguiente;
                                   $("#dias").text('1');//la cantidad de dias por defecto es 1, debera corregirla el usuario en fechah
                              }
                              localStorage.setItem("unidad_tarifa", unatarifa.unidad);
                              localStorage.setItem("importe_tarifa", unatarifa.tarifa);
                              $("#importe").val(unatarifa.tarifa);
                              calculaestadia();
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
  };

function borra_tarifa(id){
 		$.ajax({
                      type: "POST",
                      url:"tarifas.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: true,
                      success: function(tarifas){
 					     if (tarifas.error == 0){
                            trae_tarifas(0,"");
                          }
                          else{
                            alert(tarifas.valor);
                          }
 							
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};	


function blanquea_formulario(){
    // limpiar formulario
    $("#descripcion").val('');
    $("#unidad").val('DIA');
    $("#precio").val('');
    
  };

function limpia_busqueda(){
    // limpiar formulario
    $("#buscadescripcion").val('');
};

function agrega_tarifa(d){
    blanquea_formulario();
    $("#descripcion").focus();
    $("#idtarifa").val('0');
   
};


function modifica_tarifa(tarifa){
   
    blanquea_formulario();
    $("#idtarifa").val((tarifa.id).toString());
    $("#descripcion").val(tarifa.descripcion);
    $("#unidad").val(tarifa.unidad);
    $("#precio").val(tarifa.tarifa);
    document.getElementById("mostrar-modal").checked =true;
};



function guarda_tarifa() {
            
            if ( $("#descripcion").val()!='')
            {
                var datos = $("form").serialize();
                
                var id= $("#idtarifa").val();
                //se evalua si se esta registrando un nuevo tarifa (1) o se esta modificando uno ya existente (2)
                
                 if (id==0) {
                 		var ac=1;
                 		}
                
                else {
                		var ac=2;
                };
                
               
                datos = datos + "&accion="+ac;
                
                $.ajax({      
                          type: "post",
                          url:"tarifas.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(tarifas){
                                 
                                        if (tarifas["error"]==0) {

                                           document.getElementById("cerrar-modal").checked =true;
                                           if (ac==1){
                                                console.log(tarifas["data"])
                                                precios_tarifa(tarifas["data"]);
                                            }
                                           else
                                             trae_tarifas(0, "");
                                           
   
                                        } 
                                        else{
                                            alert(tarifas["valor"]);
                                            
                                        };                  
                          },
                    
                          error: function (obj, error, objError){
                              alert(error);//avisar que ocurrió un error
                              
                          }

                    });
                      
            }
            else
                alert('Complete el nombre por favor');
};

function filtrar(texto) {
      trae_tarifas(2,texto)
};


function precios_tarifa(tarifa)
{
    console.log(tarifa);
    console.log(tarifa.id);
    $("#idtarifaprecio").val(tarifa.id);
    var descripcion_tarifa=tarifa.descripcion+', $' +tarifa.tarifa+' '+tarifa.unidad+' ';
    if (tarifa.fecha_inicio!=null)
            descripcion_tarifa=descripcion_tarifa+tarifa.fecha_inicio + ' '+tarifa.fecha_fin;
    $("#descripcion_tarifa").html(descripcion_tarifa);
    //calcular nuevas fechas
    //obtener el semestre ultimo y calcular el nuevo

    let fecha = new Date(tarifa.fecha_fin);
    let anio = fecha.getFullYear();
    let mes = fecha.getMonth() + 1; // Suma 1 porque los meses van de 0 (enero) a 11 (diciembre)
    let dia = fecha.getDate();

    if (mes>=7) {
        //segundo semestre, se disponen las fechas para el siguiente semestre de principio de año
        anio=anio+1;
        var fecha_inicio=anio+'-01-01';
        var fecha_fin= anio+'-06-30';
    }
    else
    {
        //primer semestre, se disponen las fechas para siguiente de semestre de la segunda parte del año
        var fecha_inicio=anio+'-07-01';
        var fecha_fin= anio+'-12-31';
    }


    $("#fecha_inicio").val(fecha_inicio);
    $("#fecha_fin").val(fecha_fin);

    //buscarultimoprecio(idtarifa);
    document.getElementById("mostrar-modal3").checked =true;    

};


function buscarultimoprecio(idtarifa)
{
      $.ajax({
                      type: "POST",
                      url:"../tarifas/precios.php",
                      data: {accion:4, operacion:1, caracteres:idtarifa},
                      dataType: "json",
                      async: true,
                      success: function(precio){
                              //evalua si encontro algun precio para esa tarifa
                              if (Object.keys(precio).length === 0) {
                                    console.log("El JSON está vacío");
                            } else {
                                console.log("El JSON tiene datos");
                                var unprecio = precio[0];
                                 $("#idtarifa").val(idtarifa);
                                 $("#fecha_inicio").val(diaSiguienteFecha(precio.fecha_fin));

                            }   
                      
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
  };



function guarda_precio() {
            
        //controlar que la fecha de fin no sea inferior a la fecha de inicio

            if ( $("#precio").val()!='')
            {
                var datos = $("#form_precio").serialize();
                var ac=1;
                datos = datos + "&accion="+ac;
                $.ajax({      
                          type: "post",
                          url:"precios.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(tarifas){
                                 
                                        if (tarifas["error"]==0) {

                                           document.getElementById("cerrar-modal3").checked =true;
                                           trae_tarifas(0, "");
                            
                                        } 
                                        else{
                                            alert(tarifas["valor"]);
                                            
                                        };                  
                          },
                    
                          error: function (obj, error, objError){
                              alert(error);//avisar que ocurrió un error
                              
                          }

                    });
            }
            else
                alert('Complete el nombre por favor');
};
