import { Boxes } from 'lucide-react';

export default function InventoryList({ items = [] }) {
  return (
    <section className="card">
      <h3 className="section-title" style={{display:'flex',alignItems:'center',gap:8}}>
        <Boxes size={16}/> Shared Inventory
      </h3>
      <ul className="list" style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12}}>
        {items.map(it => (
          <li key={it.id} className="card" style={{padding:10, boxShadow:'none', border:'1px solid var(--ring)'}}>
            <div className="tile-icon" style={{width:'100%', height:48}}><Boxes size={16}/></div>
            <div className="item-title" style={{marginTop:8, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{it.name}</div>
            <div className="item-sub" style={{fontSize:11}}>{it.status}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
