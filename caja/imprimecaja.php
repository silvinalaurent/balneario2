<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Listado de Caja</title>
  <link rel="stylesheet" href="../css/estiloimp.css?v=12">
  <script type="text/javascript" src="../js/jquery-2.1.1.min.js"></script>
  <script type="text/javascript" src="../caja/caja.js?v=3.0"></script>

<script type="text/javascript"> 
 
    function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };



 $( document ).ready(function() {
      
      var fecha = getParameterByName('variable'); 
      console.log("fecha ",fecha);

      trae_pagos(1,fecha);
      document.getElementById("fecha").innerHTML = fecha; 
      documment.getElementById("usuario").innerHTML= <?php echo $_SESSION['usuariologueado']; ?>;

    });      

    
 

</script>

</head>

<body>
  
  <div id="general">

  <div id="original">
  <h3>BALNEARIO CAMPING SAN JOSE</h3>
  <h3>Municipalidad de San José</h3>
  <br>
  Fecha: <label id="fecha"></label><br>
  Usuario: <label id="usuarioi"></label><br>

  <div class="tablas">
      
    <table id="tablapagos" name="tablapagos">
      <thead>
        <tr>
          <th>Parcela</th>          
          <th width="100px">Estadia </th>         
          <th>Turista</th>          
          <th>Carpa</th>          
          <th>Personas</th>
          <th>Adicional</th>                    
          <th>Descuento</th>          
          <th>Total</th>          
          <th>Forma Pago</th> 
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    <label id="texto"></label>  
    <br>
    <h4>Efectivo $ <label id="subtotale"></label></h4>
    <h4>Debito $ <label id="subtotald"></label></h4>
    <h3>Total $. <label id="total"></label></h3>
    <br>
     
  
</div>

</body>
</html>
