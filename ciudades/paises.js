/*Version: 3.0*/

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};



  

function trae_paises(tipooperacion,letras) {
	 		
	 		$("#tabla tbody").html("");
	    
   		$.ajax({
                  
                      type: "POST",
                      url:"../ciudades/paises.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(paises){
 
        				   for (var i in paises){
        					     
                           if (i >= 0)
                           {
        					  var unpais = paises[i];
                              $("#tabla tbody").append("<tr><td>" + unpais.pais + "</td><td><a href='#' onclick='modifica_pais("+JSON.stringify(unpais)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_pais("+unpais.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 

      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};

function lista_paises(nombreselector) {
      //$("#"+nombreselector).append('<option value="0">Ninguno</option>');
      $.ajax({
                  
                      type: "POST",
                      url:"../ciudades/paises.php",
                      data: {accion:4, operacion:0},
                      dataType: "json",
                      async: true,
                      success: function(paises){
 
                          for (var i in paises){
                              var unpais = paises[i];

                              if (unpais.id==1)  
                                $("#"+nombreselector).append('<option selected value="'+unpais.id+'">'+unpais.pais+'</option>');                   
                              else
                              
                                $("#"+nombreselector).append('<option value="'+unpais.id+'">'+unpais.pais+'</option>');
                              
                   
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
     
      
};


function borra_pais(id){

 		$.ajax({
                  
                      type: "POST",
                      url:"../ciudades/paises.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: true,
                      success: function(paises){
 		                if (paises.error == 0){
                            trae_paises(0,"");
                          }
                          else{
                            alert(paises.valor);
                          }
 							
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
};	


function blanquea_formulario(){
   
    // limpiar formulario
    $("#nombre").val('');
    
  };

function limpia_busqueda(){
  
    // limpiar formulario
    $("#buscatipo").val('');
   };

function agrega_pais(d){
    blanquea_formulario();
    $("#nombre").focus();
    $("#idpais").val('0');
    //setTimeout(function() {initialize();}, 2000);  
};


function modifica_pais(pais){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar pais, evento css
    
    blanquea_formulario();
    $("#idpais").val((pais.id).toString());
    $("#nombre").val(pais.pais);
    document.getElementById("mostrar-modal").checked =true;
};



function guarda_pais() {
            
            if ( $("#nombre").val()!='')
            {
                var datos = $("form").serialize();
                
                var id= $("#idpais").val();
                //se evalua si se esta registrando un nuevo pais (1) o se esta modificando uno ya existente (2)
                
                 if (id==0) {
                 		var ac=1;
                 		}
                
                else {
                		var ac=2;
                };
                
               
                datos = datos + "&accion="+ac;
                
                $.ajax({      
                          type: "post",
                          url:"../ciudades/paises.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(paises){
                                 
                                        if (paises["error"]==0) {

                                           document.getElementById("cerrar-modal").checked =true;

                                         
                                           //$("#modal").hide();
                                           trae_paises(0, "");

                                        } 
                                        else{
                                            alert(paises["valor"]);
                                            
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

function filtrar_paises(texto) {
      trae_paises(1,texto)
};


