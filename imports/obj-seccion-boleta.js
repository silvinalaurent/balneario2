import {html, PolymerElement} from '../js/polymer/polymer-element.js';


class seccionboleta extends PolymerElement {
  static get template() {
    return html`
      <style>
      :host{
        width: 100%;
      }
      :host * {
        font-family:"Lucida Console", Monaco, monospace;
        box-sizing:border-box;
        outline: 1px solid rgba(0,0,0,.3);
      }

      :host .seccion-boleta{
        width: 100%;
      }

      :host .sb-titulo{
        width: 100%;
        font-size: 9px;
        line-height: 9px;
        padding: 2px;
        text-align: center;
        background-color: #EAEAEA;
        cursor:pointer;
      }

      :host .sb-contenido{
        font-size: 13px;
        padding: 1.5px;
        text-align: center;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      :host .vermas{
        overflow:visible !important;
        white-space: normal !important;
        text-align: justify !important;
      }

      @media print {
        :host #vermas{
          display: none;
        }
      }
    </style>
    <div class="seccion-boleta">
      <div class="sb-titulo" on-click="_toggleVerMas" title="Ver mas...">
        {{titulo}}
      </div>
      <div class="sb-contenido">
        <slot></slot>
      </div>
    </div>
      
    `;
  }

  static get properties() {
    return {
      titulo:String
    };
  };

  _toggleVerMas(){
    super.ready();
    var sbcontenido = this.shadowRoot.querySelector(".sb-contenido");
    $(sbcontenido).toggleClass("vermas");

    // var vermas = this.shadowRoot.querySelector("#vermas");
    // if($(vermas).text()=="Ver mas..."){
    //   $(vermas).text("Ver menor...");
    // }else{
    //   $(vermas).text("Ver mas...");
    // };
  };

};

window.customElements.define('obj-seccion-boleta', seccionboleta);