import { useEffect } from 'react';
import { useFontSize } from './FontSizeContext';

const FontSizeHandler = () => {
    const { fontSize } = useFontSize();

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [fontSize]);

    return (
        <></>
    ); // This component doesn't render anything visually
};

export default FontSizeHandler;
