import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import EditGroup from './pages/EditGroup';
import GroupInventory from './pages/GroupInventory';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups/new" element={<CreateGroup />} />
        <Route path="/groups/:groupId/edit" element={<EditGroup />} />
        <Route path="/groups/:groupId/inventory" element={<GroupInventory />} />
      </Routes>
    </Layout>
  );
}
