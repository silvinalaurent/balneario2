<?php
include('conexion.php'); 
error_reporting(E_ALL ^ E_NOTICE);
session_start();

// datos de la base de datos 
/*$bd_host = "localhost"; 
$bd_usuario = "root";//social_admin
$bd_password = ""; //desarrollo2018
$bd_base = "social";

//conecta con el servidor
$con = mysqli_connect($bd_host, $bd_usuario, $bd_password, $bd_base) or die ("No se puede conectar a la base de datos");


mysqli_query($con,"SET NAMES 'UTF8'");

// Hacer que foo sea la base de datos actual
$bd_seleccionada = mysqli_select_db($con,$bd_base);
*/

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

// $nombre=$_POST['nombre'];
	
// if ($accion==1) {
     	
//        	# agregar 

// 	$_SESSION["accion"]="ALTA";
 	 	 	
//  	$query= "insert into ayudas (nombre) values ('$nombre')";
	
// 	$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
// 	if ($resultado) {
// 		$json = json_encode(array("error"=>0));
// 	}
// 	else{
// 		$json = json_encode(array("error"=>1,"valor"=>$query));
// 	}
// }

// else{
// 	#  modificar
// 	if ($accion==2){
	
// 		$_SESSION["accion"]="EDITA";
// 		$query = "update ayudas set nombres' $nombre' where id='$_POST[idayuda]'";
		
// 		$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
        	 
	   	
// 		if ($resultado) {
		
// 				$json = json_encode(array("error"=>0));
				
// 			}else{
// 				$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
// 			};

// 	}
	
// 	else {
// 		if ($accion==3) {
// 			# borrar

// 			$ide=$_POST["codigo"];


// 			$query = mysqli_query($con, "DELETE FROM ayudas WHERE id=".$ide) or die(mysqli_error($con));   
// 			if ($query) {
// 				$json = json_encode(array("error"=>0));
// 			}else{
// 				$json = json_encode(array("error"=>1,"valor"=>"No se pudo eliminar.-"));
// 			};
// 		} 
// 		else {
// 			if ($accion==4) {
// 				# listar
// 				$operacion=$_POST["operacion"];
				
// 				if ($operacion==0){
// 						$json=queryToJson($con,"select * from ayudas order by nombre");
// 						}
// 				else{
// 					if ($operacion==1){
// 							$caracteres=$_POST["caracteres"];
// 							$json=queryToJson($con,"select * from ayudas where UPPER(nombre) LIKE UPPER('%$caracteres%') order by nombre");
// 						}
					
// 					 } 

// 				}
				
							
// 			}
		
			
		
// 		}
// 	}

if ($accion==5) {
 				# listar avisos que estan por vencer
				$fecha=$_POST["fecha"];
				$json=queryToJson($con,"select alarmas.*, situaciones.descripcion as descripcion, personas.apellido as apellido, personas.nombres from alarmas left join situaciones on alarmas.idsituacion=situaciones.id left join personas on situaciones.idpersona=personas.id where alarmas.fecha>NOW()and alarmas.fecha < DATE_ADD(NOW(),INTERVAL 30 DAY) and realizado=0 order by fecha");
				}
if ($accion==6) {
 				# modificar estado realizado a aviso.
				$idaviso=$_POST["codigo"];
				
				$query = "update alarmas set realizado=1 where id='$idaviso'";
		
		 		$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
        
 				if ($resultado) {
		
 					$json = json_encode(array("error"=>0));
				
 				}else{
					$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
 				};
				}


echo $json;

?>