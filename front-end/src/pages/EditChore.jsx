import { useNavigate, useParams } from "react-router-dom";
import { CheckSquare, Square, ListChecks, Pencil, PlusSquare, Trash2 } from 'lucide-react';

export default function EditChore() {
    const nav = useNavigate();
    const { choreId } = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();
        nav("/chores");
    };

    return (
        <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1 className="section-title" style={{ marginTop: 0 }}><Pencil size={20}></Pencil>  Edit Chore</h1>
            <p className="item-sub">Chore ID: {choreId}</p>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <label>
                    <div className="item-sub">Title</div>
                    <input className="input" placeholder="Title" />
                </label>

                <label>
                    <div className="item-sub">Assignee</div>
                    <select className="input" placeholder="Assignee" />
                </label>

                <label>
                    <div className="item-sub">Due</div>
                    <input className="input" placeholder="Due" />
                </label>

                <label>
                    <div className="item-sub">Repeat</div>
                    <select className="input" placeholder="Repeat" />
                </label>

                <label>
                    <div className="item-sub">Description</div>
                    <textarea className="input" placeholder="Description" />
                </label>
                
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-primary" type="submit">Save Changes</button>
                    <button type="button" className="btn btn-secondary" onClick={()=>nav("/chores")}>Cancel</button>
                </div>
            </form>
        </div>

    )
}

