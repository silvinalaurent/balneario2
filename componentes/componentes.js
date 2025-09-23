
        class CustomForm extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });

                this.shadowRoot.innerHTML = `
                    <div class="form-container">
                        <h3>Formulario</h3>
                        <form id="form">
                            <input type="text" name="nombre" placeholder="Nombre" required>
                            <input type="email" name="email" placeholder="Correo Electrónico" required>
                            <button type="submit">Enviar</button>
                        </form>
                        <p id="mensaje"></p>
                    </div>
                `;

                this.form = this.shadowRoot.querySelector("#form");
                this.mensaje = this.shadowRoot.querySelector("#mensaje");

                this.form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const nombre = this.form.nombre.value;
                    const email = this.form.email.value;
                    this.mensaje.textContent = `Enviado: ${nombre} - ${email}`;
                    this.form.reset();
                });
            }
        }

        customElements.define('custom-form', CustomForm);
    