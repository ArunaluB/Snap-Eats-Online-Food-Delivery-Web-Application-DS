import { Mail, Lock } from "lucide-react";
import { useState } from "react";

export function Login() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url('https://static.vecteezy.com/system/resources/previews/051/740/895/non_2x/traditional-indian-cuisine-displayed-on-rustic-tabletop-photo.jpg')",
          filter: "blur(1px) brightness(0.3)",
        }}
      />
      <div className="relative z-10 bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
        <form className="space-y-5">
          <div className="relative">
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
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="#" className="text-violet-600 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
