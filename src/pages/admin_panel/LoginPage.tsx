  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { login } from "../../services/authService";
  import { FiUser, FiLock } from "react-icons/fi";

  export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        await login({
          username,
          password,
        });

        navigate("/ayamgoreng/dashboard");
      } catch (err) {
        alert("Login gagal");
      }
    };

    return (
      <div
        className="relative flex items-center justify-center min-h-screen bg-center bg-cover"
        style={{
          backgroundImage:
            "url('/loginpage4.jpg')",
        }}
      >
        {/* Overlay gelap */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Glass Card */}
        <div className="relative z-10 w-full max-w-md p-8 border shadow-2xl rounded-2xl bg-white/20 backdrop-blur-md border-white/50">

          <h2 className="mb-8 text-3xl font-semibold text-center text-white">
            Hii Admin!
          </h2>

          <form onSubmit={handleLogin} className="space-y-8">
    
          {/* Username */}
          <div className="relative">
              <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-3 pr-10 text-white transition-all duration-300 bg-transparent border-b border-white/40 placeholder-white/50 focus:outline-none focus:border-white"
              />
              <FiUser className="absolute text-white right-2 top-3 opacity-80" />
          </div>

          {/* Password */}
          <div className="relative">
              <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pr-10 text-white transition-all duration-300 bg-transparent border-b border-white/40 placeholder-white/50 focus:outline-none focus:border-white"
              />
              <FiLock className="absolute text-white right-2 top-3 opacity-80" />
          </div>

          <button
              type="submit"
              className="w-full py-3 font-semibold text-black transition duration-300 bg-white rounded-lg hover:bg-gray-200"
          >
              Login
          </button>
          </form>
        </div>
      </div>
    );
  }
