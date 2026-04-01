#!/bin/bash
# Setup helper per The Memory: Echi del Gerofante

echo "🎭 Benvenuto in L'Orecchio del Gerofante"
echo ""
echo "Setup script - Seguimi per configurare il progetto"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local già exists"
else
    echo "📝 Creando .env.local da template..."
    cp .env.example .env.local
    echo "✅ .env.local creato"
    echo ""
    echo "⚠️  MODIFICA .env.local CON LE TUE CREDENZIALI SUPABASE"
    echo "   VITE_SUPABASE_URL=https://xxxxx.supabase.co"
    echo "   VITE_SUPABASE_ANON_KEY=your_key_here"
    echo ""
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo "✅ npm trovato: $(npm --version)"
else
    echo "⚠️  npm non trovato. Installa Node.js da nodejs.org"
fi

echo ""
echo "✨ Setup completato!"
echo ""
echo "Prossimi step:"
echo "1. Apri .env.local e inserisci credenziali Supabase"
echo "2. Avvia il server locale:"
echo "   npm run serve    (richiede npm)"
echo "   python3 -m http.server 8000   (alternativa)"
echo "3. Apri http://localhost:8000 nel browser"
echo ""
