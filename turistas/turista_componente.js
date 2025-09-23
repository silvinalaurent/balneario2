
class TuristaComponente extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      
      // HTML y CSS del formulario
   
	}
	 
	
  
async connectedCallback() {
      // Agregar listener para el evento submit del formulario
	  this.shadowRoot.innerHTML = `
	  <style>
	   input {
			  border: none;              /* Elimina todos los bordes */
			  border-bottom: 1px solid #000; /* Añade solo un borde inferior */
			  outline: none;             /* Quita el borde de enfoque predeterminado */
			  padding: 5px 0;            /* Ajusta el espacio para una mejor apariencia */
			  font-size: 16px;           /* Ajusta el tamaño de la fuente a tu gusto */
			  width: 100%;               /* Ancho completo del contenedor */
			  transition: border-color 0.3s ease; /* Añade transición para efectos */
		  }

		  input:focus {
			  border-bottom-color: #3498d;
		  }

		  #renglon
			  {
				  display: grid;
				  grid-template-columns: 15% 35% 15% 35% ;
				  grid-template-rows: auto;
				  height: 3em;
			  }

			  
			  #columna1{
				  grid-column: 1;
				  grid-row: 1;
				  text-align: right;
				  padding: 10px;
				  
			  }
			  #columna2{
				  grid-column: 2;
				  grid-row: 1;
				  text-align: left;
				  padding:10px ;
				  
			  }

			  #columna2importe{
				  grid-column: 2;
				  grid-row: 1;
				  text-align: right;
			  }
			  #columna3{
				  grid-column: 3;
				  grid-row: 1;
				  text-align: right;
				  padding: 10px;

			  }
			  #columna4{
				  grid-column: 4;
				  grid-row: 1;
				  text-align:  left;
				  padding: 10px;
			  }

			  #columna1234{
				  grid-column: 1/4;
				  grid-row: 1;
			  }

			  #columna234{
				  grid-column: 2/4;
				  grid-row: 1;
			  }

			  #columna34{
				  grid-column: 3/4;
				  grid-row: 1;
			  }


	  </style>
	  
	<form id="form_turista" name="form_turista"  method="post" accept-charset="utf-8">
											<input id="idturista" name="idturista" style="display:none" type="text" />
										  <div id="renglon">
												<div id="columna1"><label>Apellido</label></div>
												<div id="columna2"><input type="text" id="apellido" name="apellido" size="30"></div>
												<div id="columna3"><label>Nombres</label></div>
												<div id="columna4"><input type="text" id="nombres" name="nombres" size="30"></div>
											</div>
										  <div id="renglon">
												<div id="columna1"><label>Documento</label></div>
												<div id="columna2"><input type="text" id="documento" name="documento" size="10"></div>
												<div id="columna3"><label>Domicilio</label></div>
												<div id="columna4"><input type="text" id="domicilio" name="domicilio" size="40"></div>
											</div>
											<div id="renglon">
											  <div id="columna1"><label>Pais</label></div>
												<div id="columna2"><select id="pais" name="pais" onclick="lista_provincias_pais('provincia1',this.value)"></select></div>
												<div id="columna3"><label>Provincia</label></div>
												<div id="columna4"><select id="provincia1" name="provincia1" onclick="lista_ciudades_provincia('ciudad1',this.value)"></select></div>
											</div>
										  <div id="renglon">
											  <div id="columna1"><label>Ciudad</label></div>
												<!-- <div id="columna2"><input type="text" id="ciudad1" name="ciudad1" size="40"></div> -->
												<div id="columna2"><select id="ciudad1" name="ciudad1"></select></div>
												
											</div>
											<div id="renglon">
											  <div id="columna1"><label>Fecha Nacimiento</label></div>
												<div id="columna2"><input type="date" id="fecha_nacimiento" name="ciudad1" size="40"></div>
												<div id="columna3"><label>Ocupacion</label></div>
												<div id="columna4"><select id="ocupacion" name="ocupacion">
													<option value='NINGUNO'>NINGUNO</option>
													<option value='EMPLEADO PRIVADO'>EMPLEADO PRIVADO</option>
													<option value='EMPLEADO PUBLICO'>EMPLEADO PUBLICO</option>
													<option value='TRABAJADOR INDEPENDIENTE'>TRABAJADOR INDEPENDIENTE</option>
													<option value='PROFESIONAL'>PROFESIONAL</option>
													<option value='JUBILADO'>PROFESIONAL</option>
												</select></div>
											</div>
										  <div id="renglon">
												<div id="columna1"><label>Celular</label></div>
												<div id="columna2"><input type="text" id="telefono" name="telefono" size="15"></div>
												<div id="columna3"><label>E-mail</label></div>
												<div id="columna4"><input type="text" id="email" name="email" size="50"></div>
											</div>
											<div id="renglon">
												<div id="columna1"><label>Redes sociales</label></div>
												<div id="columna2"><input type="text" id="redes" name="redes" size="100"></div>
											</div>
											<div id="renglon">
											  <div id="columna4"><input type="submit" value="Aceptar">
											  <input type="button" id="cancelar" onclick="cierraventana()" value="Cancelar"></div>
										  </div>

										</form>
	`;
  //Ejemplo carga pais
	this.pais = this.shadowRoot.querySelector('#pais');
	// Llama a la función para cargar las opciones dinámicamente
	await this.loadOptions();
	
	const form = this.shadowRoot.querySelector('#form_turista');
    form.addEventListener('submit', (e) => this.enviarFormulario(e));

    }
  
	async loadOptions() {
		try {
		const response = await fetch('obtener_paises.php');
		  const data = await response.json();
	
		  // Limpiar opciones previas
		  this.pais.innerHTML = '';
	
		  // Agregar nuevas opciones desde los datos obtenidos
		  data.forEach(item => {
			const option = document.createElement('option');
			option.value = item.id; // Ajusta según los campos que tengas en la base
			option.textContent = item.pais; // Ajusta según los campos que tengas en la base
			this.pais.appendChild(option);
		  });
		
		} catch (error) {
		  console.error('Error al cargar las opciones:', error);
		  this.pais.innerHTML = '<option>Error al cargar opciones</option>';
		}
	  }

	  async enviarFormulario(event) {
		event.preventDefault(); // Evita el envío normal del formulario
	
		// Captura los datos del formulario
		const apellido = this.shadowRoot.querySelector('#apellido').value;
		const nombres = this.shadowRoot.querySelector('#nombres').value;
		const documento = this.shadowRoot.querySelector('#documento').value;
		const domicilio = this.shadowRoot.querySelector('#domicilio').value;
		const accion=1;
/*
		$ciudad=$_POST['ciudad'];
$provincia=$_POST['provincia'];
$pais=$_POST['pais'];
$telefono=$_POST['telefono'];
$email=$_POST['email'];
$redes=$_POST['redes'];
$fecha_nacimiento=$_POST['fecha_nacimiento'];
$ocupacion=$_POST['ocupacion'];*/*
		console.log('intento guardar');
		try {
		  // Enviar los datos a la API para registrar al cliente
		/*  const response = await fetch('turistas.php', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({accion,apellido, nombres, domicilio, documento })
		  });
	
		  // Verifica la respuesta
		  const resultado = await response.json();
		  const mensaje = this.shadowRoot.querySelector('#mensaje');
		  if (response.ok) {
			mensaje.textContent = 'Cliente registrado con éxito.';
		  } else {
			mensaje.textContent = `Error: ${resultado.error}`;
		  }*/

			$.ajax({      
				type: "post",
				url:"../turistas/turistas.php",
				data:{accion,apellido, nombres, domicilio, documento},
				dataType: "json",
				async: true,
		  
				success: function(turistas){
					   
							  if (turistas["error"]==0) {

								  document.getElementById("cerrar-modal").checked =true;
								  //trae_turistas(0, "");
							  } 
							  else{
								  alert(turistas["valor"]);
								  
							  };                  
				},
		  
				error: function (obj, error, objError){
					alert(error);//avisar que ocurrió un error
					
				}

		  });
		} catch (error) {
		  console.error('Error en el envío:', error);
		  this.shadowRoot.querySelector('#mensaje').textContent = 'Error en el envío.';
		}

	  }  
	
}	
  
  // Registrar el Web Component
  customElements.define('form-turista-componente', TuristaComponente);