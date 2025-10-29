import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import EditGroup from './pages/EditGroup';
import ChoresDashboard from './pages/ChoresDashboard';
import AddChore from './pages/AddChore';
import EditChore from './pages/EditChore';

export default function App() {
  return (
    <Layout>
      <Routes>

        {/*Group Home Routes*/}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups/new" element={<CreateGroup />} />
        <Route path="/groups/:groupId/edit" element={<EditGroup />} />

        {/*Chores Routes*/}
        <Route path="/chores" element={<ChoresDashboard />} />
        <Route path="/chores/add" element={<AddChore />} />
        <Route path="/chores/:choreId/edit" element={<EditChore />} />

      </Routes>
    </Layout>
  );
}
