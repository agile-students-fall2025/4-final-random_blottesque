import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import EditGroup from './pages/EditGroup';
import ChoresDashboard from './pages/ChoresDashboard';
import AddChore from './pages/AddChore';
import EditChore from './pages/EditChore';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ExpensesDashboard from './pages/ExpensesDashboard';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import GroupInventory from './pages/GroupInventory';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import UserProfile from './pages/UserProfile';

export default function App() {
  return (
    <Layout>
      <Routes>

        {/* Authentication Routes - no login required*/}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signout" element={<Signup />} /> {/* Keep for backwards compat */}

        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes */}
          {/* Group Home Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/groups/new" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
          <Route path="/groups/:groupId/edit" element={<ProtectedRoute><EditGroup /></ProtectedRoute>} />

          {/* Chores Routes */}
          <Route path="/chores" element={<ProtectedRoute><ChoresDashboard /></ProtectedRoute>} />
          <Route path="/chores/add" element={<ProtectedRoute><AddChore /></ProtectedRoute>} />
          <Route path="/chores/:choreId/edit" element={<ProtectedRoute><EditChore /></ProtectedRoute>} />

          {/* Expenses Routes */}
          <Route path="/expenses" element={<ProtectedRoute><ExpensesDashboard /></ProtectedRoute>} />
          <Route path="/expenses/new" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
          <Route path="/expenses/:expenseId/edit" element={<ProtectedRoute><EditExpense /></ProtectedRoute>} />

          {/* Inventory Routes */}
          <Route path="/:groupId/inventory" element={<ProtectedRoute><GroupInventory /></ProtectedRoute>} />
          <Route path="/:groupId/inventory/new" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
          <Route path="/:groupId/inventory/:itemId/edit" element={<ProtectedRoute><EditItem /></ProtectedRoute>} />

          {/* Profile Routes */}
          <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

      </Routes>
    </Layout>
  );
}
