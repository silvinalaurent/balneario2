<?php
include('conexion.php'); 
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
$idusuario=$_POST["usuario"];

	
		if ($accion==1) {
			# agregar
				$usuario=$_POST['usuario'];
				$menu=$_POST['menu'];
				$consulta= "insert into permisos(usuario_id,menu_id) values ('$usuario','$menu')";
			
				$query = mysqli_query($con,$consulta) or die(mysqli_error($con));   
				if ($query) {
					$json = json_encode(array("error"=>0));
				}else{
					$json = json_encode(array("error"=>1,"valor"=>"No se pudo eliminar.-"));
				};
		}
				
		

	
		if ($accion==3) {
			# borrar
				$usuario=$_POST['usuario'];
				$menu=$_POST['menu'];
				$consulta= "delete from permisos where usuario_id='$usuario' and menu_id='$menu'";
			
				$query = mysqli_query($con,$consulta) or die(mysqli_error($con));   
				if ($query) {
					$json = json_encode(array("error"=>0));
				}else{
					$json = json_encode(array("error"=>1,"valor"=>"No se pudo eliminar.-"));
				};
		}

		if ($accion==4) {
				# listar
				$json=queryToJson($con,"SELECT * FROM permisos  where usuario_id=$idusuario");
		}
		if ($accion==5)
		{
				$idmenu=$_POST["menu"];
				$json=queryToJson($con,"SELECT * FROM permisos  where usuario_id=$idusuario AND menu_id=$idmenu");
		}
		if ($accion==6) {
				# listar
				$json=queryToJson($con,"SELECT menues.id, menues.titulo, menues.url, menues.padre, menues.nivel FROM permisos INNER JOIN menues ON permisos.menu_id=menues.id  where usuario_id=$idusuario");
		}		
echo $json;

?>