// js/dashboard.js (Versão com Filtros e Ações de Editar/Deletar)

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData(); // Carrega os dados iniciais
    
    // Adiciona os listeners para os novos campos de filtro
    document.getElementById('search-input').addEventListener('keyup', handleFilterChange);
    document.getElementById('category-filter').addEventListener('change', handleFilterChange);
});

const poisContainer = document.getElementById('pois-list-container');
let currentUser = null;

// Função principal que carrega os dados do dashboard
async function loadDashboardData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        currentUser = user;
        // Carrega a lista de POIs do usuário com base nos filtros (que estarão vazios no início)
        loadPois();
    }
}

// Função para buscar e exibir os POIs, agora com base nos filtros
async function loadPois() {
    if (!currentUser) return;

    // Pega os valores atuais dos filtros
    const searchTerm = document.getElementById('search-input').value;
    const category = document.getElementById('category-filter').value;

    // Começa a construir a query no Supabase
    let query = supabase
        .from('pois')
        .select('*')
        .eq('user_id', currentUser.id); // Continua mostrando apenas os POIs do usuário na lista

    // Adiciona o filtro de busca por nome, se houver
    if (searchTerm) {
        query = query.ilike('nome', `%${searchTerm}%`); // 'ilike' é case-insensitive
    }

    // Adiciona o filtro de categoria, se houver
    if (category) {
        query = query.eq('categoria', category);
    }

    // Ordena o resultado final
    query = query.order('created_at', { ascending: false });

    // Executa a query construída
    const { data: pois, error } = await query;

    if (error) {
        console.error('Erro ao buscar POIs:', error);
        poisContainer.innerHTML = '<p class="error-text">Não foi possível carregar os locais.</p>';
        return;
    }

    if (pois.length === 0) {
        poisContainer.innerHTML = '<p>Nenhum local encontrado com os filtros selecionados.</p>';
        return;
    }

    // Gera o HTML para cada POI
    poisContainer.innerHTML = pois.map(poi => `
        <div class="poi-card" id="poi-${poi.id}">
            <h3>${poi.nome}</h3>
            <span>${poi.categoria.toUpperCase()}</span>
            <p>${poi.descricao || 'Sem descrição.'}</p>
            <div class="poi-actions">
                <button class="btn btn-secondary btn-edit" data-id="${poi.id}">Editar</button>
                <button class="btn btn-danger btn-delete" data-id="${poi.id}">Deletar</button>
            </div>
        </div>
    `).join('');
}

// Função que é chamada toda vez que um filtro muda
function handleFilterChange() {
    loadPois();
}


// LÓGICA COMPLETA DE DELEÇÃO E EDIÇÃO
poisContainer.addEventListener('click', async (event) => {
    
    // --- AÇÃO DE DELETAR ---
    if (event.target.classList.contains('btn-delete')) {
        const poiId = event.target.dataset.id;
        
        const isConfirmed = confirm('Tem certeza que deseja deletar este local? Esta ação não pode ser desfeita.');
        
        if (isConfirmed) {
            const { error } = await supabase
                .from('pois')
                .delete()
                .eq('id', poiId);

            if (error) {
                console.error('Erro ao deletar POI:', error);
                alert('Não foi possível deletar o local.');
            } else {
                document.getElementById(`poi-${poiId}`).remove();
                alert('Local deletado com sucesso!');
            }
        }
    }

    // --- AÇÃO DE EDITAR ---
    if (event.target.classList.contains('btn-edit')) {
        const poiId = event.target.dataset.id;
        
        const { data: poi, error } = await supabase
            .from('pois')
            .select('*')
            .eq('id', poiId)
            .single();

        if (error) {
            console.error('Erro ao buscar dados para edição:', error);
            alert('Não foi possível carregar os dados do local.');
            return;
        }

        document.getElementById('poi-id').value = poi.id;
        document.getElementById('poi-nome').value = poi.nome;
        document.getElementById('poi-descricao').value = poi.descricao;
        document.getElementById('poi-categoria').value = poi.categoria;
        document.getElementById('poi-latitude').value = poi.latitude;
        document.getElementById('poi-longitude').value = poi.longitude;
        
        document.getElementById('add-poi-modal').classList.add('visible');
    }
});