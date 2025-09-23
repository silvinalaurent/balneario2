<?php 
	session_start();

	 if (!isset($_SESSION['usuariologueado'])) {
	 		header('Location: index.php');
	 	}
 ?>

<!DOCTYPE html>
<html lang="es">
<head>
	<title>Municipalidad de San José. Camping Balneario SAN JOSE</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1">
	<link rel="stylesheet" type="text/css" href="css/estilos.css">
    <script type="text/javascript" src="permisos/permisos.js?v=3.0"></script>
    <script type="text/javascript" src="js/jquery-2.1.1.min.js"></script>
	<meta http-equiv="Expires" content="0">
	<meta http-equiv="Last-Modified" content="0">
	<meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
	<meta http-equiv="Pragma" content="no-cache">



</head>

<body onload="trae_menues_usuario(<?php echo $_SESSION['idusuario'] ?>)">
		<header>
				<div id="zonatitulo">
				<h2>SJ Ciudad</h2> 
				<h3>Camping Balneario SAN JOSE</h3>
				</div>
				<div id="zonamenu">
					<nav class="menu"> 
						<ul id="nivel1"></ul>
					</nav>	
				</div>
				<div id="zonausuario">
				Bienvenido <a href='usuario.html?variable=<?php echo $_SESSION['usuariologueado'] ?>' title="Cambiar contraseña" target="formularios"><?php echo $_SESSION['usuariologueado'] ?></a>, <a href="salir.php">Cerrar Sesión</a>  
				</div>
			
			
		</header>

		<main>
			<div class="contenedor">
				<iframe src="blanco.html" name="formularios" id="formularios" style="width: 100%; height:auto">
					
				</iframe>
			</div>
		</main>
		
		<footer>
			<div class="contenedor">
				Municipalidad de San José
			</div>
		</footer>

</body>

</html>