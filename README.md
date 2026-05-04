# Sofia Chatbot Backend — Florida License Fast

Backend Node.js/Express para el chatbot Sofia. Se despliega en **Render** y sirve como proxy seguro hacia la API de Groq.

---

## 🚀 Deploy en Render (paso a paso)

### 1. Subir este repo a GitHub

```bash
git init
git add .
git commit -m "Sofia backend inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/florida-chat-backend.git
git push -u origin main
```

### 2. Crear Web Service en Render

1. Ve a [render.com](https://render.com) → **New → Web Service**
2. Conecta tu cuenta de GitHub y selecciona el repo `florida-chat-backend`
3. Configura:
   - **Name:** `florida-chat-backend`
   - **Region:** Ohio (US East) — más cercano a Florida
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free ✅

### 3. Variables de entorno en Render

En el panel de Render → **Environment** → agrega:

| Variable | Valor |
|----------|-------|
| `GROQ_API_KEY` | `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` |

### 4. Obtener la URL de tu backend

Después del deploy, Render te da una URL como:
```
https://florida-chat-backend.onrender.com
```

### 5. Actualizar el HTML en GitHub Pages

En el archivo `florida_license_v4-2.html`, busca la línea:
```javascript
const BACKEND_URL = 'https://TU-BACKEND.onrender.com/chat';
```
Y reemplaza con tu URL real de Render.

---

## ⚠️ Nota sobre plan Free de Render

El plan Free **hiberna** el servicio después de 15 minutos sin uso. La primera llamada tras la hibernación puede tardar **20-30 segundos**. Para producción, considera el plan Starter ($7/mes) que mantiene el servicio activo.

---

## 🔒 Seguridad

- La API key de Groq **nunca** aparece en el HTML público
- CORS configurado para aceptar solo `ybra73.github.io`
- Historial limitado a 20 mensajes por sesión
