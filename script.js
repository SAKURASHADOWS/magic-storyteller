// --- Magic Storyteller Main Script v3.0 --- Final Auth Integration ---

// Această funcție principală rulează doar dacă utilizatorul este logat.
function initializeApp(session) {
    console.log('App initialized for user:', session.user.email);

    // --- Meniu de navigare ---
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const userEmailDisplay = document.getElementById('user-email-display');
    const logoutButton = document.getElementById('logout-button');

    if (loggedInView && loggedOutView && userEmailDisplay && logoutButton) {
        loggedOutView.style.display = 'none';
        loggedInView.style.display = 'flex';
        userEmailDisplay.textContent = session.user.email;
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('storyteller_session');
            window.location.href = 'login.html';
        });
    }

    // --- Logica aplicației ---
    const createButton = document.getElementById('create-story-button');
    const heroInput = document.getElementById('hero-input');
    // ... și restul elementelor ...
    const storyOutputSection = document.getElementById('story-output');
    const imageContainer = document.getElementById('image-container');
    const storyContainer = document.getElementById('story-container');

    createButton.addEventListener('click', async () => {
        // ... (restul logicii de creare a poveștii rămâne la fel) ...
        const hero = heroInput.value;
        const place = placeInput.value;
        const object = objectInput.value;

        if (!hero || !place || !object) {
            alert('Please fill in all three fields!');
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
            if (!response.ok) { throw new Error('Something went wrong!'); }
            
            const data = await response.json();

            const imageElement = document.createElement('img');
            imageElement.src = data.imageUrl;
            imageContainer.innerHTML = ''; 
            imageContainer.appendChild(imageElement);

            const storyElement = document.createElement('p');
            storyElement.textContent = data.story;
            storyContainer.appendChild(storyElement);

        } catch (error) {
            console.error('Error:', error);
            storyContainer.innerHTML = `<p class="error">Oops! Please try again.</p>`;
        } finally {
            createButton.disabled = false;
            createButton.textContent = 'Create the Story!';
        }
    });
}


// --- "Gardianul" de la intrare ---
// Acesta este codul care rulează primul.
document.addEventListener('DOMContentLoaded', () => {
    const sessionData = JSON.parse(localStorage.getItem('storyteller_session'));
    if (!sessionData) {
        // Dacă nu ești logat, te trimite la login
        window.location.href = 'login.html';
    } else {
        // Dacă ești logat, pornește aplicația principală
        initializeApp(sessionData);
    }
});
