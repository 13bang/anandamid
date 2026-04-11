import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { FiUser, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="flex min-h-screen bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#818cf8]">
      
      {/* LEFT SIDE */}
      <div className="hidden w-1/2 lg:flex items-center justify-center">
        <img
          src="/logoanandam.svg"
          alt="logo"
          className="w-[500px]"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center w-full lg:w-1/2">
        <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-2xl">

          <h2 className="mb-2 text-2xl font-semibold text-center">
            Welkam Bek
          </h2>
          <p className="mb-8 text-sm text-center text-gray-500">
            Semoga kita selalu dilindungi Tuhan Yang Maha Esa dalam setiap langkah kita. Aamiin.
          </p>

          <form onSubmit={handleLogin} className="space-y-8">

            {/* Username */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 pr-10 border-b border-gray-300 focus:outline-none focus:border-indigo-500 placeholder-gray-400 text-black"
              />
              <FiUser className="absolute right-2 top-3 text-gray-400" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pr-10 transition-all duration-300 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
              />

              {/* TOGGLE SHOW/HIDE */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white transition duration-300 rounded-lg bg-indigo-600 hover:bg-indigo-700"
            >
              Login
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}