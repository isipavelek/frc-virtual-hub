import React, { useState } from 'react';
import { 
  ClipboardList, 
  Users, 
  Trophy, 
  BarChart2, 
  Search, 
  Plus, 
  Check, 
  ShieldCheck, 
  Zap, 
  Flame,
  ArrowRight
} from 'lucide-react';

export default function MatchScouting({ teamInfo }) {
  const [activeTab, setActiveTab] = useState('alliance-sim'); // 'alliance-sim' | 'scouting-list'
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  // Teams database for regional tournament
  const [teams, setTeams] = useState([
    {
      number: "9482",
      name: "CyberRobotics College (Nuestro Equipo)",
      drivetrain: "Swerve MK4i",
      autoNotes: 3,
      teleopCycles: 9,
      climbReliability: 90, // %
      weightLbs: 118.5,
      epa: 54.2, // Expected Points Added
      notes: "Swerve ágil, buen tiro a media distancia, climb rápido."
    },
    {
      number: "4476",
      name: "Wafflebots",
      drivetrain: "Swerve SDS MK4",
      autoNotes: 4,
      teleopCycles: 11,
      climbReliability: 95,
      weightLbs: 122.0,
      epa: 62.8,
      notes: "Excelente shooter con visión Limelight, consistencia top."
    },
    {
      number: "6832",
      name: "Iron Steer Robotics",
      drivetrain: "Tank Drive 6WD",
      autoNotes: 2,
      teleopCycles: 6,
      climbReliability: 80,
      weightLbs: 124.8,
      epa: 38.5,
      notes: "Muy buen robot defensivo, chasis robusto con reductor de empuje."
    },
    {
      number: "8022",
      name: "Titans Tech",
      drivetrain: "Swerve REV MAXSwerve",
      autoNotes: 3,
      teleopCycles: 8,
      climbReliability: 85,
      weightLbs: 115.0,
      epa: 48.0,
      notes: "Alimentación rápida de piezas de piso, intake flotante."
    },
    {
      number: "7451",
      name: "Quantum Hawks",
      drivetrain: "Tank Drive 6WD",
      autoNotes: 1,
      teleopCycles: 5,
      climbReliability: 60,
      weightLbs: 120.5,
      epa: 31.0,
      notes: "Rookie team entusiasta, buen alimentador humano de Amp."
    },
    {
      number: "5985",
      name: "Project Bucephalus",
      drivetrain: "Swerve MK4i",
      autoNotes: 4,
      teleopCycles: 12,
      climbReliability: 98,
      weightLbs: 121.2,
      epa: 68.4,
      notes: "Capitán veterano, tiro en movimiento y auto de 4 notas."
    }
  ]);

  // Alliance Selection State
  const [blueAlliance, setBlueAlliance] = useState(["9482", "4476", "8022"]);
  const [redAlliance, setRedAlliance] = useState(["5985", "6832", "7451"]);

  // Simulation Results
  const [simResult, setSimResult] = useState(null);

  // New Team Form state
  const [newTeam, setNewTeam] = useState({
    number: '',
    name: '',
    drivetrain: 'Swerve MK4i',
    autoNotes: 2,
    teleopCycles: 7,
    climbReliability: 85,
    weightLbs: 120,
    notes: ''
  });

  const runAllianceSimulation = () => {
    const getTeam = (num) => teams.find(t => t.number === num);

    const blueTeams = blueAlliance.map(getTeam).filter(Boolean);
    const redTeams = redAlliance.map(getTeam).filter(Boolean);

    // Calculate Blue stats
    const blueAuto = blueTeams.reduce((acc, t) => acc + (t.autoNotes * 5 + 2), 0);
    const blueTeleop = blueTeams.reduce((acc, t) => acc + (t.teleopCycles * 3.5), 0);
    const blueEndgame = blueTeams.reduce((acc, t) => acc + ((t.climbReliability / 100) * 3), 0);
    const blueTotal = Math.round(blueAuto + blueTeleop + blueEndgame + (Math.random() * 8 - 4));

    // Calculate Red stats
    const redAuto = redTeams.reduce((acc, t) => acc + (t.autoNotes * 5 + 2), 0);
    const redTeleop = redTeams.reduce((acc, t) => acc + (t.teleopCycles * 3.5), 0);
    const redEndgame = redTeams.reduce((acc, t) => acc + ((t.climbReliability / 100) * 3), 0);
    const redTotal = Math.round(redAuto + redTeleop + redEndgame + (Math.random() * 8 - 4));

    const blueWinProb = Math.round((blueTotal / (blueTotal + redTotal)) * 100);

    setSimResult({
      blueScore: blueTotal,
      redScore: redTotal,
      blueAuto: Math.round(blueAuto),
      redAuto: Math.round(redAuto),
      blueTeleop: Math.round(blueTeleop),
      redTeleop: Math.round(redTeleop),
      blueEndgame: Math.round(blueEndgame),
      redEndgame: Math.round(redEndgame),
      winner: blueTotal > redTotal ? 'blue' : 'red',
      blueWinProb,
      redWinProb: 100 - blueWinProb,
      blueRP: (blueTotal > redTotal ? 2 : 0) + (blueAuto >= 18 ? 1 : 0) + (blueEndgame >= 10 ? 1 : 0),
      redRP: (redTotal > blueTotal ? 2 : 0) + (redAuto >= 18 ? 1 : 0) + (redEndgame >= 10 ? 1 : 0),
    });
  };

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!newTeam.number || !newTeam.name) return;
    const epa = Number(newTeam.autoNotes) * 5 + Number(newTeam.teleopCycles) * 3.5 + 5;
    const team = {
      ...newTeam,
      autoNotes: Number(newTeam.autoNotes),
      teleopCycles: Number(newTeam.teleopCycles),
      climbReliability: Number(newTeam.climbReliability),
      weightLbs: Number(newTeam.weightLbs),
      epa: Number(epa.toFixed(1))
    };
    setTeams(prev => [...prev, team]);
    setShowAddTeamModal(false);
    setNewTeam({ number: '', name: '', drivetrain: 'Swerve MK4i', autoNotes: 2, teleopCycles: 7, climbReliability: 85, weightLbs: 120, notes: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header bar */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-purple">ESTRATEGIA & SCOUTING</span>
              <span className="badge badge-blue">FORMATO OFICIAL FRC 3 VS 3</span>
            </div>
            <h2 style={{ fontSize: '1.7rem', color: '#ffffff', marginBottom: '4px' }}>
              Simulador de Alianzas & Base de Scouting
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Predicción estadística de matches eliminatorios, análisis de consistencia (EPA) y cuaderno de scouting en boxes (Pit Scouting).
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              className={activeTab === 'alliance-sim' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
              onClick={() => setActiveTab('alliance-sim')}
            >
              <Trophy size={15} /> Simulador 3 vs 3
            </button>
            <button
              className={activeTab === 'scouting-list' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
              onClick={() => setActiveTab('scouting-list')}
            >
              <ClipboardList size={15} /> Base de Scouting ({teams.length})
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: 3 vs 3 Alliance Simulator */}
      {activeTab === 'alliance-sim' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Alliance Selector Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Blue Alliance Card */}
            <div className="glass-panel" style={{
              padding: '20px',
              border: '1px solid rgba(2, 132, 199, 0.4)',
              background: 'radial-gradient(ellipse at top left, rgba(2, 132, 199, 0.2) 0%, rgba(15, 23, 42, 0.8) 70%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#38bdf8' }}>Alianza Azul (3 Robots)</h3>
                <span className="badge badge-blue">DEFENSA / ATAQUE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[0, 1, 2].map(slot => (
                  <div key={slot}>
                    <label style={{ fontSize: '0.72rem', color: '#38bdf8' }}>Robot Azul {slot + 1}</label>
                    <select
                      value={blueAlliance[slot] || ''}
                      onChange={e => {
                        const newAll = [...blueAlliance];
                        newAll[slot] = e.target.value;
                        setBlueAlliance(newAll);
                      }}
                    >
                      {teams.map(t => (
                        <option key={t.number} value={t.number}>
                          #{t.number} - {t.name} ({t.drivetrain} | EPA: {t.epa})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Alliance Card */}
            <div className="glass-panel" style={{
              padding: '20px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'radial-gradient(ellipse at top right, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.8) 70%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#f87171' }}>Alianza Roja (3 Robots)</h3>
                <span className="badge badge-red">RIVALES</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[0, 1, 2].map(slot => (
                  <div key={slot}>
                    <label style={{ fontSize: '0.72rem', color: '#f87171' }}>Robot Rojo {slot + 1}</label>
                    <select
                      value={redAlliance[slot] || ''}
                      onChange={e => {
                        const newAll = [...redAlliance];
                        newAll[slot] = e.target.value;
                        setRedAlliance(newAll);
                      }}
                    >
                      {teams.map(t => (
                        <option key={t.number} value={t.number}>
                          #{t.number} - {t.name} ({t.drivetrain} | EPA: {t.epa})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              className="btn-primary"
              style={{ fontSize: '1.05rem', padding: '12px 28px' }}
              onClick={runAllianceSimulation}
            >
              <Zap size={18} /> Simular Resultado del Match
            </button>
          </div>

          {/* Simulation Outcome Display */}
          {simResult && (
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
                  RESULTADO ESTIMADO DEL MATCH
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '28px', marginTop: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>ALIANZA AZUL</span>
                    <div className="tech-font" style={{ fontSize: '3rem', fontWeight: 900, color: '#38bdf8' }}>
                      {simResult.blueScore}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Probabilidad: <strong style={{ color: '#38bdf8' }}>{simResult.blueWinProb}%</strong>
                    </span>
                  </div>

                  <div className="tech-font" style={{ fontSize: '1.8rem', color: 'var(--text-dim)' }}>
                    VS
                  </div>

                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 700 }}>ALIANZA ROJA</span>
                    <div className="tech-font" style={{ fontSize: '3rem', fontWeight: 900, color: '#f87171' }}>
                      {simResult.redScore}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Probabilidad: <strong style={{ color: '#f87171' }}>{simResult.redWinProb}%</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown Table */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>PERIODO AUTÓNOMO</span>
                  <div className="mono-font" style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>
                    <span style={{ color: '#38bdf8' }}>{simResult.blueAuto} pts</span> vs <span style={{ color: '#f87171' }}>{simResult.redAuto} pts</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>TELEOPERADO (CICLOS)</span>
                  <div className="mono-font" style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>
                    <span style={{ color: '#38bdf8' }}>{simResult.blueTeleop} pts</span> vs <span style={{ color: '#f87171' }}>{simResult.redTeleop} pts</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>ENDGAME (ESCALADA)</span>
                  <div className="mono-font" style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>
                    <span style={{ color: '#38bdf8' }}>{simResult.blueEndgame} pts</span> vs <span style={{ color: '#f87171' }}>{simResult.redEndgame} pts</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>RANKING POINTS (RP)</span>
                  <div className="mono-font" style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>
                    <span style={{ color: '#38bdf8' }}>+{simResult.blueRP} RP</span> vs <span style={{ color: '#f87171' }}>+{simResult.redRP} RP</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Pit Scouting Database */}
      {activeTab === 'scouting-list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={() => setShowAddTeamModal(true)}>
              <Plus size={16} /> Agregar Equipo Scouteado en Pit
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '0px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 18px' }}>Equipo FRC</th>
                  <th style={{ padding: '14px 14px' }}>Chasis</th>
                  <th style={{ padding: '14px 14px' }}>Notas Autónomo</th>
                  <th style={{ padding: '14px 14px' }}>Ciclos Teleop/Min</th>
                  <th style={{ padding: '14px 14px' }}>Fiabilidad Climb</th>
                  <th style={{ padding: '14px 14px' }}>EPA Estimado</th>
                  <th style={{ padding: '14px 18px' }}>Notas de Observación</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => (
                  <tr key={team.number} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="mono-font" style={{ fontWeight: 800, color: '#00d2ff' }}>
                          #{team.number}
                        </span>
                        <strong style={{ color: '#ffffff' }}>{team.name}</strong>
                      </div>
                    </td>

                    <td style={{ padding: '14px 14px' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                        {team.drivetrain}
                      </span>
                    </td>

                    <td style={{ padding: '14px 14px' }} className="mono-font">
                      {team.autoNotes} piezas
                    </td>

                    <td style={{ padding: '14px 14px' }} className="mono-font">
                      {team.teleopCycles} ciclos
                    </td>

                    <td style={{ padding: '14px 14px' }}>
                      <span style={{ color: team.climbReliability >= 90 ? '#10b981' : '#fbbf24', fontWeight: 600 }}>
                        {team.climbReliability}%
                      </span>
                    </td>

                    <td style={{ padding: '14px 14px' }}>
                      <span className="tech-font" style={{ color: '#00ff88', fontSize: '1.05rem', fontWeight: 700 }}>
                        {team.epa}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {team.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Agregar Equipo Scouteado */}
      {showAddTeamModal && (
        <div className="modal-overlay" onClick={() => setShowAddTeamModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '16px' }}>
              Registrar Reporte de Pit Scouting
            </h3>

            <form onSubmit={handleAddTeam} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label>Número de Equipo</label>
                  <input 
                    type="text" 
                    value={newTeam.number} 
                    onChange={e => setNewTeam({ ...newTeam, number: e.target.value })}
                    placeholder="Ej: 5887"
                    required
                  />
                </div>

                <div>
                  <label>Nombre del Equipo</label>
                  <input 
                    type="text" 
                    value={newTeam.name} 
                    onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                    placeholder="Ej: Imperator Robotics"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Tipo de Transmisión</label>
                  <select 
                    value={newTeam.drivetrain} 
                    onChange={e => setNewTeam({ ...newTeam, drivetrain: e.target.value })}
                  >
                    <option value="Swerve MK4i">Swerve MK4i</option>
                    <option value="Swerve MAXSwerve">REV MAXSwerve</option>
                    <option value="Tank Drive 6WD">Tank 6WD</option>
                    <option value="Mecanum">Mecanum</option>
                  </select>
                </div>

                <div>
                  <label>Piezas en Autónomo (15s)</label>
                  <input 
                    type="number" 
                    value={newTeam.autoNotes} 
                    onChange={e => setNewTeam({ ...newTeam, autoNotes: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Ciclos en Teleoperado</label>
                  <input 
                    type="number" 
                    value={newTeam.teleopCycles} 
                    onChange={e => setNewTeam({ ...newTeam, teleopCycles: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Fiabilidad de Escalada (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={newTeam.climbReliability} 
                    onChange={e => setNewTeam({ ...newTeam, climbReliability: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Notas Técnicas y Observaciones de Pit</label>
                <textarea 
                  rows={3}
                  value={newTeam.notes} 
                  onChange={e => setNewTeam({ ...newTeam, notes: e.target.value })}
                  placeholder="Tipo de shooter, cámaras de visión, estilo de manejo del conductor..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddTeamModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Datos de Scouting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
