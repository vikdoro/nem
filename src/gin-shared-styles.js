import '@polymer/polymer/lib/elements/custom-style.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="gin-shared-styles">
    <template>
        <style>
            :host {
                --gin-grey-100: #9b9b9b;
                --gin-grey-200: #585D5B;
                --gin-grey-300: #424242;
                --gin-grey-400: #212121;
                --gin-grey-500: #080808;
                --gin-blue-200: #1565c0;
            }
            button {
                display: block;
                position: relative;
                padding: 17px 32px 17px;
                border-radius: 2px;
                cursor: pointer;
                box-sizing: border-box;
                border: 1px solid var(--gin-blue-200);
                font-family: 'Nunito', sans-serif;
                font-size: 16px;
                letter-spacing: .25px;
                background-color: var(--gin-blue-200);
                color: white;
                transition: background 0.3s;
            }
            button > *:not(iron-icon) {
                display: block;
                min-width: 120px;
                text-align: center;
            }
            button .label {
                display: inline-block;
                line-height: 24px;
                vertical-align: middle;
            }

            iron-icon {
                --iron-icon-fill-color: var(--gin-grey-200);
            }

            iron-icon.hoverable {
                --iron-icon-fill-color: var(--gin-grey-200);
                transition: fill 250ms;
                border-radius: 50%;
            }

            iron-icon.hoverable:hover {
                --iron-icon-fill-color: var(--gin-grey-400);
            }

            button:hover {
                background-color: #0388ca;
                /* change background image to match unhovered style */
            }

            button.simple {
                background: transparent;
                color: var(--gin-grey-200);
                border: 1px solid var(--gin-grey-100);
                padding: 15px 31px 15px;
                transition: border-color 250ms, color 250ms;
            }

            button.simple:hover{
                color: var(--gin-grey-400);
                border-color: var(--gin-grey-300);
            }

            button.simple>* {
                vertical-align: middle;
            }

            button.simple iron-icon {
                margin-right: 4px;
            }

            .add-button {
                width: 48px;
                height: 22px;
                position: absolute;
                color: #757575;
                border-radius: 12px;
                transition: color 250ms;
            }

            .add-button.right-aligned {
                top: calc(50% - 11px);
                right: -48px;
            }

            .add-button.bottom-aligned {
                position: static;
                /* left: calc(50% - 11px);
                    bottom: -32px; */
            }

            .add-button>*:first-child {
                margin-right: 4px;
            }

            .add-button:hover>*:first-child {
                /* border-right: 1px solid transparent; */
            }

            .add-button>*:hover {
                color: #212121;
                border: 1px solid var(--gin-grey-100);
                font-weight: 700;
                /* box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.24); */
            }

            .add-button>* {
                width: 18px;
                height: 18px;
                font-size: 14px;
                border-radius: 50%;
                border: 1px solid transparent;
                font-weight: 400;
                transition: border 250ms, font-weight 250ms;
                /* box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.24); */
            }

            .add-button.highlighted>* {
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.24);
            }

            h3 {
                margin: 0;
            }
            .l-pv-2 {
                padding-top: 16px;
                padding-bottom: 16px;
            }
            .l-pv-3 {
                padding-top: 24px;
                padding-bottom: 24px;
            }
            .l-pv-4 {
                padding-top: 32px;
                padding-bottom: 32px;
            }
            .l-ps-3 {
                padding-left: 24px;
                padding-right: 24px;
            }
            .l-ps-4 {
                padding-left: 32px;
                padding-right: 32px;
            }

            .l-p-3 {
                padding: 24px;
            }

            .l-pr-3 {
                padding-right: 24px;
            }

            .l-pb-2 {
                padding-bottom: 16px;
            }

            .l-pb-3 {
                padding-bottom: 24px;
            }

            .l-pl-3 {
                padding-left: 24px;
            }

            .l-m-auto {
                margin-left: auto;
                margin-right: auto;
            }

            .l-m-1 {
                margin: 8px 0;
            }

            .l-m-2 {
                margin: 16px 0;
            }

            .l-mr-1 {
                margin-right: 8px;
            }

            .l-mr-2 {
                margin-right: 16px;
            }

            .l-mr-3 {
                margin-right: 16px;
            }

            .l-mb-2 {
                margin-bottom: 16px;
            }

            .l-mb-3 {
                margin-bottom: 24px;
            }

            .l-mb-4 {
                margin-bottom: 32px;
            }

            .l-relative {
                position: relative;
            }

            .l-dialog-padding {
                padding: 40px;
            }

            input.concealed-input {
                border: 1px solid transparent;
            }

            input {
                font-family: 'Nunito', sans-serif;
                font-size: 16px;
                padding: 4px 0 4px 1px;
            }

            input:focus {
                outline: none;
            }

            .side-menu[horizontal-align="left"] {
                margin: 12px 0 0 32px;
            }

            .side-menu[horizontal-align="right"] {
                margin: 12px 32px 0 0px;
            }

            .side-menu-container {
                margin: 0;
            }

            .side-menu-container>* {
                padding: 4px 20px 4px 12px;
            }

            .side-menu-container>*:first-child {
                padding-top: 12px;
            }

            .side-menu-container>*:last-child {
                padding-bottom: 8px;
            }

            .side-menu-container>*:hover {
                background: #ddd;
            }

            .side-menu-container iron-icon {
                --iron-icon-width: 18px;
                --iron-icon-height: 18px;
                margin-right: 8px;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
