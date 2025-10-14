<?php
include('../conexion.php');
include('../php/funciones.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();

$accion = $_POST["accion"];

if ($accion == 1) {

	# agregar 

	$_SESSION["accion"] = "ALTA";

	$turno = 0;//$_POST['turno'];
	$id_tipocobro = $_POST['tipo_cobro'];
	$talonario = 0;//(!empty($_POST['talonario_nro'])) ? $_POST['talonario_nro'] : 0;
	$desde_ticket = (!empty($_POST['desde_ticket'])) ? $_POST['desde_ticket'] : 0;
	$hasta_ticket = (!empty($_POST['hasta_ticket'])) ? $_POST['hasta_ticket'] : 0;
	$monto = $_POST['efectivo'];
	$observaciones = $_POST['observaciones'];
	$idusuario = $_POST['idusuario'];


	date_default_timezone_set('America/Argentina/Buenos_Aires');
	$fecha = date("Y-m-d");
	$fechaHora = date("Y-m-d H:i:s"); // Formato: Año-Mes-Día Horas:Minutos:Segundos 	 
/*
	$query = "insert into cobros (fecha,id_tipocobro,turno,talonario,ticket_desde,ticket_hasta,monto,observaciones,idusuario,fecha_hora) values ('$fecha','$id_tipocobro','$turno','$talonario','$desde_ticket','$hasta_ticket','$monto','$observaciones','$idusuario','$fechaHora');";

	$query .= "insert into pagos (fecha,idestadia, forma_pago, lote, cupon, importe, idusuario, estado,fecha_hora,modificado) values ('$fecha',0,'E',0,0,'$monto','$idusuario','N','$fechaHora',0);";


	if (mysqli_multi_query($con, $query)) {
		$ultimoid = mysqli_insert_id($con);
		$json = json_encode(array("error" => 0, "ultimoid" => $ultimoid));
	} else {
		$json = json_encode(array("error" => 1, "valor" => mysqli_error($con)));
	}*/

	$query1 = "insert into cobros (fecha,id_tipocobro,turno,talonario,ticket_desde,ticket_hasta,monto,observaciones,idusuario,fecha_hora) values ('$fecha','$id_tipocobro','$turno','$talonario','$desde_ticket','$hasta_ticket','$monto','$observaciones','$idusuario','$fechaHora')";

	$query2 = "insert into pagos (fecha,idestadia,idcobro, forma_pago, lote, cupon, importe, idusuario, estado,fecha_hora,modificado) values ('$fecha',0,(select max(id) from cobros),'E',0,0,'$monto','$idusuario','N','$fechaHora',0)";

	// Ejecutar primera consulta
	if (mysqli_query($con, $query1)) {
		// Si la primera fue exitosa, ejecutar la segunda
		if (mysqli_query($con, $query2)) {
			// Obtener el último ID de pagos
			$resultado = mysqli_query($con, "SELECT MAX(id) as ultimoid FROM cobros");
			$fila = mysqli_fetch_assoc($resultado);
			$ultimoid = $fila['ultimoid'];
			
			$json = json_encode(array("error" => 0, "ultimoid" => $ultimoid));
		} else {
			$json = json_encode(array("error" => 1, "valor" => "Error al insertar pago: " . mysqli_error($con)));
		}
	} else {
		$json = json_encode(array("error" => 1, "valor" => "Error al insertar cobro: " . mysqli_error($con)));
	}
} else
	#  modificar
	if ($accion == 2) {

		/*		$_SESSION["accion"]="EDITA";
		$query = "update tipos_cobros set nombre='$nombre',importe='$importe',temporada='$temporada' where id='$idtipocobro'";
		
		
		$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
	   	
		if ($resultado) {
				$json = json_encode(array("error"=>0));
			}else{
				$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
			};
*/
	} else 
		if ($accion == 3) {
		# atencion, se actualiza el estado del pago 
		# se hace desde pagos_cobros.html como opcion por si llegan a tener problemas con un pago

		$ide = $_POST["codigo"];


		$query = mysqli_query($con, "update pagos set estado='R' where id='$ide'");
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
				$json = queryToJson($con, "select cobros.*, tipos_cobros.nombre as concepto from cobros inner join tipos_cobros on cobros.id_tipocobro=tipos_cobros.id order by id desc");
			} else
				// busqueda por fecha y turno
				if ($operacion == 1) {
					$turno = $_POST["caracteres"];
					$fecha = $_POST["caracteres2"];
					$json = queryToJson($con, "select cobros.*, tipos_cobros.nombre as concepto from cobros inner join tipos_cobros on cobros.id_tipocobro=tipos_cobros.id where fecha='$fecha' and turno='$turno' order by fecha,turno");
				} else
					//busca el ultimo cobro
					if ($operacion == 2) {
						$json = queryToJson($con, "SELECT MAX(id) AS ultimo FROM cobros");
					} else {
						if ($operacion == 3)
						//todos los cobros entre dos fechas											
						{
							$fecha1 = $_POST["fecha1"];
							$fecha2 = $_POST["fecha2"];
							$json = queryToJson($con, "select cobros.*, tipos_cobros.nombre as concepto, usuarios.usuario as usuario from cobros inner join tipos_cobros on cobros.id_tipocobro=tipos_cobros.id inner join usuarios on cobros.idusuario = usuarios.id where cobros.fecha>='$fecha1' and cobros.fecha<='$fecha2' order by fecha");
						} else
                                    if ($operacion == 4) {
							//busqueda para imprimir el cobro 
							$idcobro = $_POST["caracteres"];

							$json = queryToJson($con, "select cobros.*, tipos_cobros.nombre as concepto, usuarios.usuario as usuario, pagos.id as idpago from cobros inner join tipos_cobros on cobros.id_tipocobro=tipos_cobros.id inner join usuarios on cobros.idusuario = usuarios.id inner join pagos on cobros.id=pagos.idcobro where cobros.id='$idcobro' order by fecha,turno;");
						} else
										if ($operacion == 5) {
							$fecha = $_POST["caracteres"];
							$usuario = $_POST["usuario"];
							$json = queryToJson($con, "SELECT sum(monto) as total FROM `cobros` where fecha='$fecha' and idusuario='$usuario' group by fecha");
						} else
										    if ($operacion == 6) {
							$fecha = $_POST["caracteres"];

							$json = queryToJson($con, "SELECT sum(monto) as total FROM `cobros` where fecha='$fecha' group by fecha");
						} else
											    if ($operacion == 7) {
							//traigo de pagos aquellos que son de cobros (parrilas/duchas)
							//por si el administrador necesita anular alguno

							$json = queryToJson($con, "SELECT * FROM `pagos` where  idestadia=0 and estado='N' order by id");
						} else
													if ($operacion == 8) {
							//ultimo ticket cargado		
							$json = queryToJson($con, "SELECT MAX(ticket_hasta) AS ultimo_ticket FROM cobros WHERE ticket_hasta IS NOT NULL");
						}
					}
		}
	}



echo $json;
