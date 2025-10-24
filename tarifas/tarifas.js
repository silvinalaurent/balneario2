/*Version: 3.0*/

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};



  

function trae_tarifas(tipooperacion,letras) {
	 		
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
                              $("#tabla tbody").append("<tr><td>" + unatarifa.descripcion + "</td><td>"+unatarifa.unidad+ "</td><td>"+unatarifa.tarifa+ "</td><td><a href='#' onclick='modifica_tarifa("+JSON.stringify(unatarifa)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_tarifa("+unatarifa.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 

      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};

function lista_tarifas(nombreselector) {
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
    //setTimeout(function() {initialize();}, 2000);  
};


function modifica_tarifa(tarifa){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar tarifa, evento css
    
    blanquea_formulario();
    $("#idtarifa").val((tarifa.id).toString());
    $("#descripcion").val(tarifa.descripcion);
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

                                         
                                           //$("#modal").hide();
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


