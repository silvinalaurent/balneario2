<?php

$reserva=$_POST['idestadia'];
$turista=$_POST['turista'];
$parcela=$_POST['idparcela'];
$fechad=$_POST['fechad'];
$fechah=$_POST['fechah'];
$descripcion=$_POST['descripcion'];
$cantidad_personas=$_POST['cantidad_personas'];
$total=$_POST['total'];
$adicional=$_POST['adicional'];
$observaciones=$_POST['observaciones'];
$descuento=$_POST['descuento'];

$to = "silvinalaurent@gmail.com";//post
$subject = "Estadia Balneario Camping Municipal San José Entre Rios";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

$message = "
<html>
<head>
<title>Estadia Balneario Camping Municipal SJ Ciudad</title>
</head>
<body>
<h1>Felicitaciones</h1>
<p>Que disfrute su estadia en el Balneario Camping San Jose</p>
<br>
<p>Nro. de Estadia: ".$reserva."</p>
<br>
<p>Ubicacion: ".$parcela."</p>
<br>
<p>Turista: ".$turista."</p>
<br>
<p>Desde : ".$fechad."  - Hasta ".$fechah."</p>
<br>
<p>Tipo: ".$descripcion."</p>
<br>
<p>Grupo acompañante  : ".$cantidad_personas."</p>
<br>
<p>Adicional: ".$adicional."</p>
<p>Observaciones: ".$observaciones."</p>
<br>
<p>Total: ".$descuento."</p>
<br>
<br>
<p>Total: ".$total."</p>
<br>


</body>
</html>";
 
mail($to, $subject, $message, $headers);


?>