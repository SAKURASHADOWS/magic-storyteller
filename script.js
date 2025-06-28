// --- Magic Storyteller Frontend Logic ---
// File: script.js

document.addEventListener('DOMContentLoaded', () => {
    // Selectăm toate elementele de pe pagină cu care vom interacționa
    const createButton = document.getElementById('create-story-button');
    const heroInput = document.getElementById('hero-input');
    const placeInput = document.getElementById('place-input');
    const objectInput = document.getElementById('object-input');

    const storyOutputSection = document.getElementById('story-output');
    const imageContainer = document.getElementById('image-container');
    const storyContainer = document.getElementById('story-container');

    // Adăugăm logica pentru clicul pe buton
    createButton.addEventListener('click', async () => {
        // 1. Preluăm valorile din câmpurile de text
        const hero = heroInput.value;
        const place = placeInput.value;
        const object = objectInput.value;

        // Validare simplă: ne asigurăm că toate câmpurile sunt completate
        if (!hero || !place || !object) {
            alert('Please fill in all three fields to create a story!');
            return;
        }

        // 2. Afișăm un mesaj de încărcare și dezactivăm butonul
        createButton.disabled = true;
        createButton.textContent = 'Creating magic...';
        storyOutputSection.classList.remove('hidden');
        imageContainer.innerHTML = '<div class="loader"></div>'; // Afișăm un indicator de încărcare
        storyContainer.innerHTML = '';

        try {
            // 3. Trimitem datele către serverul nostru local
            const serverUrl = 'https://magic-storyteller.onrender.com/create-story';
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hero, place, object })
            });

            if (!response.ok) {
                throw new Error('Something went wrong with the story factory!');
            }

            // 4. Primim răspunsul (povestea și imaginea)
            const data = await response.json();

            // 5. Afișăm rezultatele pe pagină
            // Creăm elementul de imagine
            const imageElement = document.createElement('img');
            imageElement.src = data.imageUrl;
            imageElement.alt = `Illustration for a story about a ${hero}`;
            imageContainer.innerHTML = ''; // GOLIM indicatorul de încărcare
            imageContainer.appendChild(imageElement);

            // Creăm elementul de text pentru poveste
            const storyElement = document.createElement('p');
            storyElement.textContent = data.story;
            storyContainer.appendChild(storyElement);

        } catch (error) {
            console.error('Error:', error);
            storyContainer.innerHTML = `<p class="error">Oops! The magic ink spilled. Please try again.</p>`;
        } finally {
            // 6. Reactivăm butonul, indiferent de rezultat
            createButton.disabled = false;
            createButton.textContent = 'Create the Story!';
        }
    });
});
