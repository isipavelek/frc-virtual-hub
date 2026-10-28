import React from 'react';
import { 
  Scale, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';

export default function OverviewDashboard({ 
  teamInfo, 
  members, 
  tasks, 
  parts, 
  robotConfig, 
  setActiveTab 
}) {
  // Calculos dinámicos
  const totalCost = parts.reduce((acc, p) => acc + (p.cost * p.quantity), 0);
  const robotPartsCost = parts.reduce((acc, p) => acc + (p.cost * (p.inRobot || 0)), 0);
  
  // Peso en lbs del robot (excluyendo baterías y bumpers según reglas oficiales R103 / R406)
  const robotWeightLbs = parts.reduce((acc, p) => {
    if (p.category.includes('Energía') || p.category.includes('Bumpers')) {
      return acc; // Regla oficial FIRST: batería y bumpers no cuentan para el límite de 125 lbs
    }
    return acc + (p.weightLbs * (p.inRobot || 0));
  }, 0);

  const isOverWeight = robotWeightLbs > teamInfo.weightLimitLbs;
  const weightPercentage = Math.min(100, (robotWeightLbs / teamInfo.weightLimitLbs) * 100);

  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const totalHours = members.reduce((acc, m) => acc + m.hours, 0);

  const weeks = [
    { num: 1, name: "Estrategia & Prototipado", status: "completed" },
    { num: 2, name: "Diseño CAD & Arquitectura CAN", status: "completed" },
    { num: 3, name: "Mecanizado & Chasis Swerve", status: "completed" },
    { num: 4, name: "Ensamble de Mecanismos & PID", status: "current" },
    { num: 5, name: "Rutas Autónomas & Tuning", status: "upcoming" },
    { num: 6, name: "Driver Practice & Regional FRC", status: "upcoming" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner / Welcome Hero */}
      <div className="glass-panel" style={{
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at top left, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.85) 70%)',
        border: '1px solid rgba(0, 210, 255, 0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-blue">FIRST ROBOTICS COMPETITION HUB</span>
              <span className="badge badge-gold">TEMPORADA 2024-2026</span>
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
              Centro de Operaciones: <span style={{ color: 'var(--frc-blue-glow)' }}>{robotConfig.name}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '680px', fontSize: '0.98rem' }}>
              Gestión centralizada para estudiantes y mentores: control del límite reglamentario de 125 lbs,
              mapeo del bus CAN del roboRIO, stock de componentes y simulador interactivo de arena.
            </p>
          </div>

          {/* Quick Action Button Hero */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              onClick={() => setActiveTab('simulator')}
              style={{ fontSize: '1rem', padding: '12px 22px' }}
            >
              <Zap size={18} /> Probar Robot en Simulador
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => setActiveTab('builder')}
            >
              Configurar Subsistemas
            </button>
          </div>
        </div>

        {/* 6-Week Build Season Interactive Timeline */}
        <div style={{ marginTop: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              LÍNEA DE TIEMPO OFICIAL: BUILD SEASON (SEMANA {teamInfo.seasonWeek} DE 6)
            </span>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
              65% del ciclo completado
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '8px',
          }}>
            {weeks.map((w) => {
              const isPast = w.status === 'completed';
              const isCurr = w.status === 'current';
              return (
                <div 
                  key={w.num}
                  style={{
                    background: isCurr 
                      ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.4) 0%, rgba(0, 210, 255, 0.2) 100%)' 
                      : isPast ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isCurr 
                      ? '1px solid #00d2ff' 
                      : isPast ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="mono-font" style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isCurr ? '#00d2ff' : isPast ? '#34d399' : 'var(--text-dim)'
                    }}>
                      SEM {w.num}
                    </span>
                    {isPast && <CheckCircle2 size={13} color="#10b981" />}
                    {isCurr && <span className="live-indicator" style={{ width: '7px', height: '7px' }} />}
                  </div>
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: isCurr ? 700 : 500,
                    color: isCurr ? '#ffffff' : isPast ? 'var(--text-main)' : 'var(--text-dim)',
                    lineHeight: 1.2
                  }}>
                    {w.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-cols-4">
        {/* Weight Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              AUDITORÍA DE PESO FRC
            </span>
            <div style={{
              background: isOverWeight ? 'rgba(239, 68, 68, 0.2)' : 'rgba(2, 132, 199, 0.2)',
              color: isOverWeight ? 'var(--frc-red)' : 'var(--frc-blue)',
              padding: '6px',
              borderRadius: '8px'
            }}>
              <Scale size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <span className="tech-font" style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              color: isOverWeight ? 'var(--frc-red-glow)' : '#ffffff'
            }}>
              {robotWeightLbs.toFixed(1)}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              / {teamInfo.weightLimitLbs} lbs ({(robotWeightLbs * 0.453592).toFixed(1)} kg)
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: '7px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{
              width: `${weightPercentage}%`,
              height: '100%',
              background: isOverWeight ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #0284c7, #00ff88)',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }} />
          </div>

          <div style={{ fontSize: '0.76rem', color: isOverWeight ? 'var(--frc-red-glow)' : 'var(--frc-green)' }}>
            {isOverWeight 
              ? `⚠️ Exceso por ${(robotWeightLbs - teamInfo.weightLimitLbs).toFixed(1)} lbs. Se requiere aligerar bolsillos!`
              : `✓ Margen disponible: ${(teamInfo.weightLimitLbs - robotWeightLbs).toFixed(1)} lbs`}
          </div>
        </div>

        {/* Budget Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              PRESUPUESTO TOTAL BOM
            </span>
            <div style={{
              background: 'rgba(245, 158, 11, 0.2)',
              color: 'var(--frc-gold)',
              padding: '6px',
              borderRadius: '8px'
            }}>
              <DollarSign size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <span className="tech-font" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff' }}>
              ${robotPartsCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              en robot (${totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })} total)
            </span>
          </div>

          <div style={{ height: '7px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{
              width: `${Math.min(100, (totalCost / teamInfo.budgetLimit) * 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #f59e0b)',
              borderRadius: '4px'
            }} />
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Fondo restante: <strong style={{ color: '#fbbf24' }}>${(teamInfo.budgetLimit - totalCost).toFixed(0)} USD</strong>
          </div>
        </div>

        {/* Tasks Progress Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              SPRINT DE CONSTRUCCIÓN
            </span>
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: 'var(--frc-green)',
              padding: '6px',
              borderRadius: '8px'
            }}>
              <TrendingUp size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <span className="tech-font" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff' }}>
              {doneTasks} / {tasks.length}
            </span>
            <span style={{ color: 'var(--frc-green-glow)', fontSize: '0.85rem', fontWeight: 600 }}>
              {Math.round((doneTasks / tasks.length) * 100)}% Completado
            </span>
          </div>

          <div style={{ height: '7px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{
              width: `${(doneTasks / tasks.length) * 100}%`,
              height: '100%',
              background: '#10b981',
              borderRadius: '4px'
            }} />
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            {inProgressTasks} tareas actualmente en taller activo
          </div>
        </div>

        {/* Team Dedication Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              HORAS DE TALLER FRC
            </span>
            <div style={{
              background: 'rgba(139, 92, 246, 0.2)',
              color: 'var(--frc-purple)',
              padding: '6px',
              borderRadius: '8px'
            }}>
              <Clock size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <span className="tech-font" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff' }}>
              {totalHours} hrs
            </span>
            <span style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 600 }}>
              {members.length} Miembros
            </span>
          </div>

          <div style={{ height: '7px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{
              width: `${Math.min(100, (totalHours / 400) * 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
              borderRadius: '4px'
            }} />
          </div>

          <div style={{ fontSize: '0.76rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> 100% Certificados en Seguridad
          </div>
        </div>
      </div>

      {/* Middle Grid: Subsystems Overview + Inspection Checklist */}
      <div className="grid-cols-2">
        {/* Subsystems Status Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Subsistemas del Robot</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Módulos de ingeniería instalados en {robotConfig.name}</p>
            </div>
            <button 
              className="btn-secondary" 
              onClick={() => setActiveTab('builder')}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              Configurar <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {robotConfig.subsystems.map(sub => (
              <div 
                key={sub.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#ffffff' }}>{sub.name}</span>
                    <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{sub.motors} Motores</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {sub.description}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="mono-font" style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                    {sub.weightLbs} lbs
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    {sub.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FRC Robot Inspector Checklist */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Inspección Reglamentaria FRC</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requisitos obligatorios para aprobar la inspección de campo</p>
            </div>
            <span className="badge badge-green">4 / 5 Verificados</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <CheckCircle2 size={18} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>Regla R103: Límite de Peso (125 lbs)</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  El robot pesa {robotWeightLbs.toFixed(1)} lbs. Está dentro del rango reglamentario sin baterías ni bumpers.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <CheckCircle2 size={18} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>Regla R406: Bumpers Rojos y Azules Reversibles</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Construidos con madera contrachapada de 3/4", fideos de pileta dobles de 2.5" y números #{teamInfo.teamNumber} visibles.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <CheckCircle2 size={18} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>Regla R601: Main Breaker de 120 Amperios</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Montado en posición de rápido acceso para los árbitros con etiqueta reflectante.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <CheckCircle2 size={18} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>Regla R714: Bus CAN sin Colisiones de IDs</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  14 dispositivos identificados con terminación de 120 ohms en el Power Distribution Hub.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <AlertTriangle size={18} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>Prueba de Extensión Perimetral (R410)</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Pendiente validar en el simulador que el brazo no supere las 12 pulgadas fuera del perímetro del chasis en teleoperado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
