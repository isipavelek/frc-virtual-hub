import React, { useState } from 'react';
import { 
  Users, 
  Wrench, 
  Zap, 
  Code, 
  BarChart3, 
  Shield, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Tag, 
  AlertCircle,
  Filter,
  Check,
  Award
} from 'lucide-react';

export default function TeamManagement({ 
  members, 
  setMembers, 
  tasks, 
  setTasks, 
  subteams 
}) {
  const [activeSubteamFilter, setActiveSubteamFilter] = useState('all');
  const [activeView, setActiveView] = useState('kanban'); // 'kanban' | 'members'
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);

  // Form states
  const [newTask, setNewTask] = useState({
    title: '',
    subteam: 'mech',
    assignee: '',
    priority: 'high',
    week: 4,
    description: ''
  });

  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    subteam: 'mech',
    type: 'Estudiante',
    skills: ''
  });

  // Filter tasks & members
  const filteredTasks = activeSubteamFilter === 'all' 
    ? tasks 
    : tasks.filter(t => t.subteam === activeSubteamFilter);

  const filteredMembers = activeSubteamFilter === 'all'
    ? members
    : members.filter(m => m.subteam === activeSubteamFilter);

  const moveTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    const task = {
      id: `t-${Date.now()}`,
      ...newTask,
      status: 'todo'
    };
    setTasks(prev => [task, ...prev]);
    setShowNewTaskModal(false);
    setNewTask({ title: '', subteam: 'mech', assignee: '', priority: 'high', week: 4, description: '' });
  };

  const handleCreateMember = (e) => {
    e.preventDefault();
    if (!newMember.name) return;
    const member = {
      id: `m-${Date.now()}`,
      name: newMember.name,
      role: newMember.role || 'Miembro de Equipo',
      subteam: newMember.subteam,
      type: newMember.type,
      hours: 0,
      safetyCertified: true,
      skills: newMember.skills ? newMember.skills.split(',').map(s => s.trim()) : ['Iniciación FRC']
    };
    setMembers(prev => [...prev, member]);
    setShowNewMemberModal(false);
    setNewMember({ name: '', role: '', subteam: 'mech', type: 'Estudiante', skills: '' });
  };

  const incrementHours = (memberId, delta) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, hours: Math.max(0, m.hours + delta) } : m));
  };

  const columns = [
    { id: 'todo', label: 'Por Iniciar (Backlog)', color: '#94a3b8' },
    { id: 'in-progress', label: 'En Taller Activo', color: '#38bdf8' },
    { id: 'review', label: 'Revisión con Mentor', color: '#fbbf24' },
    { id: 'done', label: 'Completado & Probado', color: '#34d399' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header bar */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>Gestión de Recursos Humanos & Tareas</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Organización de los subequipos escolares, asignación de roles, horas de taller y flujo de trabajo FRC.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '4px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              gap: '4px'
            }}>
              <button
                className={activeView === 'kanban' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => setActiveView('kanban')}
              >
                Tablero Kanban
              </button>
              <button
                className={activeView === 'members' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => setActiveView('members')}
              >
                Directorio ({members.length})
              </button>
            </div>

            {activeView === 'kanban' ? (
              <button className="btn-primary" onClick={() => setShowNewTaskModal(true)}>
                <Plus size={16} /> Nueva Tarea
              </button>
            ) : (
              <button className="btn-primary" onClick={() => setShowNewMemberModal(true)}>
                <Plus size={16} /> Nuevo Integrante
              </button>
            )}
          </div>
        </div>

        {/* Subteams Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setActiveSubteamFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: activeSubteamFilter === 'all' ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
              background: activeSubteamFilter === 'all' ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeSubteamFilter === 'all' ? '#00d2ff' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Todos ({tasks.length})
          </button>

          {subteams.map(st => (
            <button
              key={st.id}
              onClick={() => setActiveSubteamFilter(st.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: activeSubteamFilter === st.id ? `1px solid ${st.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                background: activeSubteamFilter === st.id ? `${st.color}25` : 'rgba(255, 255, 255, 0.03)',
                color: activeSubteamFilter === st.id ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: st.color }} />
              {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* View 1: Kanban Board */}
      {activeView === 'kanban' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          alignItems: 'flex-start'
        }}>
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div 
                key={col.id} 
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: '520px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{col.label}</span>
                  </div>
                  <span className="mono-font" style={{
                    fontSize: '0.78rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    color: 'var(--text-muted)'
                  }}>
                    {colTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {colTasks.map(task => {
                    const st = subteams.find(s => s.id === task.subteam);
                    return (
                      <div 
                        key={task.id}
                        className="glass-panel"
                        style={{
                          padding: '14px',
                          border: '1px solid rgba(255, 255, 255, 0.07)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: `${st?.color || '#3b82f6'}20`,
                            color: st?.color || '#38bdf8'
                          }}>
                            {st?.name || 'Subequipo'}
                          </span>

                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            color: task.priority === 'high' ? '#f87171' : '#fbbf24',
                            textTransform: 'uppercase'
                          }}>
                            {task.priority === 'high' ? 'Alta' : 'Media'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.35 }}>
                          {task.title}
                        </div>

                        {task.description && (
                          <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                            {task.description}
                          </div>
                        )}

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '6px',
                          paddingTop: '6px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          fontSize: '0.75rem',
                          color: 'var(--text-dim)'
                        }}>
                          <span style={{ color: 'var(--text-muted)' }}>
                            👤 {task.assignee || 'Sin asignar'}
                          </span>
                          <span className="mono-font" style={{ color: '#00d2ff' }}>
                            Sem {task.week}
                          </span>
                        </div>

                        {/* Quick Status Mover Buttons */}
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => moveTaskStatus(task.id, col.id === 'done' ? 'review' : col.id === 'review' ? 'in-progress' : 'todo')}
                              style={{
                                flex: 1,
                                padding: '4px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: 'none',
                                borderRadius: '4px',
                                color: 'var(--text-muted)',
                                fontSize: '0.7rem',
                                cursor: 'pointer'
                              }}
                            >
                              ← Retroceder
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => moveTaskStatus(task.id, col.id === 'todo' ? 'in-progress' : col.id === 'in-progress' ? 'review' : 'done')}
                              style={{
                                flex: 1,
                                padding: '4px',
                                background: 'rgba(2, 132, 199, 0.25)',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#38bdf8',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Avanzar →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Members Directory & Hours Logger */}
      {activeView === 'members' && (
        <div className="grid-cols-3">
          {filteredMembers.map(member => {
            const st = subteams.find(s => s.id === member.subteam);
            return (
              <div 
                key={member.id}
                className="glass-panel"
                style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${st?.color || '#3b82f6'}, #00d2ff)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-tech)'
                    }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>{member.name}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{member.role}</div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: `${st?.color || '#3b82f6'}25`,
                    color: st?.color || '#38bdf8',
                    fontWeight: 600
                  }}>
                    {st?.name || member.subteam}
                  </span>
                </div>

                {/* Skills tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {member.skills.map((skill, i) => (
                    <span 
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Hours tracker + Safety */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '10px 12px',
                  borderRadius: '8px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>HORAS TALLER</span>
                    <strong className="mono-font" style={{ fontSize: '1.1rem', color: '#38bdf8' }}>
                      {member.hours} hrs
                    </strong>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => incrementHours(member.id, -2)}
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      -2h
                    </button>
                    <button 
                      onClick={() => incrementHours(member.id, 2)}
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(2, 132, 199, 0.4)',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#38bdf8',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      +2h
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#10b981' }}>
                  <Award size={14} /> Certificado en Normativa de Seguridad FIRST
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Nueva Tarea */}
      {showNewTaskModal && (
        <div className="modal-overlay" onClick={() => setShowNewTaskModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '16px' }}>
              Crear Nueva Tarea de Temporada
            </h3>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label>Título de la Tarea</label>
                <input 
                  type="text" 
                  value={newTask.title} 
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Ej: Ensamblar reductor MAXPlanetary del Intake"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Subequipo</label>
                  <select 
                    value={newTask.subteam} 
                    onChange={e => setNewTask({ ...newTask, subteam: e.target.value })}
                  >
                    {subteams.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Responsable</label>
                  <select 
                    value={newTask.assignee} 
                    onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                  >
                    <option value="">Seleccionar Estudiante / Mentor</option>
                    {members.map(m => (
                      <option key={m.id} value={m.name}>{m.name} ({m.subteam})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Prioridad</label>
                  <select 
                    value={newTask.priority} 
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="high">Alta (Crítica para el Robot)</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja / Deseable</option>
                  </select>
                </div>

                <div>
                  <label>Semana de Build Season</label>
                  <select 
                    value={newTask.week} 
                    onChange={e => setNewTask({ ...newTask, week: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6].map(w => (
                      <option key={w} value={w}>Semana {w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label>Descripción / Instrucciones Técnicas</label>
                <textarea 
                  rows={3} 
                  value={newTask.description} 
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Especificaciones, tolerancias, materiales necesarios..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowNewTaskModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nuevo Miembro */}
      {showNewMemberModal && (
        <div className="modal-overlay" onClick={() => setShowNewMemberModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '16px' }}>
              Registrar Nuevo Estudiante / Mentor
            </h3>
            <form onSubmit={handleCreateMember} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label>Nombre y Apellido</label>
                <input 
                  type="text" 
                  value={newMember.name} 
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Ej: Lucía Benítez"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Rol en el Equipo</label>
                  <input 
                    type="text" 
                    value={newMember.role} 
                    onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                    placeholder="Ej: Operadora de Driver Station"
                  />
                </div>

                <div>
                  <label>Tipo</label>
                  <select 
                    value={newMember.type} 
                    onChange={e => setNewMember({ ...newMember, type: e.target.value })}
                  >
                    <option value="Estudiante (Junior)">Estudiante</option>
                    <option value="Mentor Docente">Mentor Docente</option>
                    <option value="Mentor Ingeniero Externo">Mentor Ingeniero</option>
                    <option value="Padre / Colaborador">Padre / Colaborador</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Subequipo Asignado</label>
                <select 
                  value={newMember.subteam} 
                  onChange={e => setNewMember({ ...newMember, subteam: e.target.value })}
                >
                  {subteams.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Habilidades (separadas por coma)</label>
                <input 
                  type="text" 
                  value={newMember.skills} 
                  onChange={e => setNewMember({ ...newMember, skills: e.target.value })}
                  placeholder="CAD, Impresión 3D, Java, Cableado..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowNewMemberModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Registrar Integrante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
