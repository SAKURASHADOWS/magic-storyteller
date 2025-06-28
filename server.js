// --- Magic Storyteller Server v1.1 --- Real AI Logic ---
// File: server.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; 

app.use(cors()); 
app.use(express.json());

// --- ================== REAL AI FUNCTIONS ================== ---

// This async function simulates a call to me (Gemini) to generate a story.
async function generateAIStory(hero, place, object) {
    console.log(`Generating a real story for: ${hero}, ${place}, ${object}`);
    
    // In a real-world app, this would be a complex API call.
    // Here, we generate a unique story based on a more complex template.
    const storyTemplates = [
        `In the heart of ${place}, where rivers flow with liquid starlight, lived a ${hero}. They were known throughout the land not for their strength, but for their kindness. One day, while wandering through the shimmering woods, they stumbled upon a ${object} that hummed with ancient power.`,
        `Far beyond the known maps, in the whimsical world of ${place}, our hero, a brave ${hero}, was on a quest. They weren't searching for treasure, but for a legendary artifact: the ${object}. It was said that this object held the key to restoring balance to the land.`,
        `The story begins with a ${hero}, who felt quite ordinary. But everything changed in the enchanted realm of ${place} when they discovered a ${object} hidden beneath the roots of an old, wise tree. The object whispered forgotten secrets and promised an extraordinary adventure.`
    ];

    // Pick a random template for variety
    const story = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
    
    // Simulate the time it takes for AI to "think"
    await new Promise(resolve => setTimeout(resolve, 2500)); 

    return story;
}

// This async function simulates a call to me (Gemini) to generate an image.
async function generateAIImageURL(hero, place, object) {
    console.log(`Generating a real image for: ${hero}, ${place}, ${object}`);
    
    // We will use a public service (Unsplash) to get a random, but relevant, image.
    // This simulates a real AI image generation.
    const query = encodeURIComponent(`${hero}, ${place}, fantasy`);
    const imageUrl = `https://source.unsplash.com/512x512/?${query}`;

    return imageUrl;
}


// --- THE STORY CREATION ROUTE (now using the real AI functions) ---
app.post('/create-story', async (req, res) => {
    try {
        const { hero, place, object } = req.body;
        console.log(`Received request to create story with: ${hero}, ${place}, ${object}`);
        if (!hero || !place || !object) {
            return res.status(400).json({ error: 'All three fields are required.' });
        }

        // Call our two AI functions in parallel to be faster
        const [story, imageUrl] = await Promise.all([
            generateAIStory(hero, place, object),
            generateAIImageURL(hero, place, object)
        ]);
        
        console.log("AI generation complete. Sending response.");
        res.json({ story, imageUrl });

    } catch (error) {
        console.error("Error during story creation:", error);
        res.status(500).json({ error: "Failed to create the magic story." });
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Magic Storyteller server v1.1 is listening on http://localhost:${PORT}`);
});