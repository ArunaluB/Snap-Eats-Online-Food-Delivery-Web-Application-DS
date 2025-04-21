import { Mail, Lock, User, Phone, Car, IdCard, MapPin } from "lucide-react";
import { useState, ChangeEvent } from "react";

export function DriverRegister() {
  const [formData, setFormData] = useState({
    id: "",
    driverId: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    vehicleType: "",
    vehicleNo: "",
    vehicleModel: "",
    nicNo: "",
    licencePlate: "",
    licenceNumber: "",
    licenceExpiryDate: "",
    password: "",
    profileImage: null,
    addressTestimony: "",
    licenseImagePathFront: null,
    licenseImagePathBack: null,
    nicImagePathFront: null,
    nicImagePathBack: null,
    vehicleFrontPath: null,
    vehicleRearPath: null,
    vehicleSidePath: null,
    vehicleColor: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const textFields = [
    { name: "username", label: "User Name", icon: <User /> },
    { name: "firstName", label: "First Name", icon: <User /> },
    { name: "lastName", label: "Last Name", icon: <User /> },
    { name: "email", label: "Email", icon: <Mail /> },
    { name: "phoneNumber", label: "Phone Number", icon: <Phone /> },
    { name: "vehicleType", label: "Vehicle Type", icon: <Car />, isSelect: true },
    { name: "vehicleNo", label: "Vehicle No", icon: <Car /> },
    { name: "vehicleModel", label: "Vehicle Model", icon: <Car /> },
    { name: "vehicleColor", label: "Vehicle Color", icon: <Car /> },
    { name: "nicNo", label: "NIC No", icon: <IdCard /> },
    { name: "licencePlate", label: "License Plate", icon: <Car /> },
    { name: "licenceNumber", label: "License Number", icon: <Car /> },
    { name: "licenceExpiryDate", label: "License Expiry Date", icon: <Car />, type: "date" },
    { name: "password", label: "Password", icon: <Lock />, type: "password" },
    { name: "addressTestimony", label: "Address Testimony", icon: <MapPin /> },
  ];

  const fileFields = [
    "profileImage",
    "licenseImagePathFront",
    "licenseImagePathBack",
    "nicImagePathFront",
    "nicImagePathBack",
    "vehicleFrontPath",
    "vehicleRearPath",
    "vehicleSidePath",
  ];

  const fileLabels: { [key: string]: string } = {
    profileImage: "Profile Image",
    licenseImagePathFront: "License Image Front",
    licenseImagePathBack: "License Image Back",
    nicImagePathFront: "NIC Image Front",
    nicImagePathBack: "NIC Image Back",
    vehicleFrontPath: "Vehicle Front Image",
    vehicleRearPath: "Vehicle Rear Image",
    vehicleSidePath: "Vehicle Side Image",
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1695654390723-479197a8c4a3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2QlMjBkZWxpdmVyeXxlbnwwfHwwfHx8MA%3D%3D')",
          filter: "brightness(0.3)",
        }}
      />
      <div className="relative z-10 bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Driver Registration</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {textFields.map(({ name, label, icon, isSelect, type = "text" }) => (
            <div className="relative" key={name}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
              {isSelect ? (
                <select
                  name={name}
                  value={formData[name as keyof typeof formData] as string}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Van">Van</option>
                  <option value="Bus">Bus</option>
                  <option value="Truck">Truck</option>
                </select>
              ) : (
                <input
                  name={name}
                  type={type}
                  placeholder={label}
                  value={formData[name as keyof typeof formData] as string}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              )}
            </div>
          ))}

          {fileFields.map((field) => (
            <div key={field} className="col-span-full">
              <label className="block mb-1 text-sm font-medium text-gray-600 capitalize">
                {fileLabels[field]}
              </label>
              <input
                name={field}
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400"
              />
            </div>
          ))}

          <button className="col-span-full bg-yellow-500 font-bold text-white py-3 rounded-xl hover:bg-gray-900 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
