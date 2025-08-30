// js/theme-modal.js
document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('theme-modal-overlay');
    const themeOptions = document.querySelectorAll('.theme-option-card');
    const saveBtn = document.getElementById('save-theme-btn');
    const rememberCheckbox = document.getElementById('remember-theme-choice');

    // 1. Verifica se um tema já foi salvo. Se não, mostra o modal.
    if (!localStorage.getItem('sherloc-theme')) {
        modalOverlay.classList.add('visible');
    }

    // 2. Lógica para selecionar um tema
    themeOptions.forEach(card => {
        card.addEventListener('click', () => {
            // Remove a classe 'active' de todos os cards
            themeOptions.forEach(c => c.classList.remove('active'));
            // Adiciona a classe 'active' apenas no card clicado
            card.classList.add('active');
        });
    });

    // 3. Lógica para salvar a escolha e fechar o modal
    saveBtn.addEventListener('click', () => {
        const selectedThemeCard = document.querySelector('.theme-option-card.active');
        const selectedTheme = selectedThemeCard.dataset.theme;

        // Aplica o tema
        if (selectedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Salva a preferência se a caixa estiver marcada
        if (rememberCheckbox.checked) {
            localStorage.setItem('sherloc-theme', selectedTheme);
        }

        // Esconde o modal
        modalOverlay.classList.remove('visible');
    });
});