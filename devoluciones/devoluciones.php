<?php
include('../conexion.php');
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();

$accion = $_POST["accion"];
$iddevolucion = $_POST["iddevolucion"];
date_default_timezone_set('America/Argentina/Buenos_Aires');
$fecha = date("Y-m-d");
$idestadia = $_POST['idestadia'];
$importe = $_POST['importe'];
$motivo = $_POST['motivo'];
$usuario = $_SESSION['idusuario'];

if ($accion == 1) {

	# agregar 

	$_SESSION["accion"] = "ALTA";

	$query = "insert into devoluciones (fecha, idestadia,importe, motivo, idusuario) values ('$fecha','$idestadia','$importe','$motivo', '$usuario')";

	$resultado = mysqli_query($con, $query) or die(mysqli_error($con));
	if ($resultado) {
		$json = json_encode(array("error" => 0));
	} else {
		$json = json_encode(array("error" => 1, "valor" => $query));
	}
} else
	#  modificar
	if ($accion == 2) {
		# no se utiliza
		$_SESSION["accion"] = "EDITA";
		$query = "update devoluciones set fecha='$fecha',idestadia='$idestadia',importe='$importe',motivo='$motivo' where id='$_POST[iddevolucion]'";


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


		$query = mysqli_query($con, "DELETE FROM devoluciones WHERE id=" . $ide) or die(mysqli_error($con));
		if ($query) {
			$json = json_encode(array("error" => 0));
		} else {
			$json = json_encode(array("error" => 1, "valor" => "No se pudo eliminar.-"));
		};
	} else 
 			if ($accion == 4) {
		# listar
		$operacion = $_POST["operacion"];

		if ($operacion == 0) {
			$json = queryToJson($con, "select devoluciones.*, CONCAT('Parcela:',estadias.idparcela,' ', turistas.apellido,' ', turistas.nombres,' de ',estadias.fecha_ingreso, ' a ', estadias.fecha_egreso, ' $ ', estadias.total) as datos_estadia from devoluciones left join estadias on devoluciones.idestadia= estadias.id left join turistas on estadias.idturista=turistas.id order by devoluciones.fecha desc");
		} else 
					if ($operacion == 1) {
			$fecha = $_POST["caracteres"];
			$idusuario = $_POST["idusuario"];
			$json = queryToJson($con, "select devoluciones.*, turistas.apellido as apellido, turistas.nombres as nombres from devoluciones left join estadias on devoluciones.idestadia=estadias.id left join turistas on estadias.idturista=turistas.id where devoluciones.fecha='$fecha' and devoluciones.idestadia in (select idestadia from pagos where pagos.fecha='$fecha' and pagos.idusuario='$idusuario')");
		} else
			if ($operacion == 2) {
			$fecha = $_POST["caracteres"];
			$json = queryToJson($con, "select devoluciones.*, turistas.apellido as apellido, turistas.nombres as nombres, usuarios.usuario from devoluciones left join estadias on devoluciones.idestadia=estadias.id left join turistas on estadias.idturista=turistas.id left join usuarios on devoluciones.idusuario=usuarios.id where devoluciones.fecha='$fecha'");
		} else
			if ($operacion == 3) { //Busca si ya se hizo devolucion sobre esa estadia
			$idestadia = $_POST["caracteres"];
			$json = queryToJson($con, "Select * from devoluciones where devoluciones.idestadia='$idestadia'");
		} else
			if ($operacion == 5) { //Calcula total de devoluciones
			$fecha = $_POST["caracteres"];
			$json = queryToJson($con, "Select fecha, sum(importe) as total from devoluciones where devoluciones.fecha='$fecha'");
			// and devoluciones.idestadia in (select idestadia from pagos where pagos.fecha='$fecha' and pagos.idusuario='$usuario')
		} else
			if ($operacion == 10) {
			$fecha = $_POST["caracteres"];
			$json = queryToJson($con, "Select fecha, sum(importe) as total from devoluciones where devoluciones.fecha='$fecha'");
		} else {
			if ($operacion == 11) {
				//devoluciones entre dos fechas
				$fecha1 = $_POST["fecha1"];
				$fecha2 = $_POST["fecha2"];
				$json = queryToJson($con, "Select devoluciones.*, turistas.apellido, turistas.nombres, usuarios.usuario from devoluciones left join estadias on devoluciones.idestadia=estadias.id left join turistas on estadias.idturista=turistas.id left join usuarios on devoluciones.idusuario=usuarios.id where
				 							devoluciones.fecha>='$fecha1' and devoluciones.fecha<='$fecha2'");
			} else {
				if ($operacion == 12) {
					$fecha1 = $_POST["fecha1"];
					$fecha2 = $_POST["fecha2"];
					$json = queryToJson($con, "Select sum(importe) as total from devoluciones where devoluciones.fecha>='$fecha1' and devoluciones.fecha<='$fecha2'");
				}
			}
		}
	}



echo $json;
