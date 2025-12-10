import { useState } from 'react';
import { useApp } from '../context/AppContext';
import * as api from '../lib/api';
import { SlidersHorizontal, Users, Trash2, AppWindow, CheckSquare, Square, CheckCircle, Circle } from 'lucide-react';

const c2f = (c) => Math.round((c * 9) / 5 + 32);

export default function GroupForm({ initial = {}, onSubmit, submitLabel = 'Save' }) {
  const toChip = (r) => (typeof r === 'string' ? r : (r?.email || r?.name || ''));
  const fromText = (t) => t.split(',').map(s => s.trim()).filter(Boolean);

  // Basics
  const [name, setName] = useState(initial.name || '');
  const [description, setDescription] = useState(initial.description || '');
  const [inviteCode, setInviteCode] = useState(initial.inviteCode || '');
  const [error, setError] = useState('');

  const { user, activeGroupId } = useApp();


  // Components toggles
  const has = (k) => Array.isArray(initial.components) && initial.components.includes(k);
  const [components, setComponents] = useState({
    chores: has('chores') ?? true,
    expenses: has('expenses') ?? true,
    inventory: has('inventory') ?? true,
  });
  const toggleComponent = (key) =>
    setComponents((prev) => ({ ...prev, [key]: !prev[key] }));

  // Quiet hours
  const [quietStart, setQuietStart] = useState(initial?.quietHours?.start || '');
  const [quietEnd, setQuietEnd] = useState(initial?.quietHours?.end || '');

  // Preferences (Fahrenheit-first; fallback from legacy °C)
  const initialTempF =
    typeof initial?.preferences?.temperatureF === 'number'
      ? String(initial.preferences.temperatureF)
      : typeof initial?.preferences?.temperatureC === 'number'
        ? String(c2f(initial.preferences.temperatureC))
        : '';
  const [temperatureF, setTemperatureF] = useState(initialTempF);

  const [guestsAllowed, setGuestsAllowed] = useState(
    typeof initial?.preferences?.guestsAllowed === 'boolean'
      ? initial.preferences.guestsAllowed
      : true
  );

  const [smokingAllowed, setSmokingAllowed] = useState(
    typeof initial?.preferences?.smokingAllowed === 'boolean'
      ? initial.preferences.smokingAllowed
      : true
  );

  const [drinkingAllowed, setDrinkingAllowed] = useState(
    typeof initial?.preferences?.drinkingAllowed === 'boolean'
      ? initial.preferences.drinkingAllowed
      : true
  );

  const [partiesAllowed, setPartiesAllowed] = useState(
    typeof initial?.preferences?.partiesAllowed === 'boolean'
      ? initial.preferences.partiesAllowed
      : true
  );

  const [nightTimeGuestsAllowed, setNightTimeGuestsAllowed] = useState(
    typeof initial?.preferences?.nightTimeGuestsAllowed === 'boolean'
      ? initial.preferences.nightTimeGuestsAllowed
      : true
  );

  
  const [accommodations, setAccommodations] = useState(
    typeof initial?.preferences?.accommodations === "string" &&
    initial.preferences.accommodations !== "None"
      ? initial.preferences.accommodations
      : "None"
  );

  const [accommodationsTrue, setAccommodationsTrue] = useState(
    typeof initial?.preferences?.accommodations === "string" &&
    initial.preferences.accommodations !== "None"
      ? true
      : false
  );

  const [roommates, setRoommates] = useState(initial?.roommates || []);

  // Delete roommate via API
  const handleRMDelete = async (userId) => {
    if (!window.confirm('Delete this roommate?')) return;
          
    try {
        await api.deleteRoommate(activeGroupId, userId);
        setRoommates(prev => prev.filter(r => (r._id || r.id) !== userId));
    } catch (err) {
        setError(err.message || 'Failed to delete roommate');
    }
  };

  const rmLabel = (r) => {
    if (!r) return '—';
    if (typeof r === 'string') return r;
    return r.name || r.email || '—';
  };


  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      description: description.trim(),
      inviteCode: inviteCode.trim(),
      roommates: roommates || [],
      components: Object.entries(components).filter(([, v]) => v).map(([k]) => k),
      quietHours: { start: quietStart || null, end: quietEnd || null },
      preferences: {
        temperatureF: temperatureF === '' ? null : Number(temperatureF),
        guestsAllowed,
        smokingAllowed,
        drinkingAllowed,
        partiesAllowed,
        nightTimeGuestsAllowed,
        accommodations: accommodations === 'None' || accommodations === '' ? 'None' : accommodations
      },
    };
    await onSubmit?.(payload);
  }

  console.log(roommates);

  return (
    <form onSubmit={handleSubmit} className="form-stack" style={{ display: 'grid', gap: 12 }}>

      {/* Group Info */}
      <section className="card" style={{ display: 'grid', gap: 12 }}>
        <h3 className="section-title" style={{ marginTop: 0 }}>Group</h3>

        <label className="field">
          <div className="field-label">Group name</div>
          <input
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Address House"
          />
        </label>

        <label className="field">
          <div className="field-label">Description</div>
          <textarea
            id="desc-input"
            className="input"
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description (optional)"
          />
        </label>

        <label className="field">
          <div className="field-label">Invite code (optional)</div>
          <input
            className="input"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value)}
            placeholder="e.g., T38YZ2"
          />
        </label>
      </section>

      <section className='card'>
        <Users size={16} /> Roomates
        {roommates.length === 0 ? (
          <div className='item-sub'>Nothing yet! Send out the invite code to add roommates.</div>
        ) : (
        <div>
              {roommates.length > 0 && (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {roommates.map((r, i) => (
                    <div key={i}>
                      <span className="rm-chip rm-chip-lg"
                        style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{rmLabel(r.name || r.email)}</span>
                      <button className='btn btn-ghost' onClick={() => handleRMDelete(r._id || r.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
            </div>
              )}
              </div>
        )}
        
      </section>

      {/* Components */}
      <section className="card" style={{ display: 'grid', gap: 8 }}>
        <h3 className="section-title" style={{ marginTop: 0, display:'flex', alignItems:'center', gap:8 }}>
          <AppWindow size={16} /> Components
        </h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            ['Chores', 'chores'],
            ['Expenses', 'expenses'],
            ['Inventory', 'inventory'],
          ].map(([label, key]) => (
            <label key={key} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}} onClick={() => toggleComponent(key)}>
              {components[key] ? (
                <CheckSquare size={18} color='#059669'/>
              ) : (
                  <Square size={18} color='#9ca3af'/>
              )}

              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Preferences */}
      <section className="card" style={{ display: 'grid', gap: 12 }}>
        <h3 className="section-title" style={{ marginTop: 0, display:'flex', alignItems:'center', gap:8 }}>
          <SlidersHorizontal size={16} /> Preferences
        </h3>

        {/* Quiet hours */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="item-sub">Quiet Hours</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input
              type="time"
              className="input"
              value={quietStart}
              onChange={e => setQuietStart(e.target.value)}
              aria-label="Quiet hours start"
            />
            <input
              type="time"
              className="input"
              value={quietEnd}
              onChange={e => setQuietEnd(e.target.value)}
              aria-label="Quiet hours end"
            />
          </div>
        </div>

        {/* Fahrenheit */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="item-sub">Temperature (°F)</div>
          <input
            type="number"
            className="input"
            min={50}
            max={85}
            step={1}
            value={temperatureF}
            onChange={e => setTemperatureF(e.target.value)}
            placeholder="e.g., 72"
          />
        </div>

        {/* Guests */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="item-sub">Guests</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <label onClick={() => setGuestsAllowed(true)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              {guestsAllowed === true ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}
              <span>Allowed</span>
            </label>
              <label onClick={() => setGuestsAllowed(false)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              {guestsAllowed === false ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}
              <span>Not allowed</span>
            </label>
          </div>
        </div>

        {/* Smoking */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="item-sub">Smoking</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <label onClick={() => setSmokingAllowed(true)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              {smokingAllowed === true ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}
              <span>Allowed</span>
            </label>
              <label onClick={() => setSmokingAllowed(false)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              {smokingAllowed === false ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}
              <span>Not allowed</span>
            </label>
          </div>
        </div>

        {/* Drinking */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="item-sub">Drinking</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <label onClick={() => setDrinkingAllowed(true)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              {drinkingAllowed === true ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}
              <span>Allowed</span>
            </label>
              <label onClick={() => setDrinkingAllowed(false)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              {drinkingAllowed === false ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}
              <span>Not allowed</span>
            </label>
          </div>
        </div>

      {/* Parties */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="item-sub">Parties</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <label onClick={() => setPartiesAllowed(true)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              {partiesAllowed === true ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}
              <span>Allowed</span>
            </label>
              <label onClick={() => setPartiesAllowed(false)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              {partiesAllowed === false ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}
              <span>Not allowed</span>
            </label>
          </div>
        </div>
      
      {/* Night Time Guests */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="item-sub">Night Guests</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <label onClick={() => setNightTimeGuestsAllowed(true)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              {nightTimeGuestsAllowed === true ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}
              <span>Allowed</span>
            </label>
              <label onClick={() => setNightTimeGuestsAllowed(false)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
              {nightTimeGuestsAllowed === false ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}
              <span>Not allowed</span>
            </label>
          </div>
      </div>
      
      {/* Accommodations */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="item-sub">Accommodations</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <label onClick={() => setAccommodationsTrue(true)} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                {accommodationsTrue === true ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}

              <span>Accommodations</span>
            </label>

            <label onClick={() => {setAccommodationsTrue(false); setAccommodations("None");}} style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                {accommodationsTrue === false ? (
                <CheckCircle size={18} color="#059669" />
              ) : (
                  <Circle size={18} color="#9ca3af"/>
              )}

              <span>No Accommodations</span>
            </label>
            </div>

            {accommodationsTrue && (
            <input
              type="text"
              placeholder='Enter accommodations'
              value={accommodations}
              onChange={(e) => setAccommodations(e.target.value)}
              style={{ padding: 6 }}
            />
          )}
        </div>

        </section>

      <button className="btn btn-primary btn-full">{submitLabel}</button>
    </form>
  );
}
