import { Mail, Lock, User, Phone } from "lucide-react";
import { useState, ChangeEvent } from "react";
import BackgroundAnimation from "./BackgroundAnimation";

export function RestaurantRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    restaurantName: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to send to the backend
    const data = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      restaurantName: formData.restaurantName,
    };

    try {
      // Send data to the backend API
      const response = await fetch('/api/restaurant-owner/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Redirect to dashboard or show success message
        window.location.href = "/dashboard"; // Redirect to the dashboard
      } else {
        // Handle error
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
    }
  };

  const fields = [
    { name: "firstName", label: "First Name", icon: <User /> },
    { name: "lastName", label: "Last Name", icon: <User /> },
    { name: "email", label: "Email", icon: <Mail /> },
    { name: "phone", label: "Phone", icon: <Phone /> },
    { name: "password", label: "Password", icon: <Lock /> },
    { name: "restaurantName", label: "Restaurant Name", icon: <User /> },
  ];

  return (
    <div className="relative max-h-screen flex items-center justify-center py-10">
      <BackgroundAnimation />
      <div className="w-full max-w-xl bg-gradient-to-r from-yellow-100 to-blue-100 p-4 md:p-6 justify-between items-center shadow-2xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Restaurant Registration</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
