import { Boxes } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

//This is currently unused and out-of-date, as the inventory slots are now made directly in GroupInventory

export default function InventorySlot({ item,isActive,onSelect }) {
  const nav = useNavigate();
  const { activeGroupId } = useApp();

  return (
    <section className="card">
      <li key={item.id} className="card" style={{padding:10, boxShadow:'none', border:'1px solid var(--ring)'}}>

        <div className="inventory-item" style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: 100,
          padding: 8,
        }} 
        onClick={onSelect}>

        <div className="item-icon" style={{ marginRight: 12, display: 'flex', alignItems: 'center'  }}><Boxes size={80}/></div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            flex: 1,
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
          }}>
            <div className="item-name" style={{fontSize: 22, fontWeight: 500, paddingTop: 4, paddingBottom: 16, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{item.name}</div>
            <div className="item-sub" style={{fontSize: 15, color: '#555', marginBottom: 2}}>Status:</div>
            <div className="item-sub" style={{fontSize: 13, color: '#666', marginBottom: 2}}>{item.status}</div>
          </div>
        </div>
      </li>

      {isActive && 
        <div className="extra-info" style={{
          display:'grid', gap:12
        }}>

        <InfoPopup item={item} />
        
        <button className="btn btn-primary" onClick={() => nav(`/${activeGroupId}/inventory/${item.id}/edit`)}>
          Edit Item
        </button>
        

      </div>}

    </section>
  );
}

function InfoPopup({ item }) {
  return (
    <div
      style={{
        padding: 10,
        background: "#eee",
        marginTop: 10,
        borderRadius: 6,
        textAlign: "center",
      }}
    >
      <strong>Info</strong> <br/>Lorem Ipsum
    </div>
  );
}