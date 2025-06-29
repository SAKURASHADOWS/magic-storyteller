// --- Magic Storyteller Server v3.0 --- FINAL & COMPLETE ---
// File: server.js

require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// --- Supabase Connection ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 3002; //

// --- CORS Configuration ---
const corsOptions = {
  origin: [
      'http://127.0.0.1:5500',
      'http://localhost:5500', // 
      'https://magic-storyteller.onrender.com',
      'https://sakurashadows.github.io' // 
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());


// --- ======================= API ROUTES ======================= ---

// --- Authentication Routes ---
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ user: data.user });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: "Invalid login credentials" });
    res.status(200).json({ user: data.user, session: data.session });
});


// --- Story Creation Route ---
app.post('/create-story', async (req, res) => {
    try {
        const { hero, place, object } = req.body;
        if (!hero || !place || !object) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        
        const story = `In the whimsical land of ${place}, a brave ${hero} found a ${object} that shimmered with untold power. This was the beginning of an epic journey.`;
        const query = encodeURIComponent(`${hero}, ${place}, fantasy art`);
        const imageUrl = `https://source.unsplash.com/512x512/?${query}`;
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        res.json({ story, imageUrl });

    } catch (error) {
        console.error("Error creating story:", error);
        res.status(500).json({ error: "Failed to create the magic story." });
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Magic Storyteller FULL server is listening on http://localhost:${PORT}`);
});