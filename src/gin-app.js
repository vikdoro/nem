import { PolymerElement, html } from '@polymer/polymer';
import { GinLocalizeMixin } from './gin-localize-mixin.js';
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './gin-rule-list.js';
import './gin-icons.js';
import './gin-shared-styles.js';
import './gin-auth.js';

class GinApp extends GinLocalizeMixin(PolymerElement) {
    static get template() {
        return html`
        <style is="custom-style" include="iron-flex iron-flex-alignment gin-shared-styles">
            :host {
                display: block;
                font-family: Nunito;
            }
            nav {
                opacity: 1;
                padding: 16px 24px;
                box-shadow: 0 0px 4px rgba(0, 0, 0, 0.16);
            }
            nav>.action-menu {
                margin-left: 32px;
                font-size: 14px;
            }
            nav>.action-menu>#nav-btn {
                padding: 8px 16px;
                border-radius: 3px;
                cursor: pointer;
                transition: background 0.3s;
            }
            nav>.action-menu>#nav-btn:hover {
                outline: 0;
            }
            nav>.brand {
                font-size: 28px;
                letter-spacing: 3.8px;
                color: #212121;
                border-radius: 5px;
            }
            #nav-btn {
                color: var(--gin-grey-200);
                transition: color 250ms;
            }
            #nav-btn:hover {
                color: var(--gin-grey-500);
            }
            #error-box {
                position: fixed;
                bottom: 16px;
                right: 16px;
            }
            #error-dialog {
                position: absolute;
                bottom: 0;
                right: 0;
            }
            #dialog-content {
                font-size: 16px;
                color: var(--gin-grey-400);
                min-width: 392px;
                text-align: center;
                box-sizing: border-box;
                padding: 32px;
                margin: 0;
            }
            iron-icon {
                --iron-icon-fill-color: #212121;
            }
            [hidden] {
                display: none !important;
            }
                    /* nunito-regular - latin */
        @font-face {
            font-family: 'Nunito', sans-serif;
            font-style: normal;
            font-weight: 400;
            src: url('assets/fonts/nunito-v9-latin-regular.eot'); /* IE9 Compat Modes */
            src: local('Nunito Regular'), local('Nunito-Regular'),
                url('../assets/fonts/nunito-v9-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
                url('assets/fonts/nunito-v9-latin-regular.woff') format('woff'), /* Modern Browsers */
                url('assets/fonts/nunito-v9-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
        }
        /* nunito-700 - latin */
        @font-face {
            font-family: 'Nunito', sans-serif;
            font-style: normal;
            font-weight: 700;
            src: url('assets/fonts/nunito-v9-latin-700.eot'); /* IE9 Compat Modes */
            src: local('Nunito Bold'), local('Nunito-Bold'),
                url('assets/fonts/nunito-v9-latin-700.woff2') format('woff2'), /* Super Modern Browsers */
                url('assets/fonts/nunito-v9-latin-700.woff') format('woff'), /* Modern Browsers */
                url('assets/fonts/nunito-v9-latin-700.ttf') format('truetype'), /* Safari, Android, iOS */
        }
        </style>

        <nav class="horizontal layout">
            <div class="brand">GIN</div>
            <div class="action-menu horizontal layout center end-justified flex">
                <div id="nav-btn" on-click="openAuth" hidden\$="[[user]]">
                    <div>[[localize('LOGINXXX')]]</div>
                </div>
                <div hidden\$="[[!user]]">[[user.email]]</div>
                <div id="nav-btn" on-click="signOut" hidden\$="[[!user]]">
                    <div>[[localize('SIGNOUTX')]]</div>
                </div>
            </div>
        </nav>

        <iron-pages id="pager" attr-for-selected="data-route" selected="[[section]]">
            <gin-rule-list rules="{{rules}}" data-route="units"></gin-rule-list>
        </iron-pages>
        <div id="error-box" class="l-relative">
            <paper-dialog id="error-dialog">
                <div id="dialog-content" class="no-padding">[[errorMessage]]</div>
            </paper-dialog>
        </div>
        <gin-auth id="auth"></gin-auth>
    `;
    }

    static get is() { return 'gin-app'; }
    static get properties() {
        return {
            section: {
                type: String,
                value: 'units'
            },
            isAttached: {
                type: Boolean,
                notify: true
            },
            user: {
                type: Object,
                value: null,
                observer: 'onUserChanged'
            },
            rules: {
                type: Array,
                value: () => []
            },
            errorMessage: {
                type: String
            }
        }
    }
    static get observers() {
        return [
            'onRulesChanged(rules.*, rules)'
        ];
    }
    constructor() {
        super();
        this.onFireBaseCall = this.onFireBaseCall.bind(this);
        this.addEventListener('firebase-request', this.onFireBaseCall);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('keydown', e => {
            console.log('k'.e);
        });
        this.addEventListener('gin-error', e => {
            this.errorMessage = e.detail.message;
            this.shadowRoot.querySelector('#error-dialog').open();
        });
        this.isAttached = true;
    }
    isAppLoading(rules) {
        return !Array.isArray(rules) || rules.length === 0;
    }
    onRulesChanged(e) {
        console.log('Save', e.path);
        if (/authors|title|incomeHeader/.test(e.path)) {
            console.log('Firebase EDIT', e.path);
            e.path.replace(/(rules.)(\d+)/, (match, firstGroup, secondGroup) => {
                const ruleIndex = secondGroup;
                console.log('ruleIndex', ruleIndex);
                // different logic for splice, push etc.
                this.dispatchEvent(
                    new CustomEvent('firebase-request', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            type: 'edit-gin',
                            docId: this.rules[ruleIndex].id,
                            newState: this.rules[ruleIndex]
                        }
                    })
                );
            });
        }
    }
    signOut() {
        this.dispatchEvent(
            new CustomEvent('firebase-request', {
                bubbles: true,
                composed: true,
                detail: {
                    type: 'signout'
                }
            })
        );
    }
    selectSection(e) {
        this.section = e.composedPath()[0].getAttribute('data-section');
    }
    openAuth(e) {
        e.stopPropagation();
        this.shadowRoot.querySelector('gin-auth').open();
    }
    closeAuth() {
        this.shadowRoot.querySelector('gin-auth').close();
    }
    displayAuthError() {
        this.shadowRoot.querySelector('gin-auth').displayError();
    }
    onFireBaseCall(e) {
        console.log('firebase called', e);
    }
    onUserChanged(user) {
        console.log('user', user);
    }
}
customElements.define(GinApp.is, GinApp);
