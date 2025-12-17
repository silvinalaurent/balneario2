<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set("display_errors", 1);

session_start();
require_once("../conexion.php");

// Respuesta por defecto
$respuesta = [
    "status"  => "error",
    "mensaje" => ""
];

$ok = true;   // bandera de control

// 1️⃣ Validaciones
if (!isset($_POST['idpago'])) {
    $respuesta["mensaje"] = "Falta el parámetro idpago";
    $ok = false;
}

if ($ok && (!isset($_POST['motivo']) || trim($_POST['motivo']) === "")) {
    $respuesta["mensaje"] = "Debe indicar el motivo de la anulación";
    $ok = false;
}

if ($ok && !isset($_SESSION['idusuario'])) {
    $respuesta["mensaje"] = "Usuario no autenticado";
    $ok = false;
}

// 2️⃣ Proceso principal
if ($ok) {

    $idpago    = intval($_POST['idpago']);
    $motivo    = trim($_POST['motivo']);
    $idusuario = intval($_SESSION['idusuario']);

    $con->begin_transaction();

    // 2.1 Anular pago
    $stmt = $con->prepare("UPDATE pagos SET estado = 'A' WHERE id = ?");
    if ($stmt) {

        $stmt->bind_param("i", $idpago);
        $stmt->execute();

        if ($stmt->affected_rows === 0) {
            $respuesta["mensaje"] = "El pago no existe o ya está anulado";
            $ok = false;
        }
    } else {
        $respuesta["mensaje"] = "Error al preparar UPDATE pagos";
        $ok = false;
    }

    // 2.2 Registrar modificación
    if ($ok) {
        $stmt2 = $con->prepare("
            INSERT INTO modificados (idpago, detalle, fecha_hora, idusuario)
            VALUES (?, ?, NOW(), ?)
        ");

        if ($stmt2) {
            $stmt2->bind_param("isi", $idpago, $motivo, $idusuario);
            $stmt2->execute();
        } else {
            $respuesta["mensaje"] = "Error al preparar INSERT modificados";
            $ok = false;
        }
    }

    // 2.3 Commit / Rollback
    if ($ok) {
        $con->commit();
        $respuesta["status"]  = "ok";
        $respuesta["mensaje"] = "Pago anulado correctamente";
    } else {
        $con->rollback();
    }
}

echo json_encode($respuesta);
