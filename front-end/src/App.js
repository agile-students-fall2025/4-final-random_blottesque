import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import EditGroup from './pages/EditGroup';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups/new" element={<CreateGroup />} />
        <Route path="/groups/:groupId/edit" element={<EditGroup />} />
      </Routes>
    </Layout>
  );
}
