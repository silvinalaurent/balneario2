<?php
// datos de la base de datos 
$bd_host = "localhost"; 
$bd_usuario = "admin2";//admin2 en forma local //u315583124_admin en forma remota
$bd_password = "petronita";//en forma local contraseña petronita //Hhagv>>NdM+5 en forma remota
$bd_base = "u315583124_bsj";

//conecta con el servidor
$con = mysqli_connect($bd_host, $bd_usuario, $bd_password, $bd_base) or die ("No se puede conectar a la base de datos");

mysqli_query($con,"SET NAMES 'UTF8'");

$bd_seleccionada = mysqli_select_db($con,$bd_base);

date_default_timezone_set("America/Argentina/Buenos_Aires");
?>
