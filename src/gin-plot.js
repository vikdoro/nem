import { PolymerElement, html } from '@polymer/polymer';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import './gin-condition.js';
import './gin-dialog.js';
import './gin-shared-styles.js';
import { GinLocalizeMixin } from './gin-localize-mixin.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

class GinPlot extends GinLocalizeMixin(PolymerElement) {
  static get template() {
    return html`
    <style is="custom-style" include="iron-flex iron-flex-alignment gin-shared-styles">
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 32px;
      }

      .sub-header {
        padding: 16px;
        width: 40px;
        border-radius: 12px;
        font-size: 20px;
      }

      #condition-container {
        margin-bottom: 32px;
      }

      h5 {
        margin: 0;
        width: 100%;
      }

      .key {
        min-width: 30px;
        margin: 0 16px 0 0;
        padding: 4px 0 4px 1px;
        border-bottom: 1px solid var(--gin-grey-100);
        min-height: 24px;
        font-size: 16px;
      }

      .key:focus {
        outline: none;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <h5 hidden\$="[[noConditions]]">[[localize('IFXXXXXX')]]:</h5>
    <div id="condition-container" hidden\$="[[noConditions]]">
      <div class="vertical layout center-center">
        <template is="dom-repeat" items="{{conditions}}" as="condition">
          <div class="horizontal layout center l-relative">
            <gin-condition id\$="unit-[[index]]" x-options="[[xOptions]]" column-variables="{{columnVariables}}" x="{{condition.x}}" y="{{condition.y}}" operator="{{condition.operator}}"></gin-condition>
            <div class="horizontal layout center-center add-button right-aligned" hidden\$="[[!_isItemLast(conditions.length, index)]]">
              <div class="vertical layout center-center" on-click="addCondition">+</div>
              <div class="vertical layout center-center" on-click="removeCondition">-</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <h5>[[computeSplitLabel(noConditions, siblingCount)]]</h5>
    <div id="payee-container" class="horizontal layout center-justified center wrap l-relative">
      <template is="dom-repeat" items="[[segments]]" as="segment" index-as="segmentIndex">
        <div class="payee-field horizontal layout center-center">
          <div class="key" on-click="openOptions" data-label="segment">[[segment.label]]</div>
        </div>
      </template>
      <div class="horizontal layout center justified add-button right-aligned">
        <div class="vertical layout center-center" on-click="addSegment">+</div>
        <div class="vertical layout center-center" on-click="removeSegment">-</div>
      </div>
    </div>
    <gin-dialog id="dialog" on-new-val-request="onValChanged" on-new-option-request="_onNewOptionRequest" with-text-input=""></gin-dialog>
`;
  }

  static get is() { return 'gin-plot'; }
  static get properties() {
    return {
      conditions: {
        type: Array,
        value: () => [],
        notify: true
      },
      editedSegmentIndex: {
        type: Number
      },
      noConditions: {
        type: Boolean,
        value: false
      },
      segments: {
        type: Array,
        value: () => [],
        notify: true
      },
      segmentOptions: {
        type: Array,
        computed: '_computeSegmentOptions(columnVariables.*)'
      },
      segmentOperators: {
        type: Array,
        value: () => [
          {
            label: '+'
          }, {
            label: '-'
          }, {
            label: '*'
          }, {
            label: '/'
          }
        ]
      },
      xOptions: {
        type: Array,
        computed: '_computeXOptions(columnVariables.*)'
      },
      columnVariables: {
        type: Array,
        value: () => [],
        notify: true
      },
      simpleValueOptions: {
        type: Array,
        value: () => [
          {
            label: 'and'
          }, {
            label: 'or'
          }, {
            label: '('
          }, {
            label: ')'
          }
        ]
      },
      siblingCount: {
        type: Number,
        value: 0
      }
    }
  }
  static get observers() {
    return [
      'onConditionsChanged(conditions.*)'
    ];
  }
  constructor() {
    super();
    afterNextRender(this, () => {
      this.isAttached = true;
    });
  }
  run(row) {
    const conditions = [...this.$['condition-container'].querySelectorAll('gin-condition')];
    for (const [index, condition] of conditions.entries()) {
      if (condition.withTableValue) {
        // Iterate through field keys in a row, and set the condition x value
        Object.keys(row).forEach(fieldKey => {
          if (fieldKey === condition.x.label) {
            condition.set('x.val', row[fieldKey]);
          }
        });
        condition.flag = condition.run();
      }
    };
    return this.doRunPlot();
  }
  computeReturn(row) {
    let plotString = 'return ';
    let segments = this.segments;
    for (let i = 0; i < segments.length; i += 1) {
      plotString += segments[i].tableValue ?
        row[segments[i].label] : segments[i].label;
      plotString += ' ';
    }
    const runComputeReturn = new Function(plotString);
    return runComputeReturn();
  }
  doRunPlot() {
    const conditions = [...this.$['condition-container'].querySelectorAll('gin-condition')];
    let plotString = 'return ';
    for (let i = 0; i < conditions.length; i += 1) {
      plotString += conditions[i].withTableValue ?
        conditions[i].flag : this.mapSimpleValue(conditions[i].simpleValue);
      plotString += ' ';
    }
    const runFunction = new Function(plotString);
    return runFunction();
  }
  mapSimpleValue(label) {
    const map = {
      'and': '&&',
      'or': '||'
    };
    return map[label] || label;
  }
  addCondition() {
    if (this.isEmptyObject(this.conditions[this.conditions.length - 1])) {
      return;
    }
    // Workaround dom-repeat bug
    const newArray = this.conditions.slice(0);
    this.set('conditions', []);
    newArray.push({});
    requestAnimationFrame(() => this.set('conditions', newArray));
  }
  removeCondition() {
    if (this.conditions.length > 1) {
      //TODO: convert to safe splice
      this.splice('conditions', this.conditions.length - 1);
    }
  }
  isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  onValChanged(e) {
    this.set(`segments.${this.editedSegmentIndex}`, e.detail);
    this.notifyPath(`segments.${this.editedSegmentIndex}`);
  }
  onConditionsChanged() {
    if (!this.isAttached) {
      return;
    }
    this._debounceJob = Debouncer.debounce(this._debounceJob, timeOut.after(200), () => {
      this.dispatchEvent(
        new CustomEvent('firebase-request', {
          bubbles: true,
          composed: true,
          detail: 'mome'
        })
      );
    }, 300);
  }
  openOptions(e) {
    this.editedSegmentIndex = e.model.segmentIndex;
    this.$.dialog.openOptions(e.target, this.segmentOptions);
  }
  computeSplitLabel(noConditions) {
    let label;
    if (!this.siblingCount && noConditions) {
      label = this.localize('VALUEXXX') + ':';
    } else if (this.siblingCount > 0 && noConditions) {
      label = this.localize('DEFAULTX') + ':';
    } else {
      label = this.localize('THENXXXX') + ':';
    }
    return label;
  }
  addSegment() {
    if (this.segments.length !== 0 && this.isEmptyObject(this.segments[this.segments.length - 1])) {
      return;
    }
    // Workaround dom-repeat bug
    const newArray = this.segments.slice(0);
    this.set('segments', []);
    newArray.push({});
    requestAnimationFrame(() => this.set('segments', newArray));
  }
  removeSegment() {
    if (this.segments.length > 1) {
      //TODO: convert to safe splice
      this.splice('segments', this.segments.length - 1);
    }
  }
  _isItemLast(arrayLength, index) {
    return arrayLength - 1 === index;
  }
  _computeXOptions() {
    return this.columnVariables.concat(this.simpleValueOptions);
  }
  _computeSegmentOptions() {
    return this.columnVariables.concat(this.segmentOperators);
  }
  _onNewOptionRequest(e) {
    this.unshift('columnVariables', e.detail);
    this.set(`segments.${this.editedSegmentIndex}`, e.detail);
    this.notifyPath(`segments.${this.editedSegmentIndex}`);
  }
}
customElements.define(GinPlot.is, GinPlot);
