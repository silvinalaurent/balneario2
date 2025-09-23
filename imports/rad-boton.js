import {html, PolymerElement} from '../js/polymer/polymer-element.js';
import '../js/polymer/lib/elements/dom-if.js';


class RADBoton extends PolymerElement {
  static get template() {
    return html`
      <link rel="stylesheet" href="[[rootPath]]css/iconos.css">
      <link rel="stylesheet" href="[[rootPath]]css/framesp.css">
      <style>
      :host{
        font-family: var(--rad-fuente,arial);
      }

      :host .radboton{
        padding:  3px 10px 3px 10px;
        margin: 1px;
        border-radius: 10px;
        cursor: pointer;
        text-align: center;
        background-color: var(--rad-fondo,blue);
        color: var(--rad-color,white);
        border:1px solid transparent;
        transition:all .3s;
      }

      :host .radboton:hover{
        border:1px solid var(--rad-fondo,blue);
        color:var(--rad-fondo,blue)!important;
        background-color: var(--rad-color,white) !important;
      }

      :host .desabilitado{
        background-color: #BCBCBC !important;
        color:#757575 !important;
        cursor:no-drop;
      }

      :host .desabilitado:hover{
        border:none !important;
        background-color: #BCBCBC !important;
        color:#757575 !important;
      }
    </style>
    <p on-click="acc" class="radboton">
      <slot></slot>
    </p>
    `;
  }

  static get properties() {
    return {
      accion:String,
        disabled:{
          type:Boolean,
          observer:"_desabilita"
        }
    };
  };

  _desabilita(){
    var boton = this.shadowRoot.querySelector(".radboton"); 
    if(this.disabled){
      $(boton).addClass("desabilitado");
    }else{
      $(boton).removeClass("desabilitado");
    };
  };

  acc(){
    if(!this.disabled){
      eval(this.accion);
    }else{
      infoPopup("Boton Desabilitado");
    };
  };
  
}

window.customElements.define('rad-boton', RADBoton);