#!/usr/bin/env node

/**
 * Build script - Genera src/config.js da .env.local
 * Uso: npm run build:config
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const configFile = path.join(__dirname, 'src', 'config.js');

const config = {
  supabase: {
    url: process.env.VITE_SUPABASE_URL || '',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || ''
  },
  app: {
    name: 'L\'Orecchio del Gerofante',
    version: '1.0.0',
    resultsPerPage: 25
  }
};

// Valida config
if (!config.supabase.url || !config.supabase.anonKey) {
  console.error('❌ Errore: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY mancano in .env.local');
  process.exit(1);
}

// Genera il file
const content = `/**
 * Generated configuration
 * Auto-generated from .env.local
 * DO NOT EDIT MANUALLY
 */

export default ${JSON.stringify(config, null, 2)};
`;

fs.writeFileSync(configFile, content, 'utf-8');
console.log('✅ src/config.js generato con successo');
