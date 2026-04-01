@echo off
REM Setup helper per The Memory: Echi del Gerofante (Windows)

echo 🎭 Benvenuto in L'Orecchio del Gerofante
echo.
echo Setup script - Seguimi per configurare il progetto
echo.

REM Check if .env.local exists
if exist ".env.local" (
    echo ✅ .env.local gia esiste
) else (
    echo 📝 Creando .env.local da template...
    copy .env.example .env.local >nul
    echo ✅ .env.local creato
    echo.
    echo ⚠️  MODIFICA .env.local CON LE TUE CREDENZIALI SUPABASE
    echo    VITE_SUPABASE_URL=https://xxxxx.supabase.co
    echo    VITE_SUPABASE_ANON_KEY=your_key_here
    echo.
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ npm trovato: 
    npm --version
) else (
    echo ⚠️  npm non trovato. Installa Node.js da nodejs.org
)

echo.
echo ✨ Setup completato!
echo.
echo Prossimi step:
echo 1. Apri .env.local e inserisci credenziali Supabase
echo 2. Avvia il server locale:
echo    npm run serve
echo 3. Apri http://localhost:8000 nel browser
echo.
pause
