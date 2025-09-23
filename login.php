<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
    
//controla que se lo haya llamado desde ajax
if ((!empty($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'))
{
	require('conexion.php'); 

	session_start();

	$con->set_charset('utf8');

	$usuario= $con->real_escape_string($_POST['textousuario']);
	$clave=$con->real_escape_string($_POST['textoclave']);
	
	//Cifrar clave ingresada
	$clavecifrada = hash('sha256', $clave);
	
	if ($nueva_consulta=$con->prepare("SELECT id,usuario from usuarios WHERE usuario=? AND clave=?"))
	{
		$nueva_consulta->bind_param('ss', $usuario, $clavecifrada);
		$nueva_consulta->execute();
		$resultado = $nueva_consulta->get_result();

		if($resultado->num_rows ==1){
			$datos=$resultado->fetch_assoc();
			$_SESSION['conectado']=1;
			$_SESSION['usuariologueado']= $datos['usuario'];
			$_SESSION['idusuario']= $datos['id'];
			$_SESSION['time'] = time();
			echo json_encode(array('error=>false'));
		}
		else
		{
			echo json_encode(array('error'=>true));
		}

		
	$nueva_consulta->close();
	}
	
	$con->close();


 } 

 
?>