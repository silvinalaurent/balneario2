/*Version: 3.0*/

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};


  

function trae_ciudades(tipooperacion,letras) {
	 		
	 		$("#tabla tbody").html("");
	    
   		$.ajax({
                  
                      type: "POST",
                      url:"../ciudades/ciudades.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(ciudades){
 
        							    for (var i in ciudades){
        					     
                           if (i >= 0)
                           {
        							        var unaciudad = ciudades[i];
                              $("#tabla tbody").append("<tr><td>" + unaciudad.ciudad + "</td><td>"+unaciudad.provincia+"</td><td><a href='#' onclick='modifica_ciudad("+JSON.stringify(unaciudad)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_ciudad("+unaciudad.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 

      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};


function borra_ciudad(id){

 		$.ajax({
                  
                      type: "POST",
                      url:"../ciudades/ciudades.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: true,
                      success: function(ciudades){
 							            if (ciudades.error == 0){
                            trae_ciudades(0,"");
                            
       
                          }
                          else{
                            alert(ciudades.valor);
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
    $("#buscaprovincia").val('');
    
  };

function limpia_busqueda(){
  
    // limpiar formulario
    $("#buscaciudad").val('');
   };

function agrega_ciudad(d){
    blanquea_formulario();
    $("#nombre").focus();
    $("#idciudad").val('0');
    $("#buscaprovincia").val('-1');
    //setTimeout(function() {initialize();}, 2000);  
};


function modifica_ciudad(ciudad){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar ciudad, evento css
    
    blanquea_formulario();
    $("#idciudad").val((ciudad.id).toString());
    $("#nombre").val(ciudad.ciudad);
    $("#buscaprovincia").val(ciudad.idprovincia);
    document.getElementById("mostrar-modal").checked =true;
};



function guarda_ciudad() {
            
            if ( $("#nombre").val()!='')
            {
                var datos = $("form").serialize();
                
                var id= $("#idciudad").val();
                //se evalua si se esta registrando un nuevo ciudad (1) o se esta modificando uno ya existente (2)
                
                 if (id==0) {
                 		var ac=1;
                 		}
                
                else {
                		var ac=2;
                };
                
               
                datos = datos + "&accion="+ac;
                console.log(datos);
                $.ajax({      
                          type: "post",
                          url:"../ciudades/ciudades.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(ciudades){
                                 
                                        if (ciudades["error"]==0) {

                                           document.getElementById("cerrar-modal").checked =true;

                                         
                                           //$("#modal").hide();
                                           trae_ciudades(0, "");

                                        } 
                                        else{
                                            alert(ciudades["valor"]);
                                            
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

function filtrar_ciudades(texto) {
    if (texto.length>=4) {
         trae_ciudades(1,texto);
}
};


function lista_ciudades_provincia(nombreselector,idprovincia) {
    $("#"+nombreselector).empty();
    $("#"+nombreselector).append('<option value="0">Ninguno</option>');
    $.ajax({
                
                    type: "POST",
                    url:"../ciudades/ciudades.php",
                    data: {accion:4, operacion:2,caracteres:idprovincia},
                    dataType: "json",
                    async: true,
                    success: function(ciudades){

                        
                        for (var i in ciudades){
                            var unaciudad = ciudades[i];
                            
                            $("#"+nombreselector).append('<option value="'+unaciudad.id+'">'+unaciudad.ciudad+'</option>');
                            
                             
                        }; 
                    },
                    error: function (obj, error, objError){
                        alert(error);//avisar que ocurrió un error
                    }
          });
};

