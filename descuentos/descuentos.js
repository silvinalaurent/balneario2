/*Version: 3.0*/
function trae_descuentos(tipooperacion,letras) {
	 		$("#tabla tbody").html("");
   		$.ajax({
                  
                      type: "POST",
                      url:"descuentos.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(descuentos){
 
        							    for (var i in descuentos){
        					     
                           if (i >= 0)
                           {
        							        var undescuento = descuentos[i];
                              var clase='';
                              var acciones='';
                              console.log("estado ",undescuento.estado);
                              if (undescuento.estado==0)
                                  {
                                    clase="class='debaja'";
                                  }
                              else
                              {
                                acciones="<a href='#' onclick='modifica_descuento("+JSON.stringify(undescuento)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_descuento("+undescuento.id+")'><i class=\"icon-trash\"></i></a>";

                              }
                              $("#tabla tbody").append("<tr "+clase+"><td>" + undescuento.descripcion + "</td><td>"+undescuento.porcentaje+" %"+ "</td><td>"+acciones+"</td> </tr>"); 

      							       } 
        							 
        						    	}; 
	                        
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};

function lista_descuentos(nombreselector) {
      $("#"+nombreselector).append('<option value="0">Ninguno</option>');
      $.ajax({
                      type: "POST",
                      url:"../descuentos/descuentos.php",
                      data: {accion:4, operacion:0, caracteres:''},
                      dataType: "json",
                      async: true,
                      success: function(descuentos){
 
                          for (var i in descuentos){
                              var undescuento = descuentos[i];
                              if (undescuento.estado==1)
                              {
                              $("#"+nombreselector).append('<option value="'+undescuento.porcentaje+'">'+undescuento.descripcion+' '+undescuento.porcentaje+' % </option>');
                            }
                               
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};


function eligedescuento(iddescuento){

       console.log("Elige descuento de  ",iddescuento);

      $.ajax({
                      type: "POST",
                      url:"../descuentos/descuentos.php",
                      data: {accion:4, operacion:1, caracteres:iddescuento},
                      dataType: "json",
                      async: true,
                      success: function(descuentos){
 
                              var undescuento = descuentos[0];
                              $("#importe").val(undescuento.descuento);
                              calculaestadia();


                              
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
  };

function borra_descuento(id){
 		$.ajax({
                  
                      type: "POST",
                      url:"descuentos.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: true,
                      success: function(descuentos){
 							            if (descuentos.error == 0){
                            trae_descuentos(0,"");
                          }
                          else{
                            alert(descuentos.valor);
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

function agrega_descuento(d){
    blanquea_formulario();
    $("#descripcion").focus();
    $("#iddescuento").val('0');
    //setTimeout(function() {initialize();}, 2000);  
};


function modifica_descuento(descuento){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar descuento, evento css
    
    blanquea_formulario();
    $("#iddescuento").val((descuento.id).toString());
    $("#descripcion").val(descuento.descripcion);
    $("#precio").val(descuento.porcentaje);
    document.getElementById("mostrar-modal").checked =true;
};



function guarda_descuento() {
            
            if ( $("#descripcion").val()!='')
            {
                var datos = $("form").serialize();
                
                var id= $("#iddescuento").val();
                //se evalua si se esta registrando un nuevo descuento (1) o se esta modificando uno ya existente (2)
                
                 if (id==0) {
                 		var ac=1;
                 		}
                
                else {
                		var ac=2;
                };
                
               
                datos = datos + "&accion="+ac;
                
                $.ajax({      
                          type: "post",
                          url:"descuentos.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(descuentos){
                                 
                                        if (descuentos["error"]==0) {

                                           document.getElementById("cerrar-modal").checked =true;

                                           //$("#modal").hide();
                                           trae_descuentos(0, "");

                                        } 
                                        else{
                                            alert(descuentos["valor"]);
                                            
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
      trae_descuentos(1,texto)
};


