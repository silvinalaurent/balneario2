/*Version: 7.0"*/

jQuery(document).on('submit','#formlogin', function(event){

event.preventDefault();

  jQuery.ajax({
    url:'login.php', 
    type:'POST',
    dataType:'json',
    data: $(this).serialize(),
    beforeSend: function(){
      $('.boton').val('Validando');
    }
  })

  .done(function(respuesta) {
      console.log(respuesta);
      if (!respuesta.error){
        location.href='menu.php';
      }
      else{
        
        $("#textousuario").val('');
        $("#textoclave").val('');
        $('.boton').val('Aceptar');
        $("#textousuario").focus();
        $('.error').slideDown('slow');
        setTimeout(function(){$('.error').slideUp('slow');},1500);
      }
  })
  .fail(function(resp){
    console.log(resp.responseText);
  })
  .allways(function(){
    console.log("complete");
  })
   
 });
