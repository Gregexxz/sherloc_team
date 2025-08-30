// js/add-poi.js (Versão atualizada para Adicionar E Editar)

const modal = document.getElementById('add-poi-modal');
const addPoiBtn = document.getElementById('add-poi-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const addPoiForm = document.getElementById('add-poi-form');
const errorMessage = document.getElementById('poi-error-message');
const poiIdField = document.getElementById('poi-id'); // Referência para o campo escondido

// Quando o botão "Adicionar Novo Local" é clicado, garantimos que o formulário está limpo
addPoiBtn.addEventListener('click', () => {
    addPoiForm.reset(); // Limpa todos os campos
    poiIdField.value = ''; // Limpa o ID, entrando no "modo de criação"
    modal.classList.add('visible');
});

closeModalBtn.addEventListener('click', () => modal.classList.remove('visible'));

addPoiForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        errorMessage.textContent = 'Você precisa estar logado para salvar um local.';
        return;
    }
    
    // Monta o objeto com os dados do formulário
    const poiData = {
        nome: addPoiForm['poi-nome'].value,
        descricao: addPoiForm['poi-descricao'].value,
        categoria: addPoiForm['poi-categoria'].value,
        latitude: parseFloat(addPoiForm['poi-latitude'].value),
        longitude: parseFloat(addPoiForm['poi-longitude'].value),
        user_id: user.id
    };
    
    const currentPoiId = poiIdField.value;
    let error;

    // A MÁGICA ACONTECE AQUI:
    if (currentPoiId) {
        // MODO EDIÇÃO: Se temos um ID, fazemos um UPDATE
        const { error: updateError } = await supabase
            .from('pois')
            .update(poiData)
            .eq('id', currentPoiId);
        error = updateError;
    } else {
        // MODO CRIAÇÃO: Se não temos um ID, fazemos um INSERT
        const { error: insertError } = await supabase
            .from('pois')
            .insert([poiData]);
        error = insertError;
    }

    // Lógica final é a mesma para ambos os casos
    if (error) {
        errorMessage.textContent = `Erro: ${error.message}`;
    } else {
        alert(`Local ${currentPoiId ? 'atualizado' : 'adicionado'} com sucesso!`);
        addPoiForm.reset();
        poiIdField.value = '';
        modal.classList.remove('visible');
        location.reload(); // Recarrega a página para ver as mudanças
    }
});