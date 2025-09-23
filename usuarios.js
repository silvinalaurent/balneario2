/*Version: 3.0*/

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
                              $("#tabla tbody").append("<tr><td>" + unusuario.usuario + "</td><td><a href='#' onclick='modifica_usuario("+JSON.stringify(unusuario)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='modifica_clave("+JSON.stringify(unusuario)+")'><i class=\"icon-key\"></i></a> - <a href='#' onclick='borra_usuario("+unusuario.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 
                              /**/
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
    
};

function modifica_usuario(usuario){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar usuario, evento css
    blanquea_formulario();
    $("#idusuario").val((usuario.id).toString());//o lo puede tomar del parametro
    $("#nombreusuario").val(usuario.usuario);
    document.getElementById("claveusuario").disabled =true;
    document.getElementById("claverep").disabled =true;
    document.getElementById("mostrar-modal").checked =true;
};

function modifica_clave(usuario){
   //ver forma de mostrar modal, como si se hubiera  presionado sobre agregar usuario, evento css
    blanquea_formulario();
    $("#idusuario").val((usuario.id).toString());
    $("#nombreusuario").val(usuario.usuario);
    document.getElementById("nombreusuario").disabled =true;
    document.getElementById("mostrar-modal").checked =true;

};

function guarda_usuario() {
            
            console.log("guarda usuario");
            var datos = $("form").serialize();
            var id= $("#idusuario").val();

            //se evalua si se esta registrando un nuevo usuario (1) o se esta modificando uno ya existente (2)
            if (id==0) var ac=1
            else var ac=2;
            
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



function comprueba(){ 
    console.log("comprueba");
    var id= $("#idusuario").val();
    var nombreusuario= $("#nombreusuario").val();
    var claveusuario= $("#claveusuario").val();
    console.log(nombreusuario);
    //se evalua si se esta registrando un nuevo usuario (1) o se esta modificando uno ya existente (2)
    if (id==0) {
                console.log("es un alta de usuario");
                //comprobar que no exista ya ese nombre de usuario y que las claves sean iguales
                console.log("comprobar_usuario");                
                comprobar_usuario(nombreusuario).then(r =>{
                console.log(r)
                if (r) 
                  {alert("Ya hay un usuario con este nombre "+nombreusuario+ ", por favor controle sus datos")}
                else 
                {
                    console.log("ese nombre de usuario no existe, ahora comprueba claves")
                    if (comprobar_clave()==true)
                    {  
                      console.log("se puede guardar");
                      guarda_usuario();
                    }
                    else
                      alert("Las claves no coinciden");
                }

              }).catch(() => {
                console.log('Algo salió mal');
              });

            }
    else {
          //si esta modificando          
              if (document.getElementById("nombreusuario").disabled) 
              {
                  //modifica clave
                  if (comprobar_clave()==true)
                    {  
                      console.log("se puede guardar");
                      guarda_clave(nombreusuario,claveusuario);
                    }
                    else
                      alert("Las claves no coinciden");
              }
              else
                {
                  //modifica usuario
                comprobar_usuario(nombreusuario).then(r =>{
                console.log(r)
                if (r) 
                  {alert("Ya hay un usuario con este nombre "+nombreusuario+ ", por favor controle sus datos")}
                else 
                {
                    console.log("ese nombre de usuario no existe, ahora comprueba claves")
                    //se guarda el nombre del usuario
                    guarda_nombre_usuario(id,nombreusuario);
                }

              }).catch(() => {
                console.log('Algo salió mal');
              });

                }
            };
};      
    

function comprobar_usuario(nombreusuario){ 
   return new Promise(function(resolve, reject) {
 
    $.ajax({
                      type: "POST",
                      url:"usuarios.php",
                      data: {accion:4, operacion:2, caracteres:nombreusuario},
                      dataType: "json",
                      async: true,
                      success: function(usuarios){

                          console.log("Resultado de usuarios ",usuarios);
                          if (usuarios.error==1)
                          {
                            console.log("no existe ese usuario");
                            resolve(false);
                          }
                          else 
                            {
                              console.log("ya existe ese usuario");
                              resolve(true);
                           }
                          resolve(true); 
                      },
                      error: function (obj, error, objError){
                          
                          reject(alert(error));//avisar que ocurrió un error
                          
                      }

            });
    });
};


function comprobar_clave(){ 
    console.log("comprueba clave")
    clave1 = document.form_usuario.claveusuario.value;
    clave2 = document.form_usuario.claverep.value ;

    if (clave1 == clave2) 
      {
        console.log("son iguales");
        return true;
      } 
    else 
      {
        alert("Las dos claves son distintas..."); 
        return false;
      }
}; 


// para usuario.html   

function cambiar_clave_usuario() {
   //falta controlar longitud de clave

    var nombreusuario = document.getElementById("nombreusuario").innerHTML;
    var clavenueva = $("#claveusuario").val();
    var clavenueva2 = $("#claverep").val();
    
      console.log(nombreusuario, clavenueva, clavenueva2);
      if (clavenueva == clavenueva2) 
        //estoy mandando el nombre de usuario deberia enviar el id
          guarda_clave(nombreusuario,clavenueva);
      else 
          alert("Las dos claves son distintas..."); 
    
} 

function guarda_clave(usuario,clave) 
{
  $.ajax({
                      type: "POST",
                      url:"usuarios.php",
                      data: {accion:5, nombreusuario:usuario, claveusuario:clave},
                      dataType: "json",
                      async: true,
                      success: function(usuarios){
                          alert("Se guardo la clave");
                          var iframe = document.getElementById("formularios");
                          iframe.setAttribute("src", "blanco.html");

                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};

function guarda_nombre_usuario(idusuario,nombreusuario) 
{
  $.ajax({
                      type: "POST",
                      url:"usuarios.php",
                      data: {accion:6, idusuario:idsuario,nombreusuario:nombreusuario},
                      dataType: "json",
                      async: true,
                      success: function(usuarios){
                          
                          alert("Se cambio el nombre de usuario");
                          var iframe = document.getElementById("formularios");
                          iframe.setAttribute("src", "blanco.html");

                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};