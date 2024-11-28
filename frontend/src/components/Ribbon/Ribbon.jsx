import React, { useState } from "react";
import { useFontSize } from "./FontSizeContext";

const Ribbon = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [highlights, setHighlights] = useState([]);
  const { increaseFontSize, decreaseFontSize} = useFontSize();

  
  

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "") {
      setHighlights([]); 
      return;
    }

   
    const regex = new RegExp(query, "gi"); 
    const matches = [];

    
    const elements = document.querySelectorAll(".searchable"); 
    elements.forEach((el, index) => {
      if (el.textContent.match(regex)) {
        matches.push(el);
      }
    });

    setHighlights(matches); 
  };

  const clearSearch = () => {
    setSearchQuery("");
    setHighlights([]); 
  };

  return (
    <div className="bg-gray-200 text-black shadow-md z-100">
      <div className="container mx-auto flex justify-between items-center px-2">
        {/* Logo */}
        <div className="text-sm font-bold">
          <a href="/" className="hover:text-blue-600">
            Government of NCT of Delhi | AICTE
          </a>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="my-1 h-5 rounded text-black "
            />
            {searchQuery && (
              <button onClick={clearSearch} className="ml-2 text-red-500">
                Clear
              </button>
            )}
          </li>
          <li>
          <div className="h-5 text-black my-1 z-50 font-bold">
            <div className="flex space-x-4">
            <button onClick={increaseFontSize}>A+</button>
            <button onClick={decreaseFontSize}>A-</button>
            </div>
          </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Ribbon;
