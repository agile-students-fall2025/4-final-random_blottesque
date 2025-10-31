import { useState } from 'react';
import { SlidersHorizontal, Users, AppWindow } from 'lucide-react';

const c2f = (c) => Math.round((c * 9) / 5 + 32);

export default function GroupForm({ initial = {}, onSubmit, submitLabel = 'Save' }) {
  const toChip = (r) => (typeof r === 'string' ? r : (r?.email || r?.name || ''));
  const fromText = (t) => t.split(',').map(s => s.trim()).filter(Boolean);

  // Basics
  const [name, setName] = useState(initial.name || '');
  const [description, setDescription] = useState(initial.description || '');
  const [inviteCode, setInviteCode] = useState(initial.inviteCode || '');

  // Roommates text
  const [roommatesText, setRoommatesText] = useState(
    Array.isArray(initial.roommates) ? initial.roommates.map(toChip).join(', ') : ''
  );

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

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      description: description.trim(),
      inviteCode: inviteCode.trim(),
      roommates: fromText(roommatesText),
      components: Object.entries(components).filter(([, v]) => v).map(([k]) => k),
      quietHours: { start: quietStart || null, end: quietEnd || null },
      preferences: {
        temperatureF: temperatureF === '' ? null : Number(temperatureF),
        guestsAllowed,
      },
    };
    await onSubmit?.(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack" style={{ display: 'grid', gap: 12 }}>
      {/* NEW: wrap basics in a card so they align with everything else */}
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

      {/* Roommates */}
      <section className="card" style={{ display: 'grid', gap: 8 }}>
        <h3 className="section-title" style={{ marginTop: 0, display:'flex', alignItems:'center', gap:8 }}>
          <Users size={16} /> Roommates
        </h3>
        <div className="item-sub">Comma-separated emails or names</div>
        <textarea
          className="input"
          rows={3}
          value={roommatesText}
          onChange={e => setRoommatesText(e.target.value)}
          placeholder="alice@x.com, bob@x.com"
        />
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
            <label key={key} className="check">
              <input type="checkbox" checked={components[key]} onChange={() => toggleComponent(key)} />
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
          <div style={{ display:'flex', gap:8 }}>
            <label className="check">
              <input
                type="radio"
                name="guests"
                checked={guestsAllowed === true}
                onChange={() => setGuestsAllowed(true)}
              />
              <span>Allowed</span>
            </label>
            <label className="check">
              <input
                type="radio"
                name="guests"
                checked={guestsAllowed === false}
                onChange={() => setGuestsAllowed(false)}
              />
              <span>Not allowed</span>
            </label>
          </div>
        </div>
      </section>

      <button className="btn btn-primary btn-full">{submitLabel}</button>
    </form>
  );
}
