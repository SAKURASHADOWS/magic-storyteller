// --- Magic Storyteller Main Script v2.0 --- Full Auth Integration ---

document.addEventListener('DOMContentLoaded', () => {
    // --- ================== 1. GARDIANUL DE LA INTRARE ================== ---
    // Verificăm dacă există o sesiune salvată
    const sessionData = JSON.parse(localStorage.getItem('storyteller_session'));

    // Dacă NU există, redirecționăm utilizatorul la pagina de login
    if (!sessionData) {
        window.location.href = 'login.html';
        return; // Oprim execuția restului codului
    }
    // --- ==================================================================== ---


    // --- ================== 2. ACTUALIZAREA MENIULUI ================== ---
    // Dacă am ajuns aici, înseamnă că utilizatorul este logat.
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const userEmailDisplay = document.getElementById('user-email-display');
    const logoutButton = document.getElementById('logout-button');

    if (loggedInView && loggedOutView && userEmailDisplay && logoutButton) {
        // Ascundem butoanele Login/Register
        loggedOutView.style.display = 'none';
        // Afișăm email-ul și butonul de Logout
        loggedInView.style.display = 'flex';
        userEmailDisplay.textContent = sessionData.user.email;

        // Adăugăm funcționalitatea de Logout
        logoutButton.addEventListener('click', () => {
            // Ștergem sesiunea din memoria browserului
            localStorage.removeItem('storyteller_session');
            // Redirecționăm la pagina de login
            window.location.href = 'login.html';
        });
    }
    // --- ==================================================================== ---
    

    // --- ================== 3. LOGICA APLICAȚIEI PRINCIPALE ================== ---
    // Restul codului rămâne la fel, gestionând crearea poveștilor.
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
            const serverUrl = 'https://magic-storyteller.onrender.com';
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hero, place, object })
            });
            if (!response.ok) { throw new Error('Something went wrong with the story factory!'); }
            
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
            console.error('Error:', error);
            storyContainer.innerHTML = `<p class="error">Oops! The magic ink spilled. Please try again.</p>`;
        } finally {
            createButton.disabled = false;
            createButton.textContent = 'Create the Story!';
        }
    });
    // --- ======================================================================= ---
});