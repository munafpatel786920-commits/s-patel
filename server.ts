import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json({ limit: '10mb' }));

// Create HTTP server
const httpServer = createServer(app);

// Initialize Gemini Client (server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gemini AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, context, systemInstruction } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing on server' });
    }

    const sysInst = systemInstruction || 
      `You are ChatConnect AI, an intelligent, friendly, and helpful AI assistant embedded inside the ChatConnect messaging app. 
       Help users draft messages, answer general queries, summarize texts, give concise advice, or analyze ideas. Keep answers clear, well-formatted, and helpful.`;

    let fullPrompt = prompt;
    if (context && context.length > 0) {
      fullPrompt = `[Context of previous messages]\n${context}\n\n[User question]: ${prompt}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: sysInst,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'I am sorry, I could not process your request.';
    return res.json({ reply: replyText });
  } catch (err: any) {
    console.error('Gemini AI Chat Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to communicate with AI model' });
  }
});

// Gemini AI Translate endpoint
app.post('/api/ai/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and targetLanguage are required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Translate the following chat message precisely into ${targetLanguage}. Maintain the original tone and emotion without adding meta commentary or explanations:\n\n"${text}"`,
      config: {
        temperature: 0.2,
      },
    });

    const translatedText = response.text?.trim() || text;
    return res.json({ translatedText });
  } catch (err: any) {
    console.error('Gemini Translate Error:', err);
    return res.status(500).json({ error: err.message || 'Translation failed' });
  }
});

// WebSocket Server for Real-Time Messaging & Call Signaling
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

// Track connected clients
interface ClientConnection {
  ws: WebSocket;
  userId?: string;
  chatIds?: string[];
}

const connectedClients = new Set<ClientConnection>();

wss.on('connection', (ws: WebSocket) => {
  const client: ClientConnection = { ws };
  connectedClients.add(client);

  ws.on('message', (messageBuffer: Buffer) => {
    try {
      const data = JSON.parse(messageBuffer.toString());
      
      switch (data.type) {
        case 'register':
          client.userId = data.userId;
          client.chatIds = data.chatIds || [];
          // Broadcast online status
          broadcastEvent({
            type: 'user_status',
            userId: data.userId,
            status: 'online'
          }, client);
          break;

        case 'send_message':
          // Broadcast message to all connected clients in the chat or all clients
          broadcastEvent({
            type: 'new_message',
            message: data.message
          });
          break;

        case 'typing_indicator':
          broadcastEvent({
            type: 'user_typing',
            chatId: data.chatId,
            userId: data.userId,
            userName: data.userName,
            isTyping: data.isTyping
          }, client);
          break;

        case 'message_read':
          broadcastEvent({
            type: 'message_status_update',
            chatId: data.chatId,
            messageId: data.messageId,
            status: 'read'
          });
          break;

        case 'call_signal':
          // Pass call signaling (offer, answer, ice-candidate, end)
          broadcastEvent({
            type: 'call_signal',
            signal: data.signal,
            fromUserId: data.fromUserId,
            targetUserId: data.targetUserId,
            callType: data.callType
          }, client);
          break;

        case 'status_post':
          broadcastEvent({
            type: 'new_status',
            status: data.statusUpdate
          });
          break;

        default:
          break;
      }
    } catch (err) {
      console.error('WebSocket message parsing error:', err);
    }
  });

  ws.on('close', () => {
    connectedClients.delete(client);
    if (client.userId) {
      broadcastEvent({
        type: 'user_status',
        userId: client.userId,
        status: 'offline',
        lastSeen: 'Just now'
      });
    }
  });
});

function broadcastEvent(payload: any, excludeClient?: ClientConnection) {
  const json = JSON.stringify(payload);
  for (const client of connectedClients) {
    if (client !== excludeClient && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(json);
    }
  }
}

// Attach Vite or Static Middleware
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

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`ChatConnect Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
