import { Mail, Lock, User, Phone, Car, IdCard, MapPin, X, Upload } from "lucide-react";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundAnimation from "./BackgroundAnimation";

function Notification({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between max-w-md">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export function DriverRegister() {
  const [step, setStep] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();

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
    profileImage: null as string | null,
    addressTestimony: "",
    licenseImagePathFront: null as string | null,
    licenseImagePathBack: null as string | null,
    nicImagePathFront: null as string | null,
    nicImagePathBack: null as string | null,
    vehicleFrontPath: null as string | null,
    vehicleRearPath: null as string | null,
    vehicleSidePath: null as string | null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const fileUrl = await uploadToImageKit(file);
      setFormData({ ...formData, [name]: fileUrl });
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    setNotificationMessage("Registration successful! Verification will complete within 48 hours.");
    setShowNotification(true);

    setFormData({
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
      profileImage: null,
      addressTestimony: "",
      licenseImagePathFront: null,
      licenseImagePathBack: null,
      nicImagePathFront: null,
      nicImagePathBack: null,
      vehicleFrontPath: null,
      vehicleRearPath: null,
      vehicleSidePath: null,
    });

    setTimeout(() => {
      navigate("/");
    }, 5000);
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

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
      {showNotification && (
        <Notification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}

      <BackgroundAnimation />

      <div className="w-full max-w-2xl bg-gradient-to-r from-yellow-100 to-blue-100 p-6 shadow-2xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Driver Registration</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Step 1 - Personal Info */}
          {step === 1 &&
            textFields
              .filter(({ name }) =>
                ["username", "firstName", "lastName", "email", "phoneNumber", "password"].includes(name)
              )
              .map(({ name, label, icon, type = "text" }) => (
                <div className="relative" key={name}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
                  <input
                    name={name}
                    type={type}
                    placeholder={label}
                    value={formData[name as keyof typeof formData] as string}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    required
                  />
                </div>
              ))}

          {/* Step 2 - Vehicle Info */}
          {step === 2 &&
            textFields
              .filter(({ name }) =>
                ["vehicleType", "vehicleNo", "vehicleModel", "vehicleColor", "licencePlate", "licenceNumber", "licenceExpiryDate"].includes(name)
              )
              .map(({ name, label, icon, isSelect, type = "text" }) => (
                <div className="relative" key={name}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
                  {isSelect ? (
                    <select
                      name={name}
                      value={formData[name as keyof typeof formData] as string}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                      required
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
                      required
                    />
                  )}
                </div>
              ))}

          {/* Step 3 - NIC & Address */}
          {step === 3 && (
            <>
              <div className="relative col-span-full">
                <label htmlFor="addressTestimony" className="block text-gray-700 mb-2">Address Testimony</label>
                <textarea
                  name="addressTestimony"
                  placeholder="Provide address testimony"
                  value={formData.addressTestimony}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {/* Step 4 - File Uploads */}
          {step === 4 && (
            <>
              {fileFields.map((field) => (
                <div key={field} className="relative">
                  <label className="block text-gray-700 mb-1">{fileLabels[field]}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      name={field}
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                    {formData[field as keyof typeof formData] && (
                      <Upload className="text-green-500" size={20} />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="col-span-full flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl"
                onClick={prevStep}
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl"
                onClick={nextStep}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-xl"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
function uploadToImageKit(file: File) {
  throw new Error("Function not implemented.");
}

