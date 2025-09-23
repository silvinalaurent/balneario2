/*Version: 3.0*/

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};



  

function trae_provincias(tipooperacion,letras) {
	 		
	 	$("#tabla tbody").html("");
	    $.ajax({
                  
                      type: "POST",
                      url:"../ciudades/provincias.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(provincias){
 
        							    for (var i in provincias){
        					     
                           if (i >= 0)
                           {
        							        var unaprovincia = provincias[i];
                              $("#tabla tbody").append("<tr><td>" + unaprovincia.pais + "</td><td>" + unaprovincia.provincia + "</td><td><a href='#' onclick='modifica_provincia("+JSON.stringify(unaprovincia)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_provincia("+unaprovincia.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 

      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};

function trae_provincias_pais()
{
    var selectpais = document.getElementById("qpais");
    var idpais = selectpais.value;
    trae_provincias(2,idpais);
   
}

function lista_provincias(nombreselector) {
      $("#"+nombreselector).empty();
      $("#"+nombreselector).append('<option value="0">Ninguno</option>');
      $.ajax({
                  
                      type: "POST",
                      url:"../ciudades/provincias.php",
                      data: {accion:4, operacion:0},
                      dataType: "json",
                      async: true,
                      success: function(provincias){
 
                          
                          for (var i in provincias){
                              var unaprovincia = provincias[i];
                              
                              $("#buscaprovincia").append('<option value="'+unaprovincia.id+'">'+unaprovincia.provincia+'</option>');
                              $("#"+nombreselector).append('<option value="'+unaprovincia.id+'">'+unaprovincia.provincia+'</option>');
                              
                               
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};

function lista_provincias_pais(nombreselector,idpais) {
    $("#"+nombreselector).empty();
    $("#"+nombreselector).append('<option value="0">Ninguno</option>');
    $.ajax({
                
                    type: "POST",
                    url:"../ciudades/provincias.php",
                    data: {accion:4, operacion:2,caracteres:idpais},
                    dataType: "json",
                    async: true,
                    success: function(provincias){

                        
                        for (var i in provincias){
                            var unaprovincia = provincias[i];
                            
                            $("#"+nombreselector).append('<option value="'+unaprovincia.id+'">'+unaprovincia.provincia+'</option>');
                            
                             
                        }; 
                    },
                    error: function (obj, error, objError){
                        alert(error);//avisar que ocurrió un error
                    }
          });
};

function borra_provincia(id){

 		$.ajax({
                  
                      type: "POST",
                      url:"../ciudades/provincias.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: true,
                      success: function(provincias){
 							            if (provincias.error == 0){
                            trae_provincias(0,"");
                            
       
                          }
                          else{
                            alert(provincias.valor);
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

function agrega_provincia(d){
    blanquea_formulario();
    $("#nombre").focus();
    $("#idprovincia").val('0');
    //setTimeout(function() {initialize();}, 2000);  
};


function modifica_provincia(provincia){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar provincia, evento css
    
    blanquea_formulario();
    $("#idprovincia").val((provincia.id).toString());
    $("#nombre").val(provincia.provincia);
    document.getElementById("mostrar-modal").checked =true;
};



function guarda_provincia() {
            
            if ( $("#nombre").val()!='')
            {
                var datos = $("form").serialize();
                
                var id= $("#idprovincia").val();
                //se evalua si se esta registrando un nuevo provincia (1) o se esta modificando uno ya existente (2)
                
                 if (id==0) {
                 		var ac=1;
                 		}
                
                else {
                		var ac=2;
                };
                
               
                datos = datos + "&accion="+ac;
                
                $.ajax({      
                          type: "post",
                          url:"../ciudades/provincias.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(provincias){
                                 
                                        if (provincias["error"]==0) {

                                           document.getElementById("cerrar-modal").checked =true;

                                         
                                           //$("#modal").hide();
                                           trae_provincias(0, "");

                                        } 
                                        else{
                                            alert(provincias["valor"]);
                                            
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

function filtrar_provincias(texto) {
      trae_provincias(1,texto)
};


