
function haysesion () {
    $.ajax({
        url:'../datos_sesion.php',
        type:'POST',
        dataType:'json',
        async:false,
        success:function(data){
            usuario=data;
           
            if (!usuario.conectado) {
                alert('Fuera de sesion, debe loguearse nuevamente');
                window.location.href = '../logout_page.php'
                
                };
            }
        
    });
};