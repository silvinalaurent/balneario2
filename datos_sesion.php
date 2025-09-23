<?php
	session_start();
    
	if (isset($_SESSION["conectado"])) {
		echo json_encode(["conectado"=>$_SESSION["conectado"],"usuario_id"=>$_SESSION["idusuario"],"usuario"=>$_SESSION["usuariologueado"]]);
	}else{
		echo json_encode(["conectado"=>0,"usuario_id"=>0,"usuario"=>""]);
	};
?>