const button = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');

let isDelenActive = false;
updateUI(isDelenActive);

button.addEventListener('click', async () => {
    button.disabled = true;
    isDelenActive = !isDelenActive;
    
    const comando = isDelenActive ? 'ligar' : 'desligar';
    updateUI(isDelenActive);

    try {
        // Faz a chamada segura para a nossa API na Vercel
        const response = await fetch(`/api/controle?acao=${comando}`);
        if (!response.ok) throw new Error();
        console.log("Comando enviado com sucesso.");
    } catch (error) {
        console.error("Erro ao processar comando seguro.");
    } finally {
        button.disabled = false;
    }
});

function updateUI(active) {
    if (active) {
        button.className = 'btn-control delen';
        button.innerText = 'Desativar Delen';
        statusText.innerText = 'Toque para voltar à programação normal (Atmosphera)';
    } else {
        button.className = 'btn-control atmosphera';
        button.innerText = 'Ativar Delen';
        statusText.innerText = 'Toque para exibir a campanha do Delen imediatamente';
    }
}