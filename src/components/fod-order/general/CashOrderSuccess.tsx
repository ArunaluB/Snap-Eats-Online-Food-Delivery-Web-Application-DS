import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessProps {
  userId: string;
}

const CashOrderSuccess: React.FC<SuccessProps> = ({ userId }) => {
  const navigate = useNavigate();

  // Automatically navigate after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/fod-order/latest-order/${userId}`, { replace: true });
    }, 2000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate, userId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center max-w-sm w-full">
        <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-800">Order Placed Successfully!</h2>
        <p className="mt-2 text-sm text-gray-500 text-center">
          Your order has been received. Redirecting to your latest order...
        </p>
      </div>
    </div>
  );
};

export default CashOrderSuccess;