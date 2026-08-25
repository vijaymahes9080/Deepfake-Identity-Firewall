import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import apiRouter from './routes/api.js';
import { riskFusionEngine } from './engines/riskFusion.js';
import { attackGraphEngine } from './engines/attackGraph.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/v1', apiRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', timestamp: new Date().toISOString() });
});

// Create HTTP Server & WebSocket Server
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/firewall' });

const clients = new Set();

wss.on('connection', (ws, req) => {
  clients.add(ws);
  console.log(`[WS] New Identity Stream Client connected. Total: ${clients.size}`);

  // Send initial handshake
  ws.send(JSON.stringify({
    type: 'CONNECTION_ESTABLISHED',
    message: 'Deepfake Identity Firewall Real-Time Sentinel Gateway Active',
    timestamp: Date.now()
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'BIOMETRIC_TELEMETRY') {
        // Evaluate incoming telemetry
        const evaluation = riskFusionEngine.evaluate(data.payload);
        const attackGraph = attackGraphEngine.generateGraph(
          evaluation.threatFactors.map(t => t.module),
          evaluation.riskScore
        );

        // Send evaluation back to client
        ws.send(JSON.stringify({
          type: 'RISK_EVALUATION_UPDATE',
          evaluation,
          attackGraph,
          timestamp: Date.now()
        }));
      } else if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
    } catch (err) {
      console.error('[WS] Error processing message:', err.message);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected. Remaining: ${clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('[WS] Socket error:', err.message);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  DEEPFAKE IDENTITY FIREWALL SERVER INITIALIZED`);
  console.log(`🚀 REST API: http://localhost:${PORT}/api/v1/system/status`);
  console.log(`⚡ WebSocket Stream: ws://localhost:${PORT}/ws/firewall`);
  console.log(`====================================================`);
});
