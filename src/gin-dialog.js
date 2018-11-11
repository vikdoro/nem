import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import './gin-icons.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { GinLocalizeMixin } from './gin-localize-mixin.js';

class GinDialog extends mixinBehaviors([IronResizableBehavior], GinLocalizeMixin(PolymerElement)) {
    static get template() {
        return html`
        <style is="custom-style" include="iron-flex
                    iron-flex-alignment">
            :host {
                display: block;
            }

            input#text-input {
                box-sizing: border-box;
                padding: 1px 0 1px 4px;
                border: none;
            }

            input#text-input:focus {
                outline: none;
            }

            .dropdown-item {
                box-sizing: border-box;
                width: 100%;
                padding-left: 4px;
            }

            .dropdown-item:hover {
                background: #eee;
            }

            #dialog {
                position: absolute;
                margin: 0;
                min-width: 100%;
                padding-right: 8px;
            }

            #dialog-content {
                margin: 0;
            }

            .new-container>* {
                padding: 8px 16px;
            }

            .new-container .iron-selected {
                font-weight: bold;
            }

            #dialog-outer-container {
                position: fixed;
                z-index: 999999;
                top: 100px;
                left: 400px;
            }

            #close-icon {
                --iron-icon-height: 14px;
                --iron-icon-width: 14px;
                fill: #999;
                transition: 250ms fill;
                height: 100%;
                padding: 0 2px 0 4px;
            }

            #close-icon:hover {
                fill: black;
            }

            .new-container>* {
                position: relative;
                margin: 4px 0;
            }

            [hidden] {
                display: none !important;
            }
        </style>

        <div id="dialog-outer-container">
            <div id="dialog-container">
                <paper-dialog id="dialog" no-cancel-on-outside-click="" with-backdrop="">
                    <div id="dialog-content" class="no-padding">
                        <input id="text-input" disabled\$="[[newMode]]" on-keyup="onKeyup" style\$="min-height: [[fieldHeight]]px" type="text" size\$="[[computeInputSize(searchString)]]" hidden\$="[[!withTextInput]]" value="{{searchString::input}}">
                        <div class="flex vertical layout center" hidden\$="[[newMode]]">
                            <template is="dom-repeat" items="[[options]]" filter="[[_computeFilter(searchString)]]">
                                <div class="dropdown-item horizontal layout center" style\$="min-height: [[fieldHeight]]px" on-click="changeValue">
                                    <div class="flex">[[item.label]]</div>
                                </div>
                            </template>
                        </div>
                        <div class="new-container" hidden\$="[[!newMode]]">
                            <iron-selector attr-for-selected="name" selected="{{newEntry.type}}">
                                <div name="string">[[localize('STRINGXX')]]</div>
                                <div name="number">[[localize('NUMBERXX')]]</div>
                                <div name="date">[[localize('DATEXXXX')]]</div>
                            </iron-selector>
                            <button on-click="addNewVariable">[[localize('ADDXXXXX')]]</button>
                            <button on-click="quitNewMode">[[localize('DISCARDX')]]</button>
                        </div>
                    </div>
                </paper-dialog>
            </div>
        </div>
`;
    }

    static get is() { return 'gin-dialog'; }

    static get properties() {
        return {
            bar: {
                type: String,
                value: 'bar'
            },
            options: {
                type: Array,
                value: () => [{
                    label: 'one'
                }, {
                    label: 'two'
                }, {
                    label: 'three'
                }]
            },
            withTextInput: {
                type: Boolean,
                value: false
            },
            editedProperty: {
                type: String
            },
            val: {
                type: String,
                notify: true
            },
            newMode: {
                type: Boolean,
                value: false
            },
            newEntry: {
                type: Object,
                value: () => {
                    return {
                        type: 'string'
                    };
                }
            },
            searchString: {
                type: String,
                value: null
            }
        }
    }
    constructor() {
        super();
    }
    ready() {
        super.ready();
        this._positionDialog = this._positionDialog.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.onOverlayClick = this.onOverlayClick.bind(this);
        this.addEventListener('iron-resize', this._positionDialog);
        document.addEventListener('scroll', this._positionDialog);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('iron-resize', this._positionDialog);
        this.removeEventListener('iron-resize', this.$.dialog.notifyResize);
        document.removeEventListener('scroll', this._positionDialog);
    }
    dispatchValue(val) {
        this.dispatchEvent(
            new CustomEvent('new-val-request', {
                bubbles: true,
                composed: true,
                detail: val
            })
        );
    }
    changeValue(e) {
        if (e.model && e.model.item) {
            this.set('val', e.model.item);
            this.dispatchValue(e.model.item);
        }
    }
    isLabelNew(val) {
        return this.options.map(optionItem => optionItem.label).indexOf(val) === -1;
    }
    addNewVariable() {
        this.dispatchEvent(
            new CustomEvent('new-option-request', {
                bubbles: true,
                composed: true,
                detail: this.newEntry
            })
        );
        this.quitNewMode();
    }
    quitNewMode() {
        this.set('newEntry', {});
        this.newMode = false;
        this.closeDialog();
    }
    _positionDialog(e) {
        if (!this.target) {
            return;
        }

        // Avoid infinite loop
        if (e && e.composedPath()[0].tagName === 'PAPER-DIALOG') {
            return;
        }
        // this._debounceJob = Polymer.Debouncer.debounce(this._debounceJob, Polymer.Async.timeOut.after(200), () => {
        const targetRect = this.target.getBoundingClientRect();
        this.fieldHeight = targetRect.height;
        Object.assign(this.$['dialog-outer-container'].style, {
            top: targetRect.top + 1 + 'px',
            left: targetRect.left + 'px',
            minWidth: targetRect.width + 'px'
        });
        this.$.dialog.notifyResize();
        // }, 300);
    }
    _computeFilter(searchString) {
        if (!searchString) {
            // set filter to null to disable filtering
            return null;
        } else {
            // return a filter function for the current search string
            searchString = searchString.toLowerCase();
            return function (item) {
                const regex = new RegExp(`\${searchString}`, 'i');
                return regex.test(item.title);
            };
        }
    }
    openOptions(target, options) {
        this.target = target;
        this.options = options;
        // FIX ME: Not IE compatible
        this.host = target.getRootNode();

        // Shallow copy array
        this.options = options.slice(0);
        // if (!this.withTextInput) {
        //     targetRect.top += targetRect.height;
        // }
        this._positionDialog();
        this.$.dialog.open();
        afterNextRender(this, () => {
            document.body.addEventListener('click', this.onOverlayClick);
            this.$['text-input'].focus();
        });
    }
    onKeyup(e) {
        // Hitting enter
        if (e.keyCode === 13) {
            this.processAndSignalNewVariable();
        }
    }
    processAndSignalNewVariable() {
        const inputValue = this.$['text-input'].value;
        // If it's a number, just set the value and quit
        if (this._isNumber(inputValue)) {
            this.set('val', { label: inputValue });
            this.dispatchValue({ label: inputValue });
            this.closeDialog();
            return;
        }
        if (inputValue && this.isLabelNew(inputValue)) {
            // Workaround for dom-repeat bug
            const newArray = this.options.slice(0);
            this.set('newEntry.label', this.$['text-input'].value);
            this.set('newEntry.tableValue', true);
            this.set('options', []);
            newArray.push(this.newEntry);
            requestAnimationFrame(() => {
                this.set('options', newArray);
                this.newMode = true;
            });
            return true;
        }
        if (inputValue && this.options.map(option => option.label).indexOf(inputValue) !== -1) {
            this.set('val', { label: inputValue });
            this.dispatchValue({ label: inputValue });
            this.closeDialog();
        }
    }
    closeDialog() {
        this.$['text-input'].value = '';
        document.body.removeEventListener('click', this.onOverlayClick);
        this.searchString = null;
        this.$.dialog.close();
    }
    onOverlayClick(e) {
        if ((!this.newMode && !this.processAndSignalNewVariable() &&
            !e.composedPath()[0].hasAttribute('data-label')) ||
            (!e.composedPath()[0].getRootNode().isEqualNode(this.shadowRoot) &&
                !e.composedPath()[0].getRootNode().isEqualNode(this.host))) {
            this.closeDialog();
        }
    }
    computeInputSize(searchString) {
        return searchString === null ? '1' : searchString.length;
    }
    _isNumber(n) {
        return !isNaN(parseFloat(n)) && !isNaN(n - 0);
    }
}
customElements.define(GinDialog.is, GinDialog);
