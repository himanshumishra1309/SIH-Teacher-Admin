import React, { createContext, useState, useContext } from 'react';

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState(16); // Default font size (in px)

    const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32)); // Max 32px
    const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12)); // Min 12px
    const resetFontSize = () => setFontSize(16); // Reset to default

    return (
        <FontSizeContext.Provider
            value={{ fontSize, increaseFontSize, decreaseFontSize, resetFontSize }}
        >
            {children}
        </FontSizeContext.Provider>
    );
};

export const useFontSize = () => useContext(FontSizeContext);
