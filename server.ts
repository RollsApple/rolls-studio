import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const SYSTEM_PROMPT = `Tu es un consultant digital d'élite, architecte web, designer UI/UX et développeur full-stack créatif.
Tu es un partenaire de réflexion, conseiller et créateur capable d'échanger, d'écouter, de planifier et de concevoir des sites web sur mesure.

RÈGLE D'OR : CONCISION ET PERTINENCE (JAMAIS DE LONGS MESSAGES INUTILES)
- L'utilisateur déteste les bavardages et les longs pavés de texte inutiles.
- Va TOUJOURS droit au but : sois direct, clair et concis.
- Pour un simple salut ("Bonjour", "Salut"), réponds en 1 à 2 phrases courtes maximum, sans déballer un catalogue de texte.
- N'écris de réponses détaillées QUE si l'utilisateur demande explicitement une analyse approfondie, un plan complet ou la rédaction de contenu.
- Pas d'introductions théâtrales ni de répétitions de politesse.

PRINCIPE FONDAMENTAL : COMPRENDRE LE BESOIN AVANT DE CODER
Ne te précipite JAMAIS à générer du code si l'utilisateur n'a pas encore validé ou demandé la création.

1. PHASE D'ÉCHANGE & COMPRÉHENSION :
- Si l'utilisateur salue, pose une question générale ou partage une idée vague :
  * Réponds brièvement avec écoute et courtoisie (2-3 phrases max).
  * Pose 1 ou 2 questions très ciblées pour cerner son besoin (ex: objectif principal, public visé).
  * Ne génère AUCUN code HTML/CSS/JS.

2. PHASE DE PLANIFICATION :
- Quand l'utilisateur décrit son idée ou demande un plan :
  * Fournis un plan concis, aéré et synthétique (3-4 points clés : Arborescence, Ambiance visuelle, Fonctionnalités clés).
  * Demande-lui simplement s'il valide ce plan ou s'il souhaite ajuster des détails avant de coder.

3. PHASE DE CODAGE (Uniquement sur demande ou validation explicite) :
- Génère le code du site UNIQUEMENT si l'utilisateur le demande explicitement (ex: "Code le site", "Génère", "C'est bon, crée-le", "Valide et lance").
- Dans ce cas, fournis le code complet et responsive avec la structure exacte :
\`\`\`html:index.html
<!DOCTYPE html>
...
\`\`\`
\`\`\`css:style.css
/* Styles complets */
...
\`\`\`
\`\`\`javascript:script.js
// Logique interactive
...
\`\`\`
- Assure-toi que index.html lie style.css et script.js.
- Conclus par une seule phrase brève pour inviter l'utilisateur à tester le site dans l'aperçu à droite.

4. AUTRES DEMANDES (Design, Copywriting, Conseils) :
- Réponds avec concision et précision, adapté au strict besoin demandé.`;

// Utility to extract a clean, human-readable error message
function formatErrorMessage(err: any): string {
  if (!err) return "Erreur inconnue de génération.";
  let rawMsg = typeof err === 'string' ? err : (err.message || String(err));

  // Try extracting inner JSON if wrapped
  for (let i = 0; i < 3; i++) {
    try {
      const startIdx = rawMsg.indexOf('{');
      const endIdx = rawMsg.lastIndexOf('}');
      if (startIdx !== -1 && endIdx > startIdx) {
        const parsed = JSON.parse(rawMsg.slice(startIdx, endIdx + 1));
        if (parsed.error?.message) {
          rawMsg = parsed.error.message;
        } else if (parsed.message) {
          rawMsg = parsed.message;
        } else {
          break;
        }
      } else {
        break;
      }
    } catch {
      break;
    }
  }

  if (rawMsg.includes('high demand') || rawMsg.includes('503') || rawMsg.includes('UNAVAILABLE')) {
    return "Le service de génération IA subit temporairement une très forte demande. Veuillez patienter quelques secondes et relancer la génération.";
  }
  if (rawMsg.includes('API key not valid') || rawMsg.includes('API_KEY_INVALID')) {
    return "La clé API configurée n'est pas valide. Veuillez la vérifier dans les paramètres.";
  }
  if (rawMsg.includes('Quota exceeded') || rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('429')) {
    return "Le quota de requêtes est temporairement atteint. Veuillez patienter une minute.";
  }

  return rawMsg;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, customApiKey } = req.body;

    const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.status(500).json({
        error: "Clé API non trouvée. Veuillez vérifier votre configuration dans Settings > Secrets.",
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Set Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Prepare contents array for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages)) {
      for (const m of messages) {
        if (!m.content || typeof m.content !== 'string') continue;
        const role = m.role === 'assistant' ? 'model' : 'user';

        // Gemini requires the first turn in contents to be user
        if (contents.length === 0 && role !== 'user') {
          continue;
        }

        // Merge adjacent messages with the same role
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += `\n\n${m.content}`;
        } else {
          contents.push({
            role,
            parts: [{ text: m.content }],
          });
        }
      }
    }

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Génère un exemple de site web moderne.' }],
      });
    }

    // Build fallback list based on model choice
    // Prioritize gemini-3.1-flash-lite for immediate availability, high quota and responsiveness
    const requested = model || 'gemini-3.1-flash-lite';
    const candidateModels: string[] = [];

    if (requested === 'gemini-3.1-pro-preview') {
      candidateModels.push('gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-flash-latest');
    } else if (requested === 'gemini-flash-latest' || requested === 'gemini-3.8-flash') {
      // User explicitly asked for Flash; fallback to Flash Lite if quota is reached
      candidateModels.push(requested, 'gemini-3.1-flash-lite');
    } else {
      // Default: Gemini 3.1 Flash Lite first for optimal quota and speed, then Gemini Flash
      candidateModels.push('gemini-3.1-flash-lite', 'gemini-flash-latest');
    }

    let streamSucceeded = false;
    let lastError: any = null;

    for (const candidate of candidateModels) {
      try {
        const responseStream = await ai.models.generateContentStream({
          model: candidate,
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });

        for await (const chunk of responseStream) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
            streamSucceeded = true;
          }
        }

        if (streamSucceeded) {
          break;
        }
      } catch (streamErr: any) {
        lastError = streamErr;
        const errString = streamErr?.message || String(streamErr);
        const isQuota =
          streamErr?.status === 429 ||
          errString.includes('429') ||
          errString.includes('RESOURCE_EXHAUSTED') ||
          errString.includes('Quota exceeded');

        if (isQuota) {
          console.log(`[API Chat] Quota atteint sur ${candidate}, bascule automatique vers le modèle de secours...`);
        } else {
          console.log(`[API Chat] Modèle ${candidate} indisponible, essai du modèle de secours...`);
        }

        if (streamSucceeded) {
          // Some chunks were already delivered to the client, cannot cleanly fallback mid-stream
          break;
        }

        // Brief delay before trying next fallback model
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    if (streamSucceeded) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    } else {
      const friendlyMessage = formatErrorMessage(lastError);
      res.write(`data: ${JSON.stringify({ error: friendlyMessage })}\n\n`);
    }

    res.end();
  } catch (err: any) {
    console.error('Erreur globale route /api/chat:', err);
    const friendlyMessage = formatErrorMessage(err);
    res.write(`data: ${JSON.stringify({ error: friendlyMessage })}\n\n`);
    res.end();
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
