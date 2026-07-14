// Configurações da OnSign TV
    const PLAYER_ID = '305362'; 
    const API_TOKEN = 'LQyCHOQvXRRyE4o7fy4oyK4CJzqgb5fE3nig8a1T'; // Cuidado ao expor isso publicamente

    const button = document.getElementById('toggleBtn');
    const statusText = document.getElementById('status');
    
    // Define o estado inicial (false = Atmosphera, true = Delen)
    let isDelenActive = false;

    button.addEventListener('click', async () => {
        // Desabilita temporariamente para evitar cliques duplos rápidos
        button.disabled = true;
        
        // Alterna o estado lógico
        isDelenActive = !isDelenActive;
        
        // Define qual gatilho disparar com base no estado
        const triggerName = isDelenActive ? 'ativar_delen' : 'ativar_atmosphera';
        
        // Atualiza a interface visual antes da resposta para parecer instantâneo
        updateUI(isDelenActive);

        // Dispara a requisição para a API da OnSign TV
        try {
            const response = await fetch(`https://api.onsign.tv/v1/players/${PLAYER_ID}/triggers/${triggerName}`, {
                method: 'POST',
                headers: {
                    'X-OnSignTV-API-Token': API_TOKEN,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            console.log(`Gatilho ${triggerName} enviado com sucesso.`);
        } catch (error) {
            console.error('Falha ao mudar mídia:', error);
            alert('Erro ao conectar com o player. Verifique sua conexão.');
            // Reverte o estado em caso de falha crítica
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