import { useNavigate } from 'react-router-dom';
import GroupForm from '../components/GroupForm';
import { useApp } from '../context/AppContext';

export default function CreateGroup() {
  const { createGroup } = useApp();
  const nav = useNavigate();

  async function handleSubmit(form) {
    const g = await createGroup(form);
    nav(`/groups/${g.id}/edit`);
  }

  return (
    <div style={{display:'grid', gap:12}}>
      <h1 style={{margin:0, fontSize:20, fontWeight:800}}>Create Group</h1>
      <p className="item-sub">Name your household, add roommates, pick components, and set quiet hours.</p>
      <GroupForm onSubmit={handleSubmit} submitLabel="Save" />
    </div>
  );
}
