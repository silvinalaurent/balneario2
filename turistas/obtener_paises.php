<?php

include('../conexion.php'); 
error_reporting(E_ALL ^ E_NOTICE);


// Consulta a la base de datos
$sql = "SELECT id, pais FROM paises";
$result = $con->query($sql);

$paises = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $paises[] = $row;
    }
}

// Cierra la conexión
$con->close();

// Devuelve los datos en formato JSON
echo json_encode($paises);
?>