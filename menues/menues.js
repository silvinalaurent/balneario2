/*Version: 3.0*/

function trae_menues(tipooperacion,letras) {
      
      $("#tabla tbody").html("");
      $.ajax({
                  
                      type: "POST",
                      url:"menues.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(menues){
 
                          for (var i in menues){
                       
                           if (i >= 0)
                           {
                              var unmenu = menues[i];
                              $("#tabla tbody").append("<tr><td>" + unmenu.id + "</td><td>"+ unmenu.titulo + "</td><td>"+ unmenu.url + "</td><td>"+ unmenu.nivel +"</td><td>"+ unmenu.padre +"</td><td><a href='#' onclick='modifica_menu("+JSON.stringify(unmenu)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_menu("+unmenu.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 
                           } 
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};

function borra_menu(id){

 		$.ajax({
                  
                      type: "POST",
                      url:"menues.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: true,
                      success: function(menues){
 							            if (menues.error == 0){
                            trae_menues(0,"");
                            
       
                          }
                          else{
                            alert(menues.valor);
                          }
 							
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
};	


function blanquea_formulario(){
   
    // limpiar formulario
    $("#idmenu").val(0);
    $("#titulo").val('');
    $("#url").val('');
    $("#nivel").val('');
    $("#padre").val('');
  };

function limpia_busqueda(){
  
    // limpiar formulario
    $("#buscatipo").val('');
   };

function agrega_menu(d){
    blanquea_formulario();
    $("#titulo").focus();
    $("#idayuda").val('0');
    //setTimeout(function() {initialize();}, 2000);  
};


function modifica_menu(menu){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar ayuda, evento css
    
    blanquea_formulario();
    $("#idmenu").val((menu.id).toString());
    $("#titulo").val(menu.titulo);
    $("#url").val(menu.url);
    $("#nivel").val(menu.nivel);
    $("#padre").val(menu.padre);
    document.getElementById("mostrar-modal").checked =true;
};



function guarda_menu() {
            
            if ( $("#titulo").val()!='')
            {
                var datos = $("form").serialize();
                var id=0;
                id= $("#idmenu").val();
                //se evalua si se esta registrando un nuevo (1) o se esta modificando uno ya existente (2)
                
                 if (id==0) {
                 		var ac=1;
                 		}
                
                else {
                		var ac=2;
                };
                
               
                datos = datos + "&accion="+ac;
                
                $.ajax({      
                          type: "post",
                          url:"menues.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(menues){
                                 
                                        if (menues["error"]==0) {

                                           document.getElementById("cerrar-modal").checked =true;
                                                                                  
                                           trae_menues(0, "");

                                        } 
                                        else{
                                            alert(menues["valor"]);
                                            
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
      trae_menues(1,texto)
};


   