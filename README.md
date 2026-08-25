# 🛡️ Deepfake Identity Firewall — Next-Generation Multimodal AI Security Platform

> **"Don't just verify the face. Verify the human behind the digital session."**

An enterprise-grade, research-caliber **Identity Firewall** that continuously evaluates whether a real human is authentic behind a digital interaction across video, voice, liveness, device, and behavioral channels.

---

## ⚡ Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend UI                           │
│  • Modern Cyber-Security Operations Center (SOC Dark Theme) │
│  • Live WebRTC Camera & Microphone Stream Canvas Overlays   │
│  • Facial Landmark Triangulation & rPPG Blood Pulse Waveform│
│  • Live Web Audio API FFT Spectrum Visualizer               │
│  • Interactive Dynamic Attack Chain Graph (SVG / Nodes)     │
│  • Operational Modes: Exam | Banking | Interview | Remote   │
│  • Adversarial Red-Team Attack Injector & Benchmark Sandbox │
├─────────────────────────────────────────────────────────────┤
│                    Core Engine / Backend                    │
│  • Express REST API Suite (/api/v1/verify, /challenge, etc.)│
│  • Bidirectional Real-Time WebSocket Hub (/ws/firewall)     │
│  • Bayesian RiskFusion Engine (0-100 Normalized Score)      │
│  • Temporal Identity Continuity Tracker (Vector Drift)      │
│  • PrivacyVault Zero-Knowledge Ephemeral Feature Hasher     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 12-Core Defense Suite

1. **🛡️ FaceShield** — Deepfake & Face-Swap Guard (DCT spectral filtering & boundary blending inpainting detection).
2. **👁️ LiveProof** — Biological Liveness & rPPG (Remote photoplethysmography pulse rhythm, micro-saccades, pupil response).
3. **🎙️ VoiceShield** — Synthetic Voice & Clone Blocker (Vocoder phase continuity, harmonic ratio anomalies & TTS artifacts).
4. **⚡ SyncGuard** — Lip-Audio Synchronization (Phoneme-viseme cross-modal correlation with millisecond temporal delta).
5. **🔄 ReplayGuard** — Presentation Attack Detection (Moire raster patterns, screen bezel reflection & 3D photometric reflectance).
6. **📱 DeviceTrust** — Hardware & Driver Integrity (Virtual video driver hooks, OBS/ManyCam detection, WebGL GPU signature).
7. **🖐️ BehaviourID** — Behavioral Dynamics (Keystroke flight intervals, mouse trajectory velocity & interaction entropy).
8. **🧠 RiskFusion** — Multimodal Bayesian Risk Engine (0-100 composite index: `TRUSTED`, `LOW`, `SUSPICIOUS`, `HIGH`, `CRITICAL`).
9. **🕸️ AttackGraph** — Dynamic Threat Chain Tracker (Visual topological reconstruction of sensor-to-account exploit pathways).
10. **✨ ChallengeAI** — Adaptive Dynamic Nonces (Dynamic directional head movements + cryptographic vocal OTP nonces).
11. **🔐 PrivacyVault** — Zero-Knowledge Biometric Vault (Zero raw-media retention, salted SHA-256 vector hashing & tamper-evident audit logs).
12. **🔌 IdentityAPI** — Enterprise Developer SDK (High-throughput REST and WebSocket endpoints for Banking, Exams & Enterprise).

---

## 🎯 Contextual Operational Modes

- 🎓 **Online Exam Mode**: Continuous proctoring integrity score, multi-face / face-absence / screen replay alarms.
- 🏦 **Banking & High-Value Transaction Gate**: Step-up biometric challenge gate and wire transfer authorization lock.
- 💼 **Technical Interview Mode**: Real-time candidate identity continuity tracker and voice/video swap alerting.
- 🧑‍💻 **Remote Work Zero-Trust Sentinel**: Continuous background identity sentinel with auto-lock on identity divergence.
- 🕵️ **Adversarial Red-Team Simulator**: Interactive real-time injection of 7 attack vectors (Face Swap, Voice Clone, Virtual Camera, Replay, Lip Desync, Identity Substitution, Macro Bot).

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### Running Locally
```bash
# Start both Backend (Port 5000) and Frontend (Port 5173) concurrently:
npm run dev

# Or run separately:
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run client
```

- **Frontend SOC Dashboard**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000/api/v1/system/status`
- **WebSocket Gateway**: `ws://localhost:5000/ws/firewall`

---

## 📜 Privacy & Compliance
- **Zero Raw Media Retention**: No video frames or audio PCM recordings are permanently stored.
- **Salted One-Way Feature Hashing**: Ephemeral embeddings hashed using SHA-256 with key rotation.
- **GDPR Art. 9 & CCPA Compliant**: Built strictly for biometric privacy and enterprise zero-trust security.
