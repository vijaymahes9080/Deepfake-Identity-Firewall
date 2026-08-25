import { useState, useEffect, useRef, useCallback } from 'react';

export function useBiometrics() {
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [streamError, setStreamError] = useState(null);
  const [simulatedFeed, setSimulatedFeed] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState(null);
  
  // Real-time telemetry signals
  const [rppgPulse, setRppgPulse] = useState(72); // bpm
  const [audioSpectrum, setAudioSpectrum] = useState(new Uint8Array(32));
  const [audioVolume, setAudioVolume] = useState(0);
  const [eyeBlinkCount, setEyeBlinkCount] = useState(14);
  const [headPose, setHeadPose] = useState({ pitch: 0, yaw: 0, roll: 0 });
  const [behaviorMetrics, setBehaviorMetrics] = useState({
    keystrokeFlightMs: 142,
    mouseEntropy: 0.88,
    interactionCount: 0
  });

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Extract Device Fingerprint
  useEffect(() => {
    const extractFingerprint = async () => {
      try {
        let glVendor = 'Generic WebGL';
        let glRenderer = 'DirectX / Vulkan Standard';
        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
              glVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || glVendor;
              glRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || glRenderer;
            }
          }
        } catch (e) {}

        const devices = navigator.mediaDevices?.enumerateDevices ? await navigator.mediaDevices.enumerateDevices() : [];
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        const audioInputs = devices.filter(d => d.kind === 'audioinput');

        // Check for virtual driver strings
        const isVirtualCam = videoInputs.some(d => 
          /obs|virtual|manycam|vcam|droidcam|xsplit/i.test(d.label || '')
        );

        setDeviceFingerprint({
          userAgent: navigator.userAgent.substring(0, 50) + '...',
          platform: navigator.platform || 'Win32',
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          colorDepth: `${window.screen.colorDepth}-bit`,
          hardwareConcurrency: navigator.hardwareConcurrency || 8,
          deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '8 GB',
          gpuVendor: glVendor,
          gpuRenderer: glRenderer,
          videoDevicesCount: videoInputs.length,
          audioDevicesCount: audioInputs.length,
          virtualDriverDetected: isVirtualCam,
          trustScore: isVirtualCam ? 35 : 98
        });
      } catch (err) {
        console.warn('Fingerprint collection partial error:', err);
      }
    };

    extractFingerprint();
  }, []);

  // Track Behavioral Interactions (Mouse movement & keystroke)
  useEffect(() => {
    let lastKeyTime = Date.now();
    const handleKeyDown = () => {
      const now = Date.now();
      const flight = Math.min(600, Math.max(40, now - lastKeyTime));
      lastKeyTime = now;
      setBehaviorMetrics(prev => ({
        ...prev,
        keystrokeFlightMs: flight,
        interactionCount: prev.interactionCount + 1
      }));
    };

    let lastMouseX = 0;
    let lastMouseY = 0;
    const handleMouseMove = (e) => {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const entropy = Math.min(1.0, Math.max(0.4, (speed % 10) / 10 + 0.3));
      setBehaviorMetrics(prev => ({
        ...prev,
        mouseEntropy: Math.round(entropy * 100) / 100
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Start Live WebRTC Camera
  const startCamera = useCallback(async () => {
    setStreamError(null);
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
          audio: true
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
        setMicActive(true);

        // Setup Audio Analyser
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.8;
            source.connect(analyser);
            analyserRef.current = analyser;
          }
        } catch (e) {
          console.warn('Audio analyser init warning:', e);
        }
      } else {
        throw new Error('getUserMedia not supported in browser environment');
      }
    } catch (err) {
      console.warn('WebRTC Camera capture failed, enabling simulated HD biometric feed:', err.message);
      setStreamError(err.message);
      setSimulatedFeed(true);
      setCameraActive(true);
      setMicActive(true);
    }
  }, []);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setMicActive(false);
    setSimulatedFeed(false);
  }, []);

  // Biometric Loop (Pulse, Audio Spectrum, Head Pose)
  useEffect(() => {
    let interval;
    if (cameraActive) {
      const updateLoop = () => {
        // rPPG Blood volume pulse simulation oscillating around 68-76 bpm
        const time = Date.now() / 1000;
        const simulatedHeartRate = 72 + Math.sin(time * 0.8) * 4;
        setRppgPulse(Math.round(simulatedHeartRate));

        // Head pose subtle micro-movements
        setHeadPose({
          pitch: Math.sin(time * 1.2) * 3.5,
          yaw: Math.cos(time * 0.9) * 4.2,
          roll: Math.sin(time * 0.7) * 1.8
        });

        // Audio spectrum extraction
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          setAudioSpectrum(dataArray.slice(0, 32));
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          setAudioVolume(Math.min(100, Math.round((sum / dataArray.length) * 1.2)));
        } else {
          // Simulated audio spectrum when active
          const fakeSpectrum = new Uint8Array(32);
          for (let i = 0; i < 32; i++) {
            fakeSpectrum[i] = Math.max(5, Math.floor(Math.sin(time * 3 + i * 0.4) * 80 + 100 + Math.random() * 40));
          }
          setAudioSpectrum(fakeSpectrum);
          setAudioVolume(Math.floor(Math.sin(time * 2) * 20 + 35));
        }

        animationFrameRef.current = requestAnimationFrame(updateLoop);
      };

      animationFrameRef.current = requestAnimationFrame(updateLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraActive]);

  return {
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
    behaviorMetrics,
    deviceFingerprint,
    startCamera,
    stopCamera,
    setSimulatedFeed
  };
}
