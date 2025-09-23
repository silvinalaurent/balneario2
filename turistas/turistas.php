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

$idturista=$_POST["idturista"];
$apellido=$_POST['apellido'];
$nombres=$_POST['nombres'];
$documento=$_POST['documento'];
$domicilio=$_POST['domicilio'];
$ciudad=$_POST['ciudad'];
$provincia=$_POST['provincia'];
$pais=$_POST['pais'];
$telefono=$_POST['telefono'];
$email=$_POST['email'];
$redes=$_POST['redes'];
$fecha_nacimiento = isset($_POST['fecha_nacimiento']) && !empty($_POST['fecha_nacimiento']) ? $_POST['fecha_nacimiento'] : '0000-00-00';
$ocupacion=$_POST['ocupacion'];

	
if ($accion==1) {
     	
       	# agregar 

		$_SESSION["accion"]="ALTA";
	 	 	 	
	 	$query= "insert into turistas (apellido, nombres, nro_documento, domicilio, ciudad, dciudad, provincia, pais, movil, redes_sociales, correo, fecha_nacimiento, ocupacion) values (UPPER('$apellido'),UPPER('$nombres'),'$documento',UPPER('$domicilio'),'$ciudad','','$provincia','$pais','$telefono','$redes','$email', '$fecha_nacimiento','$ocupacion')";
		
		$resultado = mysqli_query($con,$query);// or die(mysqli_error($con));   
		
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
			$query = "update turistas set apellido=UPPER('$apellido'), nombres=UPPER('$nombres'), nro_documento='$documento', domicilio=UPPER('$domicilio'), ciudad='$ciudad', provincia='$provincia',pais='$pais', movil='$telefono', redes_sociales='$redes', correo='$email', fecha_nacimiento = '$fecha_nacimiento', ocupacion='$ocupacion' where id='$idturista'";
			
			
			$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
		   	
			if ($resultado) {
					$json = json_encode(array("error"=>0));
				}else{
					$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
				};

	}

	
	else 

		if ($accion==3) {
			# borrar

				$ide=$_POST["codigo"];


				$query = mysqli_query($con, "DELETE FROM turistas WHERE id=".$ide) or die(mysqli_error($con));   
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
				// Opcion 0: lista los ultimos 20 turistas cargados
 				if ($operacion==0){
 						$json=queryToJson($con,"select turistas.*, ciudades.ciudad as nombreciudad, provincias.provincia as nombreprovincia, paises.pais as nombrepais from turistas left join ciudades on turistas.ciudad=ciudades.id left join provincias on turistas.provincia = provincias.id left join paises on turistas.pais=paises.id order by id desc limit 20");
				}else{
					if($operacion==1){
						 $id= $_POST["caracteres"];
 						 $json=queryToJson($con,"select turistas.*, ciudades.ciudad as nombreciudad, provincias.provincia as nombreprovincia, paises.pais as nombrepais from turistas left join ciudades on turistas.ciudad=ciudades.id left join provincias on turistas.provincia=provincias.id left join paises on turistas.pais=paises.id where turistas.id='$id'");
					}else{
						if($operacion==2){
	 							$json=queryToJson($con,"SELECT MAX(id) AS ultimo FROM turistas");
						}else{
							if($operacion==3){
								//filtrar por apellido
							 $caracteres= $_POST["caracteres"];
	 						 $json=queryToJson($con,"select turistas.*,  ciudades.ciudad as nombreciudad,provincias.provincia as nombreprovincia, paises.pais as nombrepais from turistas left join ciudades on turistas.ciudad=ciudades.id left join provincias on turistas.provincia=provincias.id left join paises on turistas.pais=paises.id where turistas.apellido like '%$caracteres%' order by apellido,nombres");
							}else{
								if($operacion==4){
									$caracteres= $_POST["caracteres"];
									$json=queryToJson($con,"select id, concat(apellido,' ',nombres) as apynom, nro_documento from turistas where concat(apellido,' ',nombres) like '%$caracteres%' or nro_documento like '%$caracteres%' order by apynom limit 20");
                        		}else{
                        			if ($operacion==5){
										$caracteres= $_POST["caracteres"];
										$json=queryToJson($con,"select correo from turistas where id='$caracteres'");
									}else{
										if($operacion==6){
											$apellido = isset($_POST["apellido"])?$_POST["apellido"]:"";
											$nro_documento = isset($_POST["nro_documento"])?$_POST["nro_documento"]:"";
											$movil = isset($_POST["movil"])?$_POST["movil"]:"";
									
											$filtro = "";
											$filtro .= $apellido != ""?"apellido like '%$apellido%'":"";

											$filtro .= ($nro_documento != ""? ($filtro != ""?" and ":"") . "nro_documento like '%$nro_documento%'":"");
											$filtro .= ($movil != ""? ($filtro != ""?" and ":"") . "movil like '%$movil%'":"");
											if($filtro!=""){
												$json=queryToJson($con,"select turistas.*,  ciudades.ciudad as nombreciudad,provincias.provincia as nombreprovincia, paises.pais as nombrepais from turistas left join ciudades on turistas.ciudad=ciudades.id left join provincias on turistas.provincia=provincias.id left join paises on turistas.pais=paises.id where $filtro order by apellido,nombres");
											};
										}
										else{
											if($operacion==7){
												$caracteres= $_POST["caracteres"];//dni
												$json=queryToJson($con,"select * from turistas where nro_documento='$caracteres'");
											}
										}
									};
								};
							};
						};
					};			
				};			
							
 			}

echo $json;

?>