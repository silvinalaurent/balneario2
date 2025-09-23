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


	
if ($accion==1) {
     	
       	# agregar 

	$_SESSION["accion"]="ALTA";
	$nombre=$_POST['nombre']; 	 	
	$pais=$_POST['pais']; 	 	
 	$query= "insert into provincias (provincia,idpais) values ('$nombre','$pais')";
	
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
		$idprovincia=$_POST["idprovincia"];
		$nombre=$_POST['nombre'];
		$pais=$_POST['pais']; 	 
		$_SESSION["accion"]="EDITA";
		$query = "update provincias set provincia='$nombre',idpais='$pais' where id='$_POST[idprovincia]'";
		
		
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
 			if ($accion==4) {
 				# listar
 				$operacion=$_POST["operacion"];
				
 				if ($operacion==0){
 						$json=queryToJson($con,"select provincias.*, paises.pais from provincias left join paises on provincias.idpais=paises.id order by provincia");
						}
				else
				    if ($operacion==1)
					{
						$caracteres=$_POST["caracteres"];
 						$json=queryToJson($con,"select provincias.*, paises.pais from provincias left join paises on provincias.idpais=paises.id  where provincia LIKE '%$caracteres%' ORDER BY provincia");
 						
						}
					else
					if ($operacion==2)
					{
						$caracteres=$_POST["caracteres"];
 						$json=queryToJson($con,"select provincias.*, paises.pais from provincias left join paises on provincias.idpais=paises.id where paises.id='$caracteres' ORDER BY provincia");
 						
						}
							
 			}
	}	



echo $json;

?>