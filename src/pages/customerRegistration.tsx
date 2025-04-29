import { Mail, Lock, User, Phone } from "lucide-react";
import { useState, ChangeEvent } from "react";
import BackgroundAnimation from "./BackgroundAnimation";

export function CustomerRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const fields = [
    { name: "firstName", label: "First Name", icon: <User /> },
    { name: "lastName", label: "Last Name", icon: <User /> },
    { name: "email", label: "Email", icon: <Mail /> },
    { name: "phoneNumber", label: "Phone Number", icon: <Phone /> },
    { name: "password", label: "Password", icon: <Lock /> },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10">
      <BackgroundAnimation />
      <div className="relative z-10 w-full max-w-xl bg-gradient-to-r from-yellow-100 to-blue-100 p-4 md:p-6 shadow-2xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Customer Registration
        </h2>
        <form className="space-y-4">
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
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          ))}
          <button className="w-full font-bold bg-yellow-500 text-white py-3 rounded-xl hover:bg-gray-900 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
