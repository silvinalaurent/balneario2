<?php
include('../conexion.php');
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();

$accion = $_POST["accion"];
$idtarifa = $_POST["idtarifa"];
$descripcion = $_POST['descripcion'];
$unidad = $_POST['unidad'];
$tarifa = floatval($_POST['precio']);

if ($accion == 1) {

	# agregar 

	$_SESSION["accion"] = "ALTA";
	$query = "insert into tarifas (descripcion,unidad,tarifa,baja) values ('$descripcion','$unidad','$tarifa',0)";

	//generar un registro en tarifas-precios con los valores nulos de fecha y precio, para que luego los modifiquen
	$resultado = mysqli_query($con, $query);
	if ($resultado) {

		// 1. ID generado
		$id_generado = mysqli_insert_id($con);

		// 2. SELECT del registro insertado
		$query_select = "SELECT * FROM tarifas WHERE id = $id_generado";
		$result_select = mysqli_query($con, $query_select);

		// 3. Obtener array asociativo
		$registro = mysqli_fetch_assoc($result_select);

		// 4. Generar respuesta JSON
		$json = json_encode(array(
			"error" => 0,
			"id_tarifa" => $id_generado,
			"data" => $registro
		));
	} else {
		//$json = json_encode(array("error" => 1, "valor" => $query));
		$json = json_encode(array(
			"error" => 1,
			"mensaje" => mysqli_error($con),
			"query" => $query
		));
	}
} else
	#  modificar
	if ($accion == 2) {

		$_SESSION["accion"] = "EDITA";
		$query = "update tarifas set descripcion='$descripcion',unidad='$unidad', tarifa='$tarifa' where id='$_POST[idtarifa]'";


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


		$query = mysqli_query($con, "update tarifas set baja=1 where id= '$ide'") or die(mysqli_error($con));
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
				$json = queryToJson($con, "select tarifas.id,tarifas.descripcion, tarifas.unidad, tarifas_precios.precio as tarifa, fecha_inicio, fecha_fin from tarifas left join tarifas_precios on tarifas.id=tarifas_precios.idtarifa where tarifas.baja=0 and CURDATE() between tarifas_precios.fecha_inicio and tarifas_precios.fecha_fin order by tarifas.unidad, tarifas.descripcion");
				//SELECT t.id, t.descripcion, t.unidad, p.precio as tarifa, p.fecha_inicio, p.fecha_fin FROM tarifas as t left JOIN tarifas_precios as p ON p.idtarifa = t.id WHERE p.fecha_inicio = ( SELECT MAX(p2.fecha_inicio) FROM tarifas_precios p2 WHERE p2.idtarifa = t.id );

				//"select * from tarifas  where baja=0 order by unidad, descripcion");
				//"
			} else
					if ($operacion == 1) {
				$caracteres = $_POST["caracteres"];
				$json = queryToJson($con, "select tarifas.id,tarifas.descripcion, tarifas.unidad, tarifas.tarifa  from tarifas where  tarifas.id = '$caracteres'");
			} else {
				$caracteres = $_POST["caracteres"];

				$json = queryToJson($con, "select tarifas.id,tarifas.descripcion, tarifas.unidad, tarifas_precios.precio as tarifa from tarifas left join tarifas_precios on tarifas.id=tarifas_precios.idtarifa where tarifas.baja=0 and CURDATE() between tarifas_precios.fecha_inicio and tarifas_precios.fecha_fin and descripcion LIKE '%$caracteres%'  ORDER BY descripcion");
			}
		}
	}



echo $json;
