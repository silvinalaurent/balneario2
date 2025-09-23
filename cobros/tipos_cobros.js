/*Version: 3.0*/

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};

function trae_tipos_cobro(tipooperacion,letras) {
	 		
	 		$("#tabla tbody").html("");
   		$.ajax({
                      type: "POST",
                      url:"../cobros/tipos_cobros.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(tipos_cobro){
 
        							    for (var i in tipos_cobro){
                           if (i >= 0)
                           {
        							        var untipo = tipos_cobro[i];
                              $("#tabla tbody").append("<tr><td>" + untipo.nombre+"</td><td>"+untipo.importe+"</td><td>"+untipo.temporada+ "</td><td><a href='#' onclick='modifica_tipo_cobro("+JSON.stringify(untipo)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_tipo_cobro("+untipo.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 

      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};



function obtiene_monto_tipo(idtipocobro) {
    return new Promise(function(resolve, reject) {

        console.log("Tipo de Cobro ",idtipocobro);
        $.ajax({
                      type: "POST",
                      url:"../cobros/tipos_cobros.php",
                      data: {accion:4, operacion:3, caracteres:idtipocobro},
                      dataType: "json",
                      async: true,
                      success: function(tipos_cobro){
                                
                                 resolve(tipos_cobro[0].importe);
                        },
                       error: function (obj, error, objError){
                          
                          reject(alert(error));//avisar que ocurrió un error
                          
                      }
            });
        });   
};

function lista_tipos_cobro(nombreselector) {
      $("#"+nombreselector).append('<option value="0">Ninguno</option>');
      $.ajax({
                      type: "POST",
                      url:"../cobros/tipos_cobros.php",
                      data: {accion:4, operacion:0, caracteres:''},
                      dataType: "json",
                      async: true,
                      success: function(tipos_cobro){
 
                          for (var i in tipos_cobro){
                              var unatipo_cobro = tipos_cobro[i];
                              
                              $("#"+nombreselector).append('<option value="'+unatipo_cobro.id+'">'+unatipo_cobro.nombre.toUpperCase()+'</option>');
                               
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};



function borra_tipo_cobro(id){

 		$.ajax({
                  
                      type: "POST",
                      url:"../cobros/tipos_cobros.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: true,
                      success: function(tipos_cobro){
 							            if (tipos_cobro.error == 0){
                            trae_tipos_cobro(0,"");
                            
       
                          }
                          else{
                            alert(tipos_cobro.valor);
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
    $("#importe").val('');
    $("#temporada").val('');
    
  };

function limpia_busqueda(){
  
    // limpiar formulario
    $("#buscatipocobro").val('');
   };

function agrega_tipo_cobro(d){
    blanquea_formulario();
    $("#nombre").focus();
    $("#idtipo_cobro").val('0');
    //setTimeout(function() {initialize();}, 2000);  
};


function modifica_tipo_cobro(tipo_cobro){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar tipo_cobro, evento css
    
    blanquea_formulario();
    $("#idtipo_cobro").val((tipo_cobro.id).toString());
    $("#nombre").val(tipo_cobro.nombre);
    $("#importe").val(tipo_cobro.importe);
    $("#temporada").val(tipo_cobro.temporada);
    document.getElementById("mostrar-modal").checked =true;
};



function guarda_tipo_cobro() {
            
            if ( $("#nombre").val()!='')
            {
                var datos = $("form").serialize();
                
                var id= $("#idtipo_cobro").val();
                //se evalua si se esta registrando un nuevo tipo_cobro (1) o se esta modificando uno ya existente (2)
                
                 if (id==0) {
                 		var ac=1;
                 		}
                
                else {
                		var ac=2;
                };
                
               
                datos = datos + "&accion="+ac;
                
                $.ajax({      
                          type: "post",
                          url:"../cobros/tipos_cobros.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(tipos_cobro){
                                 
                                        if (tipos_cobro["error"]==0) {

                                           document.getElementById("cerrar-modal").checked =true;

                                         
                                           //$("#modal").hide();
                                           trae_tipos_cobro(0, "");

                                        } 
                                        else{
                                            alert(tipos_cobro["valor"]);
                                            
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
      trae_tipos_cobro(1,texto)
};


