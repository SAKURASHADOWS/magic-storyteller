// --- Magic Storyteller Auth Logic v2.0 --- FINAL ---

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const messageContainer = document.getElementById('message-container');

    // --- CONFIGURARE SERVER ---
    // Folosim adresa locală pentru testare. O vom schimba la lansare.
    const baseServerUrl = 'http://localhost:3002'; 
    // const baseServerUrl = 'https://magic-storyteller.onrender.com'; // Adresa pentru site-ul public
    // --------------------------

    // --- LOGIC FOR THE REGISTRATION FORM ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            messageContainer.textContent = '';
            messageContainer.className = '';
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;

            if (password.length < 6) {
                messageContainer.textContent = 'Error: Password must be at least 6 characters long.';
                messageContainer.className = 'message error';
                return;
            }

            const registerUrl = `${baseServerUrl}/register`; // Construim adresa completă

            try {
                const response = await fetch(registerUrl, {
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
            messageContainer.className = '';
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;
            
            const loginUrl = `${baseServerUrl}/login`; // Construim adresa completă

            try {
                const response = await fetch(loginUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (!response.ok) { throw new Error(data.error); }
                
                localStorage.setItem('storyteller_session', JSON.stringify(data));

                messageContainer.textContent = 'Login successful! Redirecting...';
                messageContainer.className = 'message success';
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } catch (error) {
                messageContainer.textContent = `Error: ${error.message}`;
                messageContainer.className = 'message error';
            }
        });
    }
});
