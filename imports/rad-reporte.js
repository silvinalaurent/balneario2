import {html, PolymerElement} from '../js/polymer/polymer-element.js';
import '../js/polymer/lib/elements/dom-repeat.js';
import '../js/polymer/lib/elements/dom-if.js';
import { afterNextRender } from '../js/polymer/lib/utils/render-status.js';
import '../imports/rad-boton-excel.js';

export class RADReporte extends PolymerElement {
  static get template() {
    return html`
    <link rel="stylesheet" href="/rentas/css/framesp.css">
    <link rel="stylesheet" href="/rentas/css/iconos.css">
    <link rel="stylesheet" href="/rentas/css/comprobantes.css">
    <style>
      :host .paginavertical{
        width:19cm;
        max-height:27.7cm;
        float: none;
        display: block; 
        font-family:"Lucida Console", Monaco, monospace;
        font-size:15px;
        margin-bottom: 10cm;
      }

      :host .paginahorizontal{
        width: 28.7cm;
        max-height:19cm;
        float: none;
        display: block; 
        font-family:"Lucida Console", Monaco, monospace;
        font-size:15px;
        margin-bottom: 10cm;
      }

      :host .saltopagina{
          page-break-after:always;
      }

      :host .encabezado{
        height: 50px;
        margin-bottom: 5px;
      }
      
      :host .encabezado .caja6{
        align-content: center;
      }

      :host .logo{
        background-size: contain;
        background-repeat: no-repeat;
      }

      :host .titulo{
        width: 100%;
        font-size: 16px;
        text-align: center;
        text-decoration: underline;
      }

      :host .subtitulo{
        width: 100%;
        font-size: 9px;
        text-align: center;
      }

      :host .itemvalor{
        /*max-width:200px;*/
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      :host .hoy{
        align-content: center;
      }

      :host .datos{
        border-spacing: 5px 1px;
      }


      :host .datos tbody{
        font-size: 10px;
        line-height: 10px;
      }

      :host tbody tr:nth-child(even) {
        background-color:#f2f2f2;
      }

      :host tbody td div[class!=separador]{
        /*max-width:200px;*/
        overflow:hidden;
        white-space:nowrap;
        text-overflow: ellipsis;
      }

      :host .separador{
        background-color:lightgrey;
      }

      :host .titulotabla{
        border-top: 1px dashed black;
        border-bottom: 1px dashed black;
        font-size: 12px;
        font-weight:normal;
        padding: 5px 0 5px 0
      }

      :host tfoot td{
         border-top: 1px dashed black;
         border-bottom: 1px dashed black;
         font-size: 10px;
         padding: 2px 0 2px 0;
      }

      :host input[type=checkbox]{
        width: 10px !important;
        height: 10px !important;
        margin: 0 !important;
      }

      :host tbody tr:hover{
        outline: 1px solid gray;
      }

      
      :host tbody tr.modificado{
        font-weight: bold;
        background-color: #fffacd !important;
      }
      /*Parche para evitar la duplicacion de los encabezados en las hojas posteriores*/
      thead, tfoot{
        display: table-row-group;
      }

      @media print {
        :host .paginavertical, :host .paginahorizontal{
          margin-bottom: 0
        }

        :host tbody tr:hover{
          outline: none
        }
        
        :host span,:host input[type=checkbox], :host rad-boton,:host rad-boton-excel{
          display:none;
        }
      
      }
    </style>
    <div class="renglon horizontal-centro">
      <rad-boton on-click="_imprimir" title="Imprime Reporte"><span class="impresora"></span></rad-boton>
      <rad-boton on-click="_enviaexcel" title="Genera Excel"><span class="excel"></span></rad-boton>
    </div>
    <template is="dom-repeat" items="[[paginas]]" as="pagina">
      <div class$="pagina{{orientacion}} {{saltopagina}}">
        <div class="renglon encabezado">
          <div class="caja2 logo" style$="background-image:url({{logo}})"></div>
          <div class="caja6">
            <div class="titulo">{{titulo}}</div>
            <div class="subtitulo">{{subtitulo}}</div>
          </div>
          <div class="caja2 hoy">
            <div class="caja10">Fecha:{{fecha}}</div>
            <div class="caja10">Página:[[_nroPagina(index)]]</div>
            <div class="caja10">Registros:{{cantidad}}</div>
          </div>
        </div>
        <table class$="datos pagina{{nombre}}[[index]]" width="100%">
          <thead>
            <tr>
              <template is="dom-repeat" items="{{ encabezados }}" as="encabezado">
                <th class="titulotabla">{{encabezado}}</th>
              </template> 
            </tr>
          </thead>
          <tbody>

            <template is="dom-repeat" items="{{ pagina.elementos }}" as="renglon">
              
              <template is="dom-if" if="{{!_esseparador(renglon)}}">
                  <tr class$="{{_esModificado(renglon)}}">
                  <template is="dom-repeat" items="{{ _toArray(renglon) }}" as="item">
                    <td align="{{alineacion(item.valor,item.nombre)}}">
                      <template is="dom-if" if="[[ _esSecuencia(item.nombre) ]]">
                       <div class="itemvalor">
                          [[decimales(item.valor,item.nombre)]]
                          <template is="dom-if" if="[[ !_esModificadoBool(renglon) ]]">                         
                            <a href="javascript:void(0)"
                              on-click="cambiarPago"
                              title="Cambiar Forma de Pago"
                              data-id$="[[item.valor]]"
                              data-forma$="[[renglon.forma]]">
                             <span class="lapiz"></span>
                            </a>
                          </template>
                        </div>
                      </template>
                      <template is="dom-if" if="[[ !_esSecuencia(item.nombre) ]]">
                        <div class="itemvalor" inner-h-t-m-l="[[decimales(item.valor,item.nombre)]]"></div>
                      </template>
                    </td>
                  </template>
                </tr>
              </template>

              <template is="dom-if" if="{{_esseparador(renglon)}}">
                <tr>
                  <td align="center" colspan$="[[_cantcolumnas()]]"><div class="separador" inner-h-t-m-l="[[renglon.reportetitulo]]"></div></td>
                </tr>
              </template>
            
            </template>
          </tbody>
          <tfoot>
            <tr>
              <template is="dom-repeat" items="{{ pagina.totales }}" as="pie">
                <td align="right">{{decimales(pie,"totals")}}</td>
              </template> 
            </tr>
          </tfoot>
        </table>
      </div>
    </template>
    `;
  }
  
  static get properties() {
    return {
      nombre:{
          type:String,
          value:"reporte"
        },
        logo:String,
        titulo:String,
        subtitulo:String,
        encabezados:Array,
        elementos:{
          type:Array,
          reflectToAttribute:false,
          readOnly:false
        },
        elementosxpagina:{
          type:Number,
          value:82
        },
        totales:{
          type:Array,
          value:[]
        },
        paginas:{
          type:Array,
          value:[]
        },
        orientacion:{
          type:String,
          value:"vertical"
        },
        saltopagina:{
          type:String,
          value:"saltopagina"
        },
        cantidad:{
          type:Number,
          computed:"_cantelem(elementos)"
        },
        fecha:String
    };
  };

  ready(){
    super.ready();
    this.fecha = hoy();
    var totaltemp=[];

    // genera paginas con elementos y totales
    for (var i = 0; i <= (this.elementos.length / this.elementosxpagina) ; i++) {
      var desde = i*this.elementosxpagina;
      var elementostemp = this.elementos.slice(desde,desde+this.elementosxpagina);
      //totales por pagina
      for(var z in elementostemp){
        var totalpagina = []
        var elementotemp = elementostemp[z];
        for(var y in elementotemp){
          if(elementostemp[z].reportetipo!="separador"){
            if(this.totales.indexOf(y)>=0){
              totaltemp[y] = totaltemp[y]==undefined?0.00:totaltemp[y];
              totaltemp[y]+=parseFloat(elementotemp[y]);
            }else{
              totaltemp[y]="";
            };
          };
        };
        for(var x in totaltemp){
          totalpagina.push(parseFloat(totaltemp[x]).toFixed(2));
        };
      };
      this.push("paginas",{elementos:elementostemp,totales:totalpagina});
    };
    
    afterNextRender(this, () => {
      var prueba = this.shadowRoot.querySelectorAll(".renglon .caja6 .titulo");
      console.log(prueba);
    });

  };

  //agregado 9/10
  _esModificado(renglon) {
    // Verifica si el campo "modificados" existe y tiene valor 1
    if (renglon.modificado && renglon.modificado   == 1) {
      return "modificado";
    }
    return "";
  }
  //agregado 15/10
  _esModificadoBool(renglon) {
  return renglon.modificado && renglon.modificado == 1;
}
  //agregado 24/09/25 **************************************************************
  _esSecuencia(nombre) {
  return nombre === "secuencia"; // o el nombre real de tu campo
  }

 
cambiarPago(e) {
  e.preventDefault();
  const id = e.currentTarget.dataset.id;
  const forma_actual = e.currentTarget.dataset.forma;

  if (!id || !forma_actual) {
    alert("No se encontró el dato de forma de pago");
    return;
  }

  let opciones = [];
  if (forma_actual === 'E') opciones = ['D', 'T'];
  else if (forma_actual === 'D') opciones = ['E', 'T'];
  else if (forma_actual === 'T') opciones = ['E', 'D'];

  const nuevaForma = prompt(`Elija Nueva Forma de Pago: ${opciones.join(", ")}`).toUpperCase();

  if (!nuevaForma || !opciones.includes(nuevaForma)) {
    alert('Forma de pago incorrecta');
    return;
  }
  // 💳 Si pasa a débito (D), abrir modal
  if (nuevaForma === 'D') {
    this._abrirModalDebito(id, nuevaForma);
    return;
  }
  else
  // Caso normal (sin modal)
  this._actualizarFormaPago(id, nuevaForma);
}

_abrirModalDebito(id, nuevaForma) {
  const modal = document.getElementById("modal-debito");
  modal.style.display = "flex";

  const btnGuardar = document.getElementById("modal-guardar");
  const btnCancelar = document.getElementById("modal-cancelar");

  // Cancelar
  btnCancelar.onclick = () => {
    modal.style.display = "none";
  };

  // Guardar
  btnGuardar.onclick = () => {
    const lote = document.getElementById("modal-lote").value.trim();
    const cupon = document.getElementById("modal-cupon").value.trim();

    if (!lote || !cupon) {
      alert("Debe ingresar lote y cupón");
      return;
    }

    modal.style.display = "none";
    this._actualizarFormaPago(id, nuevaForma, lote, cupon);
  };
}

_actualizarFormaPago(id, nuevaForma, lote = "", cupon = "") {
  console.log("id ",id," forma ", nuevaForma, " lote ", lote, " cupon ",cupon);
  const params = new URLSearchParams();
  params.append("id", id);
  params.append("forma_pago", nuevaForma);
  if (lote) params.append("lote", lote);
  if (cupon) params.append("cupon", cupon);

  fetch(`cambiar_forma_pago.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
        alert("Forma de pago actualizada correctamente");
        this._recargarComponente();
      } else {
        alert("Error: " + data.msg);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error en la solicitud");
    });
}
_recargarComponente() {
  // Leer parámetros desde la URL
  const params = new URLSearchParams(window.location.search);
  const fdesde = params.get("fdesde");
  const fhasta = params.get("fhasta");
  const idusuario = params.get("idusuario");

  // Mostrar loading si existe el modal
  const modal = document.querySelector(".tiempo");
  if (modal) modal.style.display = "block";

  // Volver a consultar datos
  fetch("reporte_caja.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `fdesde=${encodeURIComponent(fdesde)}&fhasta=${encodeURIComponent(fhasta)}&idusuario=${encodeURIComponent(idusuario)}`
  })
    .then(res => res.json())
    .then(data => {
      console.log("Datos recargados:", data);
      // Actualiza los elementos y vuelve a armar las páginas
      this.elementos = data;
      this.paginas = [];
      this.ready();
    })
    .catch(err => {
      console.error("Error recargando reporte:", err);
      alert("No se pudo recargar el reporte.");
    })
    .finally(() => {
      if (modal) modal.style.display = "none";
    });
}

  _toArray(obj) {

      return Object.keys(obj)
       .filter(key => key !== "modificado")   // <-- excluir aquí
      .map(function(key) {
        
          return {
            nombre:key,
            valor:obj[key]
          };     
      });
  };

  alineacion(valor,nombre){
    if(this.totales.indexOf(nombre)>=0){
      var al = "right";
    }else{
      var al = typeof(valor)=="number"?"right":(typeof(valor)=="object"?"center":"left");
    };
    return al;
  }

  decimales(valor,nombre){
    if(this.totales.indexOf(nombre)>=0 || nombre=="totals"){
      if(valor!=""&&valor!="NaN"){
        if(valor!='.00'||valor!="0"){
          valor = formatMiles(parseFloat(valor).toFixed(2));
        }else{
          valor = "0.00";
        };
      }else{
        valor = "";
      };
    }else{
      valor = typeof(valor)=="number"?valor.toFixed(2):valor;
    };
    return valor;
  }

  _cantelem(elementos){
    return elementos.length;
  };

  _nroPagina(indice){
    return indice+1;
  };

  _esseparador(elemento){
    return (elemento.reportetipo=="separador");
  };

  _cantcolumnas(){
    return this.encabezados.length;
  };

  _imprimir(){
    print();
  }

  _enviaexcel(){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/rentas/php/query2excel.php");
    form.setAttribute("target","_blank");  

    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = "titulo";
    input.value = this.titulo;
    form.appendChild(input);

    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = "subtitulo";
    input.value = this.subtitulo;
    form.appendChild(input);

    //guarda solo rtexto de los campos
    var temp = this.elementos;
    var resultado = [];
    for(var x in temp){
      var renglon = temp[x];
      for(var y in renglon){
        var html = renglon[y];
        var div = document.createElement("div");
        div.innerHTML = html;
        renglon[y] = div.innerText;
      };
      resultado.push(renglon);
    };

    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = "elementos";
    input.value = JSON.stringify(resultado);
    form.appendChild(input);

    document.body.appendChild(form);                       
    form.submit();                 
    document.body.removeChild(form);   
  }
}

window.customElements.define('rad-reporte', RADReporte);