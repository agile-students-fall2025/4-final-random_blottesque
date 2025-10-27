import { useEffect, useState } from 'react';
import QuietHours from './QuietHours';
import { Users, ListChecks, Wallet2, Boxes, SlidersHorizontal } from 'lucide-react';

export default function GroupForm({ initial = null, onSubmit, submitLabel = 'Create Group' }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    inviteCode: '',
    roommatesCSV: '',
    componentsEnabled: { chores: true, expenses: true, inventory: true, envPrefs: true },
    quietHours: { start: '22:00', end: '07:00' },
    preferences: { temperatureC: 22, guestsAllowed: true }
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name ?? '',
        description: initial.description ?? '',
        inviteCode: initial.inviteCode ?? '',
        roommatesCSV: (initial.roommates ?? []).join(', '),
        componentsEnabled: initial.componentsEnabled ?? { chores: true, expenses: true, inventory: true, envPrefs: true },
        quietHours: initial.quietHours ?? { start: '22:00', end: '07:00' },
        preferences: initial.preferences ?? { temperatureC: 22, guestsAllowed: true }
      });
    }
  }, [initial]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k) => update('componentsEnabled', { ...form.componentsEnabled, [k]: !form.componentsEnabled[k] });

  const handleSubmit = (e) => {
    e.preventDefault();
    const roommates = form.roommatesCSV.split(',').map(s => s.trim()).filter(Boolean);
    onSubmit?.({ ...form, roommates });
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="card">
        <div className="field">
          <label className="label">Group name</label>
          <input className="input" value={form.name} onChange={(e)=>update('name', e.target.value)} required />
        </div>
        <div className="field">
          <label className="label">Description</label>
          <textarea id="desc-input" className="textarea" value={form.description} onChange={(e)=>update('description', e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Invite code (optional)</label>
          <input className="input" value={form.inviteCode} onChange={(e)=>update('inviteCode', e.target.value.toUpperCase())} />
        </div>
      </section>

      <section className="card" style={{marginTop:12}}>
        <h3 className="section-title" style={{display:'flex',alignItems:'center',gap:8}}>
          <Users size={18}/> Roommates
        </h3>
        <div className="field" style={{marginBottom:0}}>
          <label className="label">Comma-separated emails or names</label>
          <textarea className="textarea" placeholder="alice@x.com, bob@x.com"
                    value={form.roommatesCSV} onChange={(e)=>update('roommatesCSV', e.target.value)} />
        </div>
      </section>

      <section className="card" style={{marginTop:12}}>
        <h3 className="section-title">Components</h3>
        <div className="grid-2">
          <Toggle label="Chores" icon={ListChecks} checked={form.componentsEnabled.chores} onChange={()=>toggle('chores')} variant="indigo"/>
          <Toggle label="Expenses" icon={Wallet2} checked={form.componentsEnabled.expenses} onChange={()=>toggle('expenses')} variant="rose"/>
          <Toggle label="Inventory" icon={Boxes} checked={form.componentsEnabled.inventory} onChange={()=>toggle('inventory')} variant="sky"/>
          <Toggle label="Env. Prefs" icon={SlidersHorizontal} checked={form.componentsEnabled.envPrefs} onChange={()=>toggle('envPrefs')} variant="emerald"/>
        </div>
      </section>

      <section className="card" style={{marginTop:12}}>
        <QuietHours value={form.quietHours} onChange={(qh)=>update('quietHours', qh)} />
      </section>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
        <button type="submit" className="btn btn-primary"> {submitLabel} </button>
        <button type="reset" className="btn btn-ghost"
          onClick={()=>setForm(initial || {
            name:'', description:'', inviteCode:'', roommatesCSV:'',
            componentsEnabled:{chores:true,expenses:true,inventory:true,envPrefs:true},
            quietHours:{start:'22:00', end:'07:00'}, preferences:{temperatureC:22, guestsAllowed:true}
          })}>
          Reset
        </button>
      </div>
    </form>
  );
}

function Toggle({ label, icon: Icon, checked, onChange, variant='indigo' }) {
  const colors = {
    indigo:{bg:'var(--indigo-50)', fg:'var(--indigo-600)'},
    rose:{bg:'var(--rose-50)', fg:'var(--rose-600)'},
    sky:{bg:'var(--sky-50)', fg:'var(--sky-600)'},
    emerald:{bg:'var(--emerald-50)', fg:'var(--emerald-600)'}
  }[variant];

  return (
    <button type="button" onClick={onChange} className="tile" style={{minHeight:70, borderStyle:checked?'solid':'dashed'}}>
      <div>
        <div className="tile-title">{label}</div>
        <div className="tile-hint" style={{opacity:.9}}>{checked ? 'Enabled' : 'Disabled'}</div>
      </div>
      <div className="tile-icon" style={{background:colors.bg, color:colors.fg}}>
        <Icon size={18}/>
      </div>
    </button>
  );
}
