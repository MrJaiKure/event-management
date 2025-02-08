import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Event Management</div>
      
      <div className="flex space-x-4">
        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <Link to="/create-event" className="hover:text-gray-300">Create Event</Link>
      </div>

      <div className="flex items-center space-x-4">
        {user && <span className="text-lg">Welcome, {user.name}</span>}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
