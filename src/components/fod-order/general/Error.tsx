import React from 'react';
import { Link } from 'react-router-dom';

const Error: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <div className="mb-4">
                    <svg
                        className="h-16 w-16 text-red-500 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onRetry}
                        className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors duration-300"
                    >
                        Try Again
                    </button>
                    <Link
                        to="/"
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors duration-300"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Error;