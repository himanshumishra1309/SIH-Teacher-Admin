import React from 'react';

export const ResearchInstructionMessage = () => (
  <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span className="text-gray-600">
      Select the type of publication in the dropdown above to see the data.
    </span>
  </div>
);

