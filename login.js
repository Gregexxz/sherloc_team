const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        errorMessage.textContent = 'E-mail ou senha inválidos.';
    } else {
        window.location.href = '/dashboard.html';
    }
});