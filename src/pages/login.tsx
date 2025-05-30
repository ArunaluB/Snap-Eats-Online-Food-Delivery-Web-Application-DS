import { Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundAnimation from "./BackgroundAnimation";

export function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {     

      // In your form submission, ensure `identifier` is sent as `username`
      const response = await axios.post(
        "http://localhost:8222/user-management-service/api/auth/login",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const { token, role } = response.data;

      // Save full response (user + token) to localStorage
      localStorage.setItem("authData", JSON.stringify(response.data));
      
      // (Optional: still keep token separately if needed elsewhere)
      localStorage.setItem("token", token);
      
      // Redirect based on the user's role
      if (role === "DRIVER") {
          navigate("/driver");

      } else if (role === "USER") {
        navigate("/"); 
      } else if (role === "RESTAURANT_OWNER") {
        navigate("/restaurant");
      } else if (role === "ADMIN") {
        navigate("/admin");
      } else {
        setError("Unknown role. Please contact support.");
      }
     } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-h-screen flex items-center justify-center py-10">
      <BackgroundAnimation />
      <div className="w-full max-w-xl bg-gradient-to-r from-yellow-100 to-blue-100 p-4 md:p-6 shadow-2xl rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative mt-8">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-400 focus:outline-none"
              required
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
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold bg-yellow-500 text-white py-3 rounded-xl hover:bg-gray-900 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="http://localhost:5173/customer-register" className="text-violet-600 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
