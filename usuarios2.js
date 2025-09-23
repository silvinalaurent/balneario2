/*Version: 3.0*/

function existe_usuario(nombreusuario) {

      $.ajax({
                  
                      type: "POST",
                      url:"usuarios.php",
                      data: {accion:4, operacion:2, caracteres:nombreusuario},
                      dataType: "json",
                      async: true,
                      success: function(usuarios){
 
                          if usuarios[0].id <> 0 return true;
                          else return false;
                       
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};


function trae_usuarios(tipooperacion,letras) {
      
      $("#tabla tbody").html("");
      $.ajax({
                  
                      type: "POST",
                      url:"usuarios.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(usuarios){
 
                          for (var i in usuarios){
                       
                           if (i >= 0)
                           {
                              var unusuario = usuarios[i];
                              $("#tabla tbody").append("<tr><td>" + unusuario.usuario + "</td><td><a href='#' onclick='modifica_usuario("+JSON.stringify(unusuario)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_usuario("+unusuario.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 
                           } 
                          }; 
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};

function lista_usuarios() {
      
      //faltaria limpiar el select
      $.ajax({
                  
                      type: "POST",
                      url:"usuarios.php",
                      data: {accion:4, operacion:0, caracteres:''},
                      dataType: "json",
                      async: true,
                      success: function(usuarios){
                          $("#usuario_id").append('<option value="0">0 - Ninguno</option>');
                          for (var i in usuarios){
                       
                           
                              var unusuario = usuarios[i];
                              
                              $("#usuario_id").append('<option value="'+unusuario.id+'">'+unusuario.id+' - '+unusuario.usuario+'</option>');
                              };
                           
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
};

function borra_usuario(idusuario){

    $.ajax({
                  
                      type: "POST",
                      url:"usuarios.php",
                      data: {accion:3, codigo:idusuario},
                      dataType: "json",
                      async: true,
                      success: function(usuarios){
                          if (usuarios.error == 0){
                            trae_usuarios(0,"");
                            
                                }
                          else{
                            alert(usuarios.valor);
                          }
              
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }

            });
};  


function blanquea_formulario(){
   
    // limpiar formulario
    $("#nombreusuario").val('');
    $("#claveusuario").val('');
    $("#claverep").val('');
 };

function limpia_busqueda(){
    // limpiar formulario
    $("#buscausuario").val('');
   };

function agrega_usuario(d){
    blanquea_formulario();
    $("#nombreusuario").focus();
    $("#idusuario").val('0');
    //setTimeout(function() {initialize();}, 2000);  
};

function modifica_usuario(usuario){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar usuario, evento css
    blanquea_formulario();
    $("#idusuario").val((usuario.id).toString());
    $("#nombreusuario").val(usuario.usuario);
    document.getElementById("mostrar-modal").checked =true;
};

function guarda_usuario() {
            
            //¡¡¡FALTA chequear si ya existe un usuario con ese nombre
            
            var datos = $("form").serialize();
            
            var id= $("#idusuario").val();
            //se evalua si se esta registrando un nuevo usuario (1) o se esta modificando uno ya existente (2)
             if (id==0) {
                var ac=1;
                }
            else {
                var ac=2;
            };
            
            if (ac==1) AND (existe_usuario( $("#nombreusuario").val()))
            {  
            

            }
            else
              alert('Ya existe un usuariio con ese nombre');
            {  
            datos = datos + "&accion="+ac;
            
            $.ajax({      
                      type: "post",
                      url:"usuarios.php",
                      data:datos,
                      dataType: "json",
                      async: true,
                
                      success: function(usuarios){
                             
                                    if (usuarios["error"]==0) {

                                       document.getElementById("cerrar-modal").checked =true;

                                     
                                       //$("#modal").hide();
                                       trae_usuarios(0, "");

                                    } 
                                    else{
                                        alert(usuarios["valor"]);
                                        
                                    };                  
                      },
                
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

                });
            
};

function filtrar(texto) {
      trae_usuarios(1,texto)
};

function comprobar_usuario(){ 
//falta arreglar se cuelga
    $.ajax({
                      type: "POST",
                      url:"usuarios.php",
                      data: {accion:4, operacion:2, caracteres:nombreusuario},
                      dataType: "json",
                      async: true,
                      success: function(usuarios){
 
                          for (var i in usuarios){
                                              }; 
                          if (i >= 1)
                           {
                               alert("Ya existe un usuario con ese nombre");
              } 
                           else
                              comprobar_clave(); 
                          
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};




function comprobar_clave(){ 
    clave1 = document.form_usuario.claveusuario.value;
    clave2 = document.form_usuario.claverep.value ;

    if (clave1 == clave2) 
        guarda_usuario();
    else 
        alert("Las dos claves son distintas..."); 
} 


// para usuario.html   

function cambiar_clave_usuario() {
   //falta controlar longitud de clave

    var nombreusuario = document.getElementById("nombreusuario").innerHTML;
    //var claveactual = document.getElementById("claveusuarioa").value;
    var clavenueva = $("#claveusuarion").val();
    var clavenueva2 = $("#claverep").val();
    //if (clavenueva.length()=6)
    //{
      console.log(nombreusuario, clavenueva, clavenueva2);
      if (clavenueva == clavenueva2) 
        //estoy mandando el nombre de usuario deberia enviar el id
          guarda_clave(nombreusuario,clavenueva);
      else 
          alert("Las dos claves son distintas..."); 
    //}
    //else
    //  alert('La clave debe tener 6 caracteres')
} 

function guarda_clave(usuario,clave) {
  $.ajax({
                      type: "POST",
                      url:"usuarios.php",
                      data: {accion:5, nombreusuario:usuario, claveusuario:clave},
                      dataType: "json",
                      async: true,
                      success: function(usuarios){
                          //AVISAR QUE SE CAMBIO EXITOSAENTE LA CLVE
                          //FALTA ESTETICA DE CSS
                          alert("Se guardo la clave");
                          var iframe = document.getElementById("formularios");
                          iframe.setAttribute("src", "blanco.html");

                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
}