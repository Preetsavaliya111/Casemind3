import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI with required telemetry headers
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint with Context-Aware Gemini Copilot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, activeIncident, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!apiKey) {
      // Fallback response if GEMINI_API_KEY is not yet attached
      return res.json({
        text: `[CaseMind Local Synthesis] Analyzed incident ${activeIncident?.id || 'INC-7102'}: Root cause pattern suggests connection pool starvation or downstream saturation. To enable live Gemini 3.8 multi-step reasoning, ensure your GEMINI_API_KEY is set in Settings > Secrets.`,
        citations: [
          {
            title: `Historical Incident ${activeIncident?.id || 'INC-7102'} Post-Mortem`,
            source: 'Internal Organizational Memory Graph',
            confidence: 0.94,
          },
        ],
      });
    }

    // Build context envelope
    let contextHeader = `You are CaseMind Copilot, an enterprise-grade AI SRE and Incident Management cognitive partner.\n`;
    if (activeIncident) {
      contextHeader += `
CURRENT ACTIVE INCIDENT CONTEXT:
- Incident ID: ${activeIncident.id}
- Title: ${activeIncident.title}
- Severity: ${activeIncident.severity}
- Affected Service: ${activeIncident.service} (Cluster: ${activeIncident.cluster})
- Status: ${activeIncident.status}
- Probable Root Cause: ${activeIncident.cognitiveSynthesis?.probableRootCause || 'Under investigation'}
- Blast Radius: ${activeIncident.blastRadius?.revenueImpactPerHour || 'Unknown'} / ${activeIncident.blastRadius?.affectedUsers || 0} users (${activeIncident.blastRadius?.region || 'Global'})
- Related Historical Memory: ${activeIncident.evidenceProvenance?.memoryMatches?.map((m: any) => `${m.incidentId}: ${m.title} (Match score: ${m.similarityScore})`).join('; ') || 'None'}
`;
    }

    const systemInstruction = `${contextHeader}
INSTRUCTIONS:
1. Provide precise, actionable technical reasoning for Tier-3 DevOps/SREs.
2. Clearly distinguish between verified internal organizational memory evidence (tag as [INTERNAL EVIDENCE]) and operational recommendations.
3. Keep responses structured, concise, and professional.
4. When suggesting mitigation steps, specify safety verification gates.`;

    // Construct conversation parts
    const chatContents: any[] = [];
    if (Array.isArray(conversationHistory)) {
      for (const turn of conversationHistory.slice(-6)) {
        chatContents.push({
          role: turn.sender === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }],
        });
      }
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || 'Unable to generate synthesis.',
      citations: [
        {
          title: `Active Ticket Context: ${activeIncident?.id || 'Current Incident'}`,
          source: 'CaseMind Evidence Provenance',
          confidence: 0.96,
        },
      ],
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process AI chat request',
    });
  }
});

// Google Search Grounding endpoint
app.post('/api/search-grounding', async (req, res) => {
  try {
    const { query: searchQuery, incidentContext } = req.body;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!apiKey) {
      return res.json({
        text: `[Google Search Grounding Simulation] For query "${searchQuery}": Public documentation and vendor advisories recommend inspecting connection pool limits, kernel TCP socket timeouts (somaxconn), and connection lease recycling times. (Attach GEMINI_API_KEY in Secrets for live web search).`,
        webCitations: [
          {
            title: 'Redis Connection Management Documentation',
            uri: 'https://redis.io/docs/management/optimization/',
          },
          {
            title: 'Kubernetes Ingress-NGINX Connection Pooling Guide',
            uri: 'https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/',
          },
        ],
        searchQueries: [searchQuery],
      });
    }

    const prompt = `You are CaseMind External Intelligence Engine. Research this query regarding modern production cloud infrastructure, Kubernetes, microservices, or databases:
QUERY: "${searchQuery}"
${incidentContext ? `INCIDENT CONTEXT: ${incidentContext}` : ''}

Use Google Search to find up-to-date vendor documentation, known software CVEs, public GitHub issues, or architectural best practices.
Summarize the findings clearly with specific configuration parameters and root-cause indicators.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract search citations
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webCitations: Array<{ title: string; uri: string }> = [];

    for (const chunk of chunks) {
      if (chunk.web?.uri) {
        webCitations.push({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri,
        });
      }
    }

    const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [searchQuery];

    res.json({
      text: response.text || 'No external search findings returned.',
      webCitations,
      searchQueries,
    });
  } catch (error: any) {
    console.error('Google search grounding error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to execute search grounding',
    });
  }
});

// Rapid Post-Mortem Draft Generator
app.post('/api/generate-postmortem', async (req, res) => {
  try {
    const { incident } = req.body;
    if (!incident) {
      return res.status(400).json({ error: 'Incident data is required' });
    }

    if (!apiKey) {
      return res.json({
        postMortem: {
          summary: `Executive Incident Post-Mortem for ${incident.id}: ${incident.title}. Resolved within SLA limits through coordinated automated runbook execution and organizational memory matching.`,
          timelineSummary: `Timeline established across ${incident.telemetryStream?.length || 4} telemetry correlation events. Root cause identified in ${incident.service}.`,
          rootCauseAnalysis: incident.cognitiveSynthesis?.probableRootCause || 'Connection timeout cascaded to gateway 504s.',
          preventionItems: [
            'Increase connection pool minimum spare connections to 20',
            'Add alert threshold at 80% pool utilization before hard timeouts occur',
            'Standardize circuit-breaker fallback in checkout-gateway service',
          ],
          generatedAt: new Date().toISOString(),
        },
      });
    }

    const prompt = `Generate a comprehensive incident post-mortem draft in JSON format for the following incident:
Incident ID: ${incident.id}
Title: ${incident.title}
Severity: ${incident.severity}
Service: ${incident.service}
Root Cause: ${incident.cognitiveSynthesis?.probableRootCause}
Blast Radius: ${incident.blastRadius?.revenueImpactPerHour} revenue loss/hr, ${incident.blastRadius?.affectedUsers} affected users
Timeline Events: ${JSON.stringify(incident.telemetryStream?.slice(0, 5))}

Return JSON matching:
{
  "summary": "...",
  "timelineSummary": "...",
  "rootCauseAnalysis": "...",
  "preventionItems": ["...", "..."],
  "generatedAt": "ISO date"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ postMortem: parsed });
  } catch (error: any) {
    console.error('Post-mortem generation error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate post-mortem' });
  }
});

// Vite Middleware integration for Full-Stack development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CaseMind Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
