# 🎯 Guida: Embeddare il sito in WordPress

## Pagina iFrame Ottimizzata

È stata creata una pagina speciale ottimizzata per l'embedding in WordPress:

**File**: `iframe-page.html`
**URL**: `https://marco-onapex.github.io/The-Memory-Echi-del-Gerofante/iframe-page.html`

## Caratteristiche

✅ **Header rimosso** - Ridotto al minimo per risparmiare spazio
✅ **Sidebar collassabile** - Toggle button mini a sinistra
✅ **Responsive** - Adatta bene in iframe di qualsiasi larghezza
✅ **Auto-resize** - Comunica con il parent iframe tramite postMessage
✅ **Ricerca completa** - Tutti i filtri funzionanti
✅ **Design compatto** - Padding e spacing ridotti

## Come usare in WordPress

### 📌 Metodo 1: iFrame Semplice (HTML)

In una pagina WordPress, modalità HTML/Code:

```html
<iframe 
  id="tm-archive"
  src="https://marco-onapex.github.io/The-Memory-Echi-del-Gerofante/iframe-page.html"
  width="100%"
  height="800"
  style="border: 2px solid #D4AF37; border-radius: 8px; background: #1a1a1a;"
  title="The Memory - Archivio GDR">
</iframe>

<script>
  // Auto-resize dell'iframe in base al contenuto
  window.addEventListener('message', (e) => {
    if (e.data.type === 'resize') {
      document.getElementById('tm-archive').style.height = e.data.height + 'px';
    }
  });
</script>
```

### 📌 Metodo 2: Plugin Elementor

Se usi Elementor:
1. Aggiungi un widget **"HTML"** alla pagina
2. Incolla il codice HTML sopra
3. Salva

### 📌 Metodo 3: Plugin Advanced iFrames

1. Installa: **Advanced iFrames**
2. Crea un'iframe shortcode con URL: `https://marco-onapex.github.io/The-Memory-Echi-del-Gerofante/iframe-page.html`
3. Aggiungi al contenuto con `[advanced_iframe url="https://marco-onapex.github.io/The-Memory-Echi-del-Gerofante/iframe-page.html"]`

## Personalizzazioni

### Cambiar altezza iniziale
```html
<iframe 
  src="..."
  height="1000"  <!-- Aumenta questo numero -->
  ...
>
</iframe>
```

### Aggiungere CSS custom
```html
<style>
  #tm-archive {
    border: 3px solid #D4AF37 !important;
    box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
  }
</style>
```

### Mostrare/nascondere a seconda della viewport
```html
<div style="display: none;" class="desktop-only">
  <!-- iframe qui -->
</div>

<style>
  @media (min-width: 768px) {
    .desktop-only { display: block !important; }
  }
</style>
```

## Features Speciali

🔄 **Auto-Resize**: L'iframe si ridimensiona automaticamente in base al contenuto
📱 **Mobile Friendly**: Sidebar collassabile su mobile
🎯 **Ricerca Completa**: Funziona tutto come il sito principale
↩️ **Browser History**: Non funziona in iframe (limitazione browser)
📖 **Link Esterno**: Pulsante "Versione Completa" al footer

## Troubleshooting

### L'iframe non carica
- ✅ Verifica che sia pubblicato su GitHub Pages
- ✅ Controlla la console (F12) per errori CORS
- ✅ Svuota cache browser (Ctrl+Shift+Canc)

### L'iframe non si ridimensiona
- ℹ️ Funziona solo con auto-resize script
- ℹ️ Imposta height manualmente se il JS non funziona

### Il design non si vede bene
- 📱 Prova a impostare una larghezza minore
- 🎨 Usa CSS custom per adattarlo al tema WordPress

## URL della pagina iFrame

```
https://marco-onapex.github.io/The-Memory-Echi-del-Gerofante/iframe-page.html
```

---

**Domande?** Controlla il README principale per più info! 📖
