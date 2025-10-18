// index.js
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(cors())
app.use(express.json())

// Supabase
const supabaseUrl = 'https://foiyrivumglkegymqgos.supabase.co' // URL do seu projeto
const supabaseKey = 'SUA_ANON_KEY' // pega no painel Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

// Rota pra receber dados do frontend
app.post('/send-info', async (req, res) => {
  try {
    const { ip, username, id, avatarURL, accountAge } = req.body

    const { data, error } = await supabase.from('users').insert([
      { username, ip, id, avatar: avatarURL, accountAge }
    ])

    if(error) return res.status(500).json({ ok: false, error })
    res.json({ ok: true, data })
  } catch(err) {
    console.error(err)
    res.status(500).json({ ok: false, error: err.message })
  }
})

// Teste de API
app.get('/', (req, res) => {
  res.send('API do Lunark tá on 🔥')
})

const PORT = process.env.PORT || 10000
app.listen(PORT, () => console.log('Server rodando na porta', PORT))
