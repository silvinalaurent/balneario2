/*Version: 3.0*/

const serializeForm = (formElement) => {
  const formData = {};
  const inputs = formElement.elements;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].name !== "") {
      switch (inputs[i].type) {
        case "checkbox":
          formData[inputs[i].name] = inputs[i].checked;
          break;
        case "radio":
          if (inputs[i].checked) {
            formData[inputs[i].name] = inputs[i].value;
          }
          break;
        case "select-one":
          formData[inputs[i].name] = inputs[i].value;
          break;
        case "select-multiple":
          formData[inputs[i].name] = [];
          for (let j = 0; j < inputs[i].options.length; j++) {
            if (inputs[i].options[j].selected) {
              formData[inputs[i].name].push(inputs[i].options[j].value);
            }
          }
          break;
        case "textarea":
          formData[inputs[i].name] = inputs[i].value;
          break;
        case "range":
          formData[inputs[i].name] = inputs[i].value;
          break;
        default:
          formData[inputs[i].name] = inputs[i].value;
      }
    }
  }
  return formData;
}

function convertDateFormat(string) {
  var info = string.split('-');
  return info[2] + '/' + info[1] + '/' + info[0];
};

function traeTuristas(){
  $("#tabla tbody").html("");
  var consulta = $("#buscaturista").serializeObject();
  consulta.accion = 4;
  consulta.operacion = 6;
  $.ajax({
    type: "POST",
    url:"../turistas/turistas.php",
    data: consulta ,
    dataType: "json",
    async: false,
    success: function(turistas){
      for (var i in turistas){
        if (i >= 0){
          var unturista = turistas[i];
          var telefono='';
          if (unturista.movil!=undefined) {
            telefono=unturista.movil
          };

          var datosciudad='';
          datosciudad=unturista.dciudad;
          
          if (unturista.nombreciudad!=null){
            datosciudad=unturista.nombreciudad
          };
                                        
          var provincia='';
          if (unturista.nombreprovincia!=undefined){
            provincia=unturista.nombreprovincia
          };

          var pais='';
          if (unturista.nombrepais!=undefined){
            pais=unturista.nombrepais
          };
          
          $("#tabla tbody").append("<tr><td>" + unturista.id + "</td><td>" +unturista.apellido + "</td><td>"+unturista.nombres+"</td><td>"+ unturista.domicilio + "</td><td>"+datosciudad + "</td><td>"+provincia + "</td><td>"+pais+ "</td><td>"+telefono+ "</td><td><a href='#' onclick='modifica_turista("+JSON.stringify(unturista)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' title='Elimina Turista' onclick='borra_turista("+unturista.id+")'><i class=\"icon-trash\"></i></a> - <a href='#' title='Estadias del Turista' onclick='estadias_turista("+unturista.id+")'><i class=\"icon-clock\"></i></a> </td> </tr>"); 
        };
      }; 
    }
  });
};
  
function trae_turistas(tipooperacion,letras) {
	$("#tabla tbody").html("");
	    
	$.ajax({
    type: "POST",
    url:"../turistas/turistas.php",
    data: {
      accion:4,
      operacion:tipooperacion,
      caracteres:letras
    },
    dataType: "json",
    async: false,
    success: function(turistas){
		    for (var i in turistas){
          if (i >= 0){
		        var unturista = turistas[i];
            var telefono='';
            if (unturista.movil!=undefined) {
              telefono=unturista.movil
            };

            var datosciudad='';
            datosciudad=unturista.dciudad;
            
            if (unturista.nombreciudad!=null){
              datosciudad=unturista.nombreciudad
            };
                                          
            var provincia='';
            if (unturista.nombreprovincia!=undefined){
              provincia=unturista.nombreprovincia
            };

            var pais='';
            if (unturista.nombrepais!=undefined){
              pais=unturista.nombrepais
            };
            
            $("#tabla tbody").append("<tr><td>" + unturista.id + "</td><td>" +unturista.apellido + "</td><td>"+unturista.nombres+"</td><td>"+ unturista.nro_documento+"</td><td>"+ unturista.domicilio + "</td><td>"+datosciudad + "</td><td>"+provincia + "</td><td>"+pais+ "</td><td>"+telefono+ "</td><td><a href='#' onclick='modifica_turista("+JSON.stringify(unturista)+")'><i class=\"icon-pencil\"></i></a> - <a href='#' title='Elimina Turista' onclick='borra_turista("+unturista.id+")'><i class=\"icon-trash\"></i></a> - <a href='#' title='Estadias del Turista' onclick='estadias_turista("+unturista.id+")'><i class=\"icon-clock\"></i></a> </td> </tr>"); 
          };
	    	}; 
    },
    error: function (obj, error, objError){
        alert(error);//avisar que ocurrió un error
        
    }
  });
};


function lista_turistas(nombreselector) {
 return new Promise(function(resolve, reject) {
      
      $("#"+nombreselector).empty();
      $("#"+nombreselector).append('<option value="0">Ninguno</option>');
      $.ajax({
                  
                      type: "POST",
                      url:"../turistas/turistas.php",
                      data: {accion:4, operacion:0},
                      dataType: "json",
                      async: false,
                      success: function(turistas){
                          for (var i in turistas){
                              var unturista = turistas[i];
                              var provincia="";
                              if (unturista.nombreprovincia!=null) {provincia=unturista.nombreprovincia}
                              $("#"+nombreselector).append('<option value="'+unturista.id+'">'+unturista.apellido+" "+unturista.nombres+' '+unturista.nro_documento+ " - "+unturista.ciudad+ " "+provincia+'</option>');
                               
                          }; 
                          resolve(true);
                      },
                      error: function (obj, error, objError){
                          
                          reject(alert(error));//avisar que ocurrió un error
                      
                      }
            });
      console.log("listo");
     });
};


function completa_lista_turistas(letras)
{
      $.ajax({
                      type: "POST",
                      url:"../turistas/turistas.php",
                      data: {accion:4, operacion:4, caracteres:letras},
                      dataType: "json",
                      async: false,
                      success: function(turistas){
                      
                          $("#listaautocompletarturista").html("");
                          for(var x in turistas){
                            $("#listaautocompletarturista").append(`<option value="${turistas[x].id}">${turistas[x].id+ ' - '+turistas[x].apynom+' ('+turistas[x].nro_documento+')'}</option>`);
                          }
                        
                          
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
};



function borra_turista(id){
//antes chequear que no este relacionado con una reserva o una estadia
//FALTA CHEQUEAR LOS ACOMPAÑANTES DE ESTADIA
  var resultado= chequea_reservasturista(id).then(r =>{
  var resultado2= chequea_estadiasturista(id).then(r2 =>{
    if ((r) && (r2))
    {
            $.ajax({
                      
                              type: "POST",
                              url:"../turistas/turistas.php",
                              data: {accion:3, codigo:id},
                              dataType: "json",
                              async: false,
                              success: function(tarifas){
                                  if (tarifas.error == 0){
                                    window.alert("El turista fue borrado");
                                    trae_turistas(0,"");
                                  }
                                  else{
                                    alert(tarifas.valor);
                                  }
                              },
                              error: function (obj, error, objError){
                                  alert(error);//avisar que ocurrió un error
                              }
                              
                    })
  }
  else
      alert("No se puede borrar el turista, tiene reservas/estadias relacionadas.")
  }).catch(() => {
     console.log('Algo salió mal');
  });  
}).catch(() => {
    console.log('Algo salió mal');
  });  
  

};


function blanquea_turista(){
    // limpiar formulario turista
    $("#idturista").val('0');
    $("#apellido").val('');
    $("#nombres").val('');
    $("#documento").val('');
    $("#domicilio").val('');
    $("#ciudad1").val('');
    $("#fecha_nacimiento").val('');
    $("#provincia1").val('0');
    $("#pais").val('0');
    $("#telefono").val('');
    $("#email").val('');
    $("#redes").val('');
    $("#ocupacion").val('');
  };

function blanquea_turistar(){
    // limpiar formulario turista
    $("#idturistar").val('0');
    $("#apellidor").val('');
    $("#nombresr").val('');
    $("#documentor").val('');
    $("#domicilior").val('');
    $("#ciudad1r").val('');
    $("#fecha_nacimientor").val('');
    $("#provincia1r").val('0');
    $("#paisr").val('0');
    $("#telefonor").val('');
    $("#emailr").val('');
    $("#redesr").val('');
    $("#ocupacionr").val('');
  };

/*
function limpia_busqueda(){
  
    // limpiar formulario
    $("#buscadescripcion").val('');
   };
*/


function agrega_turista(){
    blanquea_turista();
    $("#apellido").focus();
    $("#idturista").val('0');
    $("#documento").prop("readonly", false);
    $("#documento").prop("disabled", false);
    $('#pais').val('1');//Argentina
    lista_provincias_pais('provincia1',1);
    $("#nuevoturista").show();

};

function agrega_turistar(){
    blanquea_turistar();
    $("#apellidor").focus();
    $("#idturistar").val('0');
    $("#nuevoturistar").show();

};

function agrega_turista_existente(){
    var idturista=$("#turistaid").val();
    console.log(idturista);
    if (idturista>0)
      {
      //agregar a tabla de grupo turistas
        cargaturista(idturista);
        $("#turistaid").val('');
     }

};


function modifica_turista(turista){
    
    lista_provincias_pais('provincia1',turista.pais);
    lista_ciudades_provincia('ciudad1',turista.provincia);
    
    blanquea_turista();
    $("#idturista").val(turista.id);
    $("#apellido").val(turista.apellido);
    $("#nombres").val(turista.nombres);
    $("#documento").val(turista.nro_documento);
    $("#documento").prop("readonly", true);
    $("#documento").prop("disabled", true);
    $("#domicilio").val(turista.domicilio);
   
    $("#pais").val(turista.pais);
    setTimeout(function() {
      console.log("se asigna la provincia");
      $("#provincia1").val(turista.provincia);
     }, 2000);
    setTimeout(function() {
      console.log("se asigna la ciudad");
      $("#ciudad1").val(turista.ciudad);
    }, 2000);
    
    $("#fecha_nacimiento").val(turista.fecha_nacimiento);
    $("#telefono").val(turista.movil);
    $("#email").val(turista.correo);
    $("#redes").val(turista.redes_sociales);
    $("#ocupacion").val(turista.ocupacion);
    document.getElementById("mostrar-modal").checked =true;
};

function estadias_turista(turista){
  
    $("#tabla2 tbody").html("");
      
      $.ajax({
                  
                      type: "POST",
                      url:"../estadias/estadias.php",
                      data: {accion:4, operacion:15, caracteres:turista},
                      dataType: "json",
                      async: false,
                      success: function(estadias){
                      
                          for (var i in estadias){
                       
                           if (i >= 0)
                            {
                              var unaestadia = estadias[i];
                              var fechad = convertDateFormat(unaestadia.fecha_ingreso);
                              var fechah = convertDateFormat(unaestadia.fecha_egreso);
                              $("#tabla2 tbody").append("<tr><td>" + unaestadia.id+ "</td><td>"+unaestadia.idparcela + "</td><td>"+unaestadia.nrocarpa+"</td><td>"+unaestadia.apellido+" "+unaestadia.nombres+"</td><td>"+fechad+"</td><td>"+fechah+"</td><td>"+unaestadia.descripcion+"<td>"+unaestadia.total+"</td></tr>"); 
                            } 
                       
                          }; 
                          
                      },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                          
                      }

            });
    document.getElementById("mostrar-modal2").checked =true;
};


function guarda_turista(tipo) {
//tipo indica si se lo llama desde Turistas.html (T) o de Parcela.html (E) (en una nueva estadia)                          
            var id=$("#idturista").val();             
            var apellido=$("#apellido").val();
            var nombres=$("#nombres").val();
            var documento=$("#documento").val();
            var domicilio=$("#domicilio").val();
            var ciudad=$("#ciudad1").val();
            var provincia=$("#provincia1").val();
            var pais= 0;
            if ($("#pais").val()!=null)
            {
              pais=$("#pais").val();
            }
            var telefono=$("#telefono").val();
            var email=$("#email").val();
            var redes=$("#redes").val();
            var fecha_nac= '0000-00-00';
            if ($("#fecha_nacimiento").val()!='')
            {
              fecha_nac=$("#fecha_nacimiento").val();
            }
            var ocupacion=$("#ocupacion").val();
            if ((apellido!='') && (nombres!='') && (documento!=''))
            {
                if (id==0) {
                 		var ac=1;
                		}
                else {
                		var ac=2;
                };
                datos = "idturista="+id+"&apellido="+apellido+"&nombres="+nombres+"&documento="+documento+"&domicilio="+domicilio+"&ciudad="+ciudad +"&provincia="+provincia+"&pais="+pais+"&telefono="+telefono+ "&email="+email+"&redes="+redes+"&fecha_nacimiento="+fecha_nac+"&ocupacion="+ocupacion+"&accion="+ac;
                $.ajax({      
                              type: "post",
                              url:"../turistas/turistas.php",
                              data:datos,
                              dataType: "json",
                              async: false,
                              success: function(turistas){
                                  if (turistas["error"]==0) {
                                        if (tipo=='E')//Estadias
                                        {
                                          $("#nuevoturista").hide();
                                          var id= ultimoturista().then(r =>{
                                              if (r) 
                                                {   //cargo turista a la tabla      
                                                  cargaturista(r);
                                                }
                                            }).catch(() => {
                                                console.log('Algo salió mal');
                                             });  
                                          } 
                                        else 
                                          {
                                              //Acciones para luego de guardar desde turistas.html
                                              document.getElementById("cerrar-modal").checked =true;
                                              trae_turistas(0, "");
                                          }
                                     }
                                     else{
                                            alert(turistas["valor"]);
                                      };                  
                                          
                              
                              },
                              error: function (obj, error, objError){
                                  alert(error);//avisar que ocurrió un error
                              }
                        });
              }
            else{
                alert('Complete Apellido, Nombres y Nro. de Documento, por favor');
                }
};

function actualizo_turista(idturista,tipo){
  if (tipo=="R")
    var select=document.getElementById("listaturistasr");
  else
    var select=document.getElementById("listaturistas"); 
  console.log("cantidad de turistas ",select.length);
      for(var i=1;i<select.length;i++)
      {
        if(select.options[i].value==idturista)
          {// seleccionamos el valor que coincide
            select.selectedIndex=i;
            console.log("encontrado");
          }
      }
    }


function ultimoturista(){
  return new Promise(function(resolve, reject) {
      $.ajax({
                  
                      type: "POST",
                      url:"../turistas/turistas.php",
                      data: {accion:4, operacion:2},
                      dataType: "json",
                      async: false,
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


function chequea_reservasturista(id){
// controlar si el turista tiene reservas relacionadas
console.log("Chequea reservas turistas de ",id);
return new Promise(function(resolve, reject) {
      var resultado=true;
      $.ajax({
                      type: "POST",
                      url:"../reservas/reservas.php",
                      data: {accion:4, operacion:8, caracteres:id},
                      dataType: "json",
                      async: false,
                      success: function(reservas){
                          if (reservas.error!=1)
                          {
                              resultado=false;
                              console.log("El turista tiene reservas");  
                          }
                          resolve(resultado);
                      },
                      error: function (obj, error, objError){
                          reject(alert(error));
                      }
            });
      });
};


function chequea_estadiasturista(id){
// controlar si el turista tiene estadias relacionadas
console.log("Chequea estadias turistas de ",id);

return new Promise(function(resolve, reject) {
      var resultado=true;
      $.ajax({
                      type: "POST",
                      url:"../estadias/estadias.php",
                      data: {accion:4, operacion:10, caracteres:id},
                      dataType: "json",
                      async: false,
                      success: function(estadias){
                          if (estadias.error!=1)
                          {
                              resultado=false;  
                              console.log("El turista tiene estadias");  
                          }
                          resolve(resultado);
                      },
                      error: function (obj, error, objError){
                          reject(alert(error));
                      }
            });
    });
};


function cargaturista(id){
  //en parcela.html, se carga a una tabla temporaria el grupo de turistas acampantes.
      console.log("se agrega turista a tabla");
      $.ajax({
                 //problema para borrar turista 
                      type: "POST",
                      url:"../turistas/turistas.php",
                      data: {accion:4, operacion:1, caracteres:id},
                      dataType: "json",
                      async: false,
                      success: function(turistas){
                            var unturista=turistas[0];
                            console.log("Turista ",unturista);
                            
                            
                            $("#tablaturistas").append("<tr id='Fila"+unturista.id+"'><td id='A'>"+ unturista.id +"</td><td>"+unturista.apellido +" " +unturista.nombres+ "</td><td>"+"DNI "+unturista.nro_documento+"</td><td>"+unturista.movil+"</td><td>"+unturista.ciudad+"</td><td>"+unturista.nombreprovincia+"</td><td><a href='#'          onclick='quitaturista("+unturista.id+")'><i class=\"icon-trash\"></i></a></td></tr>");             
                            
                            //
                        },
                      error: function (obj, error, objError){
                          alert(error);//avisar que ocurrió un error
                      }
            });
  
};

function quitaturista(idfila)
{
  console.log("Se elimina la fila de la tabla de turistas ",idfila);
  $("#Fila" + idfila).remove();
}


function cierraventana(){
  //se utiliza en estadias
  $("#nuevoturista").hide();
};

function cierraventanar(){
  //se utiliza en estadias
  $("#nuevoturistar").hide();
};

function filtrarapellido(texto) {
  if (texto.length > 3)
  {
      trae_turistas(3,texto);
  }
   
};

function tiene_email(id){
  var resp=false;
  $.ajax({
                  
    type: "POST",
    url:"../turistas/turistas.php",
    data: {accion:4, operacion:5, caracteres:id},
    dataType: "json",
    async: false,
    success: function(turistas){
    
            var turista = turistas[0];
            if (turista.correo!='')
              resp=true;
            
    },
    error: function (obj, error, objError){
        alert(error);//avisar que ocurrió un error
        
      
    }
  });  
return resp;  
}

function existe_dni(dni){
  var resp=false;
  $.ajax({
    type: "POST",
    url:"../turistas/turistas.php",
    data: {accion:4, operacion:7, caracteres:dni},
    dataType: "json",
    async: false,
    success: function(turistas){
      console.log(turistas);
      if (turistas["error"]!=1)
      {
        resp=true;
      } 
    },
    error: function (obj, error, objError){
      alert(turistas["valor"]);
    }
    }); 
  return resp; 
  };
  
  function corrobora_dni(dni){
    var id= $("#idturista").val();
    if (id==0) {// si es un alta se comprueba el DNI sino no se modifica, esta en campo deshabilitado
      if (existe_dni(dni))
        {
          alert("El DNI ingresado ya esta cargado en nuestra base de datos.");
          $("#documento").val("");
        }
    };
  }


  $(document).on("change", "#provincia1", function() {
    console.log("Cambia provincia");
    let provinciaID = $(this).val();
    if (provinciaID) {
      lista_ciudades_provincia('ciudad1', provinciaID);
    } else {
        $("#ciudad1").html('<option value="">Seleccione una ciudad</option>');
    }
});

$(document).on("change", "#pais", function() {
  console.log("Cambia pais");
  let paisID = $(this).val();

  if (paisID) {
    lista_provincias_pais('provincia1', paisID);
  } else {
      $("#provincia1").html('<option value="">Seleccione una ciudad</option>');
  }
});

