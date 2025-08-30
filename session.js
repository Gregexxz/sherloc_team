const protectedPages = ['/dashboard.html', '/perfil.html', '/configuracoes.html'];
const publicPages = ['/index.html', '/login.html', '/cadastro.html'];
const currentPath = window.location.pathname;

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Se não há sessão e a página é protegida, redireciona para o login
    if (!session && protectedPages.includes(currentPath)) {
        window.location.replace('/login.html');
        return;
    }

    // Se há sessão e a página é pública, redireciona para o dashboard
    if (session && publicPages.includes(currentPath)) {
        window.location.replace('/dashboard.html');
        return;
    }
});