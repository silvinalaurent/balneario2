<?php
include('../conexion.php'); 
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();

date_default_timezone_set('America/Argentina/Buenos_Aires');
$horaActual = date("H:i:s");


$accion=$_POST["accion"];
$idturista=$_POST['turista'];
$idparcela=$_POST['numeroparcela2'];
$nrocarpa=$_POST['nrocarpa'];
$idsector=$_POST['listasectores'];
$fechad=$_POST['fechad'];
$fechah=$_POST['fechah'];
$cantidad=$_POST['cantidad'];
$tarifa=$_POST['listadotarifas'];
$importe=$_POST['importe'];

$detalleadicional=isset($_POST['detalleadicional'])?$_POST["detalleadicional"]:'';
$adicional=isset($_POST['adicionaldias'])?$_POST["adicionaldias"]:0;
$detalleadicional2=isset($_POST['detalleadicional2'])?$_POST["detalleadicional2"]:'';
$adicional2=isset($_POST['adicional2dias'])?$_POST["adicional2dias"]:0;

$detalleadicional3=$_POST['detalleadicional3'];
$adicional3=$_POST['adicional3'] == '' ? 0:$_POST['adicional3'];
$observaciones=$_POST['observaciones'];
$descuento=$_POST['montodescuento'];
$total=$_POST['total'];
$patente=$_POST['patente'];
$idusuario=$_SESSION['idusuario'] != 0 ? $_SESSION['idusuario'] : $_POST['usuario'];
$discapacidad=$_POST['discapacidad'] == true ? 1 : 0;
$mascotas=$_POST['mascotas'] == true ? 1 : 0;
$forma_pago=$_POST['forma_pago'];


if ($nrocarpa=='') {
	$nrocarpa='0';
}	
if ($accion==1) {
     	
    # agregar 

	$_SESSION["accion"]="ALTA";
	
	date_default_timezone_set('America/Argentina/Buenos_Aires');
	$fechaHora = date("Y-m-d H:i:s"); // Formato: Año-Mes-Día Horas:Minutos:Segundos
	$fecha= date("Y-m-d");		
 	# estado es N si es Normal o E si es eliminado  	 	
 	$query= "insert into estadias (idparcela, nrocarpa, idsector, fecha_ingreso,fecha_egreso,importe,detalleadicional,adicional,detalleadicional2,adicional2,detalleadicional3,adicional3, cantidad_personas, estado, tipo_alojamiento, patente, idturista, total,idusuario,descuento, observaciones, discapacidad, mascotas, fecha) values ('$idparcela','$nrocarpa','$idsector','$fechad','$fechah','$importe','$detalleadicional','$adicional','$detalleadicional2','$adicional2','$detalleadicional3','$adicional3','$cantidad','N','$tarifa', '$patente', '$idturista','$total','$idusuario','$descuento','$observaciones', '$discapacidad', '$mascotas','$fechaHora');";
	
	$query.="insert into pagos (fecha, idestadia, forma_pago, importe, idusuario, estado,fecha_hora) values ('$fecha',(select max(id) from estadias),'$forma_pago','$total','$idusuario','N','$fechaHora')";
	
	
	if (mysqli_multi_query($con,$query)) {
		$ultimoid=mysqli_insert_id($con);
		$json = json_encode(array("error"=>0, "ultimoid"=>$ultimoid));
		
	}
	else{
		$json = json_encode(array("error"=>1,"valor"=>$query));
		
	}
	
	//probar esto para ultimo id
	//$id = mysql_insert_id() ;  ver como devolverlo
}
else
	if ($accion==5)
		//modifica fecha de estadia
	{
		$idestadia=$_POST["idestadia"];
		$fecha_egreso=$_POST["fecha_egreso"];
		$query = "update estadias set fecha_egreso='$fecha_egreso' where id='$idestadia'";
						
								$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
					   			
								if ($resultado) {
										$json = json_encode(array("error"=>0));
									}else{
										$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
									};
								}	

	else
	 	if ($accion==6)
	 						{
								# poner finalizado a la estadia
				 				$estadia=$_POST["estadia"];
								$query = "update estadias set estado='F' where id='$estadia'";
						
								$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
					   			
								if ($resultado) {
										$json = json_encode(array("error"=>0));
									}else{
										$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
									};

								}		
/*	
	else
 	#  modificar
	if ($accion==2){
	
		$_SESSION["accion"]="EDITA";
		$query = "update estadias set forma_pago='$ciudad', idprovincia='$provincia' where id='$_POST[idciudad]'";
		
		
		$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
	   	
		if ($resultado) {
				$json = json_encode(array("error"=>0));
			}else{
				$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
			};

		}
	*/
	else 
		if ($accion==3) {
			# anular

			$ide=$_POST["codigo"];


			$query = mysqli_query($con, "UPDATE estadias SET estado='A', idusuario='$idusuario' WHERE id=".$ide) or die(mysqli_error($con));   
			if ($query) {
				$json = json_encode(array("error"=>0));
			}else{
				$json = json_encode(array("error"=>1,"valor"=>"No se pudo eliminar.-"));
			};
		} 
		else 
 			if ($accion==4) {
 				# listar
 				$operacion=$_POST["operacion"];
				
				
				
 				if ($operacion==0){
 						$json=queryToJson($con,"select * from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id ORDER BY fecha_ingreso");
						}
				else 

					if ($operacion==1)
							{
								//lista estadias activas
								//agregar tipo de pago
	 							$json=queryToJson($con,"select estadias.*, turistas.apellido as apellido, turistas.nombres as nombres, tarifas.descripcion, pagos.forma_pago from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id left join pagos on estadias.id=pagos.idestadia WHERE CURDATE()>=estadias.fecha_ingreso and curdate()<= estadias.fecha_egreso  ORDER BY fecha_egreso");
	 							// estadias.estado='N' and pagos.estado='N'
	 							

							}
					else
						if ($operacion==2)
							{
								//busca el mayor id

	 							$json=queryToJson($con,"SELECT MAX(id) AS ultimo FROM estadias");
							}
						else
							if ($operacion==3)
							{//busqueda por numero de parcela, de estadias activas
								$caracteres=$_POST["caracteres"];
	 								$json=queryToJson($con,"select estadias.*, turistas.apellido, turistas.nombres, tarifas.descripcion from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id WHERE estadias.idparcela='$caracteres'  and estado='N' ORDER BY fecha_ingreso");
	 								//and estadias.fecha_egreso >= CURDATE()
							}		
							else
								if ($operacion==4)
								{
									$estadia=$_POST["caracteres"];
	 								$json=queryToJson($con,"select estadias.*, turistas.apellido, turistas.nombres, turistas.nro_documento, turistas.correo, tarifas.descripcion, tarifas.unidad, pagos.id as idpago, pagos.fecha as fecha_pago, pagos.forma_pago as forma_pago, sectores.descripcion as sector  from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id left join pagos on estadias.id= pagos.idestadia left join sectores on estadias.idsector=sectores.id WHERE estadias.id= '$estadia'");
								}		
								else
									if ($operacion==5)
									{
										//busca estadias cuya fecha de ingreso coincida con la fecha del parametro
										$fecha=$_POST["caracteres"];
		 								$json=queryToJson($con,"select * from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id WHERE estadias.fecha_ingreso= '$fecha'");
									}		
									else
										if ($operacion==6)
										{
											//busca estadias cuya fecha de egreso coincida con la fecha del parametro
											$fecha=$_POST["caracteres"];
			 								$json=queryToJson($con,"select * from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id WHERE estadias.fecha_egreso= '$fecha'");
										}	
										else
											if ($operacion==7)
											//lista estadoas entre dos fechas	
											{
											$fechad=$_POST["fechad"];
											$fechah=$_POST["fechah"];
			 								$json=queryToJson($con,"select estadias.*,turistas.apellido,turistas.nombres, turistas.nro_documento, tarifas.descripcion from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id WHERE ((estadias.fecha_ingreso>='$fechad') and (estadias.fecha_egreso<='$fechah')) or
			 									(('$fechad' > estadias.fecha_ingreso) and ('$fechad' < estadias.fecha_egreso)) or
			 									(('$fechah' > estadias.fecha_ingreso) and ('$fechah' < estadias.fecha_egreso))
 			 									order by estadias.fecha_ingreso");
											}		
											else
												if ($operacion==8)
												{	
													$parcela=$_POST["caracteres"];
													$json=queryToJson($con,"SELECT MAX(id), fecha_egreso FROM estadias where idparcela='$parcela'");
												}
												else
													if ($operacion==9)
													//busca estadias en fecha
													{	
														date_default_timezone_set('America/Argentina/Buenos_Aires');
														$fecha = date("Y-m-d"); // Formato: Año-Mes-Día 
														
														//$fecha=$_POST["caracteres"];
														$json=queryToJson($con,"SELECT * FROM estadias where (fecha_ingreso<='$fecha' and fecha_egreso> '$fecha' and estado='N') or (estado='N') order by idparcela, fecha_egreso DESC");
														
													}
													else
														if ($operacion==10)
														{	
															$idturista=$_POST["caracteres"];
															$json=queryToJson($con,"SELECT * FROM estadias where idturista='$idturista'");
														}	
														else
															if ($operacion==11)
															{	
																$json=queryToJson($con,"select * from estadias WHERE CURDATE()>=estadias.fecha_ingreso and curdate()<= estadias.fecha_egreso and estadias.estado='N' ORDER BY idparcela");
															}
															else
																if ($operacion==12)
																{
																	$apellido=$_POST["caracteres"];
																	$json=queryToJson($con,"select estadias.*,turistas.apellido,turistas.nombres, turistas.nro_documento, tarifas.descripcion from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id WHERE 
																		turistas.apellido LIKE '$apellido%'
			 															order by estadias.fecha_ingreso");
																}
																else
																{
																	if ($operacion==13)
																	{ 
																		$parcela=$_POST["caracteres"];
																		$json=queryToJson($con,"select estadias.*,turistas.apellido,turistas.nombres, turistas.nro_documento, tarifas.descripcion from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id WHERE 
																		estadias.idparcela = '$parcela'
			 															order by estadias.fecha_ingreso");		
																	}
																	else
																	{
																		if ($operacion==14)
																		{ 
																			$carpa=$_POST["caracteres"];
																			$json=queryToJson($con,"select estadias.*,turistas.apellido,turistas.nombres, turistas.nro_documento, tarifas.descripcion from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id WHERE 
																			estadias.nrocarpa = '$carpa'
				 															order by estadias.fecha_ingreso");		
																		}
																		else
																		{
																			if ($operacion==15)
																			{ 
																				$turista=$_POST["caracteres"];
																				$json=queryToJson($con,"select estadias.*,turistas.apellido,turistas.nombres, turistas.nro_documento, tarifas.descripcion  from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id WHERE 
																				estadias.idturista = '$turista'
					 															order by estadias.fecha_ingreso");		
																			}
																		else {
																			 if ($operacion==16)
																				{ //busqueda por patente
																				$patente=$_POST["caracteres"];
																				$json=queryToJson($con,"select estadias.*,turistas.apellido,turistas.nombres, turistas.nro_documento, tarifas.descripcion from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id WHERE 
																				estadias.patente like '%$patente%'
					 															order by estadias.fecha_ingreso");		
																			}
																			else
																				if ($operacion==17)
																				{

 																					$idestadia=$_POST["idestadia"];
 																					$json=queryToJson($con,"select * from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id left join pagos on estadias.id=pagos.idestadia where estadias.id='$idestadia' ORDER BY fecha_ingreso");
						
																				}
																				else
																					if ($operacion==18)
																					{
																					//lista estadias activas
																	
	 																				$json=queryToJson($con,"select estadias.*, turistas.apellido as apellido, turistas.nombres as nombres, tarifas.descripcion, pagos.forma_pago from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id left join pagos on estadias.id=pagos.idestadia WHERE CURDATE()<estadias.fecha_egreso and estadias.estado='N' ORDER BY fecha_egreso");
	 							
						
																					}
																					else
																						if ($operacion==19)
																					{
																					//lista estadias vencidas
																	
	 																				$json=queryToJson($con,"select estadias.*, turistas.apellido as apellido, turistas.nombres as nombres, tarifas.descripcion, pagos.forma_pago from estadias left join turistas on estadias.idturista=turistas.id left join tarifas on estadias.tipo_alojamiento=tarifas.id left join pagos on estadias.id=pagos.idestadia  WHERE estadias.fecha_egreso<=CURDATE() and HOUR(CURTIME())>=3 and estadias.estado='N' ORDER BY estadias.fecha_egreso");
	 							
						
																					}
																						else
																						{
																						if ($operacion==20)
																					{
																						//lista estadias viejas vencidas
																						// Fecha actual
$fechaActual = new DateTime();

// Restar un día
$fechaActual->modify('-1 day');

$fecha=$fechaActual->format('Y-m-d');
																
																						$json=queryToJson($con,"select * from estadias WHERE estadias.fecha_egreso<'$fecha' and estado='N'");
									
																					}	
																				}

																		}
																		}
																	}
																}
														
										
 			}
 			
	

	mysqli_close($con);

echo $json;

?>