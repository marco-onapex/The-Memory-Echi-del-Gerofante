# Guida per Contribuitori

Grazie per l'interesse nel contribuire a **L'Orecchio del Gerofante**! 💜

## Come Contribuire

### Segnalare Bug 🐛

Se trovi un bug:
1. Verifica che il bug non sia già stato segnalato (cerca nelle [Issues](https://github.com/marco-onapex/The-Memory-Echi-del-Gerofante/issues))
2. Crea una nuova Issue con:
   - Titolo chiaro e descrittivo
   - Descrizione dettagliata del problema
   - Step per riprodurre il bug
   - Screenshots (se utile)
   - Browser e OS utilizzati

### Suggerire Miglioramenti 💡

Per suggerire una nuova feature:
1. Apri una Issue con tag `enhancement`
2. Descrivi il caso d'uso
3. Illustra come la feature migliorerebbe l'esperienza
4. Specifica il livello di priorità (P0/P1/P2/P3)

### Fare un Pull Request 🔄

Se hai una soluzione:

1. **Fork il repo** su GitHub
2. **Crea un branch** dalla `main`:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
3. **Fai i tuoi cambiamenti**
4. **Testa sul tuo ambiente locale**:
   ```bash
   npm run serve
   # Oppure apri index.html nel browser
   ```
5. **Commita con messaggi chiari**:
   ```bash
   git commit -m "feat: add new search feature"
   git commit -m "docs: update API documentation"
   git commit -m "fix: resolve XSS vulnerability in HTML sanitizer"
   ```
6. **Push al tuo fork**:
   ```bash
   git push origin feature/my-awesome-feature
   ```
7. **Apri un Pull Request** nel repo principale con:
   - Descrizione del cambio
   - Link a issue correlate (se esiste)
   - Screenshot/demo (se utile)

## Convenzioni di Codice

### JavaScript
- Usa nomi di funzione descrittivi (es: `renderThreads()` non `render()`)
- Commenta le funzioni principali con JSDoc
- Usa `const`/`let`, evita `var`
- Implementa error handling con try/catch

### HTML/CSS
- Mantieni i nomi CSS in inglese con kebab-case: `.detail-panel`, `.thread-card`
- I colori principali sono in `:root` come variabili CSS
- Le media-query sono raggruppate alla fine

### Documentazione
- I commit dovrebbero seguire [Conventional Commits](https://www.conventionalcommits.org/)
- Aggiorna `docs/` se cambi lo schema del database
- Aggiorna il `README.md` se cambi setup o feature principali

## Setup Sviluppo Locale

### Prerequisiti
- **Git** installato
- **Supabase account** (gratuito su supabase.com)
- Un **browser moderno** (Chrome, Firefox, Safari, Edge)

### Steps

1. **Clone il repo**:
   ```bash
   git clone https://github.com/marco-onapex/The-Memory-Echi-del-Gerofante.git
   cd The-Memory-Echi-del-Gerofante
   ```

2. **Configura Supabase** (vedi [SETUP.md](docs/SETUP.md)):
   ```bash
   cp .env.example .env.local
   # Edita .env.local con le tue credenziali
   ```

3. **Avvia il server locale**:
   ```bash
   npm run serve
   # Oppure: python3 -m http.server 8000
   ```

4. **Apri nel browser**:
   ```
   http://localhost:8000
   ```

5. **Inserisci credenziali Supabase** nel banner config della pagina

## Verifiche Prima di Fare un PR

- [ ] Il codice è testato nel browser
- [ ] Non ci sono errori di console (F12 → Console tab)
- [ ] I filtri di ricerca funzionano correttamente
- [ ] La pagina si carica su Chrome, Firefox, Safari
- [ ] Le credenziali Supabase `.env.local` non sono committate
- [ ] Il commit message è chiaro e segue Conventional Commits

## Domande?

- Apri una **Discussion** nel repo se hai dubbi
- Leggi [docs/API.md](docs/API.md) per capire lo schema database
- Guarda il codice commmentato in `index.html` per capire il flow

Grazie ancora! 🙏
