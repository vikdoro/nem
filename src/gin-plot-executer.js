import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import './gin-plot.js';
import './gin-icons.js';
import './gin-shared-styles.js';
import { GinLocalizeMixin } from './gin-localize-mixin.js';

class ginPlotExecuter extends GinLocalizeMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="iron-flex
                    iron-flex-alignment
                    gin-shared-styles">             
      :host {
        display: block;
      }
      .column-container {
        border: 1px dotted var(--gin-grey-100);
        border-radius: 8px;
        margin-bottom: 16px;
        transition: border-color 250ms;
      }

      .column-container:hover {
        border-color: var(--gin-grey-300);
      }

      .column-container iron-icon#title-icon {
        --iron-icon-fill-color: var(--gin-grey-200);
      }

      .column-container:hover iron-icon#title-icon {
        --iron-icon-fill-color: var(--gin-grey-300);
      }

      #column-header-strip {
        padding: 24px;
      }

      .plot-container {
        padding: 16px 32px 32px;
      }

      #close-icon {
        position: absolute;
        top: 8px;
        right: 8px;
        --iron-icon-width: 21px;
        --iron-icon-height: 21px;
      }

      input {
        font-weight: 700;
        color: var(--gin-grey-300);
        border: 1px solid transparent;
        transition: color 250ms, border-color 250ms;
      }
      
      #column-container:hover input {
        color: var(--gin-grey-400);
      }

      input.concealed-input:hover {
        border-color: var(--gin-grey-100);
      }

      input#percentage-input {
        width: 24px;
        margin-right: 4px;
        border-bottom: 1px solid var(--gin-grey-100);
      }

      input#percentage-input::-webkit-outer-spin-button,
      input#percentage-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
      }

      input#percentage-input:focus {
        border-color: var(--gin-grey-300);
      }

      #percentage-container {
        padding-left: 8px
      }

      button#add-condition-plot {
        display: block;
        margin: 16px auto 32px;
      }

      .dialog-content {
        margin: 0;
      }

      #column-header-strip>iron-icon:first-of-type {
        position: absolute;
        top: calc(50% - 12px);
        right: 65px;
      }

      #column-header-strip>iron-icon:last-of-type {
        position: absolute;
        top: calc(50% - 12px);
        right: 23px;
      }

      gin-plot {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      gin-plot:not(#default) {
        margin-bottom: 40px;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <template is="dom-repeat" items="{{columns}}" as="column" index-as="columnIndex">
      <template is="dom-if" if="[[!column.simple]]">
        <div class="column-container">
          <div id="column-header-strip" class="horizontal layout center l-relative" on-click="toggleSelected">
            <div class="flex horizontal layout center">
              <input class="concealed-input"
                    size\$="[[column.label.length]]"
                    value="{{column.label::change}}"
                    on-click="stopPropagation">
              <div class="flex">
                <iron-icon id="title-icon" icon\$="[[_computeTitleIcon(columnIndex, openedColumns.*)]]" class="hoverable"></iron-icon>
              </div>
            </div>
            <iron-icon class="more-icon hoverable" icon="gin-icons:add" on-click="addPlot" hidden\$="[[!_isSelected(columnIndex, openedColumns.*)]]"></iron-icon>
            <iron-icon id\$="side-menu-icon-[[columnIndex]]" class="edit-icon hoverable" icon="gin-icons:more-vert" on-click="openSideMenu" hidden\$="[[!_isSelected(columnIndex, openedColumns.*)]]"></iron-icon>
          </div>
          <div id\$="plot-container-[[columnIndex]]" class="plot-container" hidden\$="[[!_isSelected(columnIndex, openedColumns.*)]]">
            <template is="dom-repeat" id="plot-repeater" items="{{column.plots}}" as="plot" index-as="plotIndex">
              <div class="l-relative">
                <iron-icon id="close-icon" class="hoverable" icon="gin-icons:close" on-click="removePlot"></iron-icon>
                <gin-plot column-variables="{{columnVariables}}" conditions="{{plot.conditions}}" segments="{{plot.segments}}"></gin-plot>
              </div>
            </template>
            <gin-plot id="default"
                      column-variables="{{columnVariables}}"
                      segments="{{column.defaultSegments}}"
                      sibling-count="{{column.plots.length}}"
                      hidden$="[[summarizerMode]]"
                      no-conditions=></gin-plot>
          </div>
        </div>
      </template>
      <template is="dom-if" if="[[column.simple]]">
        <div class="column-container simple">
          <div id="column-header-strip" class="horizontal layout center l-relative">
            <div class="horizontal layout center">
              <input class="concealed-input"
                    size\$="[[column.label.length]]"
                    value="{{column.label::input}}"
                    on-click="stopPropagation">
            </div>
            <div id="percentage-container" class="flex horizontal layout center">
              <input id="percentage-input" type="number" min="0" max="100" on-change="setSimpleValue" value$="[[column.simpleValue]]">
              <div>%</div>
            </div>
            <iron-icon id\$="side-menu-icon-[[columnIndex]]" class="edit-icon hoverable" icon="gin-icons:more-vert" on-click="openSideMenu"></iron-icon>
          </div>
        </div>
      </template>
      <paper-dialog id\$="side-menu-[[columnIndex]]" vertical-align="top" horizontal-align="left" on-iron-overlay-closed="removeScrollListener">
        <div class="dialog-content no-padding">
          <div class="side-menu-container">
            <div class="horizontal layout" on-click="deleteColumn">
              <iron-icon icon="gin-icons:delete"></iron-icon>
              <div>[[localize('DELETEXX')]]</div>
            </div>
          </div>
        </div>
      </paper-dialog>
    </template>
`;
  }

  static get is() { return 'gin-plot-executer'; }
  static get properties() {
    return {
      columns: {
        type: Array,
        value: () => [],
        notify: true
      },
      selected: {
        type: Boolean,
        value: false
      },
      openedColumns: {
        type: Array,
        value: () => []
      },
      columnVariables: {
        type: Array,
        value: () => [],
        notify: true
      },
      editMode: {
        type: Boolean,
        value: false
      },
      totalRevenue: {
        type: Number
      },
      totalProcessCount: {
        type: Number,
        notify: true
      },
      totalFinishedProcessCount: {
        type: Number,
        notify: true
      },
      summarizerMode: {
        type: Boolean,
        value: false
      }
    }
  }
  constructor() {
    super();
    this.resizeSideMenu = this.resizeSideMenu.bind(this);
  }
  setSimpleValue(e) {
    console.log('yo', e.target.value);
    this.set(`columns.${e.model.columnIndex}.simpleValue`, parseInt(e.target.value));
  }
  passToWorker(rows, headers, incomeHeader) {
    console.log('worker');
    const columnIndex = 1;
  }
  runPlots(rows, headers, incomeHeader) {
    // this.passToWorker(rows, headers, incomeHeader);
    return new Promise((resolve, reject) => {
      var myWorker = new Worker('/src/worker.js');
      console.log('this.summarizerMode', this.summarizerMode);
      myWorker.postMessage(['run', this.columns, rows, incomeHeader, headers, this.summarizerMode]);
      var view = this;
      myWorker.onmessage = function (e) {
        const workerMessage = e.data[0];
        if (workerMessage === 'calculationComplete') {
          resolve(e.data);
        }
      }
    });
  }
  addFirstPlot(e) {
    const columnIndex = e.model.columnIndex;
    this.set(`columns.${columnIndex}.plots`, [{}]);
    this.notifyPath(`columns.${columnIndex}.plots.length`);
  }
  addPlot(e) {
    e.stopPropagation();
    const columnIndex = e.model.columnIndex;
    if (!this.columns[columnIndex].plots) {
      this.set(`columns.${columnIndex}.plots`, []);
    }
    // Workaround dom-repeat bug
    const newArray = this.get(`columns.${columnIndex}.plots`).slice(0);
    this.set(`columns.${columnIndex}.plots`, []);
    newArray.unshift({
      conditions: [{ "x": { "label": "", "type": "string", "val": "notSet", "tableValue": true }, "operator": { "label": "=" }, "yLabel": "something" }],
      segments: [
        {
          label: '0'
        }
      ]
    });
    requestAnimationFrame(() => this.set(`columns.${columnIndex}.plots`, newArray));
  }
  removePlot(e) {
    e.stopPropagation();
    // Summarizers should have at least one plot card
    if (this.summarizerMode && this.columns[columnIndex].plots.length < 2) {
      return;
    }
    const columnIndex = e.model.__dataHost.__dataHost.columnIndex;
    const plotIndex = e.model.plotIndex;
    // Woraround dom-repeat bug
    const cachePlots = this.get(`columns.${columnIndex}.plots`);
    this.set(`columns.${columnIndex}.plots`, []);
    requestAnimationFrame(() => {
      this.set(`columns.${columnIndex}.plots`, cachePlots.filter((plot, index) => index !== plotIndex));
    });
  }
  openSideMenu(e) {
    e.stopPropagation();
    this.shadowRoot.querySelector(`#side-menu-${e.model.columnIndex}`).set('positionTarget',
      this.shadowRoot.querySelector(`#side-menu-icon-${e.model.columnIndex}`));
    this.shadowRoot.querySelector(`#side-menu-${e.model.columnIndex}`).open();
    document.addEventListener('scroll', this.resizeSideMenu);
  }
  removeScrollListener() {
    document.removeEventListener('scroll', this.resizeSideMenu);
  }
  resizeSideMenu() {
    const allMenus = [...this.shadowRoot.querySelectorAll('paper-dialog')];
    for (var i = 0; i < allMenus.length; i++) {
      const menu = allMenus[i];
      if (menu.opened) {
        this.hideMenuIfOutOfBound(menu);
        menu.notifyResize();
      }
    }
  }
  hideMenuIfOutOfBound(element) {
    const rect = element.getBoundingClientRect();
    if (rect.top < 48 || (window.innerHeight - rect.bottom) < 48) {
      element.close();
    }
  }
  toggleSelected(e) {
    const indexInOpened = this.openedColumns.indexOf(e.model.columnIndex);
    const indexInAll = e.model.columnIndex;
    if (indexInOpened === -1) {
      this.push('openedColumns', indexInAll);
    } else {
      this.splice('openedColumns', indexInOpened);
    }
  }
  deleteColumn(e) {
    //Safe splice
    const cacheColumns = this.columns;
    this.set('columns', []);
    requestAnimationFrame(() => {
      this.set('columns', cacheColumns.filter((column, index) => index !== e.model.columnIndex));
    });
  }
  _computeTitleIcon(instanceIndex) {
    return this._isSelected(instanceIndex) ?
      'gin-icons:keyboard-arrow-down' : 'gin-icons:keyboard-arrow-right';
  }
  _isSelected(i) {
    return this.openedColumns.indexOf(i) !== -1;
  }
  _isItemLast(arrayLength, index) {
    return arrayLength - 1 === index;
  }
  _isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }
  stopPropagation(e) {
    e.stopPropagation();
  }
}
customElements.define(ginPlotExecuter.is, ginPlotExecuter);
