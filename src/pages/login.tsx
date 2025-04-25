
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import BackgroundAnimation from "./BackgroundAnimation";

export function Login() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="relative max-h-screen flex items-center justify-center py-10">
      <BackgroundAnimation />
      <div className="w-full max-w-xl bg-gradient-to-r from-yellow-100 to-blue-100 p-4 md:p-6 justify-between items-center shadow-2xl rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
        <form className="space-y-5">
          <div className="relative mt-8">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="identifier"
              type="text"
              placeholder="Email or Phone"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
          </div>
          <button className="w-full font-bold bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition">
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="#" className="text-violet-600 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
