import React, { useState } from 'react';
import { 
  Wrench, 
  Cpu, 
  Zap, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Plus, 
  Trash2,
  Sliders,
  Gauge,
  HelpCircle
} from 'lucide-react';

export default function RobotBuilder({ 
  robotConfig, 
  setRobotConfig, 
  parts 
}) {
  const [activeTab, setActiveTab] = useState('subsystems'); // 'subsystems' | 'canbus' | 'power'
  const [showAddCanModal, setShowAddCanModal] = useState(false);

  // New CAN device form
  const [newCanDevice, setNewCanDevice] = useState({
    id: 15,
    name: '',
    type: 'Spark MAX',
    bus: 'CAN Bus 1',
    currentAmp: 30
  });

  // Calculate theoretical max speed based on gear ratio and wheel diameter
  // Motor free speed: NEO = 5676 RPM, Kraken = 6000 RPM
  const motorRPM = robotConfig.driveType.includes('Swerve') ? 5676 : 5310;
  const wheelCircumferenceMeters = (robotConfig.wheelDiameterInches * 0.0254) * Math.PI;
  const maxSpeedMps = ((motorRPM / robotConfig.gearRatio) / 60) * wheelCircumferenceMeters;

  // Check for CAN ID collisions
  const canIdCounts = {};
  robotConfig.canDevices.forEach(d => {
    canIdCounts[d.id] = (canIdCounts[d.id] || 0) + 1;
  });
  const hasCanCollision = Object.values(canIdCounts).some(count => count > 1);

  // Total peak current draw calculation
  const totalPeakAmp = robotConfig.canDevices.reduce((acc, d) => acc + (d.currentAmp || 0), 0);

  const handleUpdateConfig = (field, value) => {
    setRobotConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCanDevice = (e) => {
    e.preventDefault();
    if (!newCanDevice.name) return;
    setRobotConfig(prev => ({
      ...prev,
      canDevices: [...prev.canDevices, { ...newCanDevice, id: Number(newCanDevice.id), currentAmp: Number(newCanDevice.currentAmp) }]
    }));
    setShowAddCanModal(false);
    setNewCanDevice({ id: robotConfig.canDevices.length + 1, name: '', type: 'Spark MAX', bus: 'CAN Bus 1', currentAmp: 30 });
  };

  const handleDeleteCanDevice = (id) => {
    setRobotConfig(prev => ({
      ...prev,
      canDevices: prev.canDevices.filter(d => d.id !== id)
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header bar */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-blue">SISTEMA CAD & ARQUITECTURA</span>
              <span className="badge badge-purple">{robotConfig.driveType}</span>
            </div>
            <h2 style={{ fontSize: '1.7rem', color: '#ffffff', marginBottom: '4px' }}>
              Configurador del Robot: <span style={{ color: '#00d2ff' }}>{robotConfig.name}</span>
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Parametrización cinemática del chasis, diseño de subsistemas y mapeo de señales del bus CAN de roboRIO.
            </p>
          </div>

          {/* Subnavigation Pills */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              className={activeTab === 'subsystems' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
              onClick={() => setActiveTab('subsystems')}
            >
              <Layers size={15} /> Subsistemas & Chasis
            </button>
            <button
              className={activeTab === 'canbus' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
              onClick={() => setActiveTab('canbus')}
            >
              <Activity size={15} /> Bus CAN & Señales
            </button>
            <button
              className={activeTab === 'power' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
              onClick={() => setActiveTab('power')}
            >
              <Zap size={15} /> Distribución de Potencia
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Subsistemas & Chasis */}
      {activeTab === 'subsystems' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Kinematics & Mechanical Tuning Card */}
          <div className="grid-cols-3">
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="#00d2ff" /> Transmisión & Cinemática
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label>Tipo de Chasis FRC</label>
                  <select 
                    value={robotConfig.driveType} 
                    onChange={e => handleUpdateConfig('driveType', e.target.value)}
                  >
                    <option value="Swerve Drive MK4i">Swerve Drive MK4i (Holonómico 360°)</option>
                    <option value="Swerve Drive REV MAXSwerve">REV MAXSwerve (Ultracompacto)</option>
                    <option value="Tank Drive 6WD Drop Center">Tank Drive 6WD (Tracción Diferencial Clásica)</option>
                    <option value="Mecanum Drive 4WD">Mecanum Drive (Ruedas de rodillos en 45°)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label>Relación Reducción</label>
                    <select 
                      value={robotConfig.gearRatio} 
                      onChange={e => handleUpdateConfig('gearRatio', Number(e.target.value))}
                    >
                      <option value={8.14}>L1 (8.14:1) - Alta Fuerza</option>
                      <option value={6.75}>L2 (6.75:1) - Balanceado</option>
                      <option value={5.50}>L3 (5.50:1) - Alta Velocidad</option>
                      <option value={10.71}>Tank (10.71:1) - Empuje</option>
                    </select>
                  </div>

                  <div>
                    <label>Diámetro Ruedas</label>
                    <select 
                      value={robotConfig.wheelDiameterInches} 
                      onChange={e => handleUpdateConfig('wheelDiameterInches', Number(e.target.value))}
                    >
                      <option value={3.0}>3.0" (MAXSwerve)</option>
                      <option value={4.0}>4.0" (Colson estándar)</option>
                      <option value={6.0}>6.0" (HiGrip Tank)</option>
                    </select>
                  </div>
                </div>

                {/* Speed result */}
                <div style={{
                  background: 'rgba(0, 210, 255, 0.08)',
                  border: '1px solid rgba(0, 210, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>VELOCIDAD MÁXIMA TEÓRICA</span>
                    <strong className="mono-font" style={{ fontSize: '1.25rem', color: '#00d2ff' }}>
                      {maxSpeedMps.toFixed(2)} m/s
                    </strong>
                  </div>
                  <span className="mono-font" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ({(maxSpeedMps * 3.28084).toFixed(1)} ft/s)
                  </span>
                </div>
              </div>
            </div>

            {/* Subsystems Visual Schematic */}
            <div className="glass-panel" style={{ padding: '20px', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#ffffff' }}>Esquema Físico & Centro de Masa (CoM)</h4>
                <span className="badge badge-blue">Vista Superior & Lateral 2D</span>
              </div>

              {/* Graphical Blueprint */}
              <div style={{
                height: '190px',
                background: 'rgba(4, 8, 16, 0.8)',
                borderRadius: '10px',
                border: '1px dashed rgba(0, 210, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Grid blueprint lines */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00d2ff" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* 2D Robot Chassis Wireframe */}
                <div style={{
                  width: '160px',
                  height: '140px',
                  border: '2px solid #38bdf8',
                  borderRadius: '8px',
                  background: 'rgba(2, 132, 199, 0.1)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(2, 132, 199, 0.25)'
                }}>
                  {/* Swerve 4 modules */}
                  <div style={{ position: 'absolute', top: '-6px', left: '-6px', width: '22px', height: '14px', background: '#00d2ff', borderRadius: '3px' }} title="Módulo Swerve FL" />
                  <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '14px', background: '#00d2ff', borderRadius: '3px' }} title="Módulo Swerve FR" />
                  <div style={{ position: 'absolute', bottom: '-6px', left: '-6px', width: '22px', height: '14px', background: '#00d2ff', borderRadius: '3px' }} title="Módulo Swerve BL" />
                  <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '22px', height: '14px', background: '#00d2ff', borderRadius: '3px' }} title="Módulo Swerve BR" />

                  {/* Intake Roller (Front) */}
                  <div style={{
                    position: 'absolute',
                    top: '-18px',
                    width: '120px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '4px',
                    boxShadow: '0 0 8px #10b981'
                  }} title="Intake Frontal" />

                  {/* Shooter Flywheels (Center-Back) */}
                  <div style={{
                    width: '90px',
                    height: '50px',
                    border: '1px solid #f59e0b',
                    background: 'rgba(245, 158, 11, 0.15)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    color: '#fbbf24',
                    fontWeight: 600
                  }}>
                    SHOOTER {robotConfig.shooterAngleDeg}°
                  </div>

                  {/* Center of Mass (CoM) Target Indicator */}
                  <div style={{
                    position: 'absolute',
                    width: '18px',
                    height: '18px',
                    border: '2px solid #ef4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translate(0, 10px)'
                  }} title="Centro de Masa Estimado (Bajo y centrado)">
                    <div style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }} />
                  </div>
                </div>

                {/* Legend */}
                <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>● CoM:</span> Óptimo (H = 14.2 cm del piso)
                </div>
              </div>
            </div>
          </div>

          {/* Subsystems List Cards */}
          <div className="grid-cols-3">
            {robotConfig.subsystems.map(sub => (
              <div key={sub.id} className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '0.98rem', color: '#ffffff' }}>{sub.name}</h4>
                  <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>{sub.status}</span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  {sub.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)'
                }}>
                  <span>Motores: <strong style={{ color: '#ffffff' }}>{sub.motors}</strong></span>
                  <span>Peso: <strong className="mono-font" style={{ color: '#38bdf8' }}>{sub.weightLbs} lbs</strong></span>
                  <span>Consumo máx: <strong className="mono-font" style={{ color: '#fbbf24' }}>{sub.currentDrawMax}A</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Bus CAN & Nodos */}
      {activeTab === 'canbus' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CAN Status Banner */}
          <div className="glass-panel" style={{
            padding: '20px',
            border: hasCanCollision ? '1px solid #ef4444' : '1px solid rgba(0, 210, 255, 0.25)',
            background: hasCanCollision ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className={hasCanCollision ? 'badge badge-red' : 'badge badge-green'}>
                    {hasCanCollision ? '¡ALERTA DE COLISIÓN DE CAN IDs!' : 'BUS CAN SALUDABLE: 1 Mbit/s'}
                  </span>
                  <span className="badge badge-blue">14 DISPOSITIVOS ACTIVOS</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  En FRC, cada controlador Spark MAX, Talon FX y sensor en el bus CAN debe tener un CAN ID único del 1 al 62.
                  Las colisiones causan desconexiones intermitentes del robot durante el partido.
                </p>
              </div>

              <button className="btn-primary" onClick={() => setShowAddCanModal(true)}>
                <Plus size={16} /> Asignar Nuevo CAN ID
              </button>
            </div>
          </div>

          {/* CAN Chain Visualization */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '14px' }}>
              Topología en Cadena Daisy-Chain del Bus CAN (Regla R714)
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
              {/* roboRIO node */}
              <div style={{
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                padding: '10px 14px',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem',
                flexShrink: 0,
                textAlign: 'center',
                boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)'
              }}>
                <div>roboRIO 2.0</div>
                <span className="mono-font" style={{ fontSize: '0.7rem', opacity: 0.9 }}>ID: 0 (Maestro)</span>
              </div>

              {robotConfig.canDevices.map(d => {
                const isDuplicated = canIdCounts[d.id] > 1;
                return (
                  <React.Fragment key={d.id}>
                    <div style={{ width: '16px', height: '2px', background: isDuplicated ? '#ef4444' : '#00d2ff', flexShrink: 0 }} />
                    <div style={{
                      background: isDuplicated ? 'rgba(239, 68, 68, 0.25)' : 'rgba(15, 23, 42, 0.85)',
                      border: isDuplicated ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      flexShrink: 0,
                      minWidth: '120px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="mono-font" style={{
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          color: isDuplicated ? '#ef4444' : '#38bdf8'
                        }}>
                          CAN ID {d.id}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{d.type}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap' }}>
                        {d.name}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              <div style={{ width: '16px', height: '2px', background: '#10b981', flexShrink: 0 }} />
              {/* Terminator */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                padding: '10px 14px',
                borderRadius: '8px',
                color: '#34d399',
                fontWeight: 700,
                fontSize: '0.75rem',
                flexShrink: 0,
                textAlign: 'center'
              }}>
                <div>Terminador</div>
                <span className="mono-font" style={{ fontSize: '0.68rem' }}>120 Ω (REV PDH)</span>
              </div>
            </div>
          </div>

          {/* CAN Devices Table */}
          <div className="glass-panel" style={{ padding: '0px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 18px' }}>CAN ID</th>
                  <th style={{ padding: '12px 14px' }}>Dispositivo</th>
                  <th style={{ padding: '12px 14px' }}>Tipo de Hardware</th>
                  <th style={{ padding: '12px 14px' }}>Bus de Red</th>
                  <th style={{ padding: '12px 14px' }}>Fusible / Corriente</th>
                  <th style={{ padding: '12px 18px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {robotConfig.canDevices.map(device => {
                  const isDuplicated = canIdCounts[device.id] > 1;
                  return (
                    <tr key={device.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 18px' }}>
                        <span className="mono-font" style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: isDuplicated ? '#ef4444' : '#00d2ff',
                          background: isDuplicated ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 210, 255, 0.1)',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}>
                          ID #{device.id}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#ffffff' }}>
                        {device.name}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                        {device.type}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                          {device.bus}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }} className="mono-font">
                        {device.currentAmp} A
                      </td>
                      <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteCanDevice(device.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            color: '#f87171',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Distribución de Potencia */}
      {activeTab === 'power' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Power Distribution Hub (REV PDH)</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Monitoreo de carga eléctrica estimada frente a la curva de disparo del interruptor general de 120 Amperios.
                </p>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px 18px',
                borderRadius: '8px',
                textAlign: 'right'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>CORRIENTE PICO ESTIMADA</span>
                <div className="tech-font" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>
                  {totalPeakAmp} A
                </div>
                <div style={{ fontSize: '0.72rem', color: totalPeakAmp > 200 ? '#ef4444' : '#10b981' }}>
                  {totalPeakAmp > 200 ? '⚠️ Alerta de Brownout en aceleración brusca' : '✓ Dentro de márgenes seguros para 120A Breaker'}
                </div>
              </div>
            </div>

            {/* Breaker recommendations */}
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>CANALES 40A (Tracción / Disparo)</div>
                <div className="tech-font" style={{ fontSize: '1.3rem', color: '#38bdf8' }}>6 Canales en Uso</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>4x Módulos Swerve + 2x Flywheel Kraken</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>CANALES 20A (Giro & Mecanismos)</div>
                <div className="tech-font" style={{ fontSize: '1.3rem', color: '#10b981' }}>5 Canales en Uso</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>4x Giro Swerve + 1x Intake NEO 550</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>PUERTOS FUSIONADOS 10A / VRM</div>
                <div className="tech-font" style={{ fontSize: '1.3rem', color: '#a78bfa' }}>3 Canales en Uso</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>roboRIO 2.0, Limelight 3A, Radio VH-109</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Asignar Nuevo CAN ID */}
      {showAddCanModal && (
        <div className="modal-overlay" onClick={() => setShowAddCanModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '16px' }}>
              Asignar Nuevo Dispositivo en el Bus CAN
            </h3>

            <form onSubmit={handleAddCanDevice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label>CAN ID (1-62)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="62"
                    value={newCanDevice.id} 
                    onChange={e => setNewCanDevice({ ...newCanDevice, id: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Nombre del Dispositivo</label>
                  <input 
                    type="text" 
                    value={newCanDevice.name} 
                    onChange={e => setNewCanDevice({ ...newCanDevice, name: e.target.value })}
                    placeholder="Ej: Elevador Izquierdo NEO"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Tipo de Hardware</label>
                  <select 
                    value={newCanDevice.type} 
                    onChange={e => setNewCanDevice({ ...newCanDevice, type: e.target.value })}
                  >
                    <option value="Spark MAX">REV Spark MAX</option>
                    <option value="Spark Flex">REV Spark Flex</option>
                    <option value="Talon FX">CTRE Talon FX</option>
                    <option value="CANcoder">CTRE CANcoder</option>
                    <option value="Pigeon 2.0">CTRE Pigeon 2.0 IMU</option>
                    <option value="Pneumatics Hub">REV Pneumatics Hub</option>
                  </select>
                </div>

                <div>
                  <label>Bus de Red</label>
                  <select 
                    value={newCanDevice.bus} 
                    onChange={e => setNewCanDevice({ ...newCanDevice, bus: e.target.value })}
                  >
                    <option value="CAN Bus 1">CAN Bus Nativo (roboRIO)</option>
                    <option value="CANivore">CANivore (Bus Secundario USB)</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Límite de Corriente Sugerido (Amperios)</label>
                <input 
                  type="number" 
                  value={newCanDevice.currentAmp} 
                  onChange={e => setNewCanDevice({ ...newCanDevice, currentAmp: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddCanModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Registrar en el Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
