import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './gin-shared-styles.js';
import { GinLocalizeMixin } from './gin-localize-mixin.js';

class GinAuth extends GinLocalizeMixin(PolymerElement) {
    static get template() {
        return html`
        <style is="custom-style" include="iron-flex iron-flex-alignment gin-shared-styles">
            :host {
                display: block;
            }
            :host #error-message {
                display: none;
            }
            :host([error]) #error-message {
                display: block;
                color: #d32f2f;
                padding: 6px 0;
            }
            :host button {
                margin-top: 24px;
            }
            :host([error]) button {
                margin-top: 0;
            }
            input.auth-input {
                padding: 7px 0 7px 4px;
                border: 1px solid var(--gin-grey-100);
            }
            #dialog-container {
                margin: 0;
            }   
            #close-icon {
                position: absolute;
                top: 16px;
                right: 16px;
                --iron-icon-width: 21px;
                --iron-icon-height: 21px;
            }
        </style>

        <paper-dialog id="dialog" on-iron-overlay-closed="emptyForm" with-backdrop>
            <div id="dialog-container" class="l-dialog-padding l-relative">
                <iron-icon id="close-icon" class="hoverable" icon="gin-icons:close" on-click="exitDialog"></iron-icon>
                <iron-pages id="pager" attr-for-selected="data-route" selected="[[section]]">
                    <div data-route="signup" class="vertical layout">
                        <h3 class="l-mb-3">[[localize('SIGNUPXX')]]</h3>
                        <input id="signup-email" class="l-mb-2 auth-input" type="email" size="30">
                        <input id="signup-password" class="l-mb-4 auth-input" type="password" size="30">
                        <div class="horizontal layout">
                            <div>[[localize('ALRYUSER')]]</div>&nbsp;
                            <a href="javascript:;" class="link" on-click="toggleView">[[localize('LOGINXXX')]]</a>
                        </div>
                        <br>
                        <button on-click="submitSignup">[[localize('SUBMITXX')]]</button>
                    </div>
                    <div data-route="login" class="vertical layout">
                        <h3 class="l-mb-3">[[localize('LOGINXXX')]]</h3>
                        <input id="login-email" on-focus="clearError" class="l-mb-2 auth-input" type="email" size="30">
                        <input id="login-password" on-focus="clearError" class="auth-input" type="password" size="30">
                        <div id="error-message">Nem sikerült. Próbáld újra!</div>
                        <button on-click="submitLogin">[[localize('SUBMITXX')]]</button>
                    </div>
                </iron-pages>
            </div>
        </paper-dialog>
`;
    }

    static get unused() {
        return html`
        #dialog {
            border-radius: 2px;
        }
        <div class="horizontal layout">
        <div>[[localize('NUSERYET')]]</div>&nbsp;
        <a href="javascript:;" class="link" on-click="toggleView">[[localize('SIGNUPXX')]]</a>
        </div>
    `};

    static get is() { return 'gin-auth'; }
    static get properties() {
        return {
            section: {
                type: String,
                value: 'login'
            },
            error: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        }
    }
    constructor() {
        super();
    }
    open() {
        this.$.dialog.open();
    }
    close() {
        this.$.dialog.close();
    }
    exitDialog() {
        this.shadowRoot.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        this.$.dialog.close();
    }
    submitSignup() {
        const emailElement = this.$['signup-email'];
        const passwordElement = this.$['signup-password'];
        this.dispatchEvent(
            new CustomEvent('firebase-request', {
                bubbles: true,
                composed: true,
                detail: {
                    type: 'signup',
                    email: emailElement.value,
                    password: passwordElement.value
                }
            })
        );
        this.clearError();
    }
    displayError() {
        this.error = true;
    }
    clearError() {
        this.error = false;
    }
    toggleView() {
        this.section = this.section === 'signup' ? 'login' : 'signup';
    }
    submitLogin() {
        const emailElement = this.$['login-email'];
        const passwordElement = this.$['login-password'];
        this.dispatchEvent(
            new CustomEvent('firebase-request', {
                bubbles: true,
                composed: true,
                detail: {
                    type: 'login',
                    email: emailElement.value,
                    password: passwordElement.value
                }
            })
        );
        this.clearError();
    }
    emptyForm() {
        [...this.shadowRoot.querySelectorAll('input')].forEach(el => el.value = null);
        this.section = 'login';
        this.clearError();
    }
}
customElements.define(GinAuth.is, GinAuth);
