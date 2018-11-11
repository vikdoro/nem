import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import './gin-plot-executer.js';
import './gin-dialog.js';
import './gin-icons.js';
import './gin-shared-styles.js';
import { GinLocalizeMixin } from './gin-localize-mixin.js';

class GinRuleEditor extends GinLocalizeMixin(PolymerElement) {
  static get template() {
    return html`
    <style is="custom-style" include="iron-flex iron-flex-alignment iron-flex-reverse gin-shared-styles">
      :host {
        display: block;
      }

      :host([no-author-error]) #no-author-error {
        display: block;
      }

      :host #no-author-error {
        display: none;
        color: #d32f2f;
        text-align: center;
      }

      #editor-container {
        border: 1px dashed var(--gin-grey-100);
        color: var(--gin-grey-300);
        transition: border-color 250ms, color 250ms;
      }

      #editor-container:hover {
        color: var(--gin-grey-500);
        border-color: var(--gin-grey-300);
      }

      #editor-container:hover iron-icon#dropdown-icon {
        --iron-icon-fill-color: var(--gin-grey-300);
      }

      nav {
        width: 100%;
        box-sizing: border-box;
        background: #f1f6f4;
        padding: 8px 24px 8px;
        margin: 0 auto 32px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      nav>*:first-child {
        color: var(--gin-grey-200);
        cursor: pointer;
        padding: 8px 0;
        border-radius: 3px;
        transition: background 0.3s;
      }

      nav>iron-icon:first-of-type {
        position: absolute;
        top: calc(50% - 12px);
        right: 66px;
      }

      nav>iron-icon:last-of-type {
        position: absolute;
        top: calc(50% - 12px);
        right: 24px;
      }

      nav>.selected {
        color: #2e2e2e;
        position: relative;
        padding: 8px 24px;
        border-radius: 3px;
      }

      nav>.selected:after {
        display: block;
        position: absolute;
        bottom: 1px;
        left: 0;
        content: '';
        width: 100%;
        height: 2px;
        background: #333;
        color: #2e2e2e;
        opacity: 0.7;
        border-radius: 3px;
      }

      #gin-side-menu-icon {
        position: absolute;
        top: calc(50% - 12px);
        right: 0;
      }

      #title-bar>*:first-child {
        margin-right: 24px;
      }

      #title-bar {
        padding: 32px;
      }

      :host([selected]) #title-bar {
        padding-bottom: 0;
      }

      #editor-body {
        min-height: 275px;
        box-sizing: border-box;
        padding: 0 32px 32px;
      }

      #file-upload {
        position: relative;
      }

      .more-icon {
        --iron-icon-width: 24px;
        --iron-icon-height: 24px;
      }

      input#file-input {
        position: absolute;
        top: 0;
        left: 0;
        height: 0;
        width: 0;
        opacity: 0;
      }
      #download-button-container iron-icon {
        position: absolute;
        --iron-icon-width: 32px;
        --iron-icon-height: 32px;
        top: calc(50% - 16px);
        left: -48px;
      }

      #action-menu {
        margin: 32px 0;
      }

      #action-menu>span {
        width: 80px;
        color: var(--gin-grey-100);
        text-align: center;
        margin: 0 16px;
        border-bottom: 1px solid transparent;
        transition: color 250ms;
      }

      #action-menu>span:hover {
        color: var(--gin-grey-200);
      }

      #action-menu>span.selected {
        color: var(--gin-grey-300);
        border-bottom: 1px solid var(--gin-blue-200);
      }

      iron-pages > div {
        min-height: 160px;
      }

      .key {
        width: 104px;
        height: 30px;
        margin: 8px 16px;
        padding: 4px 0;
        border-bottom: 1px solid #D9D9D9;
      }

      #title-input-container > label {
        margin-right: 16px;
      }

      #new-form, #new-action-form {
        border: 1px dotted var(--gin-grey-100);
        border-radius: 8px;
      }

      #new-form label, #new-action-form label {
        display: inline-block;
        width: 120px;
      }

      input#title-input {
        margin: 0 8px;
        border-top: none;
        border-right: none;
        border-bottom: 1px solid #707070;
        border-left: none;
      }

      #empty-actions-button {
        margin-bottom: 16px;
      }

      #add-action-btn {
        background: #f1f6f4;
        margin-top: 16px;
        transition: background 250ms;
      }

      #add-action-btn:hover {
        border-color: var(--gin-grey-100);
        background: #ECF1EF;
      }

      .report-header {
        padding: 24px;
      }

      .dialog-content {
        margin: 0;
      }

      .download-report-container {
        border: 1px dotted var(--gin-grey-100);
        border-radius: 8px;
        transition: border-color 250ms, color 250ms;
      }

      .download-report-container:hover {
        color: var(--gin-grey-400);
        border-color: var(--gin-grey-300);
      }

      .download-report-container iron-icon {
        --iron-icon-fill-color: var(--gin-grey-200);
        transition: fill 250ms;
      }

      .download-report-container:hover iron-icon {
        --iron-icon-fill-color: var(--gin-grey-400);
      }

      :host #actions nav iron-icon,
      :host #setting nav iron-icon {
        transition: transform 250ms;
        transform: rotate(0deg);
      }
      :host([new-mode]) #actions nav iron-icon {
        transform: rotate(-45deg);
      }

      :host([new-action-mode]) #settings nav iron-icon {
        transform: rotate(-45deg);
      }

      :host([new-summarizer-mode]) #actions nav#summarizer-nav iron-icon {
        transform: rotate(-45deg);
      }

      .report-overlay {
        position: absolute;
        height: 100%;
        width: 100%;
        background: rgba(255,255,255,0.5);
        z-index: 10;
      }

      #empty-author-button iron-icon {
        --iron-icon-fill-color: var(--gin-grey-200);
        --iron-icon-width: 22px;
        --iron-icon-height: 22px;
        transition: fill 250ms;
      }

      #empty-author-button:hover iron-icon {
        --iron-icon-fill-color: var(--gin-grey-400);
      }

      .close-icon {
        position: absolute;
        top: 16px;
        right: 24px;
        --iron-icon-width: 20px;
        --iron-icon-height: 20px;
      }

      paper-spinner-lite {
        --paper-spinner-color: var( --gin-blue-200);
        z-index: 30;
      }

      input {
        padding: 4px 0 4px 1px;
        border-top: none;
        border-right: none;
        border-bottom: 1px solid var(--gin-grey-100);
        border-left: none;
        transition: 200ms border-color;
      }

      input:focus {
        outline: none;
        border-color: var(--gin-grey-200);
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <div id="editor-container">
      <div id="title-bar" class="horizontal layout center" on-click="toggleSelected">
        <div id="song-title">[[title]]</div>
        <div class="flex">
          <iron-icon id="dropdown-icon" icon$="[[_computeTitleIcon(selected)]]" class="hoverable"></iron-icon>
        </div>
        <button id="upload-btn"
                on-click="uploadFile"
                data-mode="all">
          <span>[[localize('UPLOACSV')]]</span>
        </button>
        <input id="file-input" type="file" on-click="stopPropagation">
      </div>
      <div id="editor-body" hidden\$="[[!selected]]">
        <div id="action-menu" class="horizontal layout center-center l-relative" on-click="selectSubSection">
          <span class="selected" data-section="actions">[[localize('SETTINGS')]]</span>
          <span data-section="settings">Műveletek</span>
          <iron-icon id="gin-side-menu-icon" on-click="openSideMenu" class="more-icon hoverable" icon="gin-icons:more-vert"></iron-icon>
        </div>
        <iron-pages selected="[[section]]" attr-for-selected="id" fallback-selection="fallback">
          <div id="actions">
            <nav class="layout horizontal center-center l-relative">
              <div class="flex layout horizontal center-center">
                <div>Jogtulajdonosok</div>
              </div>
              <iron-icon class="more-icon hoverable"
                         icon="gin-icons:add"
                         on-click="toggleNewMode"
                         hidden$="[[_isArrayEmpty(authors.length)]]"></iron-icon>
            </nav>
            <button id="empty-author-button" 
                    class="simple l-m-auto l-mb-4"
                    on-click="toggleNewMode"
                    hidden$="[[!_isArrayEmpty(authors.length)]]"
                    disabled$="[[newMode]]">
              <div class="horizontal layout center-center">
                <iron-icon icon="gin-icons:add"></iron-icon>
                <div>Új név</div>
              </div>
            </button>
            <!-- Authors -->
            <gin-plot-executer id="author-executer"
                               columns="{{authors}}"
                               column-variables="{{columnVariables}}"></gin-plot-executer>
            <!-- New author form -->
            <div id="new-form" class="vertical layout l-relative l-pv-4 l-ps-4 l-mb-2" hidden$="[[!newMode]]">
              <iron-icon class="hoverable close-icon" icon="gin-icons:close" on-click="toggleNewMode"></iron-icon>
              <div class="l-mb-2">
                <label for="new-author-name" class="l-mr-2">Név:</label>
                <input id="new-author-name" type="text" size="35" placeholder="Új név" on-keyup="onKeyup">
              </div>
              <div class="horizontal layout l-mb-4">
                <label for="author-type" class="l-mr-2">Royalty:</label>
                <form action="" class="horizontal layout">
                  <div class="horizontal layout" on-click="selectRadio">
                    <input type="radio" name="type" value="simple" class="l-mr-1" checked>
                    <div class="l-mr-2">Egyféle érték</div>
                  </div>
                  <div class="horizontal layout" on-click="selectRadio">
                    <input type="radio" name="type" value="complex" class="l-mr-1">
                    <div>Többféle eset</div>
                  </div>
                </form>
              </div>
              <div class="horizontal layout center-center">
                <button class="simple" on-click="addAuthor">
                  <div>Ok</div>
                </button>
              </div>
            </div>
            <br>
            <nav class="layout horizontal center-center l-relative">
              <div class="flex layout horizontal center-center">
                <div>Összegzö értékek</div>
              </div>
              <iron-icon class="more-icon hoverable"
                         icon="gin-icons:add"
                         on-click="toggleNewSummarizerMode"></iron-icon>
            </nav>
            <!-- Summarizers -->
            <gin-plot-executer id="summarizer-executer"
                               columns="{{summarizers}}"
                               column-variables="{{columnVariables}}"
                               summarizer-mode></gin-plot-executer>
            <!-- New summarizer form -->
            <div id="new-summarizer-form" class="vertical layout l-mb-2 l-pv-4 l-ps-4 l-relative" hidden$="[[!newSummarizerMode]]">
              <iron-icon class="hoverable close-icon" icon="gin-icons:close" on-click="toggleNewSummarizerMode"></iron-icon>
              <div class="l-mb-3">
                <label for="new-summarizer-name" class="l-mr-2">Nev:</label>
                <input id="new-summarizer-name"
                       type="text"
                       size="35"
                       placeholder="Név"
                       on-keyup="proceedToAddSummarizer">
              </div>
              <div class="horizontal layout center-center">
                <button class="simple" on-click="addSummarizer">
                  <div>Ok</div>
                </button>
              </div>
            </div>
            <br>
            <nav class="layout horizontal center-center l-relative">
              <div class="flex layout horizontal center-center">
                <div>Adatok</div>
              </div>
            </nav>
            <div id="title-input-container" class="horizontal layout center-center">
              <label for="title-input">[[localize('NAMEXXXX')]]:</label>
              <input id="title-input" type="text" value="{{title::change}}" size="35" on-keyup="blurInput">
            </div>
          </div>
          <br>
          <!-- Settings -->
          <div id="settings">
            <!-- Reports navbar -->
            <nav class="layout horizontal center-center l-relative">
              <div class="flex layout horizontal center-center">
                <div>Elszámolások</div>
              </div>
              <iron-icon id="add-action-icon"
                         class="more-icon hoverable"
                         icon="gin-icons:add"
                         on-click="uploadFile"
                         data-mode="report"></iron-icon>
            </nav>
            <div hidden$="[[newActionMode]]">
              <!-- Empty actions button -->
              <button id="empty-actions-button" 
                      class="simple l-m-auto"
                      on-click="uploadFile"
                      data-mode="report"
                      hidden$="[[!_isArrayEmpty(reports.length)]]"
                      disabled$="[[newActionMode]]">
                <div class="horizontal layout center-center">
                  <iron-icon icon="gin-icons:add"></iron-icon>
                  <div>Új elszámolás</div>
                </div>
              </button>
            </div>
            <div id="no-author-error">Nincs jogtulajdonos.</div>
            <!-- New action form -->
            <div id="new-action-form" class="vertical layout l-mb-2 l-pv-4 l-ps-4 l-relative" hidden$="[[!newActionMode]]">
              <iron-icon class="hoverable close-icon" icon="gin-icons:close" on-click="toggleNewActionMode"></iron-icon>
              <div class="l-mb-3">
                <label for="new-action-name" class="l-mr-2">Bevétel oszlop:</label>
                <input id="new-action-name"
                       type="text"
                       size="35"
                       placeholder="Név"
                       value="{{incomeHeader::change}}"
                       on-keyup="proceedToExecuteRun">
              </div>
              <div class="horizontal layout center-center">
                <button class="simple" on-click="executeRun">
                  <div>Ok</div>
                </button>
              </div>
            </div>
            <!-- Reports repeat -->
            <template is="dom-repeat" id="report-repeater" items="{{reports}}" as="report" index-as="reportIndex">
              <div class="download-report-container vertical layout l-relative l-mb-4">
                  <div class="horizontal layout center l-relative report-header" on-click="toggleSelectedReport">
                    <div class="flex horizontal layout center">
                      <input class="concealed-input l-mr-3"
                            size\$="[[report.title.length]]"
                            value="{{report.title::change}}"
                            on-click="stopPropagation">
                      <div class="flex">
                        <iron-icon id="title-icon" icon\$="[[_computeReportTitleIcon(reportIndex, openedReports.*)]]" class="hoverable"></iron-icon>
                      </div>
                    </div>
                    <iron-icon icon="gin-icons:file-download"
                                class="l-mr-2"
                                on-click="downloadExistingReport"
                                hidden\$="[[!_isSelected(reportIndex, openedReports, openedReports.*)]]"></iron-icon>
                    <iron-icon class="edit-icon hoverable"
                              icon="gin-icons:more-vert"
                              on-click="openSideMenu"
                              hidden\$="[[!_isSelected(reportIndex, openedReports, openedReports.*)]]"></iron-icon>
                  </div>
                  <div class="report-detail" hidden\$="[[!_isSelected(reportIndex, openedReports, openedReports.*)]]">
                    <div class="horizontal layout l-pr-2 l-pb-3 l-pl-3">
                      <div class="l-mr-1">Osszes bevetel&#58;</div>
                      <div>[[roundNumber(report.totalRevenue)]]</div>
                    </div>
                      <template is="dom-repeat" items="[[report.authors]]" as="author">
                        <div class="horizontal layout l-pr-2 l-pb-3 l-pl-3">
                          <div class="l-mr-1">[[author.label]]&#58;</div>
                          <div>[[roundNumber(author.value)]]</div>
                        </div>
                    </template>
                  </div>
                  <div class="report-overlay vertical layout center-center" hidden\$="[[!_isFirstDocumentStillLoading(report.authors, reportIndex, reports.length)]]">
                    <paper-spinner-lite active></paper-spinner-lite>
                  </div>
              </div>
            </template>
            <!-- Summaries navbar -->
            <nav class="layout horizontal center-center l-relative">
              <div class="flex layout horizontal center-center">
                <div>Osszegzesek</div>
              </div>
              <iron-icon id="add-action-icon"
                         class="more-icon hoverable"
                         data-mode="summary"
                         icon="gin-icons:add"
                         on-click="uploadFile"></iron-icon>
            </nav>
            <!-- Summaries repeat -->
            <template is="dom-repeat" id="report-repeater" items="{{summaries}}" as="summary" index-as="summaryIndex">
            <div class="download-report-container vertical layout l-relative l-mb-4">
                <div class="horizontal layout center l-relative report-header" on-click="toggleSelectedSummary">
                  <div class="flex horizontal layout center">
                    <input class="concealed-input l-mr-3"
                          size\$="[[summary.title.length]]"
                          value="{{summary.title::change}}"
                          on-click="stopPropagation">
                    <div class="flex">
                      <iron-icon id="title-icon" icon\$="[[_computeReportTitleIcon(summaryIndex, openedSummaries.*)]]" class="hoverable"></iron-icon>
                    </div>
                  </div>
                  <iron-icon icon="gin-icons:file-download"
                              class="l-mr-2"
                              on-click="downloadExistingSummary"
                              hidden\$="[[!_isSelected(summaryIndex, openedSummaries, openedSummaries.*)]]"></iron-icon>
                  <iron-icon class="edit-icon hoverable"
                            icon="gin-icons:more-vert"
                            on-click="openSideMenu"
                            hidden\$="[[!_isSelected(summaryIndex, openedSummaries, openedSummaries.*)]]"></iron-icon>
                </div>
                <div class="report-detail" hidden\$="[[!_isSelected(summaryIndex, openedSummaries, openedSummaries.*)]]">
                  <template is="dom-repeat" items="[[summary.fields]]" as="field">
                    <div class="horizontal layout l-pr-2 l-pb-3 l-pl-3">
                      <div class="l-mr-1">[[field.label]]&#58;</div>
                      <div>[[field.value]]</div>
                    </div>
                  </template>
                </div>
                <div class="report-overlay vertical layout center-center" hidden\$="[[!_isFirstDocumentStillLoading(summary.fields, summaryIndex, summaries.length)]]">
                  <paper-spinner-lite active></paper-spinner-lite>
                </div>
            </div>
          </template>
          </div>
        </iron-pages>
        <paper-dialog id="side-menu" class="side-menu" vertical-align="top" horizontal-align="left" on-iron-overlay-closed="removeScrollListener">
          <div class="dialog-content no-padding">
            <div class="side-menu-container">
              <div class="horizontal layout" on-click="deleteCommand">
                <iron-icon icon="gin-icons:delete"></iron-icon>
                <div>[[localize('DELETEXX')]]</div>
              </div>
            </div>
          </div>
        </paper-dialog>
      </div>
    </div>
    <gin-dialog id="dialog" on-val-changed="onValChanged"></gin-dialog>
`;
  }

  static get is() { return 'gin-rule-editor'; }
  static get properties() {
    return {
      title: {
        type: String,
        value: null,
        notify: true
      },
      authors: {
        type: Array,
        value: () => [],
        notify: true
      },
      summarizers: {
        type: Array,
        value: () => [],
        notify: true
      },
      incomeHeader: {
        type: String,
        value: null,
        notify: true
      },
      selected: {
        type: Boolean,
        value: true,
        notify: true,
        reflectToAttribute: true
      },
      columnVariables: {
        type: Array,
        value: () => []
      },
      section: {
        type: String,
        value: 'actions'
      },
      actionOptions: {
        type: Array,
        value: () => [{
          label: 'add',
          type: 'add'
        }]
      },
      editedProperty: {
        type: String,
        value: null
      },
      newMode: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      newActionMode: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      newSummarizerMode: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      table: {
        type: Object,
        value: () => ({})
      },
      noAuthorError: {
        type: Boolean,
        reflectToAttribute: true
      },
      deletableReportIndex: {
        type: Number
      },
      deletableSummaryIndex: {
        type: Number
      },
      openedReports: {
        type: Array,
        value: () => []
      },
      openedSummaries: {
        type: Array,
        value: () => []
      },
      reports: {
        type: Array,
        value: () => [],
        notify: true
      },
      summaries: {
        type: Array,
        value: () => [],
        notify: true
      },
      executionMode: String
    }
  }
  constructor() {
    super();
    this.onSelectFile = this.onSelectFile.bind(this);
    this.resizeSideMenu = this.resizeSideMenu.bind(this);
    this.clearNoAuthorError = this.clearNoAuthorError.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.querySelector('#file-input').addEventListener('input', this.onSelectFile);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.shadowRoot.querySelector('#file-input').removeEventListener('input', this.onSelectFile);
  }
  run() {
    this.section = 'settings';
    // Automatically switch to reports tab
    const menuItems = this.$['action-menu'].querySelectorAll('span');
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].getAttribute('data-section') === 'settings') {
        menuItems[i].classList.add('selected');
      } else {
        menuItems[i].classList.remove('selected');
      }
    }
    // For reports show the form, for summaries, go straigh to execution
    if (this.executionMode === 'summary') {
      this.executeRun();
    } else {
      this.toggleNewActionMode();
    }

  }
  proceedToExecuteRun(e) {
    // Hitting enter
    if (e.keyCode === 13) {
      this.executeRun();
    }
  }
  proceedToAddSummarizer(e) {
    // Hitting enter
    if (e.keyCode === 13) {
      this.addSummarizer();
    }
  }
  executeRun() {
    const incomeHeader = this.shadowRoot.querySelector('#new-action-name').value;
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '/' + mm + '/' + dd;

    // Summaries
    if (this.executionMode === 'summary') {
      // Workaround dom-repeat bug
      const newArray = this.summaries.slice(0);
      this.set('summaries', []);
      newArray.unshift({
        title: today
      });
      requestAnimationFrame(() => {
        this.set('summaries', newArray);
        // Expand the newly added report (index 0)
        if (this.openedSummaries.indexOf(0) === -1) {
          this.push('openedSummaries', 0);
        }
        this.shadowRoot.querySelector('#summarizer-executer').runPlots(this.table.rows, this.table.headers, incomeHeader)
          .then((data) => {
            this.set('summaries.0.table', JSON.parse(JSON.stringify(data[1])));
            this.set('summaries.0.fields', data[2]);
          });
      });
    // Reports
    } else {
      // Workaround dom-repeat bug
      const newArray = this.reports.slice(0);
      this.set('reports', []);
      newArray.unshift({
        title: today
      });
      requestAnimationFrame(() => {
        this.set('reports', newArray);
        // Expand the newly added report (index 0)
        if (this.openedReports.indexOf(0) === -1) {
          this.push('openedReports', 0);
        }
        this.toggleNewActionMode();
        this.shadowRoot.querySelector('#author-executer').runPlots(this.table.rows, this.table.headers, incomeHeader)
          .then((data) => {
            this.set('reports.0.table', JSON.parse(JSON.stringify(data[1])));
            this.set('reports.0.authors', data[2]);
            this.set('reports.0.totalRevenue', data[3]);
          });
      });

    }

  }
  uploadFile(e) {
    e.stopPropagation();
    // ExecutionMode indicates if the action is generating a report or a summary, or both
    this.executionMode = e.currentTarget.getAttribute('data-mode');
    // Error scenarios
    // Both report and summary
    if (this.executionMode === 'all'
        && (!this.authors || this.authors.length === 0)
        && (!this.summarizers || this.summarizers.length === 0)) {
      this.dispatchEvent(
        new CustomEvent('gin-error', {
          detail: {
            message: 'Nincs jogtulajdonos vagy összegző érték!'
          },
          bubbles: true,
          composed: true
        })
      );
      return;
    // Report
    } else if (this.executionMode === 'report'
        && (!this.authors || this.authors.length === 0)) {
      if (this.reports && this.reports.length > 0) {
        // Set error as a dialog
        this.dispatchEvent(
          new CustomEvent('gin-error', {
            detail: {
              message: 'Nincs jogtulajdonos!'
            },
            bubbles: true,
            composed: true
          })
        );
        return;
      } else {
        // Set error as a message
        if (!this.noAuthorError) {
          this.noAuthorError = true;
          setTimeout(() => {
            document.addEventListener('click', this.clearNoAuthorError, { once: true });
          }, 0);
        }
        return;
      }
    } else if (this.executionMode === 'summary'
        && (!this.authors || this.authors.length === 0)) {
      this.dispatchEvent(
        new CustomEvent('gin-error', {
          detail: {
            message: 'Nincs összegző érték!'
          },
          bubbles: true,
          composed: true
        })
      );
      return;
    }
    this.shadowRoot.querySelector('#file-input').click();
    document.body.onfocus = this.checkFileInputState.bind(this);
  }
  clearNoAuthorError(e) {
    const target = e.composedPath()[0];
    console.log(target.id);
    if (target.id === 'add-action-icon' || target.id === 'upload-btn' || target.id === 'empty-actions-button') {
      return;
    }
    this.noAuthorError = false;
  }
  checkFileInputState() {
    setTimeout(() => {
      console.log('mofo 2', this.shadowRoot.querySelector('#file-input').value.length)
      if (this.shadowRoot.querySelector('#file-input').value.length === 0) {
        console.log('ssss')
        document.body.onfocus = null;
        this.newActionMode = false;
        this.shadowRoot.querySelector('#upload-btn').blur();
      }
    }, 0);
  }
  onSelectFile(e) {
    e.stopPropagation();
    Papa.parse(e.target.files[0], {
      header: true,
      dynamicTyping: true,
      complete: (data) => {
        this.set('table.headers', data.meta.fields);
        this.set('table.rows', data.data);
        this.run();
      }
    });
    e.target.value = null;
  }
  downloadExistingReport(e) {
    e.stopPropagation();
    const blob = new Blob([
      Papa.unparse({
        fields: this.reports[e.model.reportIndex].table.headers,
        data: this.reports[e.model.reportIndex].table.rows
      }, { delimiter: ';' })]);
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob, { type: 'text/plain' });
    const safeTitle = this.reports[e.model.reportIndex].title.replace(/\//gm, '_');
    a.download = `${safeTitle}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  downloadExistingSummary(e) {
    e.stopPropagation();
    const blob = new Blob([
      Papa.unparse({
        fields: this.summaries[e.model.summaryIndex].table.headers,
        data: this.summaries[e.model.summaryIndex].table.rows
      }, { delimiter: ';' })]);
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob, { type: 'text/plain' });
    const safeTitle = this.summaries[e.model.summaryIndex].title.replace(/\//gm, '_');
    a.download = `${safeTitle}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  toggleNewMode() {
    this.newMode = !this.newMode;
    if (this.newMode) {
      this.shadowRoot.querySelector('#new-author-name').focus();
    } else {
      // Reset form
      this.shadowRoot.querySelector('#new-author-name').value = '';
      this.shadowRoot.querySelector('#new-form input[type="radio"]:first-of-type').click();
    }
  }
  toggleNewActionMode() {
    this.newActionMode = !this.newActionMode;
    if (this.newActionMode) {
      this.shadowRoot.querySelector('#new-action-name').focus();
    }
  }
  toggleNewSummarizerMode() {
    this.newSummarizerMode = !this.newSummarizerMode;
    if (this.newSummarizerMode) {
      this.shadowRoot.querySelector('#new-summarizer-name').focus();
    }
  }
  selectRadio(e) {
    e.currentTarget.querySelector('input').click();
  }
  openOptions(e) {
    this.editedProperty = e.target.getAttribute('data-label');
    const options = this[`${this.editedProperty}Options`];
    this.$.dialog.openOptions(e.target, options);
  }
  _computeTitleIcon(selected) {
    return selected ? 'gin-icons:keyboard-arrow-down' : 'gin-icons:keyboard-arrow-right';
  }
  _computeReportTitleIcon(instanceIndex) {
    return this._isSelected(instanceIndex, this.reports) ?
      'gin-icons:keyboard-arrow-down' : 'gin-icons:keyboard-arrow-right';
  }
  _isSelected(i, array) {
    return array.indexOf(i) !== -1;
  }
  addOne(i) {
    return i + 1;
  }
  openSideMenu(e) {
    e.stopPropagation();
    // For reports or summaries
    this.deletableReportIndex = (e.model && e.model.reportIndex) || null;
    this.deletableSummaryIndex = (e.model && e.model.summaryIndex) || null;
    this.shadowRoot.querySelector('#side-menu').set('positionTarget', e.currentTarget);
    this.shadowRoot.querySelector('#side-menu').open();
    document.addEventListener('scroll', this.resizeSideMenu);
  }
  removeScrollListener() {
    document.removeEventListener('scroll', this.resizeSideMenu);
  }
  resizeSideMenu() {
    const allMenus = this.shadowRoot.querySelectorAll('.side-menu');
    console.log('allMENUSSSS', allMenus.length);
    for (var i = 0; i < allMenus.length; i++) {
      this.hideMenuIfOutOfBound(allMenus[i]);
      allMenus[i].notifyResize();
    }
  }
  hideMenuIfOutOfBound(element) {
    const rect = element.getBoundingClientRect();
    if (rect.top < 48 || (window.innerHeight - rect.bottom) < 48) {
      element.close();
    }
  }
  addAuthor() {
    // Workaround dom-repeat bug
    const newArray = this.authors.slice(0);
    this.set('authors', []);
    newArray.unshift({
      label: this.shadowRoot.querySelector('#new-author-name').value || 'Új név',
      simple: this.shadowRoot.querySelector('#new-form form input[name="type"]:checked').value === 'simple',
      defaultSegments: [
        {
          label: 'value',
          tableValue: true
        },
        {
          label: '*'
        },
        {
          label: '1'
        }
      ],
    });
    requestAnimationFrame(() => { this.set('authors', newArray) });
    this.toggleNewMode();
  }
  addSummarizer() {
    // Workaround dom-repeat bug
    const newArray = this.summarizers.slice(0);
    this.set('summarizers', []);
    newArray.unshift({
      label: this.shadowRoot.querySelector('#new-summarizer-name').value || 'Új név',
      simple: false,
      defaultSegments: [
        {
          label: 'value',
          tableValue: true
        },
        {
          label: '*'
        },
        {
          label: '1'
        }
      ],
    });
    requestAnimationFrame(() => { this.set('summarizers', newArray) });
    this.toggleNewSummarizerMode();
  }
  selectSubSection(e) {
    console.log('select section');
    const target = e.composedPath()[0];
    const sectionString = target.getAttribute('data-section');
    if (!sectionString) {
      return;
    }
    const menuItems = this.$['action-menu'].querySelectorAll('span');
    for (let i = 0; i < menuItems.length; i++) {
      console.log(menuItems[i].getAttribute('data-section'))
      if (menuItems[i].getAttribute('data-section') === sectionString) {
        menuItems[i].classList.add('selected');
      } else {
        menuItems[i].classList.remove('selected');
      }
    }
    this.section = e.composedPath()[0].getAttribute('data-section');

    // Close new forms if clicking away from section
    if (this.section === 'actions' && this.newActionMode) {
      this.toggleNewActionMode();
    } else if (this.section === 'settings' && this.newMode) {
      this.toggleNewMode();
    }
  }
  toggleSelected(e) {
    this.selected = !this.selected;
  }
  toggleSelectedReport(e) {
    const indexInOpened = this.openedReports.indexOf(e.model.reportIndex);
    const indexInAll = e.model.reportIndex;
    if (indexInOpened === -1) {
      this.push('openedReports', indexInAll);
    } else {
      this.splice('openedReports', indexInOpened);
    }
  }
  toggleSelectedSummary(e) {
    const indexInOpened = this.openedSummaries.indexOf(e.model.summaryIndex);
    const indexInAll = e.model.summaryIndex;
    if (indexInOpened === -1) {
      this.push('openedSummaries', indexInAll);
    } else {
      this.splice('openedSummaries', indexInOpened);
    }
  }
  _isFirstDocumentStillLoading(collectionArray, index) {
    // First item in array and collection array (reports or summaries) not defined yet
    return index === 0 && (!collectionArray || collectionArray.length === 0);
  }
  deleteCommand() {
    // delete report
    if (typeof this.deletableReportIndex === 'number') {
      const cacheReports = this.reports;
      this.set('reports', []);

      requestAnimationFrame(() => {
        this.set('reports', cacheReports.filter((report, index) => index !== this.deletableReportIndex));
      });
    // delete summary
    } else if (typeof this.deletableSummaryIndex === 'number') {
      const cacheSummaries = this.summaries;
      this.set('summaries', []);

      requestAnimationFrame(() => {
        this.set('summaries', cacheSummaries.filter((summary, index) => index !== this.deletableSummaryIndex));
      });
    // delete gin
    } else {
      this.dispatchEvent(
        new CustomEvent('delete-request', {
          bubbles: true,
          composed: true
        })
      );
    }
    this.$['side-menu'].close();
  }
  roundNumber(n) {
    if (!this._isNumber(n)) {
      return '-';
    }
    let negative = false;
    if (n < 0) {
      negative = true;
      n = n * -1;
    }
    const multiplicator = Math.pow(10, 5);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(5);
    if (negative) {
      n = (n * -1).toFixed(5);
    }
    // Get rid of unnecessary zeroes
    n = +n;
    return n;
  }
  _isItemLast(instanceIndex, arrayLength) {
    return instanceIndex === arrayLength - 1;
  }
  stopPropagation (e) {
    e.stopPropagation();
  }
  onKeyup(e) {
    // Hitting enter
    if (e.keyCode === 13) {
      this.shadowRoot.querySelector('#new-form button').focus();
    }
  }
  blurInput(e) {
    // Hitting enter
    if (e.keyCode === 13) {
      e.currentTarget.blur();
    }
  }
  isEq(instance, target) {
    return instance === target;
  }
  _isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }
  _isEq(target, instance) {
    return target === instance;
  }
  _eitherIsEmptyArray() {
    // true if any of the item is undefined or has zero length
    return !arguments.filter(array => !!array || array.length === 0);
  }
  _isArrayEmpty(length) {
    return length === 0;
  }
}
customElements.define(GinRuleEditor.is, GinRuleEditor);
