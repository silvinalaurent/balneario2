<?php

include('../conexion.php');
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();
date_default_timezone_set('America/Argentina/Buenos_Aires');

$fdesde = $_POST["fdesde"];
$fhasta = $_POST["fhasta"];
$idusuario = isset($_POST["idusuario"]) ? $_POST["idusuario"] : 0;

// 02/12 se agrego que se puedan ver pagos anulados y que no sumen
$condUsuario = ($idusuario > 0) ? " AND pagos.idusuario = $idusuario" : "";
$consulta = "(
-- PAGOS NORMALES
SELECT 
    pagos.id AS secuencia,
    pagos.forma_pago AS forma,
    pagos.estado as estado,
    pagos.fecha_hora AS fpago,
    pagos.idestadia AS estadia,
    pagos.modificado AS modificado,
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

WHERE pagos.fecha BETWEEN '$fdesde' AND '$fhasta' $condUsuario  
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
)
order by secuencia;";


$json = queryToJson($con, $consulta);


echo $json;
