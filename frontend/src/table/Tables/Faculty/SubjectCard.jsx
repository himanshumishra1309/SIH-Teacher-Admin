import React from "react";

const SubjectCard = ({ subject, onClick }) => {
  return (
    <div
      className="p-6 border rounded-lg shadow-lg hover:bg-gray-50 cursor-pointer transition"
      onClick={() => onClick(subject)}
    >
      <h2 className="text-xl font-semibold">{subject.subject_name}</h2>
      <p className="text-sm text-gray-500">{subject.subject_code}</p>
    </div>
  );
};

export default SubjectCard;
