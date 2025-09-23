<!DOCTYPE html>
<script type="text/javascript" src="js/jquery-3.1.0.min.js"></script>
<?php
	session_start();
	session_destroy();
?>

<script>
	 $( document ).ready(function() {
		var mensaje = document.createElement("div");
		mensaje.textContent = "Fuera de Sesión. La página se redirigirá en unos segundos...";
		document.body.appendChild(mensaje);
		window.top.location.href = "index.php"; // URL de la página de login
		});

</script>


<html lang="es">
	<head>
		<meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1"/>
		
	</head>
<body>
	<div>
	</div>
</body>
</html>