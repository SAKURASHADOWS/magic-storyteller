// --- Magic Storyteller Server v2.1 --- Save Story Functionality ---
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
const PORT = 3002;

// --- CORS Configuration ---
const corsOptions = {
  origin: ['https://sakurashadows.github.io', 'http://127.0.0.1:5500', 'http://localhost:5500'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Helper AI Functions ---
async function generateAIStory(hero, place, object) { /* ... (logica ramane la fel) ... */ }
async function generateAIImageURL(hero, place, object) { /* ... (logica ramane la fel) ... */ }

// --- API Routes ---
app.post('/create-story', async (req, res) => { /* ... (ruta ramane la fel) ... */ });
app.post('/register', async (req, res) => { /* ... (ruta ramane la fel) ... */ });
app.post('/login', async (req, res) => { /* ... (ruta ramane la fel) ... */ });


// --- ================== NEW SAVE STORY ROUTE ================== ---
app.post('/save-story', async (req, res) => {
    // 1. Get the JWT access token from the request header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
    const token = authHeader.split(' ')[1];

    // 2. Verify the token with Supabase to get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    console.log(`Request to save story from user: ${user.email}`);

    // 3. Get the story details from the request body
    const { hero, place, object, story_text, image_url } = req.body;
    if (!story_text || !image_url) {
        return res.status(400).json({ error: 'Story content and image are required.' });
    }

    // 4. Insert the new story into the 'stories' table
    const { data, error: insertError } = await supabase
        .from('stories')
        .insert([
            { 
                user_id: user.id, // Link the story to the authenticated user
                hero,
                place,
                object,
                story_text,
                image_url
            }
        ]);
    
    if (insertError) {
        console.error('Supabase insert error:', insertError.message);
        return res.status(500).json({ error: 'Could not save the story.' });
    }

    // 5. Send a success response
    res.status(200).json({ message: 'Story saved successfully!', data: data });
});
// --- ========================================================== ---


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Magic Storyteller server (v2.1) is listening on http://localhost:${PORT}`);
});
