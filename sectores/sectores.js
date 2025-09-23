/*Version: 3.0*/
function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};



  

function trae_sectores(tipooperacion,letras) {
      
      $("#tabla tbody").html("");
      
      $.ajax({
                  
                      type: "POST",
                      url:"sectores.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(sectores){
 
                          for (var i in sectores){
                       
                           if (i >= 0)
                           {
                              var unsector = sectores[i];
                              $("#tabla tbody").append("<tr><td>" + unsector.descripcion + "</td><td><a href='#' onclick='modifica_sector("+JSON.stringify(unsector)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_sector("+unsector.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 

                           } 
                       
                          }; 
                          
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};


function lista_sectores(nombreselector) {
      $("#listasectores").append('<option value="0">Ninguno</option>');
      $.ajax({
                  
                      type: "POST",
                      url:"sectores.php",
                      data: {accion:4, operacion:0},
                      dataType: "json",
                      async: true,
                      success: function(sectores){
 
                          
                          for (var i in sectores){
                              var unsector = sectores[i];
                              
                              $("#"+nombreselector).append('<option value="'+unsector.id+'">'+unsector.descripcion+'</option>');
                              
                               
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};



function borra_sector(id){

    $.ajax({
                  
                      type: "POST",
                      url:"sectores.php",
                      data: {accion:3, codigo:id},
                      dataType: "json",
                      async: true,
                      success: function(sectores){
                          if (sectores.error == 0){
                            trae_sectores(0,"");
                            
       
                          }
                          else{
                            alert(sectores.valor);
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


function agrega_sector(){
    blanquea_formulario();
    $("#nombre").focus();
    $("#idsector").val('0');
    
};

function modifica_sector(sector){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar sector, evento css
    
    blanquea_formulario();
    $("#idsector").val((sector.id).toString());
    $("#nombre").val(sector.descripcion);
    document.getElementById("mostrar-modal").checked =true;
};

function guarda_sector() {
            
            if ( $("#nombre").val()!='')
            {
                var datos = $("form").serialize();
                
                var id= $("#idsector").val();
                //se evalua si se esta registrando un nuevo sector (1) o se esta modificando uno ya existente (2)
                
                 if (id==0) {
                    var ac=1;
                    }
                
                else {
                    var ac=2;
                };
                
               
                datos = datos + "&accion="+ac;
                
                $.ajax({      
                          type: "post",
                          url:"sectores.php",
                          data:datos,
                          dataType: "json",
                          async: true,
                    
                          success: function(sectores){
                                 
                                        if (sectores["error"]==0) {

                                           document.getElementById("cerrar-modal").checked =true;

                                         
                                           //$("#modal").hide();
                                           trae_sectores(0, "");

                                        } 
                                        else{
                                            alert(sectores["valor"]);
                                            
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

// function filtrar(texto) {
//       trae_sectores(1,texto)
// };


