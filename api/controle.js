export default async function handler(req, res) {
    const { acao } = req.query;

    const urlLigar = process.env.URL_DELEN;
    const urlDesligar = process.env.URL_DESLIGAR_DELEN;

    if (!urlLigar || !urlDesligar) {
        return res.status(500).json({ error: "Configurações de URL ausentes no servidor." });
    }

    // Define qual das duas URLs disparar
    const targetUrl = acao === 'ligar' ? urlLigar : urlDesligar;

    try {
        // A Vercel executa a requisição por trás dos panos (livre de erros de CORS!)
        await fetch(targetUrl);
        return res.status(200).json({ success: true, message: `Comando ${acao} enviado.` });
    } catch (error) {
        return res.status(500).json({ error: "Falha ao disparar comando no player." });
    }
}