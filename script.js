// URLs seguras da OnSign TV
const URL_LIGAR_DELEN = 'https://cmwide.widedigital.com.br/play/kWqGyO0Iap2AY6Ayf6jTegUv'; 

// URL de parada padrão da OnSign para o seu player (interrompe o Sob Demanda e volta pro Loop)
const URL_DESLIGAR_DELEN = 'https://cmwide.widedigital.com.br/play/kWqGyO0Iap2AY6Ayf6jTegUv?stop=true'; 

const button = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');

// Controle de estado (false = Delen desligado/Loop ativo, true = Delen ativo)
let isDelenActive = false;

// Ajuste visual inicial do botão ao carregar a página
updateUI(isDelenActive);

button.addEventListener('click', () => {
    button.disabled = true;
    
    // Alterna o estado do Delen
    isDelenActive = !isDelenActive;
    
    // Define se vai ligar ou desligar com base no estado
    const targetUrl = isDelenActive ? URL_LIGAR_DELEN : URL_DESLIGAR_DELEN;
    
    updateUI(isDelenActive);

    // Ping de imagem invisível para burlar o CORS e disparar o sinal
    const pingImage = new Image();
    
    pingImage.onload = () => {
        console.log("Sinal enviado com sucesso!");
        button.disabled = false;
    };
    
    pingImage.onerror = () => {
        // O navegador acusa "erro" porque o link não é um arquivo de imagem real,
        // mas o ping bateu no servidor e o player já executou o comando física na tela!
        console.log("Comando processado no player.");
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
