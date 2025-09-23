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
	
 			if ($accion==4) {
 				# listar
 				$operacion=$_POST["operacion"];
				
 				if ($operacion==0){
 					//recaudacion x mes
 						$json=queryToJson($con,"SELECT MONTH(FECHA) as mes, YEAR(FECHA) as anio, COUNT(ID) as cantidad, SUM(IMPORTE) as suma FROM pagos WHERE ESTADO='N' group by MONTH(FECHA), YEAR(FECHA) order by anio, mes");
						}
				else
					{
						if ($operacion==1)
						//armar estadistica con lugares de origen de los turistas
						{	
 						$json=queryToJson($con,"select turistas.provincia, provincias.provincia, count(estadias.id) as cantidad from estadias inner join turistas on estadias.idturista=turistas.id inner join provincias on turistas.provincia=provincias.id where estadias.estado!='A' group by turistas.provincia order by cantidad desc");

						}
				 		else
					    {
					    	if ($operacion==2)
					    	//estadistica segun tipo de alojamiento
					    	{	
					    		$json=queryToJson($con,"SELECT estadias.tipo_alojamiento, tarifas.descripcion, count(estadias.id) as cantidad FROM estadias inner join tarifas on estadias.tipo_alojamiento=tarifas.id where estado!='A' group by estadias.tipo_alojamiento");
							}
					    	else
					    	{
					    		if ($operacion==3)
					    		{
					    			$json=queryToJson($con,"SELECT MONTH(estadias.fecha_ingreso) as mes, YEAR(estadias.fecha_ingreso) as anio, sum(estadias.cantidad_personas) as cantidad FROM estadias where estado!='A' group by MONTH(estadias.fecha_ingreso), YEAR(estadias.fecha_ingreso) order by anio, mes
										");
					    		}
					    		else
					    		{
					    			$fd=$_POST["fd"];
					    			$fh=$_POST["fh"];	
					    			if ($operacion==5)
					    			{
					    				$json=queryToJson($con,"SELECT MONTH(FECHA) as mes, YEAR(FECHA) as anio, COUNT(ID) as cantidad, SUM(IMPORTE) as suma FROM pagos WHERE ESTADO='N' and FECHA>='$fd' and FECHA <='$fh' group by MONTH(FECHA), YEAR(FECHA) order by anio, mes");
						   			}
						   			else
						   				if ($operacion==6)
						    			{
						    				$json=queryToJson($con,"select turistas.provincia, provincias.provincia, count(estadias.id) as cantidad from estadias inner join turistas on estadias.idturista=turistas.id inner join provincias on turistas.provincia=provincias.id where estadias.estado!='A' and estadias.fecha_ingreso>='$fd' and estadias.fecha_egreso<='$fh' group by turistas.provincia order by cantidad desc");
							   			}
							   			else
							   				if ($operacion==7)
									    	//estadistica segun tipo de alojamiento segun fechas
									    	{	
						    					$json=queryToJson($con,"SELECT estadias.tipo_alojamiento, tarifas.descripcion, count(estadias.id) as cantidad FROM estadias inner join tarifas on estadias.tipo_alojamiento=tarifas.id where estado!='A' and estadias.fecha_ingreso>='$fd' and estadias.fecha_egreso<='$fh' group by estadias.tipo_alojamiento");
											}
											else
												if ($operacion==8)
										    		{
										    			$json=queryToJson($con,"SELECT MONTH(estadias.fecha_ingreso) as mes, YEAR(estadias.fecha_ingreso) as anio, sum(estadias.cantidad_personas) as cantidad FROM estadias where estado!='A' and estadias.fecha_ingreso>='$fd' and estadias.fecha_egreso<='$fh' group by MONTH(estadias.fecha_ingreso), YEAR(estadias.fecha_ingreso) order by anio, mes
															");
										    		}					
										    	

									}
					    	}
					    }
						
					
				
					}




							
 			}



echo $json;

?>