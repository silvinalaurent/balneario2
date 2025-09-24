<?php

include('../conexion.php');
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();
date_default_timezone_set('America/Argentina/Buenos_Aires');

$fdesde = $_POST["fdesde"];
$fhasta = $_POST["fhasta"];
$idusuario = isset($_POST["idusuario"]) ? $_POST["idusuario"] : 0;

$consulta = "SELECT pagos.id as secuencia, pagos.forma_pago as forma,pagos.fecha_hora as fpago, pagos.idestadia as estadia,concat(estadias.fecha_ingreso,' / ',estadias.fecha_egreso) as fechas,case when pagos.idestadia > 0 then concat(turistas.apellido,' ',turistas.nombres) else 'COBROS EXTRAS' end as turista,estadias.idparcela as parcela , estadias.cantidad_personas, CASE WHEN pagos.forma_pago='E' then pagos.importe else 0.00 end as efectivo, CASE WHEN pagos.forma_pago='D' then pagos.importe else 0.00 end as debito, CASE WHEN pagos.forma_pago='T' then pagos.importe else 0.00 end as transferencia, CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe end as devoluciones, CASE WHEN pagos.forma_pago='E' then pagos.importe-(CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe END) else 0.00 end as total_efectivo, CASE WHEN pagos.forma_pago='D' then pagos.importe-(CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe END) else 0.00 end as total_debito, CASE WHEN pagos.forma_pago='T' then pagos.importe-(CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe END) else 0.00 end as total_transferencia, pagos.importe-(CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe END) as total_general, usuarios.usuario FROM `pagos` left join devoluciones on pagos.idestadia = devoluciones.idestadia left join usuarios on pagos.idusuario = usuarios.id left join estadias on pagos.idestadia = estadias.id left join turistas on estadias.idturista = turistas.id where pagos.estado = 'N' and pagos.fecha >= '$fdesde' and pagos.fecha <= '$fhasta' ";
$consulta .= $idusuario > 0 ? " and pagos.idusuario = $idusuario" : "";
$consulta .= " order by pagos.id;";

$json = queryToJson($con, $consulta);


echo $json;
