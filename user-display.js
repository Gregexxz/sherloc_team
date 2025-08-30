// js/user-display.js

// Esta função será chamada em todas as páginas que precisam exibir dados do usuário
async function loadUserDataOnPage() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();

        if (profile) {
            // Atualiza o avatar na sidebar (se o elemento existir)
            const sidebarAvatar = document.getElementById('sidebar-avatar');
            if (sidebarAvatar && profile.avatar_url) {
                sidebarAvatar.src = `${profile.avatar_url}?t=${new Date().getTime()}`;
            }

            // Atualiza a mensagem de boas-vindas (se o elemento existir)
            const welcomeMessage = document.getElementById('welcome-message');
            if (welcomeMessage) {
                welcomeMessage.textContent = `Boa tarde, ${profile.username}!`;
            }

            // Atualiza o nome de usuário no perfil (se o elemento existir)
            const profileUsername = document.getElementById('profile-username');
            if (profileUsername) {
                profileUsername.textContent = `Perfil de ${profile.username}`;
            }
        }
    }
}

// Roda a função quando o conteúdo da página estiver carregado
document.addEventListener('DOMContentLoaded', loadUserDataOnPage);