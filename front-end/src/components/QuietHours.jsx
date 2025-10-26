export default function QuietHours({ value, onChange }) {
    const start = value?.start ?? '22:00';
    const end = value?.end ?? '07:00';
  
    return (
      <div>
        <h3 className="section-title">Quiet Hours</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div className="field" style={{marginBottom:0}}>
            <label className="label">Start</label>
            <input type="time" className="input" value={start} onChange={(e)=>onChange?.({ start:e.target.value, end })}/>
          </div>
          <div className="field" style={{marginBottom:0}}>
            <label className="label">End</label>
            <input type="time" className="input" value={end} onChange={(e)=>onChange?.({ start, end:e.target.value })}/>
          </div>
        </div>
      </div>
    );
  }
  