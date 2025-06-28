// --- Magic Storyteller Server v2.0 --- User Accounts & Supabase ---
// File: server.js

// Importăm uneltele necesare
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// --- Conectarea la noua bază de date Supabase ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 3002; // Folosim un port nou, 3002, pentru a nu intra în conflict cu LocalPulse

// Configurarea CORS - vom adăuga adresele site-ului mai târziu
app.use(cors()); 
app.use(express.json());

// --- Rutele pentru Autentificare ---

// Ruta pentru înregistrarea unui utilizator nou
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ user: data.user });
});

// Ruta pentru autentificarea unui utilizator existent
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: "Invalid login credentials" });
    res.status(200).json({ user: data.user, session: data.session });
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Magic Storyteller server (v2.0) is listening on http://localhost:${PORT}`);
});