<?php


echo date_default_timezone_get();

date_default_timezone_set('America/Argentina/Buenos_Aires');

$fechaHora = date("Y-m-d H:i:s"); // Formato: Año-Mes-Día Horas:Minutos:Segundos
echo "La fecha y hora actual del sistema es: " . $fechaHora;

?>