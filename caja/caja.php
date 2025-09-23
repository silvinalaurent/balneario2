<?php
include('../conexion.php'); 
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();
date_default_timezone_set('America/Argentina/Buenos_Aires');



$accion=$_POST["accion"];
$idestadia=$_POST["idestadia"];
$forma_pago=$_POST['forma_pago'];
//$fecha=date('Y-m-d');
$fecha=$_POST['fecha'];
$total=$_POST['total'];
$idusuario=$_POST['idusuario'];
	
if ($accion==1) {
     	
       	# agregar 

		
	$_SESSION["accion"]="ALTA";
	date_default_timezone_set('America/Argentina/Buenos_Aires');
	$fechaHora = date("Y-m-d H:i:s"); // Formato: Año-Mes-Día Horas:Minutos:Segundos 	 	
 	$query= "insert into pagos (fecha, idestadia, forma_pago, importe, idusuario, estado,fecha_hora) values ('$fecha','$idestadia','$forma_pago','$total','$idusuario','N','$fechaHora')";
	
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
		$query = "update pagos set fecha='$fecha', idestadia='$idestadia', forma_pago='$forma_pago', importe='$total', idusuario='$idusuario'  where id='$_POST[idpago]'";
		
		
		$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
	   	
		if ($resultado) {
				$json = json_encode(array("error"=>0));
			}else{
				$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
			};

		}

	
	else 
		if ($accion==3) {
			# anular pago

			$ide=$_POST["codigo"];


			$query = mysqli_query($con, "update pagos set estado='A' and idusuario='$idusuario' where idestadia=".$ide) or die(mysqli_error($con));   
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
 						$json=queryToJson($con,"Select pagos.id, pagos.fecha, pagos.importe, pagos.forma_pago, estadias.id as idestadia, estadias.idparcela, estadias.fecha_ingreso, estadias.fecha_egreso, estadias.importe, estadias.adicional, estadias.adicional2, estadias.adicional3, estadias.descuento, estadias.cantidad_personas, estadias.total, tarifas.descripcion,tarifas.tarifa, turistas.apellido, turistas.nombres, turistas.nro_documento from pagos inner join estadias on pagos.idestadia=estadias.id inner join tarifas on estadias.tipo_alojamiento=tarifas.id inner join turistas on estadias.idturista=turistas.id where pagos.fecha=curdate() and pagos.idusuario ='$idusuario' and pagos.estado ='N' order by pagos.forma_pago");
						
						}
				else
					if ($operacion==1){
						//para caja individual
						//ver filtro de fecha
						$fecha=$_POST["caracteres"];
						/*$json=queryToJson($con,"Select pagos.id, pagos.fecha, pagos.importe, pagos.forma_pago, estadias.id as idestadia, estadias.idparcela, estadias.nrocarpa, estadias.fecha_ingreso, estadias.fecha_egreso, estadias.importe, estadias.adicional, estadias.adicional2, estadias.adicional3, estadias.descuento, estadias.cantidad_personas, estadias.total, tarifas.descripcion,tarifas.tarifa, turistas.apellido, turistas.nombres, turistas.nro_documento, turistas.ciudad, provincias.provincia as nombreprovincia, usuarios.usuario from pagos inner join estadias on pagos.idestadia=estadias.id inner join tarifas on estadias.tipo_alojamiento=tarifas.id inner join turistas on estadias.idturista=turistas.id  left join provincias on turistas.provincia=provincias.id inner join usuarios on pagos.idusuario=usuarios.id where pagos.fecha='$fecha' and  pagos.idusuario ='$idusuario' and pagos.estado ='N' order by pagos.forma_pago");*/
						$json=queryToJson($con,"Select pagos.id, pagos.fecha, pagos.importe, pagos.forma_pago, estadias.id as idestadia, estadias.idparcela, estadias.nrocarpa, estadias.fecha_ingreso, estadias.fecha_egreso, estadias.importe, estadias.adicional, estadias.adicional2, estadias.adicional3, estadias.descuento, estadias.cantidad_personas, estadias.total, tarifas.descripcion,tarifas.tarifa, turistas.apellido, turistas.nombres, turistas.nro_documento, usuarios.usuario, ciudades.ciudad as nombreciudad, turistas.dciudad, provincias.provincia as nombreprovincia, paises.pais as nombrepais from pagos inner join estadias on pagos.idestadia=estadias.id inner join tarifas on estadias.tipo_alojamiento=tarifas.id inner join turistas on estadias.idturista=turistas.id inner join usuarios on pagos.idusuario=usuarios.id left join provincias on turistas.provincia=provincias.id left join ciudades on turistas.ciudad=ciudades.id left join paises on turistas.pais=paises.id  where pagos.fecha='$fecha' and  pagos.idusuario ='$idusuario' and pagos.estado ='N' order by pagos.forma_pago");
						}
						else
							if ($operacion==2){
							//para caja diaria
						//ver filtro de fecha
							$fecha=$_POST["caracteres"];
							$json=queryToJson($con,"Select pagos.id, pagos.fecha, pagos.importe, pagos.forma_pago, estadias.id as idestadia, estadias.idparcela, estadias.nrocarpa, estadias.fecha_ingreso, estadias.fecha_egreso, estadias.importe, estadias.adicional, estadias.adicional2, estadias.adicional3, estadias.descuento, estadias.cantidad_personas, estadias.total, tarifas.descripcion,tarifas.tarifa, turistas.apellido, turistas.nombres, turistas.nro_documento, usuarios.usuario, ciudades.ciudad as nombreciudad, turistas.dciudad, provincias.provincia as nombreprovincia, paises.pais as nombrepais from pagos inner join estadias on pagos.idestadia=estadias.id left join tarifas on estadias.tipo_alojamiento=tarifas.id inner join turistas on estadias.idturista=turistas.id inner join usuarios on pagos.idusuario=usuarios.id left join provincias on turistas.provincia=provincias.id left join ciudades on turistas.ciudad=ciudades.id left join paises on turistas.pais=paises.id where pagos.fecha='$fecha' and pagos.estado ='N' order by pagos.id");
							}
							

								else
									if ($operacion==5){
										//calcula suma total cajero
										$fecha=$_POST["caracteres"];
				 						$json=queryToJson($con,"Select fecha, sum(importe) as total from pagos where pagos.fecha='$fecha' and pagos.idusuario ='$idusuario' and pagos.estado='N' group by fecha");
										}
									else
										if ($operacion==6){
											//calcula subtotal efectivo cajero
											$fecha=$_POST["caracteres"];
				 							$json=queryToJson($con,"Select fecha, sum(importe) as total from pagos where pagos.fecha='$fecha' and pagos.forma_pago='E' and pagos.idusuario ='$idusuario' and pagos.estado ='N' group by fecha");
											}
										else
											if ($operacion==7){
												//calcula subtotal debito cajero
												$fecha=$_POST["caracteres"];
						 						$json=queryToJson($con,"Select fecha, sum(importe) as total from pagos where pagos.fecha='$fecha' and pagos.forma_pago = 'D' and pagos.idusuario ='$idusuario' and pagos.estado ='N' group by fecha");
											}
											else
												if ($operacion==8){
												//calcula subtotal efectivo del dia
													$fecha=$_POST["caracteres"];
				 									$json=queryToJson($con,"Select fecha, sum(importe) as total from pagos where pagos.fecha='$fecha' and pagos.forma_pago='E' and pagos.estado ='N' group by fecha");
				 									}
				 								else
					 								if ($operacion==9){
					 								//calcula subtotal debito del dia
													$fecha=$_POST["caracteres"];
							 						$json=queryToJson($con,"Select fecha, sum(importe) as total from pagos where pagos.fecha='$fecha' and pagos.forma_pago = 'D' and pagos.estado ='N' group by fecha");
							 						}
							 						else
							 							if ($operacion==10){
															$fecha=$_POST["caracteres"];
				 											$json=queryToJson($con,"Select fecha, sum(importe) as total from pagos where pagos.fecha='$fecha' and pagos.estado='N' group by fecha");
				 										}
				 										else
				 											if ($operacion==11){
				 												//pagos de estadias entre dos fechas
				 												$fecha1=$_POST["fecha1"];
																$fecha2=$_POST["fecha2"];
				 												$json=queryToJson($con,"Select pagos.id, pagos.fecha, pagos.importe, pagos.forma_pago, estadias.id as idestadia, estadias.idparcela, estadias.nrocarpa, estadias.fecha_ingreso, estadias.fecha_egreso, estadias.importe, estadias.adicional, estadias.adicional2, estadias.adicional3, estadias.descuento, estadias.cantidad_personas, estadias.total, tarifas.descripcion,tarifas.tarifa, turistas.apellido, turistas.nombres, turistas.nro_documento, usuarios.usuario, turistas.ciudad, provincias.provincia as nombreprovincia from pagos inner join estadias on pagos.idestadia=estadias.id inner join tarifas on estadias.tipo_alojamiento=tarifas.id inner join turistas on estadias.idturista=turistas.id inner join usuarios on pagos.idusuario=usuarios.id left join provincias on turistas.provincia=provincias.id where pagos.fecha>='$fecha1' and pagos.fecha<='$fecha2' and pagos.estado ='N' order by pagos.id");
				 										}
				 										else
				 											if ($operacion==12){
																//calcula subtotal efectivo del dia
																$fecha1=$_POST["fecha1"];
																$fecha2=$_POST["fecha2"];
				 												$json=queryToJson($con,"Select sum(importe) as total from pagos where pagos.fecha>='$fecha1' and pagos.fecha<='$fecha2' and pagos.forma_pago = 'E' and pagos.estado ='N'");
							 									}
				 											
				 											else
				 												if ($operacion==13){
					 											//calcula subtotal debito entre fechas
																$fecha1=$_POST["fecha1"];
																$fecha2=$_POST["fecha2"];
							 									$json=queryToJson($con,"Select sum(importe) as total from pagos where pagos.fecha>='$fecha1' and pagos.fecha<='$fecha2' and pagos.forma_pago = 'D' and pagos.estado ='N'");
							 									}
							 									else
							 										if ($operacion==14){
																	$fecha1=$_POST["fecha1"];
																	$fecha2=$_POST["fecha2"];
							 										$json=queryToJson($con,"Select sum(importe) as total from pagos where pagos.fecha>='$fecha1' and pagos.fecha<='$fecha2' and pagos.estado ='N'");
				 												}
																	else
																		if ($operacion==15){
																			$fecha=$_POST["caracteres"];
																			$json=queryToJson($con,"SELECT DISTINCT pagos.idusuario as id, usuarios.usuario FROM `pagos` left join usuarios on pagos.idusuario=usuarios.id where pagos.fecha='$fecha';");
																		}
																		else
																		    if ($operacion==16){
																				$fecha=$_POST["caracteres"];	
																				$json=queryToJson($con,"SELECT pagos.id as secuencia, pagos.fecha_hora as fpago, pagos.idestadia as estadia, CASE WHEN pagos.forma_pago='E' then pagos.importe else 0.00 end as efectivo, CASE WHEN pagos.forma_pago='D' then pagos.importe else 0.00 end as debito, CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe end as devoluciones,CASE WHEN pagos.forma_pago='E' then pagos.importe-(CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe END) else 0.00 end as total_efectivo, CASE WHEN pagos.forma_pago='D' then pagos.importe-(CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe END) else 0.00 end as total_debito, usuarios.usuario FROM `pagos` left join devoluciones on pagos.idestadia = devoluciones.idestadia left join usuarios on pagos.idusuario = usuarios.id where pagos.estado = 'N' and pagos.fecha = '$fecha' order by pagos.id;");
																			}
																			else if ($operacion==17){
																				//calcula subtotal debito del dia
																			   $fecha=$_POST["caracteres"];
																				$json=queryToJson($con,"Select fecha, sum(importe) as total from pagos where pagos.fecha='$fecha' and pagos.forma_pago = 'T' and pagos.estado ='N' group by fecha");
																				}
										




				
							
 			}
 			else
 				if ($accion==5) {
			# cambiar forma de pago

				$id=$_POST["idpago"];
				$forma_pago=$_POST["forma_pago"];


				$query = mysqli_query($con, "update pagos set forma_pago='$forma_pago' where id='$id'") or die(mysqli_error($con));   
				if ($query) {
					$json = json_encode(array("error"=>0));
				}else{
					$json = json_encode(array("error"=>1,"valor"=>"No se pudo eliminar.-"));
				};
		} 



echo $json;

?>