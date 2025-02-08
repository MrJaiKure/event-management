import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("event-management-production-2eae.up.railway.app/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg animate-pulse mb-6">
        🎉 Manage <span className="text-yellow-300">Events</span> Effortlessly!
      </h1>
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500">Login to your account</p>
        <div className="mt-6">
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          >
            Sign In
          </button>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?  
            <a href="/register" className="text-blue-600 font-semibold hover:underline"> Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
  
  
};

export default Login;
