// js/configuracoes.js

document.addEventListener('DOMContentLoaded', loadSettingsData);

// Seleção de elementos do formulário e do avatar
const settingsForm = document.getElementById('settings-form');
const usernameInput = document.getElementById('username-input');
const bioInput = document.getElementById('bio-input');
const errorMessage = document.getElementById('error-message');
const avatarPreview = document.getElementById('avatar-preview');
const uploadAvatarBtn = document.getElementById('upload-avatar-btn');
const avatarInput = document.getElementById('avatar-input');

let currentUser = null;
let newAvatarFile = null; // Para guardar o arquivo de imagem selecionado

// 1. Função para carregar os dados existentes
async function loadSettingsData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        currentUser = user;
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('username, bio, avatar_url')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Erro ao carregar perfil:', error);
            errorMessage.textContent = 'Não foi possível carregar seus dados.';
            return;
        }

        if (profile) {
            usernameInput.value = profile.username || '';
            bioInput.value = profile.bio || '';
            // Adiciona um timestamp para evitar que o navegador use uma imagem antiga do cache
            if (profile.avatar_url) {
                avatarPreview.src = `${profile.avatar_url}?t=${new Date().getTime()}`;
            }
        }
    }
}

// 2. Lógica de upload do avatar
uploadAvatarBtn.addEventListener('click', () => {
    avatarInput.click(); // Aciona o clique no input de arquivo escondido
});

avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (file) {
        // Mostra a pré-visualização da imagem
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
        newAvatarFile = file; // Guarda o arquivo para o upload
    }
});


// 3. Listener para o envio do formulário (salvar tudo)
settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const submitButton = settingsForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Salvando...';
    errorMessage.textContent = '';

    // Parte A: Upload do novo avatar (se houver)
    let avatarUrl = null;
    if (newAvatarFile) {
        const fileExt = newAvatarFile.name.split('.').pop();
        const filePath = `${currentUser.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, newAvatarFile, { upsert: true });

        if (uploadError) {
            errorMessage.textContent = `Erro no upload da imagem: ${uploadError.message}`;
            submitButton.disabled = false;
            submitButton.textContent = 'Salvar Alterações';
            return;
        }
        
        // Pega a URL pública da imagem recém-enviada
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
    }

    // Parte B: Update dos dados de texto e da nova URL do avatar
    const updatedProfile = {
        username: usernameInput.value,
        bio: bioInput.value,
        updated_at: new Date()
    };
    
    // Adiciona a URL do avatar ao objeto de update APENAS se um novo avatar foi enviado
    if (avatarUrl) {
        updatedProfile.avatar_url = avatarUrl;
    }

    const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', currentUser.id);

    if (error) {
        errorMessage.textContent = `Erro ao salvar perfil: ${error.message}`;
    } else {
        alert('Perfil atualizado com sucesso!');
        // Se um novo avatar foi enviado, atualiza a preview com a URL final e o timestamp
        if(avatarUrl) {
            avatarPreview.src = `${avatarUrl}?t=${new Date().getTime()}`;
        }
    }

    submitButton.disabled = false;
    submitButton.textContent = 'Salvar Alterações';
});