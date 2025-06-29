// --- Magic Storyteller Frontend Logic v2.0 ---
document.addEventListener('DOMContentLoaded', () => {
    const createButton = document.getElementById('create-story-button');
    const heroInput = document.getElementById('hero-input');
    const placeInput = document.getElementById('place-input');
    const objectInput = document.getElementById('object-input');
    const storyOutputSection = document.getElementById('story-output');
    const imageContainer = document.getElementById('image-container');
    const storyContainer = document.getElementById('story-container');

    createButton.addEventListener('click', async () => {
        const hero = heroInput.value;
        const place = placeInput.value;
        const object = objectInput.value;

        if (!hero || !place || !object) {
            alert('Please fill in all three fields to create a story!');
            return;
        }

        createButton.disabled = true;
        createButton.textContent = 'Creating magic...';
        storyOutputSection.classList.remove('hidden');
        imageContainer.innerHTML = '<div class="loader"></div>';
        storyContainer.innerHTML = '';

        try {
            const serverUrl = 'https://magic-storyteller.onrender.com/create-story';
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hero, place, object })
            });

            if (!response.ok) {
                throw new Error('The story factory is having some issues!');
            }

            const data = await response.json();

            const imageElement = document.createElement('img');
            imageElement.src = data.imageUrl;
            imageElement.alt = `Illustration for a story about a ${hero}`;
            imageContainer.innerHTML = ''; 
            imageContainer.appendChild(imageElement);

            const storyElement = document.createElement('p');
            storyElement.textContent = data.story;
            storyContainer.appendChild(storyElement);

        } catch (error) {
            console.error('A detailed error occurred:', error);
            storyContainer.innerHTML = `<p class="error">Oops! The magic ink spilled. Please try again.</p>`;
        } finally {
            createButton.disabled = false;
            createButton.textContent = 'Create the Story!';
        }
    });
});
