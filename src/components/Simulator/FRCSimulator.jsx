import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Target, 
  Sliders, 
  Compass, 
  Activity, 
  Award,
  Flame,
  Zap,
  Radio,
  Gamepad,
  Sparkles
} from 'lucide-react';

// Web Audio API Synthesizer for Authentic FRC Match Sounds
class FRCAudioSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMatchStart() {
    if (this.muted) return;
    this.init();
    // FRC Official Charge Foghorn
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130.81, now); // C3
    osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.35); // C4
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  playScoreChime() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.25);
    });
  }

  playIntakeSound() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playBuzzer() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);
  }
}

const audioSynth = new FRCAudioSynth();

export default function FRCSimulator({ robotConfig, teamInfo }) {
  const canvasRef = useRef(null);

  // Match and Simulation States
  const [matchMode, setMatchMode] = useState('practice'); // 'practice' | 'autonomous' | 'match'
  const [matchPhase, setMatchPhase] = useState('idle'); // 'idle' | 'auto' | 'teleop' | 'endgame' | 'finished'
  const [matchTime, setMatchTime] = useState(150); // 150 seconds total (15s auto + 135s teleop)
  const [scoreBlue, setScoreBlue] = useState(0);
  const [scoreRed, setScoreRed] = useState(0);
  const [piecesScored, setPiecesScored] = useState(0);
  const [rankingPoints, setRankingPoints] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Control Mode: 'swerve' | 'tank'
  const [driveControl, setDriveControl] = useState('swerve');

  // PID Tuning sliders
  const [pidP, setPidP] = useState(0.045);
  const [pidI, setPidI] = useState(0.001);
  const [pidD, setPidD] = useState(0.008);

  // Live Telemetry states for UI
  const [telemetry, setTelemetry] = useState({
    speedMps: 0,
    headingDeg: 0,
    voltage: 12.8,
    currentA: 18,
    intakeLoaded: false,
    autoCycleAccuracy: 94
  });

  // Waypoints for Autonomous Path Planner
  const [autoWaypoints, setAutoWaypoints] = useState([
    { x: 180, y: 220, action: 'start' },
    { x: 380, y: 160, action: 'intake' },
    { x: 190, y: 140, action: 'shoot' },
    { x: 380, y: 250, action: 'intake' },
    { x: 190, y: 140, action: 'shoot' },
  ]);
  const [activeWaypointIndex, setActiveWaypointIndex] = useState(0);

  // Internal mutable simulation state stored in ref for 60fps loop
  const simState = useRef({
    // Robot position in canvas pixels
    x: 180,
    y: 220,
    vx: 0,
    vy: 0,
    angle: 0, // Radians
    vRot: 0,
    hasPiece: false,
    intakeActive: false,
    shooterSpun: true,
    // Dimensions
    width: 44,
    height: 44,
    // Game pieces on field
    pieces: [
      { id: 1, x: 420, y: 130, active: true },
      { id: 2, x: 420, y: 190, active: true },
      { id: 3, x: 420, y: 250, active: true },
      { id: 4, x: 420, y: 310, active: true },
      { id: 5, x: 420, y: 370, active: true },
      { id: 6, x: 260, y: 150, active: true },
      { id: 7, x: 260, y: 250, active: true },
      { id: 8, x: 260, y: 350, active: true },
    ],
    // Projectiles in flight
    projectiles: [],
    // Keys pressed
    keys: {
      w: false,
      a: false,
      s: false,
      d: false,
      q: false,
      e: false,
      space: false,
      f: false,
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
    },
    // Stage climb status
    isClimbed: false,
  });

  // Synchronize audio mute state
  useEffect(() => {
    audioSynth.muted = !soundEnabled;
  }, [soundEnabled]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid scrolling on space/arrows
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      const key = e.key.toLowerCase();
      if (key in simState.current.keys) {
        simState.current.keys[key] = true;
      }
      if (e.code === 'Space') {
        simState.current.keys.space = true;
      }
      if (e.code === 'KeyF') {
        handleShoot();
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key in simState.current.keys) {
        simState.current.keys[key] = false;
      }
      if (e.code === 'Space') {
        simState.current.keys.space = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Shoot Action
  const handleShoot = () => {
    const state = simState.current;
    if (!state.hasPiece) return;

    // Target: Blue Speaker at (70, 110)
    const targetX = 70;
    const targetY = 110;
    const dx = targetX - state.x;
    const dy = targetY - state.y;
    const dist = Math.hypot(dx, dy);

    // Calculate angle towards speaker
    const shootAngle = Math.atan2(dy, dx);
    const speed = 12;

    state.projectiles.push({
      x: state.x,
      y: state.y,
      vx: Math.cos(shootAngle) * speed,
      vy: Math.sin(shootAngle) * speed,
      targetX,
      targetY,
      life: 0,
      maxLife: Math.min(60, dist / speed),
    });

    state.hasPiece = false;
    audioSynth.playScoreChime();
  };

  // Trigger Intake Action
  const triggerIntake = () => {
    simState.current.keys.space = !simState.current.keys.space;
  };

  // Reset Simulation
  const resetSimulation = () => {
    const state = simState.current;
    state.x = 180;
    state.y = 220;
    state.vx = 0;
    state.vy = 0;
    state.angle = 0;
    state.vRot = 0;
    state.hasPiece = false;
    state.isClimbed = false;
    state.projectiles = [];
    state.pieces.forEach(p => p.active = true);
    setScoreBlue(0);
    setScoreRed(0);
    setPiecesScored(0);
    setMatchTime(150);
    setMatchPhase('idle');
    setActiveWaypointIndex(0);
  };

  // Match Timer Controller
  useEffect(() => {
    if (matchMode !== 'match' || matchPhase === 'idle' || matchPhase === 'finished') return;

    const interval = setInterval(() => {
      setMatchTime((prev) => {
        if (prev <= 1) {
          setMatchPhase('finished');
          audioSynth.playBuzzer();
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          return 0;
        }

        const next = prev - 1;
        // Phase switches
        if (next === 135) {
          setMatchPhase('teleop');
          audioSynth.playMatchStart();
        } else if (next === 20) {
          setMatchPhase('endgame');
          audioSynth.playIntakeSound();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [matchMode, matchPhase]);

  // Start Official Match
  const startOfficialMatch = () => {
    resetSimulation();
    setMatchMode('match');
    setMatchPhase('auto');
    setMatchTime(150);
    audioSynth.playMatchStart();
  };

  // Main 60 FPS Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const state = simState.current;
      const keys = state.keys;

      // --- 1. PHYSICAL UPDATES ---
      const maxAcc = 0.55;
      const friction = 0.88;
      const rotFriction = 0.82;

      if (matchMode === 'autonomous' || (matchMode === 'match' && matchPhase === 'auto')) {
        // AUTONOMOUS WAYPOINT PID TRACKING
        if (autoWaypoints.length > 0 && activeWaypointIndex < autoWaypoints.length) {
          const targetWp = autoWaypoints[activeWaypointIndex];
          const dx = targetWp.x - state.x;
          const dy = targetWp.y - state.y;
          const dist = Math.hypot(dx, dy);

          // PID Position controller
          const desiredVx = dx * pidP;
          const desiredVy = dy * pidP;

          state.vx += (desiredVx - state.vx) * 0.2;
          state.vy += (desiredVy - state.vy) * 0.2;

          // Align heading towards waypoint
          const targetHeading = Math.atan2(dy, dx);
          let headingErr = targetHeading - state.angle;
          while (headingErr > Math.PI) headingErr -= Math.PI * 2;
          while (headingErr < -Math.PI) headingErr += Math.PI * 2;
          state.vRot += headingErr * 0.1;

          // Waypoint reached condition
          if (dist < 18) {
            if (targetWp.action === 'intake') {
              // Auto-intake near piece
              state.pieces.forEach(p => {
                if (p.active && Math.hypot(p.x - state.x, p.y - state.y) < 40) {
                  p.active = false;
                  state.hasPiece = true;
                  audioSynth.playIntakeSound();
                }
              });
            } else if (targetWp.action === 'shoot' && state.hasPiece) {
              handleShoot();
            }

            if (activeWaypointIndex < autoWaypoints.length - 1) {
              setActiveWaypointIndex(prev => prev + 1);
            }
          }
        }
      } else {
        // TELEOPERATED CONTROL (SWERVE OR TANK)
        if (driveControl === 'swerve') {
          // Field-Oriented or Robot-Oriented Swerve
          let ax = 0;
          let ay = 0;
          if (keys.w || keys.ArrowUp) ay -= maxAcc;
          if (keys.s || keys.ArrowDown) ay += maxAcc;
          if (keys.a) ax -= maxAcc;
          if (keys.d) ax += maxAcc;

          state.vx += ax;
          state.vy += ay;

          // Rotation
          if (keys.q || keys.ArrowLeft) state.vRot -= 0.04;
          if (keys.e || keys.ArrowRight) state.vRot += 0.04;
        } else {
          // Arcade / Tank drive
          let forward = 0;
          if (keys.w || keys.ArrowUp) forward += maxAcc;
          if (keys.s || keys.ArrowDown) forward -= maxAcc;

          state.vx += Math.cos(state.angle) * forward;
          state.vy += Math.sin(state.angle) * forward;

          if (keys.a || keys.ArrowLeft) state.vRot -= 0.04;
          if (keys.d || keys.ArrowRight) state.vRot += 0.04;
        }
      }

      // Apply friction and integrate velocities
      state.vx *= friction;
      state.vy *= friction;
      state.vRot *= rotFriction;

      state.x += state.vx;
      state.y += state.vy;
      state.angle += state.vRot;

      // Arena boundary collisions (Field: 840 x 480)
      const halfW = state.width / 2;
      const halfH = state.height / 2;
      if (state.x < halfW + 15) { state.x = halfW + 15; state.vx = 0; }
      if (state.x > 840 - halfW - 15) { state.x = 840 - halfW - 15; state.vx = 0; }
      if (state.y < halfH + 15) { state.y = halfH + 15; state.vy = 0; }
      if (state.y > 480 - halfH - 15) { state.y = 480 - halfH - 15; state.vy = 0; }

      // Intake Logic: If space is held or near piece with front bumper
      const isIntaking = keys.space || state.intakeActive;
      if (isIntaking && !state.hasPiece) {
        state.pieces.forEach(p => {
          if (p.active) {
            const dist = Math.hypot(p.x - state.x, p.y - state.y);
            if (dist < 42) {
              p.active = false;
              state.hasPiece = true;
              audioSynth.playIntakeSound();
            }
          }
        });
      }

      // Projectiles update
      for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const proj = state.projectiles[i];
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.life += 1;

        // Check if inside Speaker target zone (x: 40-100, y: 80-140)
        if (proj.x < 110 && proj.y > 80 && proj.y < 150) {
          setScoreBlue(prev => prev + 5);
          setPiecesScored(prev => prev + 1);
          state.projectiles.splice(i, 1);
          continue;
        }

        if (proj.life >= proj.maxLife) {
          state.projectiles.splice(i, 1);
        }
      }

      // Stage Hanging / Climb detection at Endgame
      const inStageZone = (state.x > 220 && state.x < 300 && state.y > 200 && state.y < 280);
      if (inStageZone && (matchPhase === 'endgame' || matchMode === 'practice')) {
        state.isClimbed = true;
      }

      // Update UI Telemetry at throttled intervals
      const currentSpeed = Math.hypot(state.vx, state.vy) * 0.45;
      const headingDeg = Math.round(((state.angle * 180 / Math.PI) % 360 + 360) % 360);
      // Realistic battery voltage sag during heavy acceleration
      const currentAmp = 15 + Math.round(currentSpeed * 28);
      const voltageSag = 12.82 - (currentAmp * 0.012);

      setTelemetry({
        speedMps: currentSpeed,
        headingDeg,
        voltage: Number(voltageSag.toFixed(2)),
        currentA: currentAmp,
        intakeLoaded: state.hasPiece,
        autoCycleAccuracy: 95
      });

      // --- 2. CANVAS RENDERING ---
      ctx.clearRect(0, 0, 840, 480);

      // Carpet Background (Dark high-durability FRC gray carpet)
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, 840, 480);

      // Field Perimeter Walls
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 820, 460);

      // Center Field Dividing Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(420, 10);
      ctx.lineTo(420, 470);
      ctx.stroke();
      ctx.setLineDash([]);

      // Blue Alliance Wing Line (Left)
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 240, 460);

      // Red Alliance Wing Line (Right)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.strokeRect(590, 10, 240, 460);

      // Blue Speaker (Upper Left Goal)
      ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
      ctx.fillRect(10, 80, 80, 70);
      ctx.strokeStyle = '#00d2ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 80, 80, 70);
      ctx.fillStyle = '#00d2ff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('SPEAKER (5 PTS)', 15, 120);

      // Blue Amp (Bottom Left)
      ctx.fillStyle = 'rgba(2, 132, 199, 0.25)';
      ctx.fillRect(10, 390, 70, 70);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(10, 390, 70, 70);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('AMP (2 PTS)', 15, 430);

      // Blue Stage / Climb Zone (Center-Left)
      ctx.fillStyle = inStageZone ? 'rgba(16, 185, 129, 0.25)' : 'rgba(139, 92, 246, 0.15)';
      ctx.strokeStyle = inStageZone ? '#10b981' : '#8b5cf6';
      ctx.beginPath();
      ctx.arc(260, 240, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#a78bfa';
      ctx.fillText('STAGE / CLIMB', 225, 245);

      // Red Speaker & Amp (Right side visual symmetry)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(750, 80, 80, 70);
      ctx.strokeStyle = '#f87171';
      ctx.strokeRect(750, 80, 80, 70);
      ctx.fillStyle = '#f87171';
      ctx.fillText('SPEAKER RED', 755, 120);

      // Draw Autonomous Waypoints Trail
      if (matchMode === 'autonomous' || (matchMode === 'match' && matchPhase === 'auto')) {
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        autoWaypoints.forEach((wp, index) => {
          if (index === 0) ctx.moveTo(wp.x, wp.y);
          else ctx.lineTo(wp.x, wp.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw waypoint dots
        autoWaypoints.forEach((wp, index) => {
          ctx.fillStyle = index === activeWaypointIndex ? '#00ff88' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px sans-serif';
          ctx.fillText(`WP${index + 1}`, wp.x + 8, wp.y + 4);
        });
      }

      // Draw Game Pieces (FRC Orange Notes / Rings)
      state.pieces.forEach(p => {
        if (!p.active) return;
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
        ctx.fill();
        // Inner hole
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw Flying Projectiles (Shooter shots)
      state.projectiles.forEach(proj => {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Robot (Centered at state.x, state.y with rotation state.angle)
      ctx.save();
      ctx.translate(state.x, state.y);
      ctx.rotate(state.angle);

      // Intake active glow zone (Front of robot)
      if (isIntaking) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.fillRect(state.width / 2, -state.height / 2, 20, state.height);
        ctx.strokeStyle = '#10b981';
        ctx.strokeRect(state.width / 2, -state.height / 2, 20, state.height);
      }

      // Bumpers (Blue Alliance official bumpers with team #)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-state.width / 2, -state.height / 2, state.width, state.height);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(-state.width / 2, -state.height / 2, state.width, state.height);

      // Internal Robot Chassis Base
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-state.width / 2 + 5, -state.height / 2 + 5, state.width - 10, state.height - 10);

      // 4 Swerve Module Pods
      const podW = 8;
      const podH = 6;
      ctx.fillStyle = '#00d2ff';
      // Front-Right
      ctx.fillRect(state.width / 2 - 12, -state.height / 2 + 3, podW, podH);
      // Front-Left
      ctx.fillRect(state.width / 2 - 12, state.height / 2 - 9, podW, podH);
      // Back-Right
      ctx.fillRect(-state.width / 2 + 4, -state.height / 2 + 3, podW, podH);
      // Back-Left
      ctx.fillRect(-state.width / 2 + 4, state.height / 2 - 9, podW, podH);

      // Shooter direction arrow
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(state.width / 2 - 4, 0);
      ctx.lineTo(state.width / 2 - 14, -6);
      ctx.lineTo(state.width / 2 - 14, 6);
      ctx.closePath();
      ctx.fill();

      // Team Number on Bumpers
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(teamInfo.teamNumber, 0, 0);

      // Indicator if Robot is holding a Note
      if (state.hasPiece) {
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Climber Hook Graphic if climbed
      if (state.isClimbed) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -state.height / 2);
        ctx.lineTo(0, -state.height / 2 - 15);
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [matchMode, matchPhase, driveControl, pidP, activeWaypointIndex, autoWaypoints]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Match Control Bar */}
      <div className="glass-panel" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              gap: '4px'
            }}>
              <button
                className={matchMode === 'practice' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '7px 14px', fontSize: '0.84rem' }}
                onClick={() => { setMatchMode('practice'); resetSimulation(); }}
              >
                <Gamepad size={15} /> Práctica Libre
              </button>
              <button
                className={matchMode === 'autonomous' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '7px 14px', fontSize: '0.84rem' }}
                onClick={() => { setMatchMode('autonomous'); resetSimulation(); }}
              >
                <Target size={15} /> Prueba Autónomo (15s)
              </button>
              <button
                className={matchMode === 'match' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '7px 14px', fontSize: '0.84rem' }}
                onClick={startOfficialMatch}
              >
                <Flame size={15} /> Match Oficial FRC
              </button>
            </div>

            <button 
              className="btn-secondary" 
              onClick={resetSimulation} 
              title="Reiniciar robot y piezas"
              style={{ padding: '8px' }}
            >
              <RotateCcw size={16} />
            </button>

            <button
              className="btn-secondary"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Silenciar sonidos de match' : 'Activar efectos de audio'}
              style={{ padding: '8px' }}
            >
              {soundEnabled ? <Volume2 size={16} color="#00ff88" /> : <VolumeX size={16} color="#94a3b8" />}
            </button>
          </div>

          {/* Match Scoreboard */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(0, 0, 0, 0.45)',
            padding: '8px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {/* Blue Alliance Score */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>ALIANZA AZUL</span>
              <div className="tech-font" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
                {scoreBlue}
              </div>
            </div>

            {/* Match Clock */}
            <div style={{
              padding: '0 16px',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <span className="mono-font" style={{
                fontSize: '0.72rem',
                color: matchPhase === 'auto' ? '#fbbf24' : matchPhase === 'endgame' ? '#f87171' : 'var(--text-muted)',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {matchPhase === 'idle' ? 'LISTO' : matchPhase}
              </span>
              <div className="mono-font" style={{
                fontSize: '1.8rem',
                fontWeight: 900,
                color: matchTime <= 20 ? '#ef4444' : '#ffffff'
              }}>
                {Math.floor(matchTime / 60)}:{(matchTime % 60).toString().padStart(2, '0')}
              </div>
            </div>

            {/* Red Alliance */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 700 }}>ALIANZA ROJA</span>
              <div className="tech-font" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f87171' }}>
                {scoreRed}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Field Canvas + Live Telemetry Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '840px 1fr', gap: '20px' }}>
        {/* Canvas Field Container */}
        <div className="glass-panel" style={{ padding: '14px', position: 'relative' }}>
          <canvas
            ref={canvasRef}
            width={840}
            height={480}
            style={{
              display: 'block',
              borderRadius: '8px',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.6)'
            }}
          />

          {/* Interactive Action Controls Bar Under Canvas */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            padding: '8px 12px',
            background: 'rgba(15, 23, 42, 0.7)',
            borderRadius: '8px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <span>🎮 <strong>WASD / Flechas</strong>: Conducir</span>
              <span>🔄 <strong>Q / E</strong>: Girar Swerve</span>
              <span>⚡ <strong>ESPACIO</strong>: Intake</span>
              <span>🎯 <strong>F</strong>: Disparar al Speaker</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-secondary"
                onClick={triggerIntake}
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                Intake {simState.current.hasPiece ? '(Cargado)' : '(Vacío)'}
              </button>
              <button
                className="btn-primary"
                onClick={handleShoot}
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                Disparar (F)
              </button>
            </div>
          </div>
        </div>

        {/* Live Telemetry Gauges & PID Tuning Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Driver Station Telemetry */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <h4 style={{ fontSize: '0.92rem', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="#00ff88" /> Telemetría roboRIO en Vivo
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Speed */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VELOCIDAD SWERVE</span>
                <div className="tech-font" style={{ fontSize: '1.4rem', color: '#00d2ff', fontWeight: 800 }}>
                  {telemetry.speedMps.toFixed(2)} <span style={{ fontSize: '0.75rem' }}>m/s</span>
                </div>
              </div>

              {/* Heading IMU */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RUMBO GIROSCOPIO</span>
                <div className="tech-font" style={{ fontSize: '1.4rem', color: '#fbbf24', fontWeight: 800 }}>
                  {telemetry.headingDeg}°
                </div>
              </div>

              {/* Voltage Sag */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VOLTAJE BATERÍA</span>
                <div className="tech-font" style={{ fontSize: '1.4rem', color: telemetry.voltage < 11.5 ? '#ef4444' : '#10b981', fontWeight: 800 }}>
                  {telemetry.voltage} V
                </div>
              </div>

              {/* Current */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CORRIENTE TOTAL</span>
                <div className="tech-font" style={{ fontSize: '1.4rem', color: '#a78bfa', fontWeight: 800 }}>
                  {telemetry.currentA} A
                </div>
              </div>
            </div>

            {/* Note Status */}
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: telemetry.intakeLoaded ? 'rgba(234, 88, 12, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: telemetry.intakeLoaded ? '1px solid #ea580c' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem'
            }}>
              <span style={{ color: telemetry.intakeLoaded ? '#fb923c' : 'var(--text-muted)', fontWeight: 600 }}>
                Sensor Óptico de Pieza
              </span>
              <span className="badge" style={{
                background: telemetry.intakeLoaded ? '#ea580c' : 'transparent',
                color: '#ffffff'
              }}>
                {telemetry.intakeLoaded ? 'PIEZA EN TOLVA' : 'VACÍO'}
              </span>
            </div>
          </div>

          {/* Closed-Loop PID Tuning Box */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '0.92rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="#38bdf8" /> Calibración PID (Trayectorias)
              </h4>
              <span className="badge badge-blue">WPILib PIDController</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Proporcional (Kp): Constante de corrección</span>
                  <span className="mono-font" style={{ color: '#00d2ff' }}>{pidP.toFixed(3)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.10" 
                  step="0.005"
                  value={pidP} 
                  onChange={e => setPidP(Number(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Integral (Ki): Eliminación de error estático</span>
                  <span className="mono-font" style={{ color: '#00d2ff' }}>{pidI.toFixed(3)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="0.01" 
                  step="0.001"
                  value={pidI} 
                  onChange={e => setPidI(Number(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Derivativo (Kd): Amortiguamiento de sobreimpulso</span>
                  <span className="mono-font" style={{ color: '#00d2ff' }}>{pidD.toFixed(3)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="0.03" 
                  step="0.002"
                  value={pidD} 
                  onChange={e => setPidD(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Drive Control Switcher */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              MODO DE TRANSMISIÓN DE CONTROL
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                className={driveControl === 'swerve' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                onClick={() => setDriveControl('swerve')}
              >
                Swerve Holonómico
              </button>
              <button
                className={driveControl === 'tank' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '7px 10px', fontSize: '0.8rem' }}
                onClick={() => setDriveControl('tank')}
              >
                Arcade / Tank 6WD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
