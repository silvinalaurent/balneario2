<?php 

    date_default_timezone_set("America/Argentina/Buenos_Aires");
    session_start();
   
    if(isset($_SESSION['usuariologueado'])){
        header('Location:menu.php');
    }
?>

<!DOCTYPE html>
  <head>
  <title>Login</title>
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <html lang="es">
  
  <meta name="viewport” content="width=device-width”>

  <link rel="stylesheet" href="css/estilologin.css?v=55.0"> 
  <link type="text/css" rel="stylesheet" href="fontello-cb1fe4de/css/fontello.css" />
  <script type="text/javascript" src="js/jquery-3.7.1.min.js"></script>
  <script type="text/javascript" src="login.js?v=7.0"></script>

  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">

 
  </head>

  <body>
    <div class="error">
      <span>Datos de ingreso incorrectos, volver a intentar</span>
    </div>

  <h3>Municipalidad de San José. Balneario Camping San José</h3>
  
  <div id="login">
    <div id="gridlogin">
      <form id="formlogin" method="post" action="">
       
            <div id="titulo"><h4>Ingreso</h4></div>
            <div id="usuario">
              <input type="text" placeholder="Ingrese usuario..." pattern="[A-Za-z0-9-_]{1-15}" required autofocus name="textousuario" id="textousuario" class="naranja"/>
            </div>                                                   
            <div id="clave">
              <input type="password" placeholder="Ingrese contraseña..." pattern="[A-Za-z0-9-_]{1-15}" required name="textoclave" id="textoclave" class="naranja"/>
            </div>
            <div id="confirma">
              
              <input name="ingresar" id="ingresar" type="submit" value="Aceptar"  class="boton"/>
            </div>
      </form>

      </div>   
     
    </div>

  </body>
</html>