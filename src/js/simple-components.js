/**
 * SIMPLE TEST - Web Component Minimalista
 * Per verificare se il Shadow DOM funziona
 */

export class SimpleInput extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    
    const template = `
      <style>
        :host {
          display: block;
          margin: 1rem 0;
        }
        label {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          color: #E8C74B;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        input {
          width: 100%;
          padding: 0.8rem;
          border: 2px solid #E8C74B;
          background: rgba(45, 45, 45, 0.8);
          color: #F5F1E8;
          font-size: 1rem;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(232, 199, 75, 0.2);
        }
        input:focus {
          outline: none;
          box-shadow: 0 0 20px rgba(232, 199, 75, 0.4);
        }
      </style>
      <label>${this.getAttribute('label') || ''}</label>
      <input 
        type="text" 
        placeholder="${this.getAttribute('placeholder') || 'Inserisci testo...'}"
      />
    `;
    
    this.shadowRoot.innerHTML = template;
  }

  getValue() {
    return this.shadowRoot.querySelector('input').value;
  }

  setValue(value) {
    this.shadowRoot.querySelector('input').value = value;
  }
}

customElements.define('simple-input', SimpleInput);

console.log('✓ SimpleInput registrato');
