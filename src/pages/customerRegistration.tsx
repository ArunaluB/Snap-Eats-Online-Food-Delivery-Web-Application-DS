
import { Mail, Lock, User, Phone } from "lucide-react";
import { useState, ChangeEvent } from "react";
import BackgroundAnimation from './BackgroundAnimation';  // Import your animation component
import React from "react";

export function CustomerRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fields = [
    { name: "First Name", icon: <User /> },
    { name: "Last Name", icon: <User /> },
    { name: "Email", icon: <Mail /> },
    { name: "Phone Number", icon: <Phone /> },
    { name: "Password", icon: <Lock /> },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10">
      <BackgroundAnimation /> 
      <div className="relative z-10 bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Customer Registration
        </h2>
        <form className="space-y-4">
          {fields.map(({ name, icon }) => (
            <div className="relative" key={name}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
              </div>
              <input
                type={name === "Password" ? "password" : "text"}
                name={name.replace(/ /g, "")}
                placeholder={name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}
          <button className="w-full bg-yellow-500 text-white py-3 rounded-xl hover:bg-gray-900 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

