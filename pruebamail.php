<?php
    ini_set( 'display_errors', 1 );
    error_reporting( E_ALL );
    
    $to = "silvinalaurent@gmail.com";
    $subject = "Prueba PHP mail";
    $message = "PHP mail envia biEn";
    
    mail($to,$subject,$message);
    echo "El correo fue enviado.";
?>