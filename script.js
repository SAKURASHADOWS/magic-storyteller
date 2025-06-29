// --- script.js v3.1 --- DEBUGGING VERSION ---

console.log('Script loaded. Waiting for DOM to be ready.');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready. Starting main logic.');

    // --- "The Bodyguard" Logic ---
    const sessionDataString = localStorage.getItem('storyteller_session');
    console.log('Found this in localStorage:', sessionDataString);

    if (!sessionDataString) {
        console.log('No session found. Redirecting to login.html...');
        window.location.href = 'login.html';
        return; 
    }

    try {
        const sessionData = JSON.parse(sessionDataString);
        console.log('Session data parsed successfully:', sessionData);

        if (sessionData && sessionData.user) {
            console.log('User found in session. Initializing app for:', sessionData.user.email);
            initializeApp(sessionData);
        } else {
            console.error('ERROR: Session data is invalid or missing user info. Cleaning up and redirecting.');
            localStorage.removeItem('storyteller_session');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('FATAL ERROR: Could not parse session data from localStorage. It is not valid JSON.', error);
        localStorage.removeItem('storyteller_session');
        window.location.href = 'login.html';
    }
});


function initializeApp(session) {
    console.log('initializeApp function has started.');

    // --- UI Update Logic ---
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
            console.log('Logout button clicked.');
            localStorage.removeItem('storyteller_session');
            window.location.href = 'login.html';
        });
    } else {
        console.error('Could not find all navigation elements to update.');
    }

    // --- Main App Logic ---
    const createButton = document.getElementById('create-story-button');
    if (createButton) {
        console.log('Create Story button found. Adding event listener.');
        createButton.addEventListener('click', async () => {
            // ... (restul logicii de creare a poveștii) ...
            console.log('Create Story button clicked!');
        });
    } else {
        console.error('FATAL: Create Story button not found!');
    }
}