import { useNavigate } from "react-router-dom";

export default function AddChore() {
    const nav = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        // Sprint 1: no persistence; navigate back
        nav("/chores");
    };

    return (
        <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1 className="section-title" style={{ marginTop: 0 }}>Add a Chore</h1>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <label>
                    <div className="item-sub">Title</div>
                    <input className="input" placeholder="Title" />
                </label>

                <label>
                    <div className="item-sub">Assignee</div>
                    <input className="input" placeholder="Assignee" />
                </label>

                <label>
                    <div className="item-sub">Due</div>
                    <input className="input" placeholder="Due" />
                </label>

                <label>
                    <div className="item-sub">Repeat</div>
                    <input className="input" placeholder="Repeat" />
                </label>

                <label>
                    <div className="item-sub">Description</div>
                    <input className="input" placeholder="Description" />
                </label>
                
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-primary" type="submit">Add Chore</button>
                    <button type="button" className="btn btn-secondary" onClick={()=>nav("/chores")}>Cancel</button>
                </div>
            </form>
        </div>
    )
}