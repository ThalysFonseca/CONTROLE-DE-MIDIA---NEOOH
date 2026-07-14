// Configurações da OnSign TV
const PLAYER_ID = '305362'; 
const API_TOKEN = 'LQyCHOQvXRRyE4o7fy4oyK4CJzqgb5fE3nig8a1T'; 

const button = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');

let isDelenActive = false;

button.addEventListener('click', async () => {
    button.disabled = true;
    isDelenActive = !isDelenActive;
    
    const triggerName = isDelenActive ? 'ativar_delen' : 'ativar_atmosphera';
    updateUI(isDelenActive);

    // Usando o CORS Anywhere como ponte para evitar o bloqueio do navegador
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = `https://api.onsign.tv/v1/players/${PLAYER_ID}/triggers/${triggerName}`;

    try {
        const response = await fetch(proxyUrl + targetUrl, {
            method: 'POST',
            headers: {
                'X-OnSignTV-API-Token': API_TOKEN,
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest' // Necessário para o proxy aceitar
            }
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }
        console.log(`Gatilho ${triggerName} enviado com sucesso.`);
    } catch (error) {
        console.error('Falha ao mudar mídia:', error);
        alert('Erro ao conectar com o player. Verifique sua conexão.');
        isDelenActive = !isDelenActive;
        updateUI(isDelenActive);
    } finally {
        button.disabled = false;
    }
});

function updateUI(active) {
    if (active) {
        button.className = 'btn-control delen';
        button.innerText = 'Mídia Delen Ativa';
        statusText.innerText = 'Toque para voltar ao Atmosphera';
    } else {
        button.className = 'btn-control atmosphera';
        button.innerText = 'Playlist Atmosphera';
        statusText.innerText = 'Toque para alternar para o Delen';
    }
}
