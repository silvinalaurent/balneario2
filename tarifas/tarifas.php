<?php
include('../conexion.php');
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();

$accion = $_POST["accion"];
$idtarifa = $_POST["idtarifa"];
$descripcion = $_POST['descripcion'];
$tarifa = $_POST['precio'];

if ($accion == 1) {

	# agregar 

	$_SESSION["accion"] = "ALTA";

	$query = "insert into tarifas (descripcion,tarifa) values ('$descripcion','$tarifa')";

	$resultado = mysqli_query($con, $query) or die(mysqli_error($con));
	if ($resultado) {
		$json = json_encode(array("error" => 0));
	} else {
		$json = json_encode(array("error" => 1, "valor" => $query));
	}
} else
	#  modificar
	if ($accion == 2) {

		$_SESSION["accion"] = "EDITA";
		$query = "update tarifas set descripcion='$descripcion',tarifa='$tarifa' where id='$_POST[idtarifa]'";


		$resultado = mysqli_query($con, $query) or die(mysqli_error($con));

		if ($resultado) {
			$json = json_encode(array("error" => 0));
		} else {
			$json = json_encode(array("error" => 1, "valor" => "No se pudo modificar.-"));
		};
	} else 
		if ($accion == 3) {
		# borrar

		$ide = $_POST["codigo"];


		$query = mysqli_query($con, "DELETE FROM tarifas WHERE id=" . $ide) or die(mysqli_error($con));
		if ($query) {
			$json = json_encode(array("error" => 0));
		} else {
			$json = json_encode(array("error" => 1, "valor" => "No se pudo eliminar.-"));
		};
	} else {
		if ($accion == 4) {
			# listar
			$operacion = $_POST["operacion"];

			if ($operacion == 0) {
				$json = queryToJson($con, "select * from tarifas where baja=0 order by unidad, descripcion");
			} else
					if ($operacion == 1) {
				$caracteres = $_POST["caracteres"];
				$json = queryToJson($con, "select * from tarifas where id = '$caracteres'");
			} else {
				$caracteres = $_POST["caracteres"];

				$json = queryToJson($con, "select * from tarifas where descripcion LIKE '%$caracteres%'  ORDER BY descripcion");
			}
		}
	}



echo $json;
