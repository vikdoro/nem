import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './gin-dialog.js';
import './gin-shared-styles.js';
import { GinLocalizeMixin } from './gin-localize-mixin.js';

class GinCondition extends GinLocalizeMixin(PolymerElement) {
  static get template() {
    return html`
    <style is="custom-style" include="iron-flex iron-flex-alignment gin-shared-styles">
      :host {
        display: block;
      }

      .key {
        width: 104px;
        height: 24px;
        font-size: 16px;
        padding: 4px 0 4px 1px;
        margin: 8px 16px;
        border-top: none;
        border-right: none;
        border-bottom: 1px solid var(--gin-grey-100);
        border-left: none;
      }

      .key.operator-key {
        width: 40px;
        text-align: center;
        font-size: 20px;
        border-bottom: 1px solid transparent;
        transform: translateZ(0);
        transition: 250ms border-color;
      }

      .key.operator-key:hover {
        border-color: var(--gin-grey-100);
      }

      .key:focus {
        outline: none;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <div class="horizontal layout center-center">
      <div class="key" data-label="x" on-click="openOptions">[[x.label]]</div>
      <div class="key operator-key" data-label="operator" on-click="openOptions" hidden\$="[[!withTableValue]]">[[operator.label]]</div>
      <input type$="[[x.type]]" class="key" value="{{y.val::change}}" on-change="blurInput" hidden\$="[[!withTableValue]]">
    </div>
    <gin-dialog id="dialog" on-val-changed="onValChanged" on-new-option-request="_onNewOptionRequest" with-text-input=""></gin-dialog>
`;
  }

  static get is() { return 'gin-condition'; }
  static get properties() {
    return {
      editedProperty: {
        type: String
      },
      flag: {
        type: Boolean,
        value: false
      },
      withTableValue: {
        type: Boolean,
        value: false
      },
      x: {
        type: Object,
        value: () => {
          return {
            label: ''
          }
        },
        notify: true
      },
      xOptions: {
        type: Array,
        value: () => []
      },
      y: {
        type: Object,
        notify: true
      },
      operatorOptionLibrary: {
        type: Object,
        value: () => {
          return {
            string: [{
              label: '='
            }, {
              label: '≠'
            }],
            number: [{
              label: '<'
            }, {
              label: '>'
            }, {
              label: '='
            }, {
              label: '≠'
            }],
            date: [{
              label: 'on'
            }, {
              label: 'before'
            }, {
              label: 'after'
            }]
          };
        }
      },
      operatorOptions: {
        type: Array,
        computed: 'computeOperatorOptions(x, withTableValue)'
      },
      operator: {
        type: Object,
        value: () => {
          return {
            label: 'is'
          };
        },
        notify: true
      },
      columnVariables: {
        type: Array,
        value: () => [],
        notify: true
      }
    }
  }
  static get observers() {
    return [
      'onXChanged(x.*)'
    ];
  }
  blurInput(e) {
    e.target.blur();
  }
  onValChanged(e) {
    this.set(`${this.editedProperty}`, e.detail.value);
    if (this.editedProperty === 'x') {
      this.set('y', { label: '' });
    }
  }
  onXChanged() {
    if (!this.x) {
      return;
    }
    this.withTableValue = this.x.tableValue || false;
    if (this.withTableValue) {
      // On changing x, set the operator to the first possible value
      this.set('operator', this.operatorOptionLibrary[this.x.type][0]);
    }
  }
  run() {
    if (typeof this.operator.label === 'undefined',
      typeof this.x.val === 'undefined',
      typeof this.y.val === 'undefined') {
      return;
    }
    const x = this.x.val;
    const y = this.y.val;
    switch (this.operator.label) {
      case '=':
        return x === y;
        break;
      case '≠':
        return x !== y;
        break;
      case '<':
        return x < y;
        break;
      case '>':
        return x > y;
        break;
      default:
        return false;
    }
  }
  computeOperatorOptions(x) {
    if (!this.withTableValue) {
      return;
    }
    return this.operatorOptionLibrary[x.type];
  }
  openOptions(e) {
    this.editedProperty = e.target.getAttribute('data-label');
    const options = this[`${this.editedProperty}Options`];
    this.$.dialog.openOptions(e.target, options);
  }
  _onNewOptionRequest(e) {
    this.unshift('columnVariables', e.detail);
    this.set('x', e.detail);
    this.set('operator', this.operatorOptionLibrary[this.x.type][0]);
    this.set('y', { label: '' });
  }
}
customElements.define(GinCondition.is, GinCondition);
