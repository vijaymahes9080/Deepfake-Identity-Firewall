import React, { useState } from 'react';
import { Terminal, Play, Copy, Check, Send } from 'lucide-react';

export function ApiSandbox() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/verify/multimodal');
  const [method, setMethod] = useState('POST');
  const [requestBody, setRequestBody] = useState(
`{
  "faceScore": 0.04,
  "livenessScore": 0.96,
  "voiceScore": 0.05,
  "syncDeltaMs": 14,
  "replayScore": 0.02,
  "deviceRisk": 0.0,
  "behaviorScore": 0.04
}`
  );
  const [responseOutput, setResponseOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    {
      path: '/api/v1/verify/multimodal',
      method: 'POST',
      desc: 'Evaluates 8 multimodal sensory layers against Bayesian Risk Engine',
      defaultBody: `{
  "faceScore": 0.04,
  "livenessScore": 0.96,
  "voiceScore": 0.05,
  "syncDeltaMs": 14,
  "replayScore": 0.02,
  "deviceRisk": 0.0,
  "behaviorScore": 0.04
}`
    },
    {
      path: '/api/v1/challenge/generate',
      method: 'POST',
      desc: 'Generates a dynamic spatial directional & vocal OTP nonce',
      defaultBody: `{
  "sessionId": "session_enterprise_09"
}`
    },
    {
      path: '/api/v1/redteam/simulate',
      method: 'POST',
      desc: 'Injects adversarial attack vectors for firewall defense benchmarking',
      defaultBody: `{
  "attackVectors": ["face_swap", "voice_clone"],
  "intensity": 0.85
}`
    },
    {
      path: '/api/v1/audit/logs',
      method: 'GET',
      desc: 'Retrieves cryptographically linked SHA-256 tamper-evident audit logs',
      defaultBody: ''
    }
  ];

  const handleSelectEndpoint = (ep) => {
    setSelectedEndpoint(ep.path);
    setMethod(ep.method);
    setRequestBody(ep.defaultBody);
  };

  const handleExecuteRequest = async () => {
    setLoading(true);
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (method === 'POST' && requestBody) {
        options.body = requestBody;
      }
      const res = await fetch(selectedEndpoint, options);
      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponseOutput(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const curlSnippet = `curl -X ${method} http://localhost:5000${selectedEndpoint} \\
  -H "Content-Type: application/json" ${method === 'POST' ? `\\
  -d '${requestBody.replace(/\n/g, '').replace(/\s+/g, ' ')}'` : ''}`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="cyber-card corner-bracket p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-900 border border-gray-700 rounded-lg text-emerald-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-gray-100">
              IDENTITY API & DEVELOPER INTEGRATION SANDBOX
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Integrate the Deepfake Identity Firewall into your Banking, Proctoring, or SSO stack.
            </p>
          </div>
        </div>

        <button
          onClick={copyCurl}
          className="flex items-center space-x-1.5 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-gray-700 text-gray-200 px-3 py-1.5 rounded transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'COPIED CURL' : 'COPY CURL'}</span>
        </button>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {endpoints.map((ep, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectEndpoint(ep)}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center space-x-2 border transition-all ${
              selectedEndpoint === ep.path
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
                : 'bg-black/40 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="font-bold text-[10px] text-cyan-400">{ep.method}</span>
            <span>{ep.path}</span>
          </button>
        ))}
      </div>

      {/* Request & Response Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Request Side */}
        <div className="cyber-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="font-mono text-xs font-bold text-gray-300">REQUEST PAYLOAD (JSON)</span>
            <button
              onClick={handleExecuteRequest}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold px-3 py-1 rounded text-xs transition-all flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'SENDING...' : 'DISPATCH API CALL'}</span>
            </button>
          </div>

          <textarea
            rows={12}
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            disabled={method === 'GET'}
            className="w-full bg-black/80 font-mono text-xs text-cyan-300 p-3 rounded border border-gray-800 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
            placeholder={method === 'GET' ? 'No body required for GET endpoint' : 'JSON payload'}
          />

          <div className="text-[11px] font-mono text-gray-400">
            cURL Snippet:
            <pre className="bg-black/90 p-2 rounded text-[10px] text-gray-300 overflow-x-auto mt-1 border border-gray-850">
              {curlSnippet}
            </pre>
          </div>
        </div>

        {/* Response Side */}
        <div className="cyber-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="font-mono text-xs font-bold text-gray-300">SERVER RESPONSE (HTTP 200)</span>
            <span className="text-[10px] font-mono text-emerald-400">JSON • EPHEMERAL</span>
          </div>

          <pre className="w-full h-80 bg-black/80 font-mono text-xs text-emerald-400 p-3 rounded border border-gray-800 overflow-y-auto leading-relaxed">
            {responseOutput || '// Click "Dispatch API Call" to execute live against local Node.js engine.'}
          </pre>
        </div>
      </div>
    </div>
  );
}
