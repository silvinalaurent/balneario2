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
$idestadia=$_POST['idestadia'];

	
if ($accion==1) {
     	
       	# agregar 

	$_SESSION["accion"]="ALTA";
 	 	 	
 	$query= "insert into grupos (idestadia, idturista) values ('$idestadia','$idturista')";
	
	$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
	if ($resultado) {
		$json = json_encode(array("error"=>0));
	}
	else{
		$json = json_encode(array("error"=>1,"valor"=>$query));
	}
}
/*
else
 	#  modificar
	if ($accion==2){
	
		$_SESSION["accion"]="EDITA";
		$query = "update provincias set provincia='$nombre' where id='$_POST[idprovincia]'";
		
		
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


			$query = mysqli_query($con, "DELETE FROM provincias WHERE id=".$ide) or die(mysqli_error($con));   
			if ($query) {
				$json = json_encode(array("error"=>0));
			}else{
				$json = json_encode(array("error"=>1,"valor"=>"No se pudo eliminar.-"));
			};
		} 
		else {
 */			if ($accion==4) {
 				# listar
 				$operacion=$_POST["operacion"];
 				$caracteres=$_POST["caracteres"];
				
 				if ($operacion==0){
 					//busca los acompañantes de una estadia
 						$json=queryToJson($con,"select * from grupos where idestadia='$caracteres'");
						}
				else
				{
					if ($operacion==1){
 					//busca los acompañantes de una estadia
 						$json=queryToJson($con,"select * from grupos left join turistas on grupos.idturista=turistas.id where idestadia='$caracteres'");
						}
				}
				
							
 			}

//	}	



echo $json;

?>