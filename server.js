// ══════════════════════════════════════════════════
//  Florida License Fast — Sofia Chatbot Backend
//  Deploy en Render → conectar con GitHub Pages
// ══════════════════════════════════════════════════
const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── CORS: permitir solo tu dominio de GitHub Pages ──
// Cambia 'ybra73.github.io' por tu usuario real de GitHub
const ALLOWED_ORIGINS = [
  'https://ybra73.github.io',          // Tu GitHub Pages
  'http://localhost:5500',             // Desarrollo local (Live Server)
  'http://127.0.0.1:5500',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir llamadas sin origin (Postman, curl) en dev
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS bloqueado para: ' + origin));
    }
  }
}));

app.use(express.json({ limit: '10kb' }));

// ── System prompt de Sofia ──
const SYSTEM_PROMPT = `Eres Sofia, la asistente virtual de Florida License Fast, especializada en ayudar migrantes a obtener la licencia de conducir en Florida (USA). Responde SIEMPRE en el idioma del usuario (espanol, ingles, portugues, frances, creole, etc.). Se calida, profesional y concisa (max 3-4 parrafos). Recomienda contactar WhatsApp +1 (417) 853-2077 para casos especificos.

DOCUMENTACION: Pasaporte/Green Card/Permiso Trabajo (obligatorio). Social Security si aplica. 2 pruebas residencia Florida ultimos 30 dias (extractos bancarios, facturas servicios - NO Amazon). Estatus migratorio: I-94, Asilo, Ajuste Cubano, Residencia, CBP ONE.

PROCESO: 1) Curso TLSAE alcohol/drogas (no aplica si tiene licencia fisica del pais de origen) 2) Examen teorico 50 preguntas, aprueba con 40 (80%) -> da Permiso de Aprendizaje 3) Examen practico 4) Examen de vista.

PRECIOS: Plan Premium $550 (todo incluido, licencia en 1-2 dias, MAS POPULAR). Gestion Examen Teorico $450 (incluye TLSAE + repeticiones). Gestion Examen Practico $450 (para quienes ya tienen permiso). Licencia Moto $650 (requiere Clase E previa). Precios sin impuestos Florida.

MENORES 18: TLSAE online 6h. Esperar 1 ano y 1 dia con permiso o mayoria de edad.

CONTACTO: WhatsApp +1 (417) 853-2077 | Telegram @licenciaUSA_bot | Miami, Orlando, Tampa, Doral, Kissimmee`;

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Sofia Chatbot Backend', version: '1.0.0' });
});

// ── Endpoint principal del chatbot ──
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Validación básica
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Se requiere el campo messages[]' });
    }

    // Limitar historial a últimos 20 mensajes para evitar abusos
    const trimmedHistory = messages.slice(-20);

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ✅ API key segura: solo existe en el servidor, nunca en el HTML
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        max_tokens: 600,
        temperature: 0.7,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...trimmedHistory
        ]
      })
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      console.error('Groq error:', groqRes.status, errData);
      return res.status(502).json({
        error: 'Error al conectar con Groq',
        detail: errData?.error?.message || groqRes.statusText
      });
    }

    const data   = await groqRes.json();
    const reply  = data.choices?.[0]?.message?.content || 'Lo siento, no obtuve respuesta.';

    res.json({ reply });

  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Sofia Backend corriendo en puerto ${PORT}`);
  console.log(`   GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✓ configurada' : '✗ FALTA CONFIGURAR'}`);
});
