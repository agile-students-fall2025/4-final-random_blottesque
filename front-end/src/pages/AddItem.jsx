import { useNavigate } from "react-router-dom";
import { useApp } from '../context/AppContext';

export default function AddItem() {
  const nav = useNavigate();
  const { activeGroupId } = useApp();
  const handleSubmit = (e) => {
    e.preventDefault();
    nav("/${activeGroupId}/inventory");
  };

  return (
    <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
      <h1 className="section-title" style={{marginTop:0}}>Add an Item</h1>
      <form onSubmit={handleSubmit} style={{display:"grid", gap:12}}>
        <input className="input" placeholder="Item Name" />
        <input className="input" type="file" placeholder="Image" />
        <input className="input" placeholder="Status" />
        <input className="input" placeholder="Info" />
        <div style={{display:"flex", gap:8}}>
          <button className="btn btn-primary" type="submit">Add Item</button>
          <button type="button" className="btn btn-secondary" onClick={()=>nav(`/${activeGroupId}/inventory`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

