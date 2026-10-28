import React, { useState } from 'react';
import { 
  Boxes, 
  Scale, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  PlusCircle,
  MinusCircle
} from 'lucide-react';

export default function InventoryBOM({ 
  parts, 
  setParts, 
  teamInfo 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Part form state
  const [newPart, setNewPart] = useState({
    name: '',
    category: 'Motores',
    supplier: 'REV Robotics',
    cost: 50,
    weightLbs: 1.0,
    quantity: 1,
    inRobot: 1,
    status: 'En Robot',
    specs: ''
  });

  // Calculate official FRC Robot Weight (Rules R103 & R406)
  const robotWeightLbs = parts.reduce((acc, p) => {
    if (p.category.includes('Energía') || p.category.includes('Bumpers')) {
      return acc;
    }
    return acc + (p.weightLbs * (p.inRobot || 0));
  }, 0);

  const totalRobotCost = parts.reduce((acc, p) => acc + (p.cost * (p.inRobot || 0)), 0);
  const totalStockCost = parts.reduce((acc, p) => acc + (p.cost * p.quantity), 0);
  const isOverWeight = robotWeightLbs > teamInfo.weightLimitLbs;

  const categories = ['all', ...new Set(parts.map(p => p.category))];

  const filteredParts = parts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleUpdateInRobot = (id, delta) => {
    setParts(prev => prev.map(p => {
      if (p.id === id) {
        const nextInRobot = Math.max(0, Math.min(p.quantity, (p.inRobot || 0) + delta));
        return { ...p, inRobot: nextInRobot, status: nextInRobot > 0 ? 'En Robot' : 'En Stock / Pit' };
      }
      return p;
    }));
  };

  const handleDeletePart = (id) => {
    if (confirm('¿Eliminar este componente del inventario?')) {
      setParts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddPart = (e) => {
    e.preventDefault();
    if (!newPart.name) return;
    const part = {
      id: `p-${Date.now()}`,
      ...newPart,
      cost: Number(newPart.cost),
      weightLbs: Number(newPart.weightLbs),
      quantity: Number(newPart.quantity),
      inRobot: Number(newPart.inRobot),
    };
    setParts(prev => [part, ...prev]);
    setShowAddModal(false);
    setNewPart({
      name: '',
      category: 'Motores',
      supplier: 'REV Robotics',
      cost: 50,
      weightLbs: 1.0,
      quantity: 1,
      inRobot: 1,
      status: 'En Robot',
      specs: ''
    });
  };

  const exportBOMCSV = () => {
    const headers = ["Nombre", "Categoría", "Proveedor", "Costo USD", "Peso (lbs)", "En Robot", "Cantidad Total", "Estado", "Especificaciones"];
    const rows = parts.map(p => [
      `"${p.name}"`,
      `"${p.category}"`,
      `"${p.supplier}"`,
      p.cost,
      p.weightLbs,
      p.inRobot || 0,
      p.quantity,
      `"${p.status}"`,
      `"${p.specs || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BOM_Oficial_FRC_Team_${teamInfo.teamNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Weight & Cost Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        border: isOverWeight ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(0, 210, 255, 0.25)',
        background: isOverWeight 
          ? 'radial-gradient(ellipse at top right, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.9) 70%)'
          : 'radial-gradient(ellipse at top right, rgba(2, 132, 199, 0.15) 0%, rgba(15, 23, 42, 0.9) 70%)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className={isOverWeight ? 'badge badge-red' : 'badge badge-green'}>
                {isOverWeight ? 'EXCESO DE PESO DETECTADO' : 'CUMPLE INSPECCIÓN DE PESO'}
              </span>
              <span className="badge badge-blue">REGLA R103 OFICIAL FIRST</span>
            </div>
            <h2 style={{ fontSize: '1.7rem', color: '#ffffff', marginBottom: '6px' }}>
              BOM (Bill of Materials) & Auditoría de Peso
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '640px' }}>
              El límite oficial de peso en FRC es de <strong>125.0 lbs (56.70 kg)</strong>. 
              Recuerda que la batería (12.8 lbs) y los bumpers (14.5 lbs) no se computan según los reglamentos R103 y R406.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Weight display */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '14px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PESO ACTUAL EN ROBOT</span>
              <div className="tech-font" style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: isOverWeight ? 'var(--frc-red-glow)' : '#00ff88'
              }}>
                {robotWeightLbs.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>lbs</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {(robotWeightLbs * 0.453592).toFixed(2)} kg / {teamInfo.weightLimitLbs} lbs máx
              </div>
            </div>

            {/* Cost display */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '14px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>COSTO MATERIALES ROBOT</span>
              <div className="tech-font" style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>
                ${totalRobotCost.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>USD</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ${totalStockCost.toLocaleString('en-US', { maximumFractionDigits: 0 })} en inventario total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Search bar */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="text" 
                placeholder="Buscar componente, motor, sensor, proveedor..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
            </div>

            <select 
              value={categoryFilter} 
              onChange={e => setCategoryFilter(e.target.value)}
              style={{ width: '180px' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas las Categorías' : cat}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={exportBOMCSV}>
              <Download size={16} /> Exportar BOM (CSV)
            </button>
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Agregar Componente
            </button>
          </div>
        </div>
      </div>

      {/* BOM Table */}
      <div className="glass-panel" style={{ padding: '0px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-muted)',
                fontSize: '0.76rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <th style={{ padding: '14px 18px' }}>Componente</th>
                <th style={{ padding: '14px 14px' }}>Categoría</th>
                <th style={{ padding: '14px 14px' }}>Proveedor</th>
                <th style={{ padding: '14px 14px' }}>Costo Unit.</th>
                <th style={{ padding: '14px 14px' }}>Peso Unit.</th>
                <th style={{ padding: '14px 14px', textAlign: 'center' }}>En Robot</th>
                <th style={{ padding: '14px 14px' }}>Stock Total</th>
                <th style={{ padding: '14px 14px' }}>Subtotal Robot</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map(part => {
                const isExcluded = part.category.includes('Energía') || part.category.includes('Bumpers');
                const partSubtotalWeight = isExcluded ? 0 : (part.weightLbs * (part.inRobot || 0));
                const partSubtotalCost = part.cost * (part.inRobot || 0);

                return (
                  <tr 
                    key={part.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{part.name}</div>
                      {part.specs && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {part.specs}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 14px' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                        {part.category}
                      </span>
                    </td>

                    <td style={{ padding: '14px 14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {part.supplier}
                    </td>

                    <td style={{ padding: '14px 14px' }} className="mono-font">
                      ${part.cost.toFixed(2)}
                    </td>

                    <td style={{ padding: '14px 14px' }}>
                      <span className="mono-font" style={{ color: isExcluded ? 'var(--text-dim)' : 'var(--text-main)' }}>
                        {part.weightLbs.toFixed(2)} lbs
                      </span>
                      {isExcluded && (
                        <div style={{ fontSize: '0.68rem', color: '#fbbf24' }}>Exento (Regla)</div>
                      )}
                    </td>

                    {/* En Robot Stepper */}
                    <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleUpdateInRobot(part.id, -1)}
                          disabled={(part.inRobot || 0) <= 0}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: (part.inRobot || 0) > 0 ? '#38bdf8' : 'var(--text-dim)',
                            cursor: (part.inRobot || 0) > 0 ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <MinusCircle size={16} />
                        </button>

                        <span className="mono-font" style={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          minWidth: '22px',
                          color: (part.inRobot || 0) > 0 ? '#00d2ff' : 'var(--text-dim)'
                        }}>
                          {part.inRobot || 0}
                        </span>

                        <button
                          onClick={() => handleUpdateInRobot(part.id, 1)}
                          disabled={(part.inRobot || 0) >= part.quantity}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: (part.inRobot || 0) < part.quantity ? '#38bdf8' : 'var(--text-dim)',
                            cursor: (part.inRobot || 0) < part.quantity ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <PlusCircle size={16} />
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: '14px 14px', color: 'var(--text-muted)' }} className="mono-font">
                      {part.quantity} uds
                    </td>

                    <td style={{ padding: '14px 14px' }}>
                      <div className="mono-font" style={{ color: '#38bdf8', fontWeight: 600 }}>
                        ${partSubtotalCost.toFixed(1)}
                      </div>
                      <div className="mono-font" style={{ fontSize: '0.74rem', color: isExcluded ? '#fbbf24' : 'var(--text-muted)' }}>
                        {isExcluded ? 'Exento R103' : `${partSubtotalWeight.toFixed(2)} lbs`}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeletePart(part.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          color: '#f87171',
                          padding: '6px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title="Eliminar del inventario"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Agregar Componente */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '16px' }}>
              Registrar Componente en BOM / Inventario
            </h3>

            <form onSubmit={handleAddPart} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label>Nombre del Componente o Pieza</label>
                <input 
                  type="text" 
                  value={newPart.name} 
                  onChange={e => setNewPart({ ...newPart, name: e.target.value })}
                  placeholder="Ej: Encoder CANcoder CTRE, Módulo GPS, etc."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Categoría</label>
                  <select 
                    value={newPart.category} 
                    onChange={e => setNewPart({ ...newPart, category: e.target.value })}
                  >
                    <option value="Control">Cerebro / Control</option>
                    <option value="Motores">Motores Brushless</option>
                    <option value="Controladores">Controladores de Motor</option>
                    <option value="Electrónica">Electrónica & Cableado</option>
                    <option value="Sensores">Sensores & Visión</option>
                    <option value="Chasis & Mecánica">Chasis & Transmisión</option>
                    <option value="Mecanismo Disparo">Shooter / Disparo</option>
                    <option value="Neumática">Neumática</option>
                    <option value="Energía">Baterías / Energía (Exento)</option>
                    <option value="Bumpers">Bumpers de Seguridad (Exento)</option>
                  </select>
                </div>

                <div>
                  <label>Proveedor</label>
                  <input 
                    type="text" 
                    value={newPart.supplier} 
                    onChange={e => setNewPart({ ...newPart, supplier: e.target.value })}
                    placeholder="REV, AndyMark, WCP, etc."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Costo Unitario ($ USD)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newPart.cost} 
                    onChange={e => setNewPart({ ...newPart, cost: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Peso Unitario (lbs)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newPart.weightLbs} 
                    onChange={e => setNewPart({ ...newPart, weightLbs: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Cantidad en Stock</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newPart.quantity} 
                    onChange={e => setNewPart({ ...newPart, quantity: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Instalados en el Robot</label>
                  <input 
                    type="number" 
                    min="0"
                    max={newPart.quantity}
                    value={newPart.inRobot} 
                    onChange={e => setNewPart({ ...newPart, inRobot: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Notas / Especificaciones Técnicas</label>
                <textarea 
                  rows={2}
                  value={newPart.specs} 
                  onChange={e => setNewPart({ ...newPart, specs: e.target.value })}
                  placeholder="Detalles de reducción, conector Anderson, etc."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Añadir al Inventario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
