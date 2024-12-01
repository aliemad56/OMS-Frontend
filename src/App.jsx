import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import ProtectedRoute from "./components/ProtectedRoute";
import SignInPage from "./pages/signIn.jsx";
import Dashboard from './pages/dashBoard.jsx';

import AdminAttendance from "./roles/admin/admin-attendence/adminAttendence.jsx";
import AdminExpenses from "./roles/admin/admin-expensess/adminExpensess.jsx";
import AdminUserManagement from "./roles/admin/user-managment/AdminUserManagment.jsx";

const App = () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<SignInPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/expenses"
            element={
              <ProtectedRoute>
                <AdminExpenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendence"
            element={
              <ProtectedRoute>
                <AdminAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;
