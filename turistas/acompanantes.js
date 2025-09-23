/*Version: 3.0*/
// Trabaja con la tabla Grupos

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};


function trae_acompanantes(idestadia) {
	 		
	 		//$("#tabla tbody").html("");
	    
   		$.ajax({
                  
                      type: "POST",
                      url:"../turistas/acompanantes.php",
                      data: {accion:4, operacion:0, caracteres:idestadia},
                      dataType: "json",
                      async: false,
                      success: function(acompanantes){
 
        							    for (var i in acompanantes){
        					     
                           if (i >= 0)
                           {
        							        var unacompanante = acompanantes[i];
                              cargaturista(unacompanante.idturista); 

      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};


function guarda_acompanante(idturista,idestadia) {
                        
                datos = "idturista="+idturista+"&idestadia="+idestadia+"&accion="+1;
                
                $.ajax({      
                          type: "post",
                          url:"../turistas/acompanantes.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(acompanantes){
                          },
                    
                          error: function (obj, error, objError){
                              alert(error);//avisar que ocurrió un error
                              
                          }

                    });
};
            

function consulta_turistas(idestadia) {
      console.log("Estadia ",idestadia);
      $("#tablaturistas tbody").html("");
      $.ajax({
                      type: "POST",
                      url:"../turistas/acompanantes.php",
                      data: {accion:4, operacion:1, caracteres:idestadia},
                      dataType: "json",
                      async: true,
                      success: function(turistas){
           
                          for (var i in turistas){
                          
                           if (i >= 0)
                           {
                              var unturista = turistas[i];
                              var fila= "<tr><td>" +unturista.apellido +" "+unturista.nombres+"</td><td>"+ unturista.nro_documento + "</td><td>"+unturista.movil+"</td><td>"+unturista.domicilio+" "+"</td><td>"+unturista.ciudad+"</td>";

                              $("#tablaturistas tbody").append(fila); 
                              
                           } 
                          }; 
                        },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
    document.getElementById("mostrar-modal").checked =true;
};


