import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { useContext } from "react";

function App() {
  // const { token} =  useContext(AuthContext)
  const token = localStorage.getItem("token");
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

             {/* Protected Routes */}
             {token ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-event" element={<CreateEvent />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Navigate to="/" />} />
              <Route path="/create-event" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
