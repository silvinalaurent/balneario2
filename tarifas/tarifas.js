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
 
                          for (var i in tarifas){
                              var unatarifa = tarifas[i];
                              
                              $("#"+nombreselector).append('<option value="'+unatarifa.id+'">'+unatarifa.descripcion+" - $ "+unatarifa.tarifa+'</option>');
                               
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
 
                              var unatarifa = tarifas[0];
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


