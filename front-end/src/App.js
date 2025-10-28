import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import EditGroup from './pages/EditGroup';
import ChoresDashboard from './pages/ChoresDashboard';
import AddChore from './pages/AddChore';
import EditChore from './pages/EditChore';
import Login from './pages/Login';
import Signout from './pages/Signout';

export default function App() {
  return (
    <Layout>
      <Routes>

        {/*Authentication Routes*/}
        <Route path="/login" element={<Login />} />
        <Route path="/signout" element={<Signout />} />

        {/*Group Home Routes*/}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups/new" element={<CreateGroup />} />
        <Route path="/groups/:groupId/edit" element={<EditGroup />} />

        {/*Chores Routes*/}
        <Route path="/chores" element={<ChoresDashboard />} />
        <Route path="/add-chore" element={<AddChore />} />
        <Route path="/chores/:choreId/edit" element={<EditChore />} />

      </Routes>
    </Layout>

    
  );
}
