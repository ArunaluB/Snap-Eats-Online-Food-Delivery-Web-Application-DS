import { Mail, Lock, User, Phone } from "lucide-react";
import { useState, ChangeEvent } from "react";

export function RestaurantRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const fields = [
    { name: "firstName", label: "First Name", icon: <User /> },
    { name: "lastName", label: "Last Name", icon: <User /> },
    { name: "email", label: "Email", icon: <Mail /> },
    { name: "phone", label: "Phone", icon: <Phone /> },
    { name: "password", label: "Password", icon: <Lock /> },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D')",
          filter: "blur(1px) brightness(0.7)",
        }}
      />
      <div className="relative z-10 bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Restaurant Registration</h2>
        <form className="space-y-4">
          {fields.map(({ name, label, icon }) => (
            <div className="relative" key={name}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
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
