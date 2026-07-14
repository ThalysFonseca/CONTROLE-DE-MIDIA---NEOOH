// Substitua os links abaixo pelas URLs que você acabou de copiar do painel
const URL_DELEN = 'https://cmwide.widedigital.com.br/play/kWqGyO0Iap2AY6Ayf6jTegUv'; 
const URL_ATMOSPHERA = 'https://cmwide.widedigital.com.br/play/IyZdaWAhkk5sd1hOUFYnMU4d';

const button = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');

// Define o estado inicial (false = Atmosphera, true = Delen)
let isDelenActive = false;

button.addEventListener('click', async () => {
    // Desabilita temporariamente para evitar cliques duplos rápidos
    button.disabled = true;
    
    // Alterna o estado lógico
    isDelenActive = !isDelenActive;
    
    // Define qual URL disparar com base no estado
    const targetUrl = isDelenActive ? URL_DELEN : URL_ATMOSPHERA;
    
    // Atualiza a interface visual antes da resposta para parecer instantâneo
    updateUI(isDelenActive);

    // Envia o comando diretamente e sem segurança exposta
    try {
        const response = await fetch(targetUrl, {
            method: 'GET', // Links sob demanda aceitam requisições simples GET
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        console.log(`Comando enviado com sucesso.`);
    } catch (error) {
        console.error('Falha ao mudar mídia:', error);
        alert('Erro ao conectar com o player. Verifique sua conexão.');
        // Reverte o estado em caso de falha
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
