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
$titulo=$_POST['titulo'];
$url=$_POST['url'];
$nivel=$_POST['nivel'];
$padre=$_POST['padre'];

if ($accion==1) {
     	
       	# agregar 

	$_SESSION["accion"]="ALTA";
 	 	 	
 	$query= "insert into menues (titulo, url, nivel, padre) values ('$titulo','$url','$nivel','$padre')";
	
	$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
	if ($resultado) {
		$json = json_encode(array("error"=>0));
	}
	else{
		$json = json_encode(array("error"=>1,"valor"=>$query));
	}
}

else{
	#  modificar
	if ($accion==2){
	
		$_SESSION["accion"]="EDITA";
		$query = "update menues set titulo='$titulo',url='$url',nivel='$nivel',padre='$padre' where id='$_POST[idmenu]'";
		
		$resultado = mysqli_query($con,$query) or die(mysqli_error($con));   
        	 
	   	
		if ($resultado) {
		
				$json = json_encode(array("error"=>0));
				
			}else{
				$json = json_encode(array("error"=>1,"valor"=>"No se pudo modificar.-"));
			};

	}
	
	else {
		if ($accion==3) {
			# borrar

			$ide=$_POST["codigo"];


			$query = mysqli_query($con, "DELETE FROM menues WHERE id=".$ide) or die(mysqli_error($con));   
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
						$json=queryToJson($con,"select * from menues order by nivel, padre");
						}
				else{
					if ($operacion==1){
							$caracteres=$_POST["caracteres"];
							$json=queryToJson($con,"select * from menues where UPPER(titulo) LIKE UPPER('%$caracteres%') order by nivel, padre");
						}
					
					 } 

				}
				
							
			}
		
			
		
		}
	}

echo $json;

?>