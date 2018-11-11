import '@polymer/polymer/lib/utils/boot.js';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

let LocalizeMixinInternal = (superClass) => {
    return class extends superClass {
        constructor() {
            super();
        }
        static get properties() {
            return {
                language: {
                    type: String,
                    value: () => {
                        let language = window.navigator.userLanguage || window.navigator.language
                        return language === 'hu' ? 'hu' : 'hu';
                    },
                },
                keyMap: {
                    type: Object,
                    value: () => {
                        return {
                            'en': {
                                "UPLOACSV": "Upload csv",
                                "DWLOACSV": "Download csv",
                                "SEARCHXX": "Search",
                                "ACTIONSX": "Authors",
                                "SETTINGS": "Settings",
                                "NAMEXXXX": "Name",
                                "Computed values": "Computed values",
                                "Summarizing values": "Summarizing values",
                                "ACTIONXX": "Action",
                                "DELETGIN": "Delete gin",
                                "DELETEXX": "Delete",
                                "IFXXXXXX": "If",
                                "THENXXXX": "Then",
                                "DEFAULTX": "Default",
                                "VALUEXXX": "Value",
                                "SUBMITXX": "Submit",
                                "NEWTITLE": "New title",
                                "STRINGXX": "String",
                                "NUMBERXX": "Number",
                                "DATEXXXX": "Date",
                                "ADDXXXXX": "Add",
                                "DISCARDX": "Discard",
                                "LOGINXXX": "Login",
                                "SIGNOUTX": "Sign out",
                                "NUSERYET": "Not a user yet?",
                                "SIGNUPXX": "Sign up",
                                "ALRYUSER": "Already a user?",
                            },
                            'hu': {
                                "UPLOACSV": "CSV feltöltése",
                                "DWLOACSV": "CSV letöltése",
                                "SEARCHXX": "Keresés",
                                "ACTIONSX": "Műveletek",
                                "SETTINGS": "Beállítas",
                                "NAMEXXXX": "Cím",
                                "Computed values": "Kiszámolt értékek",
                                "Summarizing values": "Összesített értékek",
                                "Action": "Művelet",
                                "DELETGIN": "Gin törlése",
                                "DELETEXX": "Törlés",
                                "IFXXXXXX": "Ha",
                                "THENXXXX": "Akkor",
                                "DEFAULTX": "Alapesetben",
                                "VALUEXXX": "Érték",
                                "SUBMITXX": "Elküldés",
                                "NEWTITLE": "Új cím",
                                "STRINGXX": "Szöveg",
                                "NUMBERXX": "Szám",
                                "DATEXXXX": "Dátum",
                                "ADDXXXXX": "OK",
                                "DISCARDX": "Mégsem",
                                "LOGINXXX": "Bejelentkezés",
                                "SIGNOUTX": "Kijelentkezés",
                                "NUSERYET": "Nincs meg fiokja?",
                                "SIGNUPXX": "Regisztracio",
                                "ALRYUSER": "Mar van fiokja?",
                            }
                        }
                    }
                }
            }
        }
        connectedCallback() {
            super.connectedCallback();
        }
        localize(code) {
            return this.keyMap[this.language][code];
        }
    }
};
export const GinLocalizeMixin = dedupingMixin(LocalizeMixinInternal);
