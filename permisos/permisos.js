/*Version: 4.0*/

function trae_menues_usuario(usuario) {
      
      sessionStorage.setItem("Usuario", usuario);
      $.ajax({
                  
                      type: "POST",
                      url:"permisos/permisos.php",
                      data: {accion:6, usuario:usuario},
                      dataType: "json",
                      async: true,
                      success: function(menues){
 
                          for (var i in menues){
                       
                           if (i >= 0)
                           {
                              var unmenu = menues[i];
                              
                              //cargar menues
                              if (unmenu.nivel==1)
                              {  
                                  console.log("agrega menu ",unmenu.titulo);                                   
                                  if (unmenu.url=='')
                                  {  
                                    $("#zonamenu nav #nivel1").append("<li id="+unmenu.id+"><a href='#'>"+unmenu.titulo+"</a> <ul></ul> </li>");
                                  }
                                  else
                                  {  
                                    var url=unmenu.url;
                                    $("#zonamenu nav #nivel1").append("<li id="+unmenu.id+"><a href='"+unmenu.url+"' target='formularios'>"+unmenu.titulo+"</a> <ul></ul> </li>");
                                  }
                              }
                              else
                                  {
                                        console.log('agrega submenu '+unmenu.titulo);
                                        var padre=document.getElementById("+unmenu.id+");
                                        console.log("#"+unmenu.padre);
                                        $("#"+unmenu.padre+" ul").append("<li id="+unmenu.padre+"."+unmenu.id+"><a href='"+unmenu.url+"' target='formularios'>"+unmenu.titulo+"</a></li>");
                                 }   
                              
                           } 
                       
                          }; 
                          
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
      if ((usuario==42) || (usuario==16) || (usuario==21))//si es Romina Udrizard
        {
            console.log("deberia mostrar avisos");
            document.getElementById("formularios").setAttribute("src","avisos.html");
        }   

};

function trae_menues(tipooperacion,letras) {
      
      $("#tabla tbody").html("");
      
      $.ajax({
                  
                      type: "POST",
                      url:"../menues/menues.php",
                      data: {accion:4, operacion:tipooperacion, caracteres:letras},
                      dataType: "json",
                      async: true,
                      success: function(menues){
 
                          for (var i in menues){
                       
                           if (i >= 0)
                           {
                              var unmenu = menues[i];
                              $("#tabla tbody").append("<tr><td>" + unmenu.id + "</td><td>" + unmenu.titulo + "</td><td>" + unmenu.url + "</td><td>" + unmenu.nivel + "</td><td>" + unmenu.padre + "</td><td><a href='#' onclick='modifica_menu("+JSON.stringify(unmenu)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' onclick='borra_menu("+unmenu.id+")'><i class=\"icon-trash\"></i></a> </td> </tr>"); 

                           } 
                       
                          }; 
                          
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};

function lista_menues() {
      
      $("#tabla tbody").html("");
      
      $.ajax({
                  
                      type: "POST",
                      url:"../menues/menues.php",
                      data: {accion:4, operacion:0, caracteres:''},
                      dataType: "json",
                      async: true,
                      success: function(menues){
 
                        /*  for (var i in menues){
                       
                           if (i >= 0)
                           {
                              var unmenu = menues[i];
                              $("#tabla tbody").append("<tr id="+unmenu.id+"><td>"+unmenu.id+"</td><td>"+unmenu.titulo+"</td><td><input type='checkbox' id='cbox"+unmenu.id+"' value="+unmenu.id+"></td> </tr>"); 

                          
                           } 
                       
                          };
                          construirMenu(menues, 0);
                         */
                         const padres = menues.filter(m => m.padre === "0");

                            // agrupar hijos
                            const hijosPorPadre = {};
                            menues.forEach(m => {
                                if (m.padre !== "0") {
                                    if (!hijosPorPadre[m.padre]) {
                                        hijosPorPadre[m.padre] = [];
                                    }
                                    hijosPorPadre[m.padre].push(m);
                                }
                            });

                            // render
                            const contenedor = document.getElementById("contenedor-menues");

                            padres.forEach(padre => {

                                const divPadre = document.createElement("div");
                                divPadre.className = "menu-padre";

                                const labelPadre = document.createElement("label");
                                labelPadre.className = "item-menu";

                                const chkPadre = document.createElement("input");
                                chkPadre.type = "checkbox";
                                chkPadre.value = padre.id;
/*
                                chkPadre.addEventListener("change", function () {

                                    const hijosCheckbox = divPadre.querySelectorAll(
                                        ".menu-hijos input[type=checkbox]"
                                    );

                                    hijosCheckbox.forEach(chk => {
                                        chk.checked = this.checked;
                                    });

                                });
                                */
                                labelPadre.appendChild(chkPadre);
                                labelPadre.append(" " + padre.titulo);
                                divPadre.appendChild(labelPadre);

                                // hijos
                                const hijos = hijosPorPadre[padre.id];
                                if (hijos) {
                                    const ul = document.createElement("ul");
                                    ul.className = "menu-hijos";

                                    hijos.forEach(hijo => {
                                        const li = document.createElement("li");

                                        const label = document.createElement("label");
                                        label.className = "item-menu";

                                        const chk = document.createElement("input");
                                        chk.type = "checkbox";
                                        chk.value = hijo.id;
/*
                                        chk.addEventListener("change", function () {

                                            const hijos = divPadre.querySelectorAll(
                                                ".menu-hijos input[type=checkbox]"
                                            );

                                            const algunoMarcado = Array.from(hijos).some(c => c.checked);

                                            chkPadre.checked = algunoMarcado;

                                        });

*/
                                        label.appendChild(chk);
                                        label.append(" " + hijo.titulo);

                                        li.appendChild(label);
                                        ul.appendChild(li);
                                    });

                                    divPadre.appendChild(ul); // 🔴 CLAVE
                                }

                                contenedor.appendChild(divPadre);
                            });
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};


function lista_permisos(usuario) {
     
 //probar     
      blanquea();
      if (usuario > 0)
      {
      console.log("usuario ",usuario);
     $("#idusuario").val(usuario);
      //console.log( $("#idusuario").val());
      
      $.ajax({
                  
                      type: "POST",
                      url:"../permisos/permisos.php",
                      data: {accion:4, usuario:usuario},
                      dataType: "json",
                      async: true,
                      success: function(permisos){
 /*
                          for (var i in permisos){
                              //console.log("permisos ",permisos[i].menu_id);
                              var permiso=permisos[i].menu_id;
                              $("#"+"cbox"+permiso).prop("checked", true);
                          }
   */                        
                            aplicarPermisos(permisos);                       
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
      }
};


function aplicarPermisos(permisos) {
  permisosUsuario = permisos.map(p => p.menu_id);
  // 1️⃣ desmarcar todos
  document
    .querySelectorAll("#contenedor-menues input[type=checkbox]")
    .forEach(chk => chk.checked = false);

  // 2️⃣ marcar solo los permitidos
  permisosUsuario.forEach(idMenu => {
    console.log(idMenu);
    const checkbox = document.querySelector(
      `#contenedor-menues input[type=checkbox][value="${idMenu}"]`
    );
    if (checkbox) checkbox.checked = true;
  });
}

function blanquea() {
 //limpia tabla de menues de permisos.html
    document
        .querySelectorAll("#contenedor-menues input[type=checkbox]")
        .forEach(chk => chk.checked = false);

};



function tiene_permiso(usuario,menu)
{
return new Promise(function(resolve, reject) {
 $.ajax({
                      type: "POST",
                      url:"../permisos/permisos.php",
                      data: {accion:5,usuario:usuario, menu:menu},
                      dataType: "json",
                      async: false,
                      success: function(permisos){
                          console.log("menu ",menu);
                          if (permisos.error==1)
                          {
                            console.log("no tiene permiso");
                            resolve(false);
                          }
                          else 
                            {
                              console.log("tiene permiso");
                              resolve(true);
                           }
                      },
                      error: function (obj, error, objError){
                          
                          reject(alert(error));//avisar que ocurrió un error
                      }
            });
});

};

/*function guarda_permisos() {
            
            //se recorre la tabla de checkbox de permisos y se graban o borran los permisos que correspondan.
            
          
            var usuario=$("#idusuario").val();
           // console.log("usuario en guarda ", usuario);
           
                $('#tabla tr').each(function ()
                  {
                    var menu_id=$(this).find("td").eq(0).html();
                    console.log("menu ",menu_id);
                    
                    if ($('#cbox'+menu_id).prop('checked') ) 
                     {   
                        //permiso checkeado  
                        console.log("permiso elegido");
                        
                        tiene_permiso(usuario,menu_id).then(r =>{
                        if (r==false) 
                        {
                          graba_permiso(usuario,menu_id);
                        }
                        }).catch(() => {
                              console.log('Algo salió mal');
                        });
                     }
                     else
                      {   
                        //permiso no checkeado
                        tiene_permiso(usuario,menu_id).then(r =>{
                        if (r) {
                               borra_permiso(usuario,menu_id)
                               }
                        }).catch(() => {
                            console.log('Algo salió mal');
                        });
                     };

                  });
                  alert("Se registraron los cambios");
               
};
*/
function guarda_permisos() {

    const usuario = $("#idusuario").val();

    if (usuario) {
        

        const checkboxes = document.querySelectorAll(
            "#contenedor-menues input[type=checkbox]"
        );

        checkboxes.forEach(chk => {

            const menu_id = chk.value;
            const marcado = chk.checked;

            if (marcado) {

                tiene_permiso(usuario, menu_id).then(r => {
                    if (!r) graba_permiso(usuario, menu_id);
                });

            } else {

                tiene_permiso(usuario, menu_id).then(r => {
                    if (r) borra_permiso(usuario, menu_id);
                });

            }

        });

        alert("Se registraron los cambios");
    }
    else 
        alert("Seleccione un usuario");
        

}

function graba_permiso(usuario,menu)
{   
      console.log("se guarda, menu ", menu, " usuario ", usuario);
      $.ajax({
                  
                      type: "POST",
                      url:"../permisos/permisos.php",
                      data: {accion:1, usuario:usuario, menu:menu},
                      dataType: "json",
                      async: true,
                      success: function(permisos){
                          console.log("se guardo permiso");
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
 };


function borra_permiso(usuario,menu)
{   
      $.ajax({
                  
                      type: "POST",
                      url:"../permisos/permisos.php",
                      data: {accion:3, usuario:usuario, menu:menu},
                      dataType: "json",
                      async: true,
                      success: function(permisos){
                           console.log("se borro permiso");
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
 };


