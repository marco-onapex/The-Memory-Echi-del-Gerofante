/**
 * PREMIUM FORM COMPONENTS - Web Components con Shadow DOM
 * Tema medievale + animazioni sofisticate
 */

// ══════════════════════════════════════════════════════════════════════
// 【 TEXT INPUT COMPONENT 】
// ══════════════════════════════════════════════════════════════════════

export class PremiumInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._setupStyles();
  }

  connectedCallback() {
    const label = this.getAttribute('label') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const id = this.getAttribute('id') || 'input-' + Math.random().toString(36).substr(2, 9);
    const icon = this.getAttribute('icon') || '';

    this.shadowRoot.innerHTML = `
      <div class="input-wrapper">
        <label for="${id}" class="label">
          ${icon ? `<span class="icon">${icon}</span>` : ''}
          <span class="label-text">${label}</span>
        </label>
        <div class="input-container">
          <input 
            id="${id}" 
            type="text" 
            placeholder="${placeholder}"
            class="input-field"
          />
          <div class="input-underline"></div>
          <div class="input-focus"></div>
        </div>
        <span class="helper-text"></span>
      </div>
    `;

    this._input = this.shadowRoot.querySelector('input');
    this._helperText = this.shadowRoot.querySelector('.helper-text');

    this._setupEventListeners();
  }

  _setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        --gold-light: #E8C74B;
        --stone-bg: #0F0F0F;
        --ink: #F5F1E8;
        --ink-faded: #A39D8F;
        --border: #4A4A4A;
        --transition: 0.2s ease;
      }

      .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .label {
        font-family: 'Cinzel', serif;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--gold-light);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all var(--transition);
      }

      .icon {
        font-size: 1.2rem;
        display: inline-block;
      }

      .input-container {
        position: relative;
      }

      .input-field {
        width: 100%;
        font-family: 'Crimson Text', serif;
        font-size: 1rem;
        padding: 0.7rem 0.9rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background: rgba(45, 45, 45, 0.7);
        color: var(--ink);
        transition: all var(--transition);
        backdrop-filter: blur(2px);
      }

      .input-field::placeholder {
        color: var(--ink-faded);
        opacity: 0.5;
      }

      .input-underline {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, var(--gold-light), transparent);
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .input-focus {
        position: absolute;
        inset: -3px;
        border: 2px solid var(--gold-light);
        border-radius: 4px;
        opacity: 0;
        transition: opacity var(--transition);
        pointer-events: none;
        box-shadow: inset 0 0 10px rgba(232, 199, 75, 0.1);
      }

      .input-field:focus {
        outline: none;
        border-color: var(--gold-light);
        background: rgba(45, 45, 45, 0.9);
        box-shadow: 0 0 12px rgba(232, 199, 75, 0.2);
      }

      .input-field:focus ~ .input-underline {
        width: 100%;
      }

      .input-field:focus ~ .input-focus {
        opacity: 1;
      }

      .helper-text {
        font-size: 0.75rem;
        color: var(--ink-faded);
        min-height: 1.2rem;
        display: block;
        transition: all var(--transition);
      }

      /* Error state */
      .input-field.error {
        border-color: #E74C3C;
        background: rgba(231, 76, 60, 0.05);
      }

      .input-field.error:focus {
        box-shadow: 0 0 12px rgba(231, 76, 60, 0.3);
      }

      .helper-text.error {
        color: #E74C3C;
      }

      /* Success state */
      .input-field.success {
        border-color: #27AE60;
      }

      .input-field.success:focus {
        box-shadow: 0 0 12px rgba(39, 174, 96, 0.2);
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  _setupEventListeners() {
    this._input.addEventListener('input', (e) => {
      this.dispatchEvent(new CustomEvent('input-change', {
        detail: { value: e.target.value },
        bubbles: true
      }));
    });

    this._input.addEventListener('focus', () => {
      this.shadowRoot.querySelector('.label').style.color = 'var(--gold-light)';
    });

    this._input.addEventListener('blur', () => {
      if (!this._input.value) {
        this.clearValidation();
      }
    });
  }

  setValue(value) {
    this._input.value = value;
  }

  getValue() {
    return this._input.value;
  }

  setError(message) {
    this._input.classList.add('error');
    this._helperText.textContent = message;
    this._helperText.classList.add('error');
  }

  setSuccess(message = 'Validato') {
    this._input.classList.add('success');
    this._input.classList.remove('error');
    this._helperText.textContent = message;
    this._helperText.classList.remove('error');
  }

  clearValidation() {
    this._input.classList.remove('error', 'success');
    this._helperText.textContent = '';
    this._helperText.classList.remove('error');
  }

  focus() {
    this._input.focus();
  }
}

customElements.define('premium-input', PremiumInput);

// ══════════════════════════════════════════════════════════════════════
// 【 BUTTON COMPONENT 】
// ══════════════════════════════════════════════════════════════════════

export class PremiumButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._setupStyles();
  }

  connectedCallback() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const text = this.textContent || 'Click';

    this.shadowRoot.innerHTML = `
      <button class="btn btn-${variant} btn-${size}">
        <span class="btn-content">${text}</span>
        <span class="btn-ripple"></span>
      </button>
    `;

    this._button = this.shadowRoot.querySelector('button');
    this._setupEventListeners();
  }

  _setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        --gold-light: #E8C74B;
        --gold-dark: #9D7E2E;
        --crimson: #E74C3C;
        --crimson-dark: #C0392B;
        --ink: #F5F1E8;
        --transition: 0.2s ease;
      }

      .btn {
        position: relative;
        overflow: hidden;
        border: none;
        border-radius: 4px;
        font-family: 'Cinzel', serif;
        font-weight: 700;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: all var(--transition);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .btn-content {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* PRIMARY VARIANT */
      .btn-primary {
        background: linear-gradient(135deg, var(--crimson), var(--crimson-dark));
        color: var(--ink);
        border: 1px solid var(--crimson);
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.25);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(231, 76, 60, 0.35);
        background: linear-gradient(135deg, #F05854, var(--crimson));
      }

      .btn-primary:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(231, 76, 60, 0.25);
      }

      /* SECONDARY VARIANT */
      .btn-secondary {
        background: transparent;
        color: var(--gold-light);
        border: 2px solid var(--gold-light);
        transition: all var(--transition);
      }

      .btn-secondary:hover {
        background: rgba(232, 199, 75, 0.1);
        box-shadow: 0 0 12px rgba(232, 199, 75, 0.25);
        transform: translateX(2px);
      }

      .btn-secondary:active {
        transform: translateX(0);
      }

      /* SIZES */
      .btn-sm {
        padding: 0.4rem 0.9rem;
        font-size: 0.8rem;
      }

      .btn-md {
        padding: 0.6rem 1.5rem;
        font-size: 0.9rem;
      }

      .btn-lg {
        padding: 0.8rem 2rem;
        font-size: 1rem;
      }

      /* RIPPLE EFFECT */
      .btn-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        pointer-events: none;
      }

      .btn:active .btn-ripple {
        animation: ripple 0.6s ease-out;
      }

      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      /* DISABLED STATE */
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
      }

      .btn:disabled:hover {
        transform: none;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  _setupEventListeners() {
    this._button.addEventListener('click', (e) => {
      // Ripple effect
      const rect = this._button.getBoundingClientRect();
      const ripple = this.shadowRoot.querySelector('.btn-ripple');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      this.dispatchEvent(new CustomEvent('btn-click', {
        bubbles: true,
        detail: { timestamp: Date.now() }
      }));
    });
  }

  setText(text) {
    this.shadowRoot.querySelector('.btn-content').textContent = text;
  }

  setDisabled(disabled) {
    this._button.disabled = disabled;
  }
}

customElements.define('premium-button', PremiumButton);

// ══════════════════════════════════════════════════════════════════════
// 【 SELECT/DROPDOWN COMPONENT 】
// ══════════════════════════════════════════════════════════════════════

export class PremiumSelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._setupStyles();
    this._isOpen = false;
  }

  connectedCallback() {
    const label = this.getAttribute('label') || '';
    const placeholder = this.getAttribute('placeholder') || 'Seleziona...';
    const icon = this.getAttribute('icon') || '';
    const id = this.getAttribute('id') || 'select-' + Math.random().toString(36).substr(2, 9);

    // Parse options from slot content
    const slot = this.querySelector('option');
    let optionsHTML = '';
    
    if (slot) {
      const options = Array.from(this.querySelectorAll('option'));
      optionsHTML = options.map(opt => 
        `<div class="option" data-value="${opt.value}">${opt.textContent}</div>`
      ).join('');
    }

    this.shadowRoot.innerHTML = `
      <div class="select-wrapper">
        <label class="label">
          ${icon ? `<span class="icon">${icon}</span>` : ''}
          <span class="label-text">${label}</span>
        </label>
        <div class="select-container">
          <button class="select-trigger" id="${id}">
            <span class="select-value">${placeholder}</span>
            <span class="select-arrow">⌄</span>
          </button>
          <div class="select-dropdown">
            ${optionsHTML}
          </div>
        </div>
      </div>
    `;

    this._trigger = this.shadowRoot.querySelector('.select-trigger');
    this._dropdown = this.shadowRoot.querySelector('.select-dropdown');
    this._valueDisplay = this.shadowRoot.querySelector('.select-value');
    this._options = this.shadowRoot.querySelectorAll('.option');

    this._setupEventListeners();
  }

  _setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        --gold-light: #E8C74B;
        --stone-bg: #0F0F0F;
        --ink: #F5F1E8;
        --ink-faded: #A39D8F;
        --border: #4A4A4A;
        --transition: 0.2s ease;
      }

      .select-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .label {
        font-family: 'Cinzel', serif;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--gold-light);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .icon {
        font-size: 1.2rem;
      }

      .select-container {
        position: relative;
      }

      .select-trigger {
        width: 100%;
        padding: 0.7rem 0.9rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background: rgba(45, 45, 45, 0.7);
        color: var(--ink);
        font-family: 'Crimson Text', serif;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all var(--transition);
        backdrop-filter: blur(2px);
      }

      .select-trigger:hover {
        background: rgba(45, 45, 45, 0.85);
        border-color: var(--gold-light);
      }

      .select-trigger:focus {
        outline: none;
        border-color: var(--gold-light);
        box-shadow: 0 0 12px rgba(232, 199, 75, 0.2);
      }

      .select-arrow {
        transition: transform var(--transition);
        font-size: 0.8rem;
      }

      .select-trigger.open .select-arrow {
        transform: rotate(180deg);
      }

      .select-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(30, 30, 30, 0.95);
        border: 1px solid var(--border);
        border-top: none;
        border-radius: 0 0 4px 4px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        backdrop-filter: blur(2px);
        z-index: 100;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .select-dropdown.open {
        max-height: 300px;
        overflow-y: auto;
      }

      .option {
        padding: 0.7rem 0.9rem;
        cursor: pointer;
        color: var(--ink-faded);
        transition: all var(--transition);
        border-bottom: 1px solid rgba(76, 74, 72, 0.3);
      }

      .option:last-child {
        border-bottom: none;
      }

      .option:hover {
        background: rgba(232, 199, 75, 0.1);
        color: var(--gold-light);
        padding-left: 1.2rem;
      }

      .option.selected {
        background: rgba(232, 199, 75, 0.15);
        color: var(--gold-light);
        font-weight: 600;
      }

      /* Scrollbar styling */
      .select-dropdown::-webkit-scrollbar {
        width: 6px;
      }

      .select-dropdown::-webkit-scrollbar-track {
        background: transparent;
      }

      .select-dropdown::-webkit-scrollbar-thumb {
        background: var(--gold-light);
        border-radius: 3px;
        opacity: 0.5;
      }

      .select-dropdown::-webkit-scrollbar-thumb:hover {
        opacity: 0.8;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  _setupEventListeners() {
    this._trigger.addEventListener('click', () => {
      this.toggle();
    });

    this._options.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        this._valueDisplay.textContent = text;
        this.value = value;
        this.close();

        this.dispatchEvent(new CustomEvent('select-change', {
          detail: { value, text },
          bubbles: true
        }));
      });
    });

    document.addEventListener('click', (e) => {
      if (!this.contains(e.target) && this._isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    this._isOpen ? this.close() : this.open();
  }

  open() {
    this._isOpen = true;
    this._trigger.classList.add('open');
    this._dropdown.classList.add('open');
  }

  close() {
    this._isOpen = false;
    this._trigger.classList.remove('open');
    this._dropdown.classList.remove('open');
  }

  setValue(value) {
    const option = Array.from(this.querySelectorAll('option')).find(o => o.value === value);
    if (option) {
      this._valueDisplay.textContent = option.textContent;
      this.value = value;
    }
  }

  getValue() {
    return this.value;
  }
}

customElements.define('premium-select', PremiumSelect);

// ══════════════════════════════════════════════════════════════════════
// 【 DATE INPUT COMPONENT 】
// ══════════════════════════════════════════════════════════════════════

export class PremiumDateInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._setupStyles();
  }

  connectedCallback() {
    const label = this.getAttribute('label') || '';
    const icon = this.getAttribute('icon') || '';
    const id = this.getAttribute('id') || 'date-' + Math.random().toString(36).substr(2, 9);

    this.shadowRoot.innerHTML = `
      <div class="date-wrapper">
        <label for="${id}" class="label">
          ${icon ? `<span class="icon">${icon}</span>` : ''}
          <span class="label-text">${label}</span>
        </label>
        <div class="date-container">
          <input 
            id="${id}" 
            type="date"
            class="date-field"
          />
          <span class="date-display"></span>
          <div class="date-underline"></div>
        </div>
      </div>
    `;

    this._input = this.shadowRoot.querySelector('input');
    this._display = this.shadowRoot.querySelector('.date-display');

    this._setupEventListeners();
  }

  _setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        --gold-light: #E8C74B;
        --ink: #F5F1E8;
        --ink-faded: #A39D8F;
        --border: #4A4A4A;
        --transition: 0.2s ease;
      }

      .date-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .label {
        font-family: 'Cinzel', serif;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--gold-light);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .icon {
        font-size: 1.2rem;
      }

      .date-container {
        position: relative;
        display: flex;
        align-items: center;
      }

      .date-field {
        width: 100%;
        padding: 0.7rem 0.9rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background: rgba(45, 45, 45, 0.7);
        color: var(--ink);
        font-family: 'Crimson Text', serif;
        font-size: 1rem;
        cursor: pointer;
        transition: all var(--transition);
        backdrop-filter: blur(2px);
      }

      .date-field::-webkit-calendar-picker-indicator {
        cursor: pointer;
        border-radius: 2px;
        background: rgba(232, 199, 75, 0.2);
        padding: 2px;
        transition: background var(--transition);
      }

      .date-field:hover::-webkit-calendar-picker-indicator {
        background: rgba(232, 199, 75, 0.4);
      }

      .date-field:focus {
        outline: none;
        border-color: var(--gold-light);
        background: rgba(45, 45, 45, 0.9);
        box-shadow: 0 0 12px rgba(232, 199, 75, 0.2);
      }

      .date-underline {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, var(--gold-light), transparent);
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .date-field:focus ~ .date-underline {
        width: 100%;
      }

      .date-display {
        position: absolute;
        right: 1rem;
        font-family: 'Cinzel', serif;
        font-size: 0.75rem;
        color: var(--ink-faded);
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--transition);
      }

      .date-field:not([value=""]) ~ .date-display {
        opacity: 1;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  _setupEventListeners() {
    this._input.addEventListener('change', (e) => {
      if (e.target.value) {
        const date = new Date(e.target.value);
        const formatted = date.toLocaleDateString('it-IT');
        this._display.textContent = formatted;
      }

      this.dispatchEvent(new CustomEvent('date-change', {
        detail: { value: e.target.value },
        bubbles: true
      }));
    });
  }

  getValue() {
    return this._input.value;
  }

  setValue(value) {
    this._input.value = value;
  }
}

customElements.define('premium-date-input', PremiumDateInput);
