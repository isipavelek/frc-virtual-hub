import React from 'react';
import { 
  Cpu, 
  Users, 
  Boxes, 
  Wrench, 
  Gamepad2, 
  ClipboardList, 
  BatteryCharging, 
  Radio, 
  AlertCircle,
  Activity
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, teamInfo, robotWeight, isOverWeight }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Cpu, badge: 'En Vivo' },
    { id: 'team', label: 'Equipo & RRHH', icon: Users, badge: '5 Equipos' },
    { id: 'inventory', label: 'BOM & Materiales', icon: Boxes, badge: `${robotWeight.toFixed(1)} lbs` },
    { id: 'builder', label: 'Robot Builder & CAN', icon: Wrench, badge: '14 Nodos' },
    { id: 'simulator', label: 'Simulador de Arena', icon: Gamepad2, badge: '60 FPS' },
    { id: 'scouting', label: 'Estrategia & Alianzas', icon: ClipboardList, badge: '3 vs 3' },
  ];

  return (
    <header style={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(8, 12, 20, 0.95)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Top Telemetry Ticker */}
      <div style={{
        background: 'rgba(2, 132, 199, 0.08)',
        borderBottom: '1px solid rgba(0, 210, 255, 0.12)',
        padding: '5px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.76rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--frc-green-glow)' }}>
            <span className="live-indicator" /> FMS LINK: CONECTADO
          </span>
          <span className="mono-font" style={{ color: 'var(--text-muted)' }}>
            PING: <strong style={{ color: '#38bdf8' }}>14 ms</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <BatteryCharging size={14} color="#10b981" />
            BATERÍA 12V: <strong style={{ color: '#10b981' }}>12.82 V</strong> (100%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Radio size={14} color="#38bdf8" />
            RADIO VH-109: <strong style={{ color: '#38bdf8' }}>5 GHz CH 157</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span className="tech-font" style={{ 
            color: isOverWeight ? 'var(--frc-red-glow)' : 'var(--text-main)', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            {isOverWeight && <AlertCircle size={14} color="var(--frc-red)" />}
            PESO TOTAL: <span style={{ color: isOverWeight ? '#ef4444' : '#00ff88' }}>{robotWeight.toFixed(1)} / {teamInfo.weightLimitLbs} LBS</span>
          </span>
          <span style={{
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 600
          }}>
            SEMANA {teamInfo.seasonWeek} / 6 (BUILD SEASON)
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand & Team Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #00d2ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 210, 255, 0.4)',
            color: '#080c14',
            fontWeight: 800,
            fontSize: '1.25rem',
            fontFamily: 'var(--font-tech)'
          }}>
            FRC
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="tech-font" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                TEAM #{teamInfo.teamNumber}
              </span>
              <span style={{
                background: 'linear-gradient(90deg, #0284c7, #00d2ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}>
                {teamInfo.teamName}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {teamInfo.school} • <span style={{ color: '#38bdf8' }}>{teamInfo.seasonName}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '5px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(3, 105, 161, 0.6) 100%)' 
                    : 'transparent',
                  color: isActive ? '#38bdf8' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 2px 10px rgba(2, 132, 199, 0.3)' : 'none',
                  outline: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : 'none',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? '#ffffff' : 'var(--text-dim)',
                    fontWeight: 600,
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
