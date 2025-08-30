// js/reviews.js

document.addEventListener('DOMContentLoaded', () => {
    // Seleção de todos os elementos do modal de avaliações
    const reviewsModal = document.getElementById('reviews-modal');
    const closeReviewsBtn = document.getElementById('close-reviews-modal-btn');
    const reviewsPoiName = document.getElementById('reviews-poi-name');
    const reviewsListContainer = document.getElementById('reviews-list-container');
    const addReviewForm = document.getElementById('add-review-form');
    const reviewPoiIdField = document.getElementById('review-poi-id');
    const reviewErrorMsg = document.getElementById('review-error-message');
    
    // Função para abrir o modal e iniciar o processo de carregamento
    async function openReviewsModal(poiId, poiName) {
        // Preenche os detalhes do POI no modal
        reviewsPoiName.textContent = `Avaliações de "${poiName}"`;
        reviewPoiIdField.value = poiId;
        addReviewForm.reset(); // Limpa o formulário de avaliações anteriores
        reviewErrorMsg.textContent = '';
        
        // Busca e exibe as avaliações que já existem para este POI
        await loadReviews(poiId);
        
        // Torna o modal visível
        reviewsModal.classList.add('visible');
    }
    
    // Função para buscar as avaliações no Supabase e exibi-las na tela
    async function loadReviews(poiId) {
        reviewsListContainer.innerHTML = '<p>Carregando avaliações...</p>';
        
        // Fazemos um JOIN para buscar o nome de usuário da tabela 'profiles' junto com a avaliação
        const { data: avaliacoes, error } = await supabase
            .from('avaliacoes')
            .select(`
                comentario,
                nota,
                profiles ( username )
            `)
            .eq('poi_id', poiId);

        if (error) {
            console.error('Erro ao carregar avaliações:', error);
            reviewsListContainer.innerHTML = '<p class="error-text">Não foi possível carregar as avaliações.</p>';
            return;
        }

        if (avaliacoes.length === 0) {
            reviewsListContainer.innerHTML = '<p>Este local ainda não tem avaliações. Seja o primeiro!</p>';
            return;
        }

        // Gera o HTML para cada avaliação encontrada
        reviewsListContainer.innerHTML = avaliacoes.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <strong class="review-author">${review.profiles.username}</strong>
                    <span class="review-stars">${'★'.repeat(review.nota)}${'☆'.repeat(5 - review.nota)}</span>
                </div>
                <p>${review.comentario || '<i>Sem comentário.</i>'}</p>
            </div>
        `).join('');
    }

    // Listener para o envio do formulário de nova avaliação
    addReviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            reviewErrorMsg.textContent = 'Você precisa estar logado para avaliar.';
            return;
        }

        const newReview = {
            nota: addReviewForm['review-nota'].value,
            comentario: addReviewForm['review-comentario'].value,
            poi_id: reviewPoiIdField.value,
            user_id: user.id
        };

        const { error } = await supabase.from('avaliacoes').insert([newReview]);
        
        if (error) {
            // A regra UNIQUE no banco de dados vai gerar um erro se o usuário tentar avaliar duas vezes.
            if (error.code === '23505') { // Código de erro para violação de constraint UNIQUE
                reviewErrorMsg.textContent = 'Você já avaliou este local.';
            } else {
                reviewErrorMsg.textContent = `Erro: ${error.message}`;
            }
        } else {
            addReviewForm.reset();
            // Recarrega a lista de reviews para mostrar a nova que acabamos de adicionar
            await loadReviews(newReview.poi_id);
        }
    });

    // Usa "delegação de evento" no corpo do documento para "escutar" cliques nos botões de avaliação
    // Isso funciona mesmo para os botões que são criados dinamicamente no mapa.
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-reviews')) {
            const poiId = event.target.dataset.poiId;
            const poiName = event.target.dataset.poiName;
            openReviewsModal(poiId, poiName);
        }
    });

    // Adiciona o evento para fechar o modal
    closeReviewsBtn.addEventListener('click', () => reviewsModal.classList.remove('visible'));
});