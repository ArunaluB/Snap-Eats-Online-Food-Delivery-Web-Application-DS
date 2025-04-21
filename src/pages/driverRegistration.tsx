import { Mail, Lock, User, Phone, Car, IdCard, MapPin } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import BackgroundAnimation from "./BackgroundAnimation";

export function DriverRegister() {
  const [step, setStep] = useState(1);

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
    vehicleColor: "",
    nicNo: "",
    licencePlate: "",
    licenceNumber: "",
    licenceExpiryDate: "",
    password: "",
    profileImage: null as File | null,
    addressTestimony: "",
    licenseImagePathFront: null as File | null,
    licenseImagePathBack: null as File | null,
    nicImagePathFront: null as File | null,
    nicImagePathBack: null as File | null,
    vehicleFrontPath: null as File | null,
    vehicleRearPath: null as File | null,
    vehicleSidePath: null as File | null,
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

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle final submission logic here
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
    <div className="relative min-h-screen flex mt-4 items-center justify-center py-10">
      <BackgroundAnimation />
      <div className="w-full max-w-xl bg-gradient-to-r from-yellow-100 to-blue-100 p-4 md:p-6 justify-between items-center shadow-2xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Driver Registration
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Step 1 - Personal Info */}
          {step === 1 &&
            textFields
              .filter(({ name }) =>
                ["username", "firstName", "lastName", "email", "phoneNumber", "password"].includes(
                  name
                )
              )
              .map(({ name, label, icon, type = "text" }) => (
                <div className="relative" key={name}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                  </div>
                  <input
                    name={name}
                    type={type}
                    placeholder={label}
                    value={formData[name as keyof typeof formData] as string}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  />
                </div>
              ))}

          {/* Step 2 - Vehicle Info */}
          {step === 2 &&
            textFields
              .filter(({ name }) =>
                [
                  "vehicleType",
                  "vehicleNo",
                  "vehicleModel",
                  "vehicleColor",
                  "licencePlate",
                  "licenceNumber",
                  "licenceExpiryDate",
                ].includes(name)
              )
              .map(({ name, label, icon, isSelect, type = "text" }) => (
                <div className="relative" key={name}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                  </div>
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

          {/* Step 3 - Documents */}
          {step === 3 && (
            <>
              <div className="relative col-span-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IdCard />
                </div>
                <input
                  name="nicNo"
                  placeholder="NIC No"
                  value={formData.nicNo}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

              <div className="relative col-span-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MapPin />
                </div>
                <input
                  name="addressTestimony"
                  placeholder="Address Testimony"
                  value={formData.addressTestimony}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

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
            </>
          )}

          {/* Step Buttons */}
          <div className="col-span-full flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-xl"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-xl ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-xl ml-auto"
              >
                Register
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
