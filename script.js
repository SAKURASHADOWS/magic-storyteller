// --- Magic Storyteller Main Script v3.1 --- FINAL ---

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready. Starting auth check.');
    const sessionData = JSON.parse(localStorage.getItem('storyteller_session'));
    console.log('Found this in localStorage:', sessionData);

    if (!sessionData || !sessionData.user) {
        console.log('No valid session found. Redirecting to login.html...');
        window.location.href = 'login.html';
        return; 
    }
    
    console.log('User found in session. Initializing app for:', sessionData.user.email);
    initializeApp(sessionData);
});


function initializeApp(session) {
    console.log('initializeApp function has started.');

    // --- Meniu de navigare ---
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const userEmailDisplay = document.getElementById('user-email-display');
    const logoutButton = document.getElementById('logout-button');

    if (loggedInView && loggedOutView && userEmailDisplay && logoutButton) {
        console.log('Updating navigation menu...');
        loggedOutView.style.display = 'none';
        loggedInView.style.display = 'flex';
        userEmailDisplay.textContent = session.user.email;
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('storyteller_session');
            window.location.href = 'login.html';
        });
    } else {
        console.error('Could not find all navigation elements to update.');
    }

    // --- Logica aplicației ---
    const createButton = document.getElementById('create-story-button');
    const heroInput = document.getElementById('hero-input');
    // ================== LINIILE LIPSĂ AU FOST ADĂUGATE AICI ==================
    const placeInput = document.getElementById('place-input');
    const objectInput = document.getElementById('object-input');
    // ========================================================================
    const storyOutputSection = document.getElementById('story-output');
    const imageContainer = document.getElementById('image-container');
    const storyContainer = document.getElementById('story-container');

    if (createButton) {
        createButton.addEventListener('click', async () => {
            const hero = heroInput.value;
            const place = placeInput.value; // Acum 'placeInput' este definit
            const object = objectInput.value; // Acum 'objectInput' este definit

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
                if (!response.ok) { throw new Error('The story factory is having some issues!'); }
                
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
    } else {
        console.error('FATAL: Create Story button not found!');
    }
}