<?php
header('Content-Type: application/json; charset=utf-8');
require_once("../conexion.php");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$response = ['status' => 'error', 'msg' => 'Error desconocido'];

try {
    // 1️⃣ Leer parámetros
    $id     = intval($_POST['id'] ?? 0);
    $formaNueva  = isset($_POST['forma_pago']) ? strtoupper($_POST['forma_pago']) : null;
    $lote        = $_POST['lote'] ?? 0;
    $cupon       = $_POST['cupon'] ?? 0;
    $idusuario   = $_SESSION['idusuario'];

    // 2️⃣ Validar datos mínimos
    if (!$id || !$formaNueva) {
        $response['msg'] = 'Faltan datos obligatorios.';
    } elseif (!in_array($formaNueva, ['E', 'D', 'T'])) {
        $response['msg'] = 'Forma de pago inválida.';
    } else {
        $ok = false;
        $detalle = '';

        // 3️⃣ Actualizar según tipo de pago
        if ($formaNueva === 'D') {
            if (!is_numeric($lote) || !is_numeric($cupon)) {
                $response['msg'] = 'Debe ingresar lote y cupón para pagos con Débito.';
            } else {
                $sql = "UPDATE pagos 
                        SET forma_pago = ?, lote = ?, cupon = ?, modificado = 1 
                        WHERE id = ?";
                $stmt = $con->prepare($sql);
                $stmt->bind_param("siii", $formaNueva, $lote, $cupon, $id);
                $ok = $stmt->execute();

                $detalle = "Cambio de forma de pago a Débito (Lote: $lote, Cupón: $cupon)";
            }
        } else {
            // Efectivo o Transferencia → limpiar lote y cupón
            $sql = "UPDATE pagos 
                    SET forma_pago = ?, lote = 0, cupon = 0 , modificado = 1
                    WHERE id = ?";
            $stmt = $con->prepare($sql);
            $stmt->bind_param("si", $formaNueva, $id);
            $ok = $stmt->execute();

            $nombreForma = ($formaNueva === 'E') ? 'Efectivo' : 'Transferencia';
            $detalle = "Cambio de forma de pago a $nombreForma";
        }

        // 4️⃣ Registrar en modificados si todo fue bien
        if ($ok) {
            $sql2 = "INSERT INTO modificados (idpago, detalle, fecha_hora, idusuario)
                     VALUES (?, ?, NOW(), ?)";
            $stmt2 = $con->prepare($sql2);
            $stmt2->bind_param("iss", $id, $detalle, $idusuario);
            $stmt2->execute();

            $response = [
                'status' => 'ok',
                'msg' => 'Forma de pago actualizada y registrada correctamente.'
            ];
        } else {
            $response['msg'] = 'Error SQL: ' . $conexion->error;
        }
    }
} catch (Throwable $e) {
    $response['msg'] = 'Error: ' . $e->getMessage();
}

// 5️⃣ Devolver respuesta JSON
echo json_encode($response);
