import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        <p className="mt-4 text-gray-500">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingPage;