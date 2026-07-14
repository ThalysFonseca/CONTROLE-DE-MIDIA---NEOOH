// URLs seguras da OnSign TV (Adicionando o controle de repetição nativo)
const URL_LIGAR_DELEN = 'https://cmwide.widedigital.com.br/play/kWqGyO0Iap2AY6Ayf6jTegUv?repeat=0'; 

// URL para parar imediatamente qualquer campanha sob demanda ativa no player
const URL_DESLIGAR_DELEN = 'https://cmwide.widedigital.com.br/play/kWqGyO0Iap2AY6Ayf6jTegUv?stop=true'; 

const button = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');

// Controle de estado (false = Delen desligado/Atmosphera ativo, true = Delen ativo)
let isDelenActive = false;

updateUI(isDelenActive);

button.addEventListener('click', () => {
    button.disabled = true;
    
    // Alterna o estado do Delen
    isDelenActive = !isDelenActive;
    
    // Define qual URL disparar com base no estado
    const targetUrl = isDelenActive ? URL_LIGAR_DELEN : URL_DESLIGAR_DELEN;
    
    updateUI(isDelenActive);

    // Ping de imagem invisível para burlar o CORS
    const pingImage = new Image();
    
    pingImage.onload = () => {
        console.log("Sinal enviado com sucesso!");
        button.disabled = false;
    };
    
    pingImage.onerror = () => {
        // Ignora o erro de renderização de imagem e libera o botão
        console.log("Comando enviado.");
        button.disabled = false;
    };

    pingImage.src = targetUrl;
});

function updateUI(active) {
    if (active) {
        button.className = 'btn-control delen'; // Fica Rosa/Vermelho
        button.innerText = 'Desativar Delen';
        statusText.innerText = 'Toque para voltar à programação normal (Atmosphera)';
    } else {
        button.className = 'btn-control atmosphera'; // Fica Azul
        button.innerText = 'Ativar Delen';
        statusText.innerText = 'Toque para exibir a campanha do Delen imediatamente';
    }
}
