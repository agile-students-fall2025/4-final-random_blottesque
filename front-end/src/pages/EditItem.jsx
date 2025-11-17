import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EditItem() {
    const nav = useNavigate();
    const { itemId } = useParams();
    const { activeGroupId } = useApp();

    const handleSubmit = (e) => {
        e.preventDefault();
        nav("/chores/${activeGroupId}/inventory");
    };

    return (
        <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1 className="section-title" style={{ marginTop: 0 }}><Pencil size={20}></Pencil> Edit Item</h1>
            <p className="item-sub">Item ID: {itemId}</p>
            <form onSubmit={handleSubmit} style={{display:"grid", gap:12}}>
                <input className="input" placeholder="Item Name" id="test"/>
                <script>
                    const test = document.getElementById('test');
                    test.value="hi"
                </script>
                    
                <input className="input" type="file" placeholder="Image" />
                <input className="input" placeholder="Status" />
                <input className="input" placeholder="Info" />
                <div style={{display:"flex", gap:8}}>
            <button className="btn btn-primary" type="submit">Save Changes</button>
            <button type="button" className="btn btn-secondary" onClick={()=>nav(`/${activeGroupId}/inventory`)}>Cancel</button>
        </div>
      </form>
    </div>

    )
}

