import React, { useState, useEffect } from 'react';
import { Map, Marker } from 'react-map-gl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '../general/Loading';
import { LocationPickerModal } from './LocationPickerModal';
import 'mapbox-gl/dist/mapbox-gl.css';

interface AddressModelProps {
    userId: string;
    onClose: () => void;
    onSave: (addressDetails: { street: string; city: string; }) => void;
}

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXJ1bmFsdSIsImEiOiJjbTllZ3ZleHUxZWlxMmxzN3hyMmlxaXBjIn0.88xrwVeZkSlah-fUY3_3BA';

export const AddressModel: React.FC<AddressModelProps> = ({ userId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: '',
        latitude: null as number | null,
        longitude: null as number | null,
        deliveryInstructions: '',
        addressLabel: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await axios.get(`http://localhost:8222/user-management-service/api/user-details/${userId}`);
                const { address } = response.data;
                setFormData({
                    street: address.street || '',
                    city: address.city || '',
                    state: address.state || '',
                    zipCode: address.zipCode || '',
                    landmark: address.landmark || '',
                    latitude: address.latitude || null,
                    longitude: address.longitude || null,
                    deliveryInstructions: '',
                    addressLabel: '',
                });
                console.log('Fetched address:', address);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    console.error('Error fetching address:', err.response?.data || err.message);
                } else {
                    console.error('Error fetching address:', err);
                }
                setError('Failed to load address.');
                toast.error('Failed to load address.', { duration: 3000 });
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLocationSave = (location: { lat: number; lng: number }) => {
        setFormData((prev) => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng,
        }));
        setIsLocationModalOpen(false);
        console.log('Location saved:', location);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.patch(
                `http://localhost:8222/user-management-service/api/user-details/${userId}`,
                {
                    fullName: null,
                    username: null,
                    password: null,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode || null,
                        landmark: formData.landmark || null,
                        latitude: formData.latitude,
                        longitude: formData.longitude,
                    },
                    role: null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                }
            );
            toast.success('Address updated successfully!', { duration: 3000 });
            onSave({ street: formData.street, city: formData.city });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error('Error updating address:', err.response?.data || err.message);
            } else {
                console.error('Error updating address:', err);
            }
            toast.error('Failed to update address.', { duration: 3000 });
        }
    };

    const handleMapLoad = () => {
        console.log('Map loaded successfully');
    };

    const handleMapError = (error: any) => {
        console.error('Map error:', error);
        setMapError('Failed to load map');
        toast.error('Failed to load map: Check token or network', { duration: 3000 });
    };

    if (loading) return <div className="p-4 text-center"><Loading /></div>;
    if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

    return (
        <div id="webcrumbs">
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-md w-full lg:min-w-[420px] mx-4 relative overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold">Address info</h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 max-h-[calc(100vh-160px)] overflow-y-auto">
                        <div className="relative h-[120px] bg-gray-100 rounded-lg mb-4 overflow-hidden">
                            {formData.latitude && formData.longitude && !mapError ? (
                                <Map
                                    initialViewState={{
                                        latitude: formData.latitude,
                                        longitude: formData.longitude,
                                        zoom: 14,
                                    }}
                                    style={{ width: '100%', height: '120px' }}
                                    mapStyle="mapbox://styles/mapbox/streets-v11"
                                    mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                                    interactive={false}
                                    onLoad={handleMapLoad}
                                    onError={handleMapError}
                                >
                                    <Marker latitude={formData.latitude} longitude={formData.longitude} anchor="bottom">
                                        <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white" />
                                    </Marker>
                                </Map>
                            ) : (
                                <img
                                    src="https://images.unsplash.com/photo-1604357209793-fca5dca89f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxtYXB8ZW58MHx8fHwxNzQ1NzQ1NDY2fDA&ixlib=rb-4.0.3&q=80&w=1080"
                                    alt="Map location"
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => setIsLocationModalOpen(true)}
                                className="absolute bottom-3 right-3 bg-white py-1 px-3 rounded-full text-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                Adjust pin
                            </button>
                        </div>

                        <p className={`font-medium ${formData.street ? 'text-black' : 'text-red-500'}`}>
                            {formData.street || 'Address is not given'}
                        </p>
                        <p className={`text-sm ${formData.city ? 'text-gray-500' : 'text-red-500'}`}>
                            {formData.city || 'City is not given'}
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Additional address information (required)</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="e.g. Street address, building name"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 hover:border-gray-400 transition-colors"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g. Malabe"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 hover:border-gray-400 transition-colors"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="e.g. Western Province"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 hover:border-gray-400 transition-colors"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="e.g. 10115"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 hover:border-gray-400 transition-colors"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Landmark</label>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                placeholder="e.g. Across Railway Station"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 hover:border-gray-400 transition-colors"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Instructions for delivery person</label>
                            <textarea
                                name="deliveryInstructions"
                                value={formData.deliveryInstructions}
                                onChange={handleChange}
                                placeholder="Example: Please knock instead of using the doorbell"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg h-[80px] focus:outline-none focus:ring-1 focus:ring-primary-500 hover:border-gray-400 transition-colors resize-none"
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Address label</label>
                            <input
                                type="text"
                                name="addressLabel"
                                value={formData.addressLabel}
                                onChange={handleChange}
                                placeholder="Add a label (e.g. school)"
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 hover:border-gray-400 transition-colors"
                            />
                        </div>

                        <div className="border-t p-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
                {isLocationModalOpen && (
                    <LocationPickerModal
                        onClose={() => setIsLocationModalOpen(false)}
                        onSave={handleLocationSave}
                    />
                )}
            </div>
        </div>
    );
};