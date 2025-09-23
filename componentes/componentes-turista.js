
        class TuristaForm extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });

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
			  		<h3>Turista</h3>
					<div id="renglon">
			  			<div id="columna1"><label>Apellido</label></div>
			  			<div id="columna2"><input type="text" id="apellido" name="apellido" size="30"></div>
			  			<div id="columna3"><label>Nombres</label></div>
			  			<div id="columna4"><input type="text" id="nombres" name="nombres" size="30"></div>
			  		</div>
					<div id="renglon">
			  			<div id="columna1"><label>Documento</label></div>
			  			<div id="columna2"><input type="text" id="documento" name="documento" size="10" onblur="corrobora_dni(this.value)"></div>
			  			<div id="columna3"><label>Domicilio</label></div>
			  			<div id="columna4"><input type="text" id="domicilio" name="domicilio" size="40"></div>
			  		</div>
					  <div id="renglon">
						<div id="columna1"><label>Pais</label></div>
			  			<div id="columna2"><select id="pais" name="pais"></select></div>
						  <div id="columna3"><label>Provincia</label></div>
			  			<div id="columna4"><select id="provincia1" name="provincia1"></select></div>
			  		</div>
					<div id="renglon">
						<div id="columna1"><label>Ciudad</label></div>
			  			<div id="columna2"><select id="ciudad1" name="ciudad1"></select></div>
		  			
			  		</div>
			  		
			  		<div id="renglon">
						<div id="columna1"><label>Fecha Nacimiento</label></div>
			  			<div id="columna2"><input type="date" id="fecha_nacimiento" name="fecha_nacimiento" size="40"></div>
			  			<div id="columna3"><label>Ocupacion</label></div>
			  			<div id="columna4"><select id="ocupacion" name="ocupacion">
			  				<option value='NINGUNO'>NINGUNO</option>
			  				<option value='EMPLEADO PRIVADO'>EMPLEADO PRIVADO</option>
			  				<option value='EMPLEADO PUBLICO'>EMPLEADO PUBLICO</option>
			  				<option value='TRABAJADOR INDEPENDIENTE'>TRABAJADOR INDEPENDIENTE</option>
			  				<option value='PROFESIONAL'>PROFESIONAL</option>
			  				<option value='JUBILADO'>JUBILADO</option>
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
						<div id="columna4"><input type="button" id="guardar2" onclick="guarda_turista('T')" value="Aceptar"></div>
						
					</div>
			  	</form> 
	
                `;

                this.form = this.shadowRoot.querySelector("#form");
                //this.mensaje = this.shadowRoot.querySelector("#mensaje");

                /*this.form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    //const nombre = this.form.nombre.value;
                    //const email = this.form.email.value;
                    //this.mensaje.textContent = `Enviado: ${nombre} - ${email}`;
                    this.form.reset();
                });
                */
            }
        }

        customElements.define('turista-componente', TuristaForm);
    