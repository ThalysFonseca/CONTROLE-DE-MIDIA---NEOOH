// ATENÇÃO: Substitua os links abaixo pelos correspondentes do seu painel OnSign TV
//
// 1) Link de PLAY do conteúdo Delen (obtido no ícone de "corrente/link" dentro de
//    "Triggered Content" no painel do Player). Ele aceita apenas os parâmetros
//    oficiais "repeat" (número de repetições, 0 = infinito) e "action=queue".
//    IMPORTANTE: NÃO existe parâmetro "stop=true" no link de play — o OnSign TV
//    simplesmente ignora parâmetros desconhecidos, por isso o Delen nunca parava.
const URL_LIGAR_DELEN = 'https://app.onsign.tv/play/bwhATdI8bPAI6008P1x7WPBd?repeat=0';

// 2) Link de STOP: é uma URL DIFERENTE, gerada separadamente no painel.
//    Como obter: Player > "Content in Player" > seção "Triggered Content" >
//    clique na setinha ao lado do botão azul "Stop On Demand Playback" >
//    "Share Stop URL" > copie o link e cole abaixo.
const URL_DESLIGAR_DELEN = 'https://app.onsign.tv/stop/Ou0HMqDvcjVqChfnUjbx7mWR';

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
