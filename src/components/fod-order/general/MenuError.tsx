import React from 'react';

interface MenuErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const MenuError: React.FC<MenuErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {message || "No menu items available"}
      </h3>
      <p className="text-gray-500 mb-4">
        It looks like we couldn't load the menu. Please try again or check back later.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};