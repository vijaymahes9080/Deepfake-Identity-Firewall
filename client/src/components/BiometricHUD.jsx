import React, { useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, Activity, ShieldCheck, AlertTriangle, Cpu, Radio, Sparkles } from 'lucide-react';

export function BiometricHUD({
  biometrics,
  evaluation,
  onTriggerChallenge,
  activeThreatCount = 0
}) {
  const {
    cameraActive,
    micActive,
    simulatedFeed,
    streamError,
    videoRef,
    rppgPulse,
    audioSpectrum,
    audioVolume,
    eyeBlinkCount,
    headPose,
    startCamera,
    stopCamera,
    setSimulatedFeed
  } = biometrics;

  const canvasRef = useRef(null);
  const pulseCanvasRef = useRef(null);
  const pulseHistoryRef = useRef([]);

  // Draw Face Mesh & Targeting Reticle on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      if (cameraActive) {
        const time = Date.now() / 1000;
        const centerX = w / 2 + Math.sin(time * 0.8) * 10;
        const centerY = h / 2 - 10 + Math.cos(time * 0.6) * 8;
        const faceW = 190;
        const faceH = 240;

        const isHighRisk = evaluation?.riskScore > 60;
        const isSuspicious = evaluation?.riskScore > 35;
        const themeColor = isHighRisk ? '#ff0055' : isSuspicious ? '#ffb703' : '#00f5a0';

        // 1. Dynamic Face Bounding Box
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(centerX - faceW / 2, centerY - faceH / 2, faceW, faceH);
        ctx.setLineDash([]);

        // 2. Corner Bracket Reticles
        const cornerLen = 18;
        const x1 = centerX - faceW / 2;
        const y1 = centerY - faceH / 2;
        const x2 = centerX + faceW / 2;
        const y2 = centerY + faceH / 2;

        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 3;
        // Top-Left
        ctx.beginPath(); ctx.moveTo(x1, y1 + cornerLen); ctx.lineTo(x1, y1); ctx.lineTo(x1 + cornerLen, y1); ctx.stroke();
        // Top-Right
        ctx.beginPath(); ctx.moveTo(x2 - cornerLen, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y1 + cornerLen); ctx.stroke();
        // Bottom-Left
        ctx.beginPath(); ctx.moveTo(x1, y2 - cornerLen); ctx.lineTo(x1, y2); ctx.lineTo(x1 + cornerLen, y2); ctx.stroke();
        // Bottom-Right
        ctx.beginPath(); ctx.moveTo(x2 - cornerLen, y2); ctx.lineTo(x2, y2); ctx.lineTo(x2, y2 - cornerLen); ctx.stroke();

        // 3. Facial Mesh Keypoints & Triangulation
        const keypoints = [
          // Forehead / Brow
          { x: centerX - 40, y: centerY - 60 },
          { x: centerX, y: centerY - 65 },
          { x: centerX + 40, y: centerY - 60 },
          // Eyes
          { x: centerX - 35, y: centerY - 30 }, // Left eye
          { x: centerX + 35, y: centerY - 30 }, // Right eye
          { x: centerX - 35 + Math.sin(time * 3) * 2, y: centerY - 30 }, // Left pupil
          { x: centerX + 35 + Math.sin(time * 3) * 2, y: centerY - 30 }, // Right pupil
          // Nose Bridge & Tip
          { x: centerX, y: centerY - 10 },
          { x: centerX, y: centerY + 15 },
          { x: centerX - 18, y: centerY + 18 },
          { x: centerX + 18, y: centerY + 18 },
          // Mouth (Lips)
          { x: centerX - 30, y: centerY + 55 },
          { x: centerX, y: centerY + 50 + (audioVolume > 10 ? Math.sin(time * 12) * 8 : 0) },
          { x: centerX + 30, y: centerY + 55 },
          { x: centerX, y: centerY + 65 + (audioVolume > 10 ? Math.sin(time * 12) * 6 : 0) },
          // Jaw & Chin
          { x: centerX - 65, y: centerY + 20 },
          { x: centerX + 65, y: centerY + 20 },
          { x: centerX, y: centerY + 95 }
        ];

        // Draw connections
        ctx.strokeStyle = `${themeColor}44`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Brow to nose
        ctx.moveTo(keypoints[0].x, keypoints[0].y); ctx.lineTo(keypoints[7].x, keypoints[7].y);
        ctx.moveTo(keypoints[2].x, keypoints[2].y); ctx.lineTo(keypoints[7].x, keypoints[7].y);
        // Nose to mouth
        ctx.moveTo(keypoints[8].x, keypoints[8].y); ctx.lineTo(keypoints[12].x, keypoints[12].y);
        ctx.moveTo(keypoints[9].x, keypoints[9].y); ctx.lineTo(keypoints[11].x, keypoints[11].y);
        ctx.moveTo(keypoints[10].x, keypoints[10].y); ctx.lineTo(keypoints[13].x, keypoints[13].y);
        // Mouth outline
        ctx.moveTo(keypoints[11].x, keypoints[11].y);
        ctx.lineTo(keypoints[12].x, keypoints[12].y);
        ctx.lineTo(keypoints[13].x, keypoints[13].y);
        ctx.lineTo(keypoints[14].x, keypoints[14].y);
        ctx.closePath();
        ctx.stroke();

        // Draw keypoint dots
        keypoints.forEach((pt, idx) => {
          ctx.fillStyle = themeColor;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, idx === 5 || idx === 6 ? 3 : 2, 0, Math.PI * 2);
          ctx.fill();
        });

        // 4. Biometric HUD Labels
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = themeColor;
        ctx.fillText(`ID_CONFIDENCE: ${evaluation?.confidenceScore || 95}%`, x1, y1 - 8);
        ctx.fillText(`rPPG_PULSE: ${rppgPulse} BPM`, x1, y2 + 16);
        ctx.fillText(`HEAD_YAW: ${headPose.yaw.toFixed(1)}°`, x2 - 80, y2 + 16);

        if (isHighRisk) {
          ctx.fillStyle = '#ff0055';
          ctx.fillText('⚠️ DEEPFAKE / ARTIFACT DETECTED', x1, y1 - 22);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [cameraActive, evaluation, rppgPulse, headPose, audioVolume]);

  // Draw real-time rPPG Blood Volume Pulse Waveform
  useEffect(() => {
    const canvas = pulseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updatePulseWave = () => {
      const w = canvas.width;
      const h = canvas.height;
      const history = pulseHistoryRef.current;

      const time = Date.now() / 1000;
      // Real-time photoplethysmography waveform calculation with systolic & diastolic peaks
      const sample = Math.sin(time * 4.8) * 0.6 + Math.sin(time * 9.6) * 0.25 + (Math.random() - 0.5) * 0.08;
      history.push(sample);
      if (history.length > w / 3) history.shift();

      ctx.clearRect(0, 0, w, h);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Draw pulse curve
      ctx.strokeStyle = '#00f5a0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const step = w / (w / 3);
      for (let i = 0; i < history.length; i++) {
        const x = i * step;
        const y = h / 2 - history[i] * (h / 2.8);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const interval = setInterval(updatePulseWave, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-card corner-bracket p-4 relative flex flex-col justify-between">
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
          <span className="font-display font-semibold tracking-wider text-sm text-gray-200">
            MULTIMODAL SENSORY HUD
          </span>
          {simulatedFeed && (
            <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-mono">
              SIMULATED HD FEED
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onTriggerChallenge}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 hover:from-emerald-600/50 hover:to-cyan-600/50 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded text-xs font-mono transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CHALLENGE.AI</span>
          </button>

          <button
            onClick={cameraActive ? stopCamera : startCamera}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-mono transition-all border ${
              cameraActive
                ? 'bg-rose-950/40 text-rose-300 border-rose-600/40 hover:bg-rose-900/50'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/50'
            }`}
          >
            {cameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            <span>{cameraActive ? 'DEACTIVATE' : 'ENGAGE SENSORS'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-black/90 rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
        {/* Real Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
            cameraActive && !simulatedFeed ? 'opacity-90' : 'opacity-0'
          }`}
        />

        {/* Simulated Biometric Feed Background when camera not connected or test mode */}
        {cameraActive && simulatedFeed && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center">
            <div className="relative w-48 h-56 rounded-full bg-slate-800/40 border border-emerald-500/20 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-slate-700/30 border border-emerald-400/30 flex items-center justify-center mb-2">
                <ShieldCheck className="w-12 h-12 text-emerald-400/60 animate-pulse" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400/80">SUBJECT_01_SYNTH_FEED</span>
              <span className="text-[9px] font-mono text-gray-400">1080p60 • PCM 48kHz</span>
            </div>
          </div>
        )}

        {/* Inactive Standby State */}
        {!cameraActive && (
          <div className="text-center p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center mb-3">
              <Camera className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-300 font-display font-medium text-sm mb-1">OPTICAL & ACOUSTIC SENSORS IDLE</p>
            <p className="text-xs text-gray-500 font-mono max-w-xs mb-4">
              Click Engage Sensors to initialize real-time WebRTC facial liveness, rPPG blood volume pulse & audio spectrum.
            </p>
            <button
              onClick={startCamera}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold px-4 py-1.5 rounded text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              INITIALIZE FIREWALL STREAM
            </button>
          </div>
        )}

        {/* Canvas HUD Overlay */}
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Scanline Animation Overlay */}
        {cameraActive && <div className="scanline-bar" />}

        {/* Top-Right HUD Badge */}
        {cameraActive && (
          <div className="absolute top-3 right-3 z-20 flex flex-col items-end space-y-1">
            <div className="bg-black/80 backdrop-blur border border-emerald-500/30 rounded px-2.5 py-1 text-[11px] font-mono text-emerald-300 flex items-center space-x-1.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>LIVE_60FPS</span>
            </div>
            <div className="bg-black/80 backdrop-blur border border-cyan-500/30 rounded px-2 py-0.5 text-[10px] font-mono text-cyan-300">
              DCT_SPECTRAL: OK
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sensor Telemetry Strip */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-800 text-xs">
        {/* 1. rPPG Biological Pulse */}
        <div className="bg-black/50 border border-gray-800 rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 font-mono text-[10px] mb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              rPPG BLOOD PULSE
            </span>
            <span className="text-emerald-400 font-bold">{rppgPulse} BPM</span>
          </div>
          <canvas ref={pulseCanvasRef} width={180} height={32} className="w-full h-8" />
        </div>

        {/* 2. Audio Spectrum & Formant */}
        <div className="bg-black/50 border border-gray-800 rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 font-mono text-[10px] mb-1">
            <span className="flex items-center gap-1">
              <Mic className="w-3 h-3 text-cyan-400" />
              VOCODER FFT SPECTRUM
            </span>
            <span className="text-cyan-400 font-bold">{audioVolume} dB</span>
          </div>
          <div className="flex items-end h-8 gap-0.5 justify-between">
            {Array.from(audioSpectrum).slice(0, 18).map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-emerald-400 rounded-t-sm transition-all duration-75"
                style={{ height: `${Math.max(10, Math.min(100, (val / 255) * 100))}%` }}
              />
            ))}
          </div>
        </div>

        {/* 3. Biological Micro-Saccades & Head Orientation */}
        <div className="bg-black/50 border border-gray-800 rounded p-2 flex flex-col justify-between font-mono text-[10px]">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-amber-400" />
              MICRO-SACCADES
            </span>
            <span className="text-amber-400 font-bold">{eyeBlinkCount}/min</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[9px] text-gray-400 pt-1">
            <div>PITCH: <span className="text-gray-200">{headPose.pitch.toFixed(1)}°</span></div>
            <div>YAW: <span className="text-gray-200">{headPose.yaw.toFixed(1)}°</span></div>
            <div>ROLL: <span className="text-gray-200">{headPose.roll.toFixed(1)}°</span></div>
            <div>SYNC_LAG: <span className="text-emerald-400">12ms</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
