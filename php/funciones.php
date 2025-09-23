<?php

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

?>