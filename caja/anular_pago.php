<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set("display_errors", 1);

// Siempre inicializamos un array de respuesta
$respuesta = [
    "status" => "error",
    "mensaje" => "Error desconocido"
];

require_once("../conexion.php");

// Validar datos recibidos
if (!isset($_POST['idpago'])) {
    $respuesta["mensaje"] = "Falta el parámetro idpago";
    echo json_encode($respuesta);
    return;   // en lugar de exit
}

$idpago = intval($_POST['idpago']);

// Ejemplo de consulta
$sql = "UPDATE pagos SET estado = 'A' WHERE id = ?";
$stmt = $con->prepare($sql);

if (!$stmt) {
    $respuesta["mensaje"] = "Error al preparar consulta: " . $con->error;
    echo json_encode($respuesta);
    return;
}

$stmt->bind_param("i", $idpago);

if ($stmt->execute()) {
    $respuesta["status"] = "ok";
    $respuesta["mensaje"] = "Pago anulado correctamente";
} else {
    $respuesta["mensaje"] = "Error al ejecutar: " . $stmt->error;
}

// Siempre devolvemos JSON
echo json_encode($respuesta);
return;
