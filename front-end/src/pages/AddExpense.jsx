import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function AddExpense() {
  const nav = useNavigate();
  const { users = [], addExpense, currentUser } = useApp();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    paidBy: currentUser?.id || "",
    sharedWith: [],      
    notes: "",
  });

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.description || !form.amount || !form.paidBy) return;

    const payload = {
      id: Date.now().toString(),
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      paidBy: form.paidBy,         
      sharedWith: form.sharedWith,  
      notes: form.notes?.trim(),
      createdAt: new Date().toISOString(),
    };

    await (addExpense ? addExpense(payload) : Promise.resolve());
    nav("/expenses");
  }

  return (
    <div style={{ padding: 20, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => nav(-1)}>×</button>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Add an Expense</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Expense:
          <input
            type="text"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="e.g., Groceries"
          />
        </label>

        <label>
          Amount ($):
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
            placeholder="0.00"
          />
        </label>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Paid By:</div>
          <div style={{ display: "grid", gap: 6 }}>
            {users.map((u) => (
              <label key={u.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="radio"
                  name="paidBy"
                  checked={form.paidBy === u.id}
                  onChange={() => update("paidBy", u.id)}
                />
                <span>{u.name || u.email}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Shared With:</div>
          <div style={{ display: "grid", gap: 6 }}>
            {users.map((u) => (
              <label key={u.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={form.sharedWith.includes(u.id)}
                  onChange={(e) => {
                    update(
                      "sharedWith",
                      e.target.checked
                        ? [...form.sharedWith, u.id]
                        : form.sharedWith.filter((id) => id !== u.id)
                    );
                  }}
                />
                <span>{u.name || u.email}</span>
              </label>
            ))}
          </div>
        </div>

        <label>
          Notes:
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Optional details..."
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Add Expense</button>
          <button type="button" onClick={() => nav("/expenses")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

