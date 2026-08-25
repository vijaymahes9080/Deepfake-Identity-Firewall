import { useState, useEffect, useRef, useCallback } from 'react';

export function useFirewallSocket(telemetryInputs = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [evaluation, setEvaluation] = useState({
    riskScore: 6.4,
    confidenceScore: 93.6,
    status: 'TRUSTED',
    statusColor: '#00f5a0',
    alertLevel: 'INFO',
    actionRequired: 'PASS',
    threatFactors: [],
    breakdown: {
      face: { score: 4, label: 'Face Authenticity', weight: '22%' },
      liveness: { score: 6, label: 'Biological Liveness', weight: '18%' },
      voice: { score: 5, label: 'Voice Naturalness', weight: '18%' },
      sync: { score: 8, label: 'Lip-Audio Synchronization', weight: '14%' },
      replay: { score: 3, label: 'Replay & Screen Guard', weight: '12%' },
      device: { score: 2, label: 'Device & Driver Trust', weight: '8%' },
      behavior: { score: 5, label: 'Behavioral Biometrics', weight: '5%' },
      continuity: { score: 3, label: 'Identity Continuity', weight: '3%' }
    }
  });

  const [attackGraph, setAttackGraph] = useState({
    nodes: [],
    edges: [],
    attackPathDetected: false,
    entryPoint: 'Direct Sensor'
  });

  const socketRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const telemetryIntervalRef = useRef(null);

  // Initialize and maintain WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname || 'localhost';
    const port = 5000;
    const wsUrl = `${protocol}//${host}:${port}/ws/firewall`;

    let reconnectTimeout;

    const connect = () => {
      try {
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          console.log('[Firewall WS] Connected to Sentinel Gateway');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'RISK_EVALUATION_UPDATE') {
              if (data.evaluation) setEvaluation(data.evaluation);
              if (data.attackGraph) setAttackGraph(data.attackGraph);
            }
          } catch (e) {
            console.error('Error parsing WS message:', e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };

        ws.onerror = (err) => {
          console.warn('[Firewall WS] Connection warning, retrying in background');
          ws.close();
        };
      } catch (err) {
        setIsConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  // Send periodic telemetry update to server
  useEffect(() => {
    const sendTelemetry = () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'BIOMETRIC_TELEMETRY',
          payload: telemetryInputs
        }));
      }
    };

    const interval = setInterval(sendTelemetry, 250); // 4Hz refresh
    return () => clearInterval(interval);
  }, [telemetryInputs]);

  const sendManualTelemetry = useCallback((customPayload) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'BIOMETRIC_TELEMETRY',
        payload: customPayload
      }));
    }
  }, []);

  return {
    isConnected,
    evaluation,
    attackGraph,
    sendManualTelemetry,
    setEvaluation,
    setAttackGraph
  };
}
