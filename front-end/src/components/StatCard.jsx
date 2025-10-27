export default function StatCard({ title, value, hint, icon: Icon, variant = 'indigo', onClick }) {
  return (
    <button type="button" onClick={onClick} className={`tile variant-${variant}`}>
      <div>
        <div className="tile-title">{title}</div>
        <div className="tile-value">{value}</div>
        {hint && <div className="tile-hint">{hint}</div>}
      </div>
      {Icon ? (
        <div className="tile-icon">
          <Icon size={20}/>
        </div>
      ) : <div style={{width:44}}/>}
    </button>
  );
}
