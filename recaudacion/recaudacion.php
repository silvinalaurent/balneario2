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
$idestadia=$_POST["idestadia"];
$forma_pago=$_POST['forma_pago'];
$total=$_POST['total'];
$idusuario=$_SESSION['idusuario'];
	
if ($accion==1) {
     	
       	# agregar 

	$_SESSION["accion"]="ALTA";
 	 	 	
 	$query= "insert into pagos (fecha, idestadia, forma_pago, importe, idusuario, estado) values (curdate(),'$idestadia','$forma_pago','$total','$idusuario','N'  )";
	
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
		else {
 			if ($accion==4) {
 				# listar
 				$operacion=$_POST["operacion"];
				
 				if ($operacion==0){
 						$json=queryToJson($con,"Select pagos.id, pagos.fecha, pagos.importe, pagos.forma_pago, estadias.id as idestadia, estadias.idparcela, estadias.fecha_ingreso, estadias.fecha_egreso, estadias.importe, estadias.adicional, estadias.adicional2, estadias.adicional3, estadias.descuento, estadias.cantidad_personas, estadias.total, tarifas.descripcion,tarifas.tarifa, turistas.apellido, turistas.nombres, turistas.nro_documento from pagos inner join estadias on pagos.idestadia=estadias.id inner join tarifas on estadias.tipo_alojamiento=tarifas.id inner join turistas on estadias.idturista=turistas.id where pagos.fecha=curdate() and pagos.idusuario ='$idusuario' and pagos.estado ='N'");
						}
				else
					if ($operacion==1){

						//ver filtro de fecha
						$fecha=$_POST["caracteres"];
						$json=queryToJson($con,"Select pagos.id, pagos.fecha, pagos.importe, pagos.forma_pago, estadias.id as idestadia, estadias.idparcela, estadias.fecha_ingreso, estadias.fecha_egreso, estadias.importe, estadias.adicional, estadias.adicional2, estadias.adicional3, estadias.descuento, estadias.cantidad_personas, estadias.total, tarifas.descripcion,tarifas.tarifa, turistas.apellido, turistas.nombres, turistas.nro_documento from pagos inner join estadias on pagos.idestadia=estadias.id inner join tarifas on estadias.tipo_alojamiento=tarifas.id inner join turistas on estadias.idturista=turistas.id where pagos.fecha='$fecha' and  pagos.idusuario ='$idusuario' and pagos.estado ='N'");
						}

					else
						if ($operacion==5){
							$fecha=$_POST["caracteres"];
	 						$json=queryToJson($con,"Select fecha, sum(importe) as total from pagos where pagos.fecha='$fecha' and pagos.idusuario ='$idusuario' and pagos.estado='N' group by fecha");
							}
						else
							if ($operacion==6){
							$fecha=$_POST["caracteres"];
	 						$json=queryToJson($con,"Select fecha, sum(importe) as total from pagos where pagos.fecha='$fecha' and pagos.forma_pago='E' and pagos.idusuario ='$idusuario' and pagos.estado ='N' group by fecha");
							}
							else
								if ($operacion==7){
									$fecha=$_POST["caracteres"];
			 						$json=queryToJson($con,"Select fecha, sum(importe) as total from pagos where pagos.fecha='$fecha' and pagos.forma_pago = 'D' and pagos.idusuario ='$idusuario' and pagos.estado ='N' group by fecha");
								}



				
							
 			}
	}	



echo $json;

?>