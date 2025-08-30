const signupForm = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = signupForm.username.value;
    const email = signupForm.email.value;
    const password = signupForm.password.value;

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    
    if (authError) {
        errorMessage.textContent = authError.message;
        return;
    }

    if (authData.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: authData.user.id, username }]);
        
        if (profileError) {
            errorMessage.textContent = profileError.message;
        } else {
            alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
            window.location.href = '/login.html';
        }
    }
});