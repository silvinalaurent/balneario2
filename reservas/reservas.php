<?php
include('../conexion.php'); 
error_reporting(E_ALL ^ E_NOTICE);
session_start();



function queryToJson($conexion,$sql){
	
    $query=mysqli_query($conexion,$sql);// or die(mysqli_error($con));
		
	if ($query) {
		
			$cant_reg = mysqli_num_rows($query); 
			
			if ($cant_reg !=0) {
				while($obj = @mysqli_fetch_object($query)){
					$arr[] = $obj;
				};
				$json = json_encode($arr);
			}
			else{
					$arr=array("error"=>1,"valor"=>"La consulta no ha conseguido ningún resultado.-");
					$json = json_encode($arr);	
			};
		}
	else{
			$json = json_encode(array("error"=>1,"valor"=>"No se pudo ejecutar la consulta.-"));
		};
	return $json;
};


$accion=$_POST["accion"];
$idturista=$_POST['listaturistas'];
$idparcela=$_POST['numeroparcela'];
$fechad=$_POST['fechad'];
$fechah=$_POST['fechah'];
$tarifa=$_POST['listadotarifas'];
$cantidad_personas=$_POST['cantidad'];
$observaciones=$_POST['observaciones'];

	
if ($accion==1) {
     	
    # agregar 

	$_SESSION["accion"]="ALTA";
 	# estado es N si es Normal o E si es eliminado  	 	
 	$query= "insert into reservas (idparcela, idturista, fecha_ingreso,fecha_egreso,cantidad_personas, tipo_alojamiento, estado, observaciones) values ('$idparcela','$idturista','$fechad','$fechah','$cantidad_personas','$tarifa','N', '$observaciones')";
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
		$query = "update reservas set idparcela='$idparcela', idturista='$idturista', fecha_ingreso='$fechad', fecha_egreso='$fechah', cantidad_personas='$cantidad_personas',tipo_alojamiento='$tarifa', observaciones='$observaciones' where id='$_POST[idreserva]'";
		
		
		$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
	   	
		if ($resultado) {
				$json = json_encode(array("error"=>0));
			}else{
				$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
			};

		}

	
	else 
		if ($accion==3) {
			# borrar, eliminar y guardar comentario de porque se elimina

			$ide=$_POST["codigo"];
			
			$comentario =$_POST["comentario"];
			$query = mysqli_query($con, "update reservas set estado='A', observaciones='$comentario' WHERE id=".$ide) or die(mysqli_error($con));   
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
 						$json=queryToJson($con,"select reservas.*, turistas.apellido, turistas.nombres, tarifas.descripcion from reservas left join turistas on reservas.idturista=turistas.id left join tarifas on reservas.tipo_alojamiento=tarifas.id where reservas.estado='N' and reservas.fecha_ingreso >= curdate() ORDER BY fecha_ingreso");
						}
				else {
						if ($operacion==2)
							{
	 							$json=queryToJson($con,"SELECT MAX(id) AS ultimo FROM reservas");
							}
						else {

						   if ($operacion==3)
							{
								//traer turistas y descripcion de tarifa
								$parcela=$_POST["caracteres"];
	 							$json=queryToJson($con,"select reservas.*, turistas.apellido, turistas.nombres, turistas.nro_documento, tarifas.descripcion, tarifas.tarifa from reservas left join turistas on reservas.idturista=turistas.id left join tarifas on reservas.tipo_alojamiento=tarifas.id where idparcela='$parcela' and reservas.estado='N' and reservas.fecha_ingreso >= curdate() ORDER BY fecha_ingreso");
							}
							else
							{	
								if ($operacion==4)
								{   //para mail
									$caracteres=$_POST["caracteres"];
									$json=queryToJson($con,"select reservas.*, turistas.apellido, turistas.nombres, turistas.nro_documento, turistas.correo, tarifas.descripcion, tarifas.tarifa from reservas left join turistas on reservas.idturista=turistas.id left join tarifas on reservas.tipo_alojamiento=tarifas.id where reservas.id='$caracteres' and reservas.estado='N' and reservas.fecha_ingreso >= curdate()");
								}			
								else
								{	
									if ($operacion==5)
									{	
										//traer turistas y descripcion de tarifa
										$fecha=$_POST["caracteres"];
			 							$json=queryToJson($con,"select reservas.*, turistas.apellido, turistas.nombres, turistas.nro_documento, tarifas.descripcion, tarifas.tarifa from reservas left join turistas on reservas.idturista=turistas.id left join tarifas on reservas.tipo_alojamiento=tarifas.id where fecha_ingreso='$fecha' and estado='N' ORDER BY fecha_ingreso");
									}
									else
									{
										if ($operacion==6)
										{	
											//para muestra_reservas por fecha
											
											$fecha=$_POST["caracteres"];
				 							$json=queryToJson($con,"select * from reservas where fecha_ingreso<='$fecha' and fecha_egreso>='$fecha' and estado='N'");
										}
										else
										{
											if ($operacion==7)
											{	
												//reservas anuladas
												$json=queryToJson($con,"select reservas.*, turistas.apellido, turistas.nombres, tarifas.descripcion from reservas left join turistas on reservas.idturista=turistas.id left join tarifas on reservas.tipo_alojamiento=tarifas.id where reservas.estado='A' ORDER BY fecha_ingreso desc");
											}	
											else
											{	
												if ($operacion==8)
												{	
												//se buscan reservas de un cliente
													$idturista=$_POST["caracteres"];	
													$json=queryToJson($con,"select * from reservas where idturista='$idturista'");
												}
											}
										}
									}	
								}				
							}					
						}						
				}	
			
 			}
 			else
	 			if ($accion==5)
	 						{
								# Actualizar el estado de la Reserva de N "Normal" a C "Confirmada" se hace a traves del chekin
				 				$fechad=$_POST["fechad"];
				 				$fechah=$_POST["fechah"];
								$consulta="select reservas.*, turistas.apellido, turistas.nombres, turistas.nro_documento, tarifas.descripcion, tarifas.tarifa from reservas left join turistas on reservas.idturista=turistas.id left join tarifas on reservas.tipo_alojamiento=tarifas.id where reservas.estado='N'";
								if ($fechad != '')
									$consulta=$consulta." and reservas.fecha_ingreso >= '$fechad'";

								if ($fechah != '')
									$consulta=$consulta." and reservas.fecha_egreso <= '$fechah'";


								
								$consulta=$consulta." ORDER BY fecha_ingreso";
								
								$json=queryToJson($con, $consulta);
							}		
	 			else
	 				if ($accion==6)
 						{
							# Actualizar el estado de la Reserva de N "Normal" a C "Confirmada" se hace a traves del chekin
			 				$reserva=$_POST["reserva"];
							$query = "update reservas set estado='C' where id='$reserva'";
					
							$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
				   			
							if ($resultado) {
									$json = json_encode(array("error"=>0));
								}else{
									$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
								};
						}		
					else 
						if ($accion==7)
			 						{
										# Anulacion de reservas caidas
						 				# por ahora solamente ponemos Chequedas porque no se estaban haciendo las estadias
										$query = "update reservas set estado='C' where estado='N' and fecha_ingreso<CURDATE()";
								
										$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
							   			
										if ($resultado) {
												$json = json_encode(array("error"=>0));
											}else{
												$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
											};
									}		
			

						

echo $json;

?>