/**
 * Attack Graph Engine - Reconstructs and visualizes the dynamic deepfake attack chain:
 * Camera Sensor -> Virtual Driver -> Face Swap Inpainting -> Synthetic Voice Splicer -> Replay Layer -> Session Gateway -> Privilege Escalation
 */

export class AttackGraphEngine {
  constructor() {
    this.nodes = [
      { id: 'sensor_cam', label: 'Hardware Camera Sensor', type: 'source', layer: 'Hardware' },
      { id: 'virtual_driver', label: 'Virtual Camera Driver (OBS/vCam)', type: 'interception', layer: 'Driver' },
      { id: 'face_swap', label: 'Neural Face Swap (SimSwap/GAN)', type: 'manipulation', layer: 'Video AI' },
      { id: 'mic_sensor', label: 'Hardware Microphone', type: 'source', layer: 'Hardware' },
      { id: 'voice_clone', label: 'AI Voice Synthesizer (VITS/TTS)', type: 'manipulation', layer: 'Audio AI' },
      { id: 'replay_stream', label: 'Replay Buffer / Screen Capture', type: 'injection', layer: 'Media' },
      { id: 'sync_combiner', label: 'Audio-Video Multiplexer', type: 'pipeline', layer: 'Transport' },
      { id: 'firewall_gate', label: 'Deepfake Identity Firewall', type: 'sentinel', layer: 'Security' },
      { id: 'auth_session', label: 'Authenticated User Session', type: 'target', layer: 'Access' }
    ];

    this.edges = [
      { from: 'sensor_cam', to: 'virtual_driver', defaultActive: false },
      { from: 'sensor_cam', to: 'sync_combiner', defaultActive: true },
      { from: 'virtual_driver', to: 'face_swap', defaultActive: false },
      { from: 'face_swap', to: 'sync_combiner', defaultActive: false },
      { from: 'mic_sensor', to: 'voice_clone', defaultActive: false },
      { from: 'mic_sensor', to: 'sync_combiner', defaultActive: true },
      { from: 'voice_clone', to: 'sync_combiner', defaultActive: false },
      { from: 'replay_stream', to: 'sync_combiner', defaultActive: false },
      { from: 'sync_combiner', to: 'firewall_gate', defaultActive: true },
      { from: 'firewall_gate', to: 'auth_session', defaultActive: true }
    ];
  }

  generateGraph(activeThreats = [], riskScore = 0) {
    const isCompromised = riskScore > 60;
    const isSuspicious = riskScore > 35;

    // Check specific threats
    const hasFaceSwap = activeThreats.some(t => t.toLowerCase().includes('face') || t.toLowerCase().includes('swap'));
    const hasVoiceClone = activeThreats.some(t => t.toLowerCase().includes('voice') || t.toLowerCase().includes('synthetic'));
    const hasVirtualCam = activeThreats.some(t => t.toLowerCase().includes('virtual') || t.toLowerCase().includes('driver'));
    const hasReplay = activeThreats.some(t => t.toLowerCase().includes('replay') || t.toLowerCase().includes('screen'));

    // Dynamic node states
    const dynamicNodes = this.nodes.map(node => {
      let state = 'HEALTHY';
      let threatLevel = 0;

      if (node.id === 'virtual_driver' && (hasVirtualCam || isSuspicious)) {
        state = hasVirtualCam ? 'BREACHED' : 'WARNING';
        threatLevel = hasVirtualCam ? 90 : 40;
      } else if (node.id === 'face_swap' && hasFaceSwap) {
        state = 'BREACHED';
        threatLevel = 95;
      } else if (node.id === 'voice_clone' && hasVoiceClone) {
        state = 'BREACHED';
        threatLevel = 90;
      } else if (node.id === 'replay_stream' && hasReplay) {
        state = 'BREACHED';
        threatLevel = 85;
      } else if (node.id === 'firewall_gate') {
        state = isCompromised ? 'BLOCKED' : isSuspicious ? 'CHALLENGING' : 'SECURE';
      } else if (node.id === 'auth_session') {
        state = isCompromised ? 'LOCKED_OUT' : 'AUTHORIZED';
      }

      return { ...node, state, threatLevel };
    });

    // Dynamic edge activation
    const dynamicEdges = this.edges.map(edge => {
      let active = edge.defaultActive;
      let malicious = false;

      if (edge.from === 'sensor_cam' && edge.to === 'virtual_driver' && (hasVirtualCam || hasFaceSwap)) {
        active = true;
        malicious = true;
      }
      if (edge.from === 'virtual_driver' && edge.to === 'face_swap' && hasFaceSwap) {
        active = true;
        malicious = true;
      }
      if (edge.from === 'face_swap' && edge.to === 'sync_combiner' && hasFaceSwap) {
        active = true;
        malicious = true;
      }
      if (edge.from === 'mic_sensor' && edge.to === 'voice_clone' && hasVoiceClone) {
        active = true;
        malicious = true;
      }
      if (edge.from === 'voice_clone' && edge.to === 'sync_combiner' && hasVoiceClone) {
        active = true;
        malicious = true;
      }
      if (edge.from === 'replay_stream' && edge.to === 'sync_combiner' && hasReplay) {
        active = true;
        malicious = true;
      }

      // If attack route active, disable clean direct route
      if ((hasFaceSwap || hasVirtualCam) && edge.from === 'sensor_cam' && edge.to === 'sync_combiner') {
        active = false;
      }
      if (hasVoiceClone && edge.from === 'mic_sensor' && edge.to === 'sync_combiner') {
        active = false;
      }

      return { ...edge, active, malicious };
    });

    return {
      nodes: dynamicNodes,
      edges: dynamicEdges,
      attackPathDetected: hasFaceSwap || hasVoiceClone || hasVirtualCam || hasReplay,
      entryPoint: hasVirtualCam ? 'Virtual Driver Hook' : hasReplay ? 'Screen Capture Stream' : hasFaceSwap ? 'Real-Time Inpainter' : 'Direct Sensor'
    };
  }
}

export const attackGraphEngine = new AttackGraphEngine();
