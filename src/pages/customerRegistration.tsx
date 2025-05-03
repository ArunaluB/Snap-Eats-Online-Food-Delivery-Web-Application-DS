import { Mail, Lock, User, Phone } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import BackgroundAnimation from "./BackgroundAnimation";
import { VerifyOtp } from "../components/VerifyOtp";

export function CustomerRegister() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showOtp, setShowOtp] = useState(false); 
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setShowOtp(false); // reset

    try {
      const response = await fetch("http://localhost:8222/user-management-service/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Registration error:", data);
        setMessage(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      // Send OTP
      const otpResponse = await fetch("http://localhost:8091/api/notification/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, username: formData.username }),
      });

      const text = await otpResponse.text(); // parse as text since it's not valid JSON

      if (!otpResponse.ok) {
        console.error("OTP Error:", text);
        setMessage("OTP sending failed.");
        setLoading(false);
        return;
      }

      // Save email for OTP verification
      localStorage.setItem("pendingEmail", formData.email);
      setShowOtp(true); // show OTP input
    } catch (err: any) {
      console.error("Submit Error:", err);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", label: "User Name", icon: <User /> },
    { name: "fullName", label: "Full Name", icon: <User /> },
    { name: "phone", label: "Phone Number", icon: <Phone /> },
    { name: "email", label: "Email", icon: <Mail /> },
    { name: "password", label: "Password", icon: <Lock /> },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10">
      <BackgroundAnimation />
      <div className="relative z-10 w-full max-w-xl bg-gradient-to-r from-yellow-100 to-blue-100 p-4 md:p-6 shadow-2xl rounded-lg">
        {!showOtp ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
              Customer Registration
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {fields.map(({ name, label, icon }) => (
                <div className="relative" key={name}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                  </div>
                  <input
                    type={name === "password" ? "password" : "text"}
                    name={name}
                    placeholder={label}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="w-full font-bold bg-yellow-500 text-white py-3 rounded-xl hover:bg-gray-900 transition disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
              {message && (
                <p className="text-center mt-2 text-sm text-red-600">{message}</p>
              )}
            </form>
          </>
        ) : (
          <VerifyOtp />
        )}
      </div>
    </div>
  );
}
