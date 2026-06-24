<?php

use function PHPSTORM_META\elementType;

include('../conexion.php');
include('../php/funciones.php');
error_reporting(E_ALL ^ E_NOTICE);
session_start();

$accion = $_POST["accion"];
$idtarifa = $_POST["idtarifaprecio"];
$idprecio = isset($_POST["idprecio"]) ? $_POST["idprecio"] : 0;
$fecha_inicio = $_POST["fecha_inicio"];
$fecha_fin = $_POST["fecha_fin"];
$precio = floatval($_POST['precio']);

if ($accion == 1) {

    # agregar 

    $_SESSION["accion"] = "ALTA";

    $query = "insert into tarifas_precios (idtarifa,precio,fecha_inicio,fecha_fin) values ('$idtarifa','$precio','$fecha_inicio','$fecha_fin')";

    $resultado = mysqli_query($con, $query);
    if ($resultado) {
        $json = json_encode(array("error" => 0));
    } else {
        //$json = json_encode(array("error" => 1, "valor" => $query));
        $json = json_encode(array(
            "error" => 1,
            "mensaje" => mysqli_error($con),
            "query" => $query
        ));
    }
} else
    #  modificar
    if ($accion == 2) {

        $_SESSION["accion"] = "EDITA";
        $query = "update tarifas_precios set fecha_inicio='$fecha_inicio',fecha_fin='$fecha_fin', precio='$precio' where id='$_POST[idprecio]'";


        $resultado = mysqli_query($con, $query) or die(mysqli_error($con));

        if ($resultado) {
            $json = json_encode(array("error" => 0));
        } else {
            $json = json_encode(array("error" => 1, "valor" => "No se pudo modificar.-"));
        };
    } else 
		if ($accion == 3) {
        # borrar
        /*
        $ide = $_POST["codigo"];


        $query = mysqli_query($con, "update tarifas_precios set baja=1 where id='" . $ide) or die(mysqli_error($con));
        if ($query) {
            $json = json_encode(array("error" => 0));
        } else {
            $json = json_encode(array("error" => 1, "valor" => "No se pudo eliminar.-"));
        };
        */
    } else {
        if ($accion == 4) {
            # listar
            $operacion = $_POST["operacion"];

            if ($operacion == 0) {
                $json = queryToJson($con, "select * from tarifas_precios order by fecha_inicio asc");
                //select * from tarifas_precios left join tarifas_precios_precios on tarifas_precios.id=tarifas_precios_precios.idtarifa where baja=0 and  CURDATE() between fecha_inicio and fecha_fin order by unidad, descripcion"
            }
            //listar para una tarifa, el precio ultimo
        } else {

            if ($accion == 5) {

                $precios      = json_decode($_POST['precios'], true);
                $fecha_inicio = $_POST['fecha_inicio'];
                $fecha_fin    = $_POST['fecha_fin'];

                mysqli_begin_transaction($con);

                try {

                    $sql = "INSERT INTO tarifas_precios 
                            (idtarifa, precio, fecha_inicio, fecha_fin)
                            VALUES (?, ?, ?, ?)";

                    $stmt = mysqli_prepare($con, $sql);

                    foreach ($precios as $p) {

                        mysqli_stmt_bind_param(
                            $stmt,
                            "idss",
                            $p['idtarifa'],
                            $p['precio'],
                            $fecha_inicio,
                            $fecha_fin
                        );

                        mysqli_stmt_execute($stmt);
                    }

                    mysqli_commit($con);

                    echo json_encode([
                        "error" => 0,
                        "valor" => "OK"
                    ]);
                } catch (Exception $e) {

                    mysqli_rollback($con);

                    echo json_encode([
                        "error" => 1,
                        "valor" => $e->getMessage()
                    ]);
                }
            }
        }
    }




echo $json;
