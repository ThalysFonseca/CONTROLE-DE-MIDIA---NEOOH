export default async function handler(req, res) {
    // 1. Bloqueia requisições GET (impede crawlers e robôs da internet)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método não permitido. Use POST." });
    }

    // 2. Verifica presença do token de autorização
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Não autorizado. Token de acesso ausente." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 3. Valida a autenticidade do token direto nos servidores do Google
        const googleVerifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        if (!googleVerifyRes.ok) {
            return res.status(401).json({ error: "Sessão inválida ou expirada." });
        }

        const googleUser = await googleVerifyRes.json();
        const userEmail = googleUser.email;

        // 4. Verifica se o e-mail logado está na lista ALLOWED_EMAILS cadastrada na Vercel
        const allowedEmailsEnv = process.env.ALLOWED_EMAILS || "";
        const allowedList = allowedEmailsEnv.split(',').map(email => email.trim().toLowerCase());

        if (!allowedList.includes(userEmail.toLowerCase())) {
            return res.status(403).json({ error: `O e-mail ${userEmail} não possui permissão para este controle.` });
        }

        // Se for apenas verificação inicial de login
        if (req.query.verificar === 'true') {
            return res.status(200).json({ authorized: true, email: userEmail });
        }

        // 5. Executa o disparo na OnSign TV se tudo estiver OK
        const { acao } = req.query;
        const urlLigar = process.env.URL_DELEN;
        const urlDesligar = process.env.URL_DESLIGAR_DELEN;

        if (!urlLigar || !urlDesligar) {
            return res.status(500).json({ error: "URLs de destino não configuradas no servidor." });
        }

        const targetUrl = acao === 'ligar' ? urlLigar : urlDesligar;

        await fetch(targetUrl);
        return res.status(200).json({ success: true, message: `Comando ${acao} executado por ${userEmail}.` });

    } catch (error) {
        return res.status(500).json({ error: "Erro interno no servidor de autenticação." });
    }
}