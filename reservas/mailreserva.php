<?php

$reserva=$_POST['idreserva'];
$turista=$_POST['turista'];
$parcela=$_POST['idparcela'];
$fechad=$_POST['fechad'];
$fechah=$_POST['fechah'];
$descripcion=$_POST['descripcion'];
$cantidad_personas=$_POST['cantidad_personas'];
$email=$_POST['mail'];

$to = $email;
$subject = "Reserva Balneario Camping Municipal San José Entre Rios";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// <p>Ubicacion: ".$parcela."</p>
// <br>

$message = "
<html>
<head>
<title>Reserva Balneario Camping Municipal SJ Ciudad</title>
</head>
<body>
<h1>Felicitaciones</h1>
<p>Lo esperamos en el Balneario Camping San Jose</p>
<br>
<p>Nro. de Reserva: ".$reserva."</p>
<br>
<p>Turista: ".$turista."</p>
<br>
<p>Desde : ".$fechad."  - Hasta ".$fechah."</p>
<br>
<p>Tipo: ".$descripcion."</p>
<br>
<p>Grupo acompañante  : ".$cantidad_personas."</p>

<h2>Politica de Reservas y Cancelación</h2>

<br>
<a href='https://sanjose.gob.ar/politicas-de-reserva-y-cancelacion/''>Link a la Politica de Reservas y Cancelación</a>
<br>
NO RESPONDA este mensaje, si desea comunicarse hágalo a balneario@sanjose.gob.ar o por teléfono 3447 641922.
<br>
Gracias
</body>
</html>";

$enviado=mail($to, $subject, $message, $headers);

if ($enviado)
  echo 'Email enviado correctamente';
else
  echo 'Error en el envío del email';


?>