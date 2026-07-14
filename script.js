// URLs seguras copiadas do seu painel da OnSign TV
const URL_DELEN = 'https://cmwide.widedigital.com.br/play/kWqGyO0Iap2AY6Ayf6jTegUv'; 
// Lembre-se de colar a URL do Atmosphera correta na linha abaixo:
const URL_ATMOSPHERA = 'https://cmwide.widedigital.com.br/play/IyZdaWAhkk5sd1hOUFYnMU4d'; 

const button = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');

// Define o estado inicial (false = Atmosphera, true = Delen)
let isDelenActive = false;

button.addEventListener('click', () => {
    // Desabilita temporariamente para evitar cliques duplos rápidos
    button.disabled = true;
    
    // Alterna o estado lógico
    isDelenActive = !isDelenActive;
    
    // Define qual URL disparar com base no estado
    const targetUrl = isDelenActive ? URL_DELEN : URL_ATMOSPHERA;
    
    // Atualiza a interface visual imediatamente
    updateUI(isDelenActive);

    // MÁGICA DO PING DE IMAGEM: 
    // Criamos uma imagem invisível na memória para forçar o navegador a acessar a URL
    // Isso ignora totalmente o bloqueio de CORS!
    const pingImage = new Image();
    
    pingImage.onload = () => {
        console.log("Comando enviado com sucesso (imagem carregada).");
        button.disabled = false;
    };
    
    pingImage.onerror = () => {
        // Como a URL do On-Demand não é de fato uma imagem, o navegador vai disparar "error",
        // mas o acesso ao link já aconteceu com sucesso no servidor do player!
        console.log("Comando disparado com sucesso (ping concluído).");
        button.disabled = false;
    };

    // Define o endereço para disparar o comando na mesma hora
    pingImage.src = targetUrl;
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
