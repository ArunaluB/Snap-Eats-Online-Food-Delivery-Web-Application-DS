import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center max-w-sm w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
                <h2 className="mt-4 text-lg font-semibold text-gray-800">Processing...</h2>
                <p className="mt-2 text-sm text-gray-500 text-center">
                    Please wait while we process your request...
                </p>
            </div>
        </div>
    );
};

export default Loading;