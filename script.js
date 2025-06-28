// --- Magic Storyteller Main Script v2.1 --- Save Story Logic ---

document.addEventListener('DOMContentLoaded', () => {
    // --- "Bodyguard" check ---
    const sessionData = JSON.parse(localStorage.getItem('storyteller_session'));
    if (!sessionData) {
        window.location.href = 'login.html';
        return; 
    }

    // --- ================== NEW: Variable to store the current story ================== ---
    let currentStoryData = null;
    // --- ============================================================================= ---

    // --- UI Update for logged-in user ---
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const userEmailDisplay = document.getElementById('user-email-display');
    const logoutButton = document.getElementById('logout-button');
    const saveStoryButton = document.getElementById('save-story-button'); // Get the save button

    if (loggedInView && loggedOutView && userEmailDisplay && logoutButton) {
        loggedOutView.style.display = 'none';
        loggedInView.style.display = 'flex';
        userEmailDisplay.textContent = sessionData.user.email;
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('storyteller_session');
            window.location.href = 'login.html';
        });
    }
    
    // --- Main App Logic ---
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
        saveStoryButton.classList.remove('visible'); // Hide save button during generation
        storyOutputSection.classList.remove('hidden');
        imageContainer.innerHTML = '<div class="loader"></div>';
        storyContainer.innerHTML = '';

        try {
            const serverUrl = 'http://localhost:3002/create-story';
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hero, place, object })
            });
            if (!response.ok) { throw new Error('Something went wrong with the story factory!'); }
            
            const data = await response.json();

            // --- ================== NEW: Save the story data temporarily ================== ---
            currentStoryData = {
                hero,
                place,
                object,
                story_text: data.story,
                image_url: data.imageUrl
            };
            // --- ========================================================================= ---

            const imageElement = document.createElement('img');
            imageElement.src = data.imageUrl;
            imageContainer.innerHTML = ''; 
            imageContainer.appendChild(imageElement);

            const storyElement = document.createElement('p');
            storyElement.textContent = data.story;
            storyContainer.appendChild(storyElement);
            
            saveStoryButton.classList.add('visible'); // Make the save button visible

        } catch (error) {
            console.error('Error:', error);
            storyContainer.innerHTML = `<p class="error">Oops! The magic ink spilled. Please try again.</p>`;
        } finally {
            createButton.disabled = false;
            createButton.textContent = 'Create the Story!';
        }
    });

    // --- ================== NEW: Logic for the Save Story Button ================== ---
    saveStoryButton.addEventListener('click', async () => {
        if (!currentStoryData) {
            alert('No story to save!');
            return;
        }

        // Get the auth token from local storage
        const token = sessionData.session.access_token;

        try {
            const serverUrl = 'http://localhost:3002/save-story';
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Send the token for authentication
                },
                body: JSON.stringify(currentStoryData)
            });

            if (!response.ok) {
                throw new Error('Could not save the story.');
            }

            // Provide feedback to the user
            saveStoryButton.textContent = '❤️ Story Saved!';
            saveStoryButton.disabled = true;
            setTimeout(() => {
                saveStoryButton.textContent = '❤️ Save Story';
                saveStoryButton.disabled = false;
            }, 2000);

        } catch (error) {
            console.error('Save story error:', error);
            alert(`Error saving story: ${error.message}`);
        }
    });
    // --- ========================================================================= ---
});
