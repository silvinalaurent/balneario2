<?php
// Recibir los datos en formato JSON
$data = json_decode(file_get_contents('php://input'), true);
// Capturar los datos
$destinatario = "silvinalaurent@gmail.com";
$asunto = "prueba desde servidor";
$mensaje = "Enviamos reglamento";
$from = "tu-correo@ejemplo.com"; // Dirección del remitente

// Encabezado para definir que es un correo con MIME
$boundary = md5(time()); // Generar un identificador único para separar las partes del mensaje
$headers = "From: $from\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

// Cuerpo del mensaje
$body = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= "$mensaje\r\n\r\n";


// Adjuntar archivo
$filePath = "../REGLAMENTO BALNEARIO.pdf"; // Ruta del archivo a adjuntar
$fileName = basename($filePath);

if (file_exists($filePath)) {
    $fileData = chunk_split(base64_encode(file_get_contents($filePath))); // Codificar el archivo en Base64

    $body .= "--$boundary\r\n";
    $body .= "Content-Type: application/octet-stream; name=\"$fileName\"\r\n";
    $body .= "Content-Description: $fileName\r\n";
    $body .= "Content-Disposition: attachment; filename=\"$fileName\"; size=" . filesize($filePath) . ";\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= "$fileData\r\n\r\n";
} else {
    echo "El archivo no existe.";
    exit;
}

// Finalizar el mensaje
$body .= "--$boundary--";

// Enviar el correo
if (mail($destinatario, $asunto, $body, $headers)) {
    echo "Correo enviado con éxito.";
} else {
    echo "Error al enviar el correo.";
}
?>
