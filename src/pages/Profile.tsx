// import React, { useEffect, useState } from 'react';
// import { UserIcon, PhoneIcon, StarIcon, SettingsIcon } from 'lucide-react';
// import axios from 'axios';

// interface DriverData {
//   id: number;
//   name: string;
//   email: string;
//   latitude: number;
//   longitude: number;
//   licenseNumber: string;
//   nic: string;
//   vehicleType: string;
//   vehicleModel: string;
//   registrationNumber: string;
//   phoneNumber: string;
//   username: string;
//   firstName: string;
//   lastName: string;
//   vehicleNo: string;
//   licenceNumber: string;
//   licenceExpiryDate: string;
//   profileImage: string;
//   vehicleColor: string;
// }

// export function Profile() {
//   const [driver, setDriver] = useState<DriverData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const username = 'huththa';

//   useEffect(() => {
//     axios
//       .get<DriverData>(`http://localhost:8080/api/drivermanager/api/driver/details?username=${username}`)
//       .then((response) => {
//         setDriver(response.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError('Failed to fetch driver data');
//         setLoading(false);
//       });
//   }, [username]);

//   if (loading) return <div className="text-center mt-8">Loading...</div>;
//   if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
//   if (!driver) return null;

//   return (
//     <div className="max-w-xl mx-auto p-4 mt-8">
//       <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
//         <div className="flex items-center space-x-4 p-4">
//           <img
//             src={driver.profileImage || 'https://via.placeholder.com/100'}
//             alt="Driver"
//             className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
//           />
//           <div>
//             <h2 className="text-2xl font-bold">{driver.name}</h2>
//             <p className="text-gray-500">Driver ID: #{driver.id}</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl shadow-md">
//         <div className="p-4 space-y-4">
//           <div className="flex items-center space-x-3">
//             <PhoneIcon className="h-5 w-5 text-gray-500" />
//             <span>{driver.phoneNumber}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <StarIcon className="h-5 w-5 text-gray-500" />
//             <span>Email: {driver.email}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <SettingsIcon className="h-5 w-5 text-gray-500" />
//             <span>Vehicle: {driver.vehicleType} ({driver.vehicleModel}, {driver.vehicleColor})</span>
//           </div>
//           <div className="text-sm text-gray-600">
//             <p>License Number: {driver.licenceNumber}</p>
//             <p>NIC: {driver.nic}</p>
//             <p>Vehicle No: {driver.vehicleNo}</p>
//             <p>License Expiry: {driver.licenceExpiryDate}</p>
//             <p>Location: ({driver.latitude}, {driver.longitude})</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  UserIcon,
  PhoneIcon,
  CarIcon,
  BadgeInfoIcon,
  MapPinIcon,
} from 'lucide-react';

interface Driver {
  id?: string;
  name: string;
  email: string;
  nic: string;
  phoneNumber: string;
  vehicleModel: string;
  vehicleNo: string;
  vehicleColor: string;
  registrationNumber: string;
  licenceNumber: string;
  licenceExpiryDate: string;
  profileImage: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  addressTestimony: string;
}

export function Profile() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const username = parsedUser.username;

        axios
          .get(
            `http://localhost:8080/api/drivermanager/api/driver/details?username=huththa`
          )
          .then((res) => {
            setDriver(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Failed to fetch driver details:', err);
            setLoading(false);
          });
      } catch (err) {
        console.error('Error parsing user data:', err);
        setLoading(false);
      }
    } else {
      console.warn('No user found in localStorage');
      setLoading(false);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (driver) {
      setDriver({ ...driver, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = () => {
    if (!driver) return;

    axios
      .put(
        `http://localhost:8080/api/driver/update/${driver.username}`,
        driver
      )
      .then((res) => {
        alert('Profile updated successfully!');
        setIsEditing(false);
      })
      .catch((err) => {
        console.error('Update failed:', err);
        alert('Failed to update profile.');
      });
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">Loading profile...</div>
    );
  if (!driver)
    return (
      <div className="text-center mt-10 text-red-500">Driver not found.</div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-8 space-y-6">
      <div className="flex flex-col items-center">
        <img
          src={driver.profileImage}
          alt="Driver"
          className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-sm object-cover mb-4"
        />
        <h2 className="text-2xl font-bold text-indigo-700">{driver.name}</h2>
        <p className="text-sm text-gray-500">Username: {driver.username}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ['First Name', 'firstName'],
          ['Last Name', 'lastName'],
          ['Email', 'email'],
          ['NIC', 'nic'],
          ['Phone Number', 'phoneNumber'],
          ['Vehicle Model', 'vehicleModel'],
          ['Vehicle Number', 'vehicleNo'],
          ['Vehicle Color', 'vehicleColor'],
          ['Registration Number', 'registrationNumber'],
          ['License Number', 'licenceNumber'],
          ['License Expiry Date', 'licenceExpiryDate'],
          ['Address Testimony', 'addressTestimony'],
          ['Password', 'password'],
        ].map(([label, key]) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            {key === 'addressTestimony' ? (
              <textarea
                name={key}
                value={(driver as any)[key]}
                onChange={handleChange}
                disabled={!isEditing}
                className="border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            ) : (
              <input
                name={key}
                type={key === 'password' ? 'password' : 'text'}
                value={(driver as any)[key]}
                onChange={handleChange}
                disabled={!isEditing}
                className="border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-6 py-2 rounded-full shadow hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
