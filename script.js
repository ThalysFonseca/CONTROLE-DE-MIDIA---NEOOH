// ATENÇÃO: Substitua os IDs abaixo pelos correspondentes do seu painel
// 1. Pegue o link On-Demand completo do Delen que você usou anteriormente:
const LINK_DELEN_BASE = 'https://cmwide.widedigital.com.br/play/kWqGyO0Iap2AY6Ayf6jTegUv';

// Criamos as duas URLs de comando direto para o seu Player
const URL_LIGAR_DELEN = `${LINK_DELEN_BASE}?repeat=true`; // Força o loop nativo do player
const URL_DESLIGAR_DELEN = `${LINK_DELEN_BASE}?stop=true`;  // Força a parada imediata e limpa a memória do player

const button = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');

// Controle de estado (false = Delen desligado/Atmosphera ativo, true = Delen ativo)
let isDelenActive = false;

updateUI(isDelenActive);

button.addEventListener('click', () => {
    button.disabled = true;
    
    // Alterna o estado lógico
    isDelenActive = !isDelenActive;
    
    // Define qual comando de sistema enviar
    const targetUrl = isDelenActive ? URL_LIGAR_DELEN : URL_DESLIGAR_DELEN;
    
    updateUI(isDelenActive);

    // Método de Ping de Imagem para evitar bloqueios de CORS do navegador
    const pingImage = new Image();
    
    pingImage.onload = () => {
        console.log("Comando recebido pelo player.");
        button.disabled = false;
    };
    
    pingImage.onerror = () => {
        // Ignora erro de formato de imagem no navegador
        console.log("Comando enviado com sucesso.");
        button.disabled = false;
    };

    pingImage.src = targetUrl;
});

function updateUI(active) {
    if (active) {
        button.className = 'btn-control delen'; // Fica Vermelho/Rosa
        button.innerText = 'Desativar Delen';
        statusText.innerText = 'Toque para voltar à programação normal (Atmosphera)';
    } else {
        button.className = 'btn-control atmosphera'; // Fica Azul
        button.innerText = 'Ativar Delen';
        statusText.innerText = 'Toque para exibir a campanha do Delen imediatamente';
    }
}
