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
import ExpensesDashboard from './pages/ExpensesDashboard';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import GroupInventory from './pages/GroupInventory';
import UserProfile from './pages/UserProfile';

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
        <Route path="/chores/add" element={<AddChore />} />
        <Route path="/chores/:choreId/edit" element={<EditChore />} />

         {/* Expenses Routes */}
        <Route path="/expenses" element={<ExpensesDashboard />} />
        <Route path="/expenses/new" element={<AddExpense />} />
        <Route path="/expenses/:expenseId/edit" element={<EditExpense />} />

        {/*Inventory Routes*/}
        <Route path="/groups/:groupId/inventory" element={<GroupInventory />} />

        {/*Profile Routes*/}
        <Route path="/user-profile" element={<UserProfile />} />

      </Routes>
    </Layout>

    
  );
}
