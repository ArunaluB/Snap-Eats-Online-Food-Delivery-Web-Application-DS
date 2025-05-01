import React from 'react';

const NoPendingOrders: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m0-2v-2m0-2V7m-4 5h8m-8 4h8m-8-8h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Pending Orders</h2>
        <p className="text-gray-500">You currently have no pending orders. Place a new order to get started!</p>
      </div>
    </div>
  );
};

export default NoPendingOrders;