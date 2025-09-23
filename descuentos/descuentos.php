<?php
include('../conexion.php'); 
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();


$accion=$_POST["accion"];
$iddescuento=$_POST["iddescuento"];
$descripcion=$_POST['descripcion'];
$porcentaje=$_POST['precio'];	

if ($accion==1) {
       	# agregar 
	$_SESSION["accion"]="ALTA";
 	$query= "insert into descuentos (descripcion,porcentaje,estado) values ('$descripcion','$porcentaje',1)";
	$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
	if ($resultado) {
		$json = json_encode(array("error"=>0));
	}
	else{
		$json = json_encode(array("error"=>1,"valor"=>$query));
	}
}
else
 	#  modificar
	if ($accion==2){
	
		$_SESSION["accion"]="EDITA";
		$query = "update descuentos set descripcion='$descripcion',porcentaje='$porcentaje' where id='$_POST[iddescuento]'";
		$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
		if ($resultado) {
				$json = json_encode(array("error"=>0));
			}else{
				$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
			};
		}
	else 
		if ($accion==3) {
			# baja logica
			//$ide=$_POST["codigo"];
			$query = "update descuentos set estado='0' where id='$_POST[codigo]'";
			$resultado = mysqli_query($con,$query) or die(mysqli_error($con));
			if ($resultado){
				$json = json_encode(array("error"=>0));
			}
			else{
				$json = json_encode(array("error"=>1,"valor"=>"No se pudo eliminar.-"));
			};
		} 
		else {
 			if ($accion==4) {
 				# listar
 				$operacion=$_POST["operacion"];
 				if ($operacion==0){
 						$json=queryToJson($con,"select * from descuentos order by estado desc, descripcion asc");
						}
				else
					if ($operacion==1)
						{
					    $caracteres=$_POST["caracteres"];
					    $json=queryToJson($con,"select * from descuentos where id = '$caracteres'");
					    }
 			}
	}	

echo $json;
?>