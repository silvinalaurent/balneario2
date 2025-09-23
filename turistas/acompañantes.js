/*Version: 3.0*/

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};


/*
  
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
                              $("#tabla tbody").append("<tr><td>" + unatarifa.descripcion + "</td><td>"+unatarifa.tarifa+ "</td><td><a href='#' onclick='modifica_tarifa("+JSON.stringify(unatarifa)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_tarifa("+unatarifa.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 

      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};
*/
/*
function lista_turistas(nombreselector) {
      $("#listaturistas").append('<option value="0">Ninguno</option>');
      $.ajax({
                  
                      type: "POST",
                      url:"../turistas/turistas.php",
                      data: {accion:4, operacion:0},
                      dataType: "json",
                      async: true,
                      success: function(turistas){
 
                          for (var i in turistas){
                              var unturista = turistas[i];
                              
                              $("#listaturistas").append('<option value="'+unturista.id+'">'+unturista.apellido+" "+unturista.nombres+' '+unturista.nro_documento+ " - "+unturista.ciudad+ " - "+unturista.nombreprovincia+'</option>');
                               
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};
*/
/*
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
    $("#apellido").val('');
    $("#nombres").val('');
    $("#documento").val('');
    $("#domicilio").val('');
    $("#ciudad1").val('');
    $("#provincia1").val('-1');
    $("#telefono").val('');
    $("#email").val('');
    $("#redes").val('');
    
  };

function limpia_busqueda(){
  
    // limpiar formulario
    $("#buscadescripcion").val('');
   };

function agrega_turista(){
    blanquea_formulario();
    $("#apellido").focus();
    $("#idturista").val('0');
    $("#nuevoturista").show();
    //setTimeout(function() {initialize();}, 2000);  
};

function agrega_turista_existente(){
    var idturista=$("#listaturistas").val();
    console.log("Turista en agrega turista existente ",idturista);
    //agregar a tabla de grupo turistas
     cargaturista(idturista);
};
/*

function modifica_tarifa(tarifa){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar tarifa, evento css
    
    blanquea_formulario();
    $("#idtarifa").val((tarifa.id).toString());
    $("#descripcion").val(tarifa.descripcion);
    $("#precio").val(tarifa.tarifa);
    document.getElementById("mostrar-modal").checked =true;
};


*/
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
            




function ultimoturista(){
  return new Promise(function(resolve, reject) {
      $.ajax({
                  
                      type: "POST",
                      url:"../turistas/turistas.php",
                      data: {accion:4, operacion:2},
                      dataType: "json",
                      async: true,
                      success: function(turistas){
                          console.log("Resultado de turistas ",turistas);
                          if (turistas.error==1)
                          {
                            resolve(0);
                          }
                          else 
                            {
                              console.log("El ultimo es ",turistas[0].ultimo);
                              resolve(turistas[0].ultimo);
                           }
                      },
                      error: function (obj, error, objError){
                          
                          reject(alert(error));//avisar que ocurrió un error
                          
                      }
            });
     });
};

function cargaturista(id){
  //en sectores.html, se carga a una tabla temporaria el grupo de turistas acampantes.
      $.ajax({
                  
                      type: "POST",
                      url:"../turistas/turistas.php",
                      data: {accion:4, operacion:1, caracteres:id},
                      dataType: "json",
                      async: true,
                      success: function(turistas){
                            var unturista=turistas[0];
                            console.log("Turista ",unturista);
                            
                            
                            $("#tablaturistas").append("<tr><td id='A'>"+ unturista.id +"</td><td>"+unturista.apellido +" " +unturista.nombres+ "</td><td>"+"DNI "+unturista.nro_documento+"</td><td>"+unturista.movil+"</td><td>"+unturista.ciudad+"</td><td>"+unturista.nombreprovincia+"</td><td>"+"<a href='#' onclick='borra_turista()'><i class=\"icon-trash\"></i></a></td></tr>");             
                        },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
  
};
function cierraventana(){
  $("#nuevoturista").hide();
};
/*
function filtrar(texto) {
      trae_tarifas(1,texto)
};


*/