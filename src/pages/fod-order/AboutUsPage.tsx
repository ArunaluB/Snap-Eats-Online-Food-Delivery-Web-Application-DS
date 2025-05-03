import React from 'react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="font-sans bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          About Snap Eats
        </h1>

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.2Fiqaw3HZCqSFbG4M9e9lQHaHa?w=500&h=500&rs=1&pid=ImgDetMain"
            alt="Snap Eats Delivery"
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <p className="text-xl text-gray-600">
            Connecting you to your favorite restaurants, delivered fast and fresh.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-4">
            At Snap Eats, we believe food brings people together. Our mission is to make delicious meals from local restaurants accessible to everyone, anywhere, anytime. Whether it’s a quick lunch, a family dinner, or a late-night snack, we’re here to deliver with speed, reliability, and care.
          </p>
          <p className="text-gray-600">
            We partner with thousands of restaurants to offer a diverse range of cuisines, from comfort food to gourmet dishes, all at the tap of a button.
          </p>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-600 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">
                Wide Selection
              </h3>
              <p className="text-gray-500">
                Choose from a variety of restaurants and cuisines to satisfy any craving.
              </p>
            </div>
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-600 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">
                Fast Delivery
              </h3>
              <p className="text-gray-500">
                Get your food delivered quickly with our efficient delivery network.
              </p>
            </div>
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-600 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">
                Quality Assurance
              </h3>
              <p className="text-gray-500">
                We ensure your food arrives fresh and as ordered, every time.
              </p>
            </div>
          </div>
        </div>

        {/* Join Us */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Join the Snap Eats Community
          </h2>
          <p className="text-gray-600 mb-4">
            Whether you're a customer, restaurant partner, or delivery driver, Snap Eats is here to make food delivery seamless and enjoyable. Download our app or visit our website to get started!
          </p>
          <a
            href="/customer-register"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};