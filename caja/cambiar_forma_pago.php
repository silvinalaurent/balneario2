<?php
header('Content-Type: application/json');
include('../conexion.php');

$id = intval($_POST['id'] ?? 0);
$forma_pago = trim($_POST['forma_pago'] ?? '');

if (!$id || !$forma_pago) {
    echo json_encode(["status" => "error", "msg" => "Faltan datos"]);
    exit;
}

$stmt = $con->prepare("UPDATE pagos SET forma_pago=? WHERE id=?");
$stmt->bind_param("si", $forma_pago, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error", "msg" => "Error al actualizar"]);
}
