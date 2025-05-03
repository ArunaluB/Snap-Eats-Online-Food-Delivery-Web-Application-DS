import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Success: React.FC<{ message: string; time?: number }> = ({ message, time }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (time) {
            const timer = setTimeout(() => {
                navigate('/');
            }, time);
            return () => clearTimeout(timer); // Cleanup on unmount
        }
    }, [time, navigate]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <div className="mb-4">
                    <svg
                        className="h-16 w-16 text-green-500 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Success!</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Success;