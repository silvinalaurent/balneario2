<?php

include('../conexion.php');
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();
date_default_timezone_set('America/Argentina/Buenos_Aires');

$fdesde = $_POST["fdesde"];
$fhasta = $_POST["fhasta"];
$idusuario = isset($_POST["idusuario"]) ? $_POST["idusuario"] : 0;
/*
$consulta = "SELECT pagos.id as secuencia, pagos.forma_pago as forma,pagos.fecha_hora as fpago, pagos.idestadia as estadia, pagos.modificado as modificado, concat(estadias.fecha_ingreso,' / ',estadias.fecha_egreso) as fechas,case when pagos.idestadia > 0 then concat(turistas.apellido,' ',turistas.nombres) else 'COBROS EXTRAS' end as turista,estadias.idparcela as parcela , estadias.cantidad_personas, CASE WHEN pagos.forma_pago='E' then pagos.importe else 0.00 end as efectivo, CASE WHEN pagos.forma_pago='D' then pagos.importe else 0.00 end as debito, CASE WHEN pagos.forma_pago='T' then pagos.importe else 0.00 end as transferencia, CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe end as devoluciones, CASE WHEN pagos.forma_pago='E' then pagos.importe-(CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe END) else 0.00 end as total_efectivo, CASE WHEN pagos.forma_pago='D' then pagos.importe-(CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe END) else 0.00 end as total_debito, CASE WHEN pagos.forma_pago='T' then pagos.importe-(CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe END) else 0.00 end as total_transferencia, pagos.importe-(CASE WHEN isnull(devoluciones.importe) then 0.00 else devoluciones.importe END) as total_general, usuarios.usuario FROM `pagos` left join devoluciones on pagos.idestadia = devoluciones.idestadia left join usuarios on pagos.idusuario = usuarios.id left join estadias on pagos.idestadia = estadias.id left join turistas on estadias.idturista = turistas.id where pagos.estado = 'N' and pagos.fecha >= '$fdesde' and pagos.fecha <= '$fhasta' ";
*/
// 02/10 se agrego que se puedan ver pagos anulados y que no sumen
$consulta = "(
-- PAGOS NORMALES
SELECT 
    pagos.id AS secuencia,
    pagos.forma_pago AS forma,
    pagos.fecha_hora AS fpago,
    pagos.idestadia AS estadia,
    pagos.modificado AS modificado,
    pagos.estado as estado,
    CONCAT(estadias.fecha_ingreso, ' / ', estadias.fecha_egreso) AS fechas,
    CASE 
        WHEN pagos.idestadia > 0 THEN CONCAT(turistas.apellido, ' ', turistas.nombres)
        ELSE 'COBROS EXTRAS'
    END AS turista,
    estadias.idparcela AS parcela,
    estadias.cantidad_personas,

    -- NO SUMAR ANULADOS
    CASE 
        WHEN pagos.forma_pago = 'E' 
        THEN pagos.importe 
        ELSE 0.00 
    END AS efectivo,

    CASE 
        WHEN pagos.forma_pago = 'D' 
        THEN pagos.importe 
        ELSE 0.00 
    END AS debito,

    CASE 
        WHEN pagos.forma_pago = 'T' 
        THEN pagos.importe 
        ELSE 0.00 
    END AS transferencia,

    CASE 
        WHEN pagos.estado = 'N' 
        THEN IFNULL(devoluciones.importe,0) 
        ELSE 0.00 
    END AS devoluciones,

    CASE 
        WHEN pagos.estado = 'N' AND pagos.forma_pago = 'E'
        THEN pagos.importe - IFNULL(devoluciones.importe,0) 
        ELSE 0.00 
    END AS total_efectivo,

    CASE 
        WHEN pagos.estado = 'N' AND pagos.forma_pago = 'D'
        THEN pagos.importe - IFNULL(devoluciones.importe,0) 
        ELSE 0.00 
    END AS total_debito,

    CASE 
        WHEN pagos.estado = 'N' AND pagos.forma_pago = 'T'
        THEN pagos.importe - IFNULL(devoluciones.importe,0) 
        ELSE 0.00 
    END AS total_transferencia,

    -- TOTAL GENERAL SOLO DE LOS NO ANULADOS
    CASE
        WHEN pagos.estado = 'N'
        THEN pagos.importe - IFNULL(devoluciones.importe,0)
        ELSE 0.00
    END AS total_general,

    usuarios.usuario

FROM pagos
LEFT JOIN devoluciones ON pagos.idestadia = devoluciones.idestadia
LEFT JOIN usuarios ON pagos.idusuario = usuarios.id
LEFT JOIN estadias ON pagos.idestadia = estadias.id
LEFT JOIN turistas ON estadias.idturista = turistas.id

WHERE pagos.estado IN ('N','A')
  AND pagos.fecha BETWEEN '$fdesde' AND '$fhasta'

)

UNION ALL

(
-- DEVOLUCIONES SIN PAGOS EN ESE DÍA
SELECT 
    devoluciones.id AS secuencia,
    'E' AS forma,
    devoluciones.fecha_hora AS fpago,
    devoluciones.idestadia AS estadia,
    NULL AS modificado,  -- no existe en devoluciones
    NULL AS estado,
    CONCAT(estadias.fecha_ingreso, ' / ', estadias.fecha_egreso) AS fechas,
    CASE 
        WHEN devoluciones.idestadia > 0 THEN CONCAT(turistas.apellido, ' ', turistas.nombres)
        ELSE 'COBROS EXTRAS'
    END AS turista,
    estadias.idparcela AS parcela,
    estadias.cantidad_personas,
    0.00 AS efectivo,
    0.00 AS debito,
    0.00 AS transferencia,
    devoluciones.importe AS devoluciones,
    -devoluciones.importe AS total_efectivo,  -- se resta del total
    0.00 AS total_debito,
    0.00 AS total_transferencia,
    -devoluciones.importe AS total_general,   -- negativo para restar
    usuarios.usuario
FROM devoluciones
LEFT JOIN estadias ON devoluciones.idestadia = estadias.id
LEFT JOIN turistas ON estadias.idturista = turistas.id
LEFT JOIN usuarios ON devoluciones.idusuario = usuarios.id
WHERE devoluciones.fecha BETWEEN '$fdesde' AND '$fhasta'
    AND devoluciones.idestadia NOT IN (
        SELECT DISTINCT idestadia FROM pagos
        WHERE fecha BETWEEN '$fdesde' AND '$fhasta'
    )
);";

/*
$consulta .= $idusuario > 0 ? " and pagos.idusuario = $idusuario" : "";
$consulta .= " order by pagos.id;";
*/
$json = queryToJson($con, $consulta);


echo $json;
