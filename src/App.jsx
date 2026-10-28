import React, { useState } from 'react';
import Navbar from './components/Navbar';
import OverviewDashboard from './components/Dashboard/OverviewDashboard';
import TeamManagement from './components/TeamManagement/TeamManagement';
import InventoryBOM from './components/InventoryBOM/InventoryBOM';
import RobotBuilder from './components/RobotBuilder/RobotBuilder';
import FRCSimulator from './components/Simulator/FRCSimulator';
import MatchScouting from './components/MatchScouting/MatchScouting';

import { 
  INITIAL_TEAM_INFO, 
  INITIAL_SUBTEAMS, 
  INITIAL_MEMBERS, 
  INITIAL_TASKS, 
  INITIAL_PARTS, 
  INITIAL_ROBOT_CONFIG 
} from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core App States
  const [teamInfo, setTeamInfo] = useState(INITIAL_TEAM_INFO);
  const [subteams, setSubteams] = useState(INITIAL_SUBTEAMS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [parts, setParts] = useState(INITIAL_PARTS);
  const [robotConfig, setRobotConfig] = useState(INITIAL_ROBOT_CONFIG);

  // Dynamic calculations
  // Weight in lbs of robot (Excluding SLA battery and Bumpers per official rules R103 & R406)
  const robotWeight = parts.reduce((acc, p) => {
    if (p.category.includes('Energía') || p.category.includes('Bumpers')) {
      return acc;
    }
    return acc + (p.weightLbs * (p.inRobot || 0));
  }, 0);

  const isOverWeight = robotWeight > teamInfo.weightLimitLbs;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        teamInfo={teamInfo}
        robotWeight={robotWeight}
        isOverWeight={isOverWeight}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            teamInfo={teamInfo}
            members={members}
            tasks={tasks}
            parts={parts}
            robotConfig={robotConfig}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'team' && (
          <TeamManagement
            members={members}
            setMembers={setMembers}
            tasks={tasks}
            setTasks={setTasks}
            subteams={subteams}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryBOM
            parts={parts}
            setParts={setParts}
            teamInfo={teamInfo}
          />
        )}

        {activeTab === 'builder' && (
          <RobotBuilder
            robotConfig={robotConfig}
            setRobotConfig={setRobotConfig}
            parts={parts}
          />
        )}

        {activeTab === 'simulator' && (
          <FRCSimulator
            robotConfig={robotConfig}
            teamInfo={teamInfo}
          />
        )}

        {activeTab === 'scouting' && (
          <MatchScouting
            teamInfo={teamInfo}
          />
        )}
      </main>

      {/* High-Tech FRC Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(8, 12, 20, 0.95)',
        padding: '24px 20px',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>FIRST Robotics Competition Hub</span> • Equipo #{teamInfo.teamNumber} "{teamInfo.teamName}"
            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '2px' }}>
              Promoviendo STEM, Robótica Educativa y Gracious Professionalism®.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span className="badge badge-blue">WPILib Ready</span>
            <span className="badge badge-green">Reglamento Oficial FRC 2024-2026</span>
            <span style={{ color: 'var(--text-dim)' }}>v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
