// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // permite o frontend chamar
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK; // set no painel do Render

app.post('/send', async (req, res) => {
  try {
    const { ip, username, id, avatar, accountAge } = req.body;
    
    const embed = {
      embeds: [{
        title: "Novo usuário entrou!",
        color: 0x7289DA,
        thumbnail: { url: avatar },
        fields: [
          { name: "IP", value: ip || "N/A", inline: true },
          { name: "Nome de usuário", value: username || "N/A", inline: true },
          { name: "ID", value: id || "N/A", inline: true },
          { name: "Anos da conta", value: (accountAge !== undefined ? String(accountAge) : "N/A"), inline: true }
        ],
        timestamp: new Date()
      }]
    };
    
    const r = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed)
    });
    
    const text = await r.text();
    if (!r.ok) return res.status(502).json({ ok: false, status: r.status, text });
    
    res.json({ ok: true });
  } catch (err) {
    console.error("Erro /send:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
