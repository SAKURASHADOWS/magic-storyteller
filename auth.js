// --- Magic Storyteller Auth Logic v1.1 ---

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const messageContainer = document.getElementById('message-container');

    // --- LOGIC FOR THE REGISTRATION FORM ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            messageContainer.textContent = '';
            messageContainer.className = 'message';
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;

            if (password.length < 6) {
                messageContainer.textContent = 'Error: Password must be at least 6 characters long.';
                messageContainer.className = 'message error';
                return;
            }

            const serverUrl = 'https://magic-storyteller.onrender.com';

            try {
                const response = await fetch(serverUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (!response.ok) { throw new Error(data.error); }

                messageContainer.textContent = 'Account created successfully! You can now log in.';
                messageContainer.className = 'message success';
                registerForm.reset();
            } catch (error) {
                messageContainer.textContent = `Error: ${error.message}`;
                messageContainer.className = 'message error';
            }
        });
    }

    // --- LOGIC FOR THE LOGIN FORM ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            messageContainer.textContent = '';
            messageContainer.className = 'message';
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;

            const serverUrl = 'http://localhost:3002/login';

            try {
                const response = await fetch(serverUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (!response.ok) { throw new Error(data.error); }
                
                // --- MODIFICAREA CHEIE ESTE AICI ---
                // Salvăm sesiunea sub un nume unic pentru acest proiect
                localStorage.setItem('storyteller_session', JSON.stringify(data));
                // --- =============================== ---

                messageContainer.textContent = 'Login successful! Redirecting...';
                messageContainer.className = 'message success';
                
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect to the main app
                }, 2000);
            } catch (error) {
                messageContainer.textContent = `Error: ${error.message}`;
                messageContainer.className = 'message error';
            }
        });
    }
});