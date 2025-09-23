<?php
include('../conexion.php'); 
error_reporting(E_ALL ^ E_NOTICE);
session_start();

 	
 	for ($i = 206; $i <= 300; $i++) {
    	$query= "insert into parcelas (numero,idsector,estado) values ($i,1,'L')";
    	$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
    	echo $resultado;
	}
 	 	


?>