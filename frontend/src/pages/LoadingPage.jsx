import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="relative">
        <div className="w-24 h-24 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <div className="w-24 h-24 border-r-4 border-l-4 border-indigo-500 rounded-full animate-spin absolute top-0 left-0 animate-ping"></div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading</h2>
        <p className="text-gray-500 max-w-sm">
          Please wait while we prepare your content...
        </p>
      </div>
      <div className="mt-12 flex space-x-3">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingPage;
