// js/auth.js (Versão Final e Corrigida para o Design de Abas)

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const tabSignin = document.getElementById('tab-signin');
    const tabSignup = document.getElementById('tab-signup');
    const usernameGroup = document.getElementById('username-group');
    const authForm = document.getElementById('auth-form');
    const submitButton = document.getElementById('submit-button');

    // --- ANIMAÇÃO DE ENTRADA DA PÁGINA ---
    // Garante que a biblioteca GSAP foi carregada
    if (window.gsap) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }});
        tl.from('.auth-visual-section', { x: 100, opacity: 0, duration: 1 })
          .from('.auth-form-section', { x: -100, opacity: 0, duration: 1 }, "<")
          .to('.auth-form-header, .auth-tabs, #auth-form, .auth-divider, .social-login', {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1
          }, "-=0.5");
    }

    // --- LÓGICA DE TROCA DE ABAS COM ANIMAÇÃO ---
    function showSigninForm() {
        tabSignin.classList.add('active');
        tabSignup.classList.remove('active');
        submitButton.textContent = 'Continuar';

        // Animação para esconder o campo de usuário
        gsap.to(usernameGroup, {
            duration: 0.4,
            maxHeight: 0,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginBottom: 0,
            onComplete: () => usernameGroup.classList.add('hidden')
        });
    }

    function showSignupForm() {
        tabSignin.classList.remove('active');
        tabSignup.classList.add('active');
        submitButton.textContent = 'Criar Conta';
        usernameGroup.classList.remove('hidden');

        // Animação para mostrar o campo de usuário
        gsap.fromTo(usernameGroup,
            { maxHeight: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0 },
            { duration: 0.4, maxHeight: '100px', opacity: 1, paddingTop: 0, paddingBottom: 0, marginBottom: '1.5rem' }
        );
    }

    // Estado inicial e listeners
    showSigninForm();
    tabSignin.addEventListener('click', showSigninForm);
    tabSignup.addEventListener('click', showSignupForm);

    // --- LÓGICA DE SUBMISSÃO DO FORMULÁRIO ---
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = authForm.email.value;
        const password = authForm.password.value;
        
        if (tabSignup.classList.contains('active')) {
            // AÇÃO DE CADASTRO (Simplificada para usar o Trigger)
            const username = authForm.username.value;
            
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username // O trigger no Supabase vai usar este dado
                    }
                }
            });
            if (error) return alert(error.message);
            
            alert('Cadastro realizado! Se a confirmação de e-mail estiver ativa, verifique sua caixa de entrada. Caso contrário, você já pode fazer login.');
            showSigninForm();

        } else {
            // AÇÃO DE LOGIN
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                alert(error.message);
            } else {
                window.location.href = '/dashboard.html';
            }
        }
    });
});