// --- Magic Storyteller Server v2.1 --- Enhanced Story & Image Logic ---
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
  origin: [
      'https://sakurashadows.github.io',
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'https://magic-storyteller.onrender.com'
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- ADVANCED AI STORY & IMAGE FUNCTIONS ---
async function generateAIStory(hero, place, object) {
    console.log(`Generating a longer story for: ${hero}, ${place}, ${object}`);
    const beginnings = [
        `In the heart of the whimsical land of ${place}, where the trees whisper ancient secrets, lived a very special ${hero}.`,
        `No map had ever charted the mysterious realm of ${place}, but that didn't stop a determined ${hero} from venturing within.`,
        `The tale begins not with a grand castle or a fearsome battle, but with a quiet ${hero} living a simple life in the peaceful world of ${place}.`
    ];
    const middles = [
        `One day, while exploring a forgotten corner of the land, our hero stumbled upon a legendary artifact: a ${object}. It pulsed with a soft, magical light, seeming to call out to them.`,
        `Everything changed the moment they found it. A beautiful, strange ${object} was resting on a pedestal of moss. As the ${hero} reached out to touch it, the air itself seemed to hum with energy.`,
        `Their quiet life was turned upside down by the discovery of a single, powerful item: the ${object}. It wasn't what they were looking for, but it was exactly what they needed.`
    ];
    const endings = [
        `Holding the ${object}, the ${hero} knew their life was no longer ordinary. This was the beginning of an adventure greater than they could have ever imagined, a story that would be told in ${place} for generations to come.`,
        `With the ${object} in hand, our hero felt a new sense of purpose. The path ahead was uncertain, but for the first time, they felt ready to walk it, knowing they had the power to shape their own destiny.`,
        `And so, the journey began. The ${hero} and the magical ${object} set off to explore the wonders of ${place}, ready to write the next chapter of their incredible story, together.`
    ];
    const story = `${beginnings[Math.floor(Math.random() * beginnings.length)]} ${middles[Math.floor(Math.random() * middles.length)]} ${endings[Math.floor(Math.random() * endings.length)]}`;
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    return story;
}

async function generateAIImageURL(hero, place, object) {
    console.log(`Generating image for: ${hero}, ${place}, ${object}`);
    const query = encodeURIComponent(`${hero} in ${place} with ${object}, digital painting`);
    return `https://source.unsplash.com/512x512/?${query}`;
}

// --- API Routes (Auth routes are still here) ---
app.post('/register', async (req, res) => { /* ... codul rămâne la fel ... */ });
app.post('/login', async (req, res) => { /* ... codul rămâne la fel ... */ });

// Story creation route now uses the new functions
app.post('/create-story', async (req, res) => {
    try {
        const { hero, place, object } = req.body;
        if (!hero || !place || !object) return res.status(400).json({ error: 'All fields are required.' });
        const [story, imageUrl] = await Promise.all([
            generateAIStory(hero, place, object),
            generateAIImageURL(hero, place, object)
        ]);
        res.json({ story, imageUrl });
    } catch (error) {
        res.status(500).json({ error: "Failed to create the magic story." });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Magic Storyteller v2.1 server is listening on http://localhost:${PORT}`);
});
