// js/dashboard-map.js (Versão com Mapa Público e Botão de Avaliações)

document.addEventListener('DOMContentLoaded', () => {
    const mapModal = document.getElementById('map-modal');
    const showMapBtn = document.getElementById('show-map-btn');
    const closeMapBtn = document.getElementById('close-map-modal-btn');

    let map;
    let mapInitialized = false;

    async function loadPoisOnMap(mapInstance) {
        // Busca os POIs de TODOS os usuários
        const { data: pois, error } = await supabase
            .from('pois')
            .select('id, nome, descricao, latitude, longitude'); // Adicionado 'id' para o botão

        if (error) {
            console.error('Erro ao carregar os POIs:', error);
            return;
        }

        // --- BLOCO ATUALIZADO ---
        pois.forEach(poi => {
            // Cria o conteúdo HTML para o popup, já com o novo botão
            const popupContent = `
                <b>${poi.nome}</b><br>
                ${poi.descricao || 'Sem descrição.'}
                <br><br>
                <button class="btn btn-primary btn-sm btn-reviews" data-poi-id="${poi.id}" data-poi-name="${poi.nome}">
                    Avaliações
                </button>
            `;

            // Adiciona o marcador e o popup ao mapa
            L.marker([poi.latitude, poi.longitude])
             .addTo(mapInstance)
             .bindPopup(popupContent);
        });
        // --- FIM DO BLOCO ATUALIZADO ---
    }

    function initializeMap() {
        if (mapInitialized) {
            setTimeout(() => map.invalidateSize(), 10);
            return;
        }
        
        map = L.map('map').setView([-20.7208, -47.8899], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        loadPoisOnMap(map);
        mapInitialized = true;
    }

    showMapBtn.addEventListener('click', () => {
        mapModal.classList.add('visible');
        initializeMap();
    });

    closeMapBtn.addEventListener('click', () => {
        mapModal.classList.remove('visible');
    });
});