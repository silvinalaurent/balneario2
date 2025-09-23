import {html, PolymerElement} from '../js/polymer/polymer-element.js';
import '../js/polymer/lib/elements/dom-if.js';
import '../js/polymer/lib/elements/dom-repeat.js';

class RADPanel extends PolymerElement {
  static get template() {
    return html`
      <link rel="stylesheet" href="/rentas/css/iconos.css">
      <link rel="stylesheet" href="/rentas/css/framesp.css">
      <style>
      :host {
        width: 100%;
        font-family: var(--rad-fuente,arial);
        margin: 10px;
        box-sizing:border-box;
      }

      :host .panel{
        transition: 0.5s all
      }
      
      :host .expande{
        position:fixed;
        width:90vw;
        z-index:10000;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        box-shadow: 0 0 10px black;
      }

      :host .expande .rad-panel-contenido ::slotted(*){
        height:auto !important;
      }

      :host .subtitulo{
        font-style: italic;
        font-size: 0.7em;
        line-height: 10px;
        margin: 2px 0 0 0 ;
        padding: 5px 0 1px 13px;
        border-top: 1px solid rgba(255,255,255,.5);
      }

      :host .rad-panel-encabezado{
        padding: 10px;
        letter-spacing: 0.01em;
        font-size: 1.2em;
        border-radius: 10px 10px 0 0;
        background-color: var(--rad-fondo,blue); 
        color:  var(--rad-color,white); ;
        transition:all .5s;
      }

      :host .rad-panel-encabezado span{
        margin-right: 8px;
      }

      :host .rad-panel-contenido{
        width: 100%;
        border: 1px solid var(--rad-fondo,blue); 
        border-radius: 0 0 10px 10px;
        padding: 10px;
        background-color: white;
        overflow-x: auto;
        box-shadow: 0 3px 10px 0px rgba(0,0,0,.3);
      }
      :host .esmodal{
        max-height: 80vh;
      }
    </style>
    
    <div class="panel">
      <div class="rad-panel-encabezado">
        <div class="titulo">
          [[titulo]]
          <template is="dom-if" if="{{cancela}}">
              <span class="cancelar flota-derecha seleccionable" on-click="accCancela"></span>
          </template>

          <template is="dom-if" if="{{extras}}">
            <template is="dom-repeat" items="{{ extras }}" as="extra">
              <span class$="{{extra.icono}} flota-derecha seleccionable" title="{{extra.titulo}}" on-click="_accionExtra" data-accion$="{{extra.accion}}"></span>
            </template> 
          </template>

          <template is="dom-if" if="{{imprime}}">
            <span class="impresora seleccionable flota-derecha" on-click="imprimeContenido"></span>
          </template>

          <template is="dom-if" if="{{expande}}">
            <span class="expandir seleccionable flota-derecha" on-click="_expande" title="Fija a Pantalla completa del panel"></span>
          </template>
          
          <template is="dom-if" if="{{esconde}}">
            <span class="toggleContenido flecha-arriba seleccionable flota-derecha" on-click="toggleContenido"></span>
          </template>
        </div>
        <template is="dom-if" if="{{subtitulo}}">
          <div class="subtitulo">
            {{subtitulo}}
          </div>
        </template>
        
      </div>
      <div class="rad-panel-contenido">
          <slot></slot>
      </div>
    </div>
    `;
  }
  static get properties() {
    return {
      titulo: String,
      cancela:String,
      esconde:Boolean,
      imprime:Boolean,
      expande:Boolean,
      subtitulo:String,
      modal:{
        type:Boolean,
        value:false,
        observer:"_esmodal"
      },
      extras:Array,
    };
  };

  _expande(){
    var panel = this.shadowRoot.querySelector(".panel");
    $(panel).toggleClass("expande");
  }

  toggleContenido(){
    var toggle = this.shadowRoot.querySelector(".toggleContenido");
    var panelcontenido = this.shadowRoot.querySelector(".rad-panel-contenido");
    var panelencabezado = this.shadowRoot.querySelector(".rad-panel-encabezado");
    
    if($(toggle).hasClass("flecha-arriba")){
      $(toggle).removeClass("flecha-arriba");
      $(toggle).addClass("flecha-abajo");
      $(panelcontenido).slideUp(500);
      $(panelencabezado).css("border-radius","10px 10px 10px 10px");
    }else{
      $(toggle).removeClass("flecha-abajo");
      $(toggle).addClass("flecha-arriba");
      $(panelcontenido).slideDown(500);
      $(panelencabezado).css("border-radius","10px 10px 0px 0px");
    };
  };

  _esmodal(){
    var contenido = this.shadowRoot.querySelector(".rad-panel-contenido"); 
    if(this.modal){
      $(contenido).addClass("esmodal");
    }else{
      $(contenido).removeClass("esmodal");
    };
  };

  _accionExtra(e){
    var accion = e.target.getAttribute('data-accion');
    accion = accion;
    eval(accion);
  };

  accCancela(){
    eval(this.cancela);
  };

  imprimeContenido(){
    var panelcontenido = this.shadowRoot.querySelector(".rad-panel-contenido");
    impDiv(panelcontenido,this.titulo);
  };
}

window.customElements.define('rad-panel', RADPanel);