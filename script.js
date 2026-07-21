const loginScreen = document.getElementById('loginScreen');
const controlScreen = document.getElementById('controlScreen');
const googleBtnContainer = document.getElementById('googleBtnContainer');
const loginError = document.getElementById('loginError');
const userEmailSpan = document.getElementById('userEmail');

const button = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');

let isDelenActive = false;
let userToken = null;

// COLE O SEU CLIENT ID DO GOOGLE AQUI:
const GOOGLE_CLIENT_ID = "288969529638-gvp9s3ked09nnmd3ka6rtv8cb4ng4mde.apps.googleusercontent.com";

window.onload = function () {
    // Inicializa o SDK do Google
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });

    // Renderiza o botão do Google
    google.accounts.id.renderButton(
        googleBtnContainer,
        { theme: "outline", size: "large", width: 280 }
    );

    // Mantém o usuário logado se fechar/recarregar a aba
    const savedToken = sessionStorage.getItem('google_token');
    const savedEmail = sessionStorage.getItem('google_email');
    if (savedToken && savedEmail) {
        showControlPanel(savedToken, savedEmail);
    }
};

async function handleCredentialResponse(response) {
    const token = response.credential;
    loginError.style.display = 'none';

    try {
        // Valida o token e autorização no backend via POST
        const res = await fetch(`/api/controle?verificar=true`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();

        if (res.ok && data.authorized) {
            sessionStorage.setItem('google_token', token);
            sessionStorage.setItem('google_email', data.email);
            showControlPanel(token, data.email);
        } else {
            showError(data.error || "Acesso negado. E-mail não autorizado.");
        }
    } catch (err) {
        showError("Falha ao validar login com o servidor.");
    }
}

function showControlPanel(token, email) {
    userToken = token;
    userEmailSpan.innerText = email;
    loginScreen.style.display = 'none';
    controlScreen.style.display = 'flex';
    button.disabled = false;
    updateUI(isDelenActive);
}

function showError(msg) {
    loginError.innerText = msg;
    loginError.style.display = 'block';
}

function logout() {
    sessionStorage.clear();
    window.location.reload();
}

// Clique seguro enviando token por requisição POST
button.addEventListener('click', async () => {
    button.disabled = true;
    isDelenActive = !isDelenActive;
    
    const comando = isDelenActive ? 'ligar' : 'desligar';
    updateUI(isDelenActive);

    try {
        const response = await fetch(`/api/controle?acao=${comando}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        if (!response.ok) throw new Error();
    } catch (error) {
        alert("Sessão expirada ou não autorizada. Faça login novamente.");
        logout();
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