<?php

include('../conexion.php');
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();
date_default_timezone_set('America/Argentina/Buenos_Aires');

$fecha = $_POST["fecha"];
$idusuario = isset($_POST["idusuario"]) ? $_POST["idusuario"] : 0;

$condUsuario = ($idusuario > 0) ? " AND modificados.idusuario = $idusuario" : "";
$consulta = "
SELECT DATE(modificados.fecha_hora) AS fecha, modificados.idpago AS idpago, modificados.detalle AS detalle, usuarios.usuario as usuario FROM modificados left join usuarios on modificados.idusuario=usuarios.id WHERE DATE(modificados.fecha_hora) ='$fecha' $condUsuario;";


$json = queryToJson($con, $consulta);


echo $json;
