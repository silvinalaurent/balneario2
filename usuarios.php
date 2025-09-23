<?php
include('conexion.php'); 
error_reporting(E_ALL ^ E_NOTICE);
session_start();


function verificar_login($user,$password,&$result) {
 
    $sql = "SELECT * FROM usuarios WHERE nombre = '$user' and clave = '$password'";
    $rec = mysql_query($sql);
    $count = 0;
    while($row = mysql_fetch_object($rec))
    {
        $count++;
        $result = $row;
    }
    if($count == 1)
    {
        return 1;
    }
    else
    {
        return 0;
    }
};

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
$idusuario=$_POST['idusuario'];
$usuario=$_POST['nombreusuario'];
$clave=$_POST['claveusuario'];

	
if ($accion==1) {
     	
       	# agregar 

	$_SESSION["accion"]="ALTA";


	$clavecifrada = hash('sha256',$clave);

 	$query= "insert into usuarios (usuario,clave) values ('$usuario','$clavecifrada')";
	
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
		$clavecifrada = hash('sha256',$clave);

		$query = "update usuarios set usuario='$usuario', clave='$clavecifrada' where id='$_POST[idusuario]'";
		
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
			
			$query = mysqli_query($con,"delete from usuarios where id='$_POST[codigo]'") or die(mysqli_error($con));   
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
						$json=queryToJson($con,"select * from usuarios order by usuario");
						}
				else{//busqueda por caractres
					if ($operacion==1){
							$caracteres=$_POST["caracteres"];
							$json=queryToJson($con,"select * from usuarios where UPPER(usuario) LIKE UPPER('%$caracteres%') order by usuario");
						}
					else
						if ($operacion==2){//busqueda por nombre de usuario
							$caracteres=$_POST["caracteres"];
							$json=queryToJson($con,"select * from usuarios where UPPER(usuario)=UPPER('$caracteres')");
						}
					
					 } 

				}
				
			else
				if ($accion==5) {
					$clavecifrada = hash('sha256',$clave);
					
					$json=queryToJson($con, "update usuarios set clave='$clavecifrada' where usuario='$usuario'");
					
				}		
				else
				    if ($accion==6)
					{
						$json=queryToJson($con, "update usuarios set nombre='$usuario' where id='$idusuario'");	   	
					}	
			}
		
			
		
		}
	}

echo $json;

?>