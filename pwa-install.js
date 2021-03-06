class PWAInstall extends HTMLElement {
  static get is() {
    /**
     * @customElement pwa-install
     */
    return 'pwa-install';
  }

  get available() {
    return this._available;
  }

  set available(value) {
    /**
     * @event available-changed
     */
    this._available = value;
    this.dispatchEvent(new CustomEvent('available-changed', {
      detail: {
        value
      }
    }));
  }

  get platforms() {
    return this._platforms;
  }

  set platforms(value) {
    /**
     * @event platforms-changed
     */
    this._platforms = value;
    this.dispatchEvent(new CustomEvent('platforms-changed', {
      detail: {
        value
      }
    }));
  }

  get relatedApps() {
    return this._relatedApps;
  }

  set relatedApps(value) {
    /**
     * @event related-apps-changed
     */
    this._relatedApps = value;
    this.dispatchEvent(new CustomEvent('related-apps-changed', {
      detail: {
        value
      }
    }));
  }

  get choiceResult() {
    return this._choiceResult;
  }

  set choiceResult(value) {
    /**
     * @event choice-result-changed
     */
    this._choiceResult = value;
    this.dispatchEvent(new CustomEvent('choice-result-changed', {
      detail: {
        value
      }
    }));
  }

  get supported() {
    return this._supported;
  }

  set supported(value) {
    /**
     * @event supported-changed
     */
    this._supported = value;
    this.dispatchEvent(new CustomEvent('supported-changed', {
      detail: {
        value
      }
    }));
  }

  _onbeforeinstallprompt(e) {
    window.deferredEvent = e;
    e.preventDefault();
    this.platforms = e.platforms;
    /**
     * @event pwa-install-available
     */
    this.dispatchEvent(new CustomEvent('pwa-install-available'), {
      bubbles: true,
      composed: true
    });
    this.available = true;
  }

  _onappinstalled(e) {
    window.deferredEvent = null;
    /**
     * @event pwa-install-installed
     */
    this.dispatchEvent(new CustomEvent('pwa-install-installed'), {
      bubbles: true,
      composed: true
    });
    this.available = false;
  }

  /**
   * @method install
   */
  install() {
    if (window.deferredEvent) {
      window.deferredEvent.prompt();
      window.deferredEvent.userChoice
        .then(choiceResult => {
          this.choiceResult = choiceResult;
          /**
           * @event pwa-install-install
           */
          this.dispatchEvent(new CustomEvent('pwa-install-install', {
            detail: {
              choiceResult
            },
            bubbles: true,
            composed: true
          }));
        })
        .catch(error => {
          /**
           * @event pwa-install-error
           */
          this.dispatchEvent(new CustomEvent('pwa-install-error', {
            detail: {
              message: {
                error
              }
            },
            bubbles: true,
            composed: true
          }));
        });
      window.deferredEvent = null;
      this.available = false;
    }
  }

  /**
   * @method getInstalledRelatedApps
   */
  getInstalledRelatedApps() {
    if (this.supported) {
      navigator.getInstalledRelatedApps().then((relatedApps) => {
        this.relatedApps = relatedApps;
      })
    }
  }

  constructor() {
    super();

    /**
     * @property available
     * @type {?boolean}
     */
    this.available;

    /**
     * @property platforms
     * @type {?Array}
     */
    this.platforms;

    /**
     * @property choiceResult
     * @type {?Object}
     */
    this.choiceResult;

    /**
     * @property supported
     * @type {?boolean}
     */
    this.supported;

    /**
     * @property relatedApps
     * @type {?Array}
     */
    this.relatedApps;

    this._onbeforeinstallprompt = this._onbeforeinstallprompt.bind(this);
    this._onappinstalled = this._onappinstalled.bind(this);
  }

  connectedCallback() {
    // Set `supported` value in `connectedCallback()` instead of `constructor()` for compatibility with Polymer data binding
    this.supported = 'getInstalledRelatedApps' in navigator;
    this.getInstalledRelatedApps();
    window.addEventListener('beforeinstallprompt', this._onbeforeinstallprompt);
    window.addEventListener('appinstalled', this._onappinstalled);
  }

  disconnectedCallback() {
    window.removeEventListener('beforeinstallprompt', this._onbeforeinstallprompt);
    window.removeEventListener('appinstalled', this._onappinstalled);
  }
}

customElements.define(PWAInstall.is, PWAInstall);
