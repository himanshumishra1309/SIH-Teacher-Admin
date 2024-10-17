import { useEffect, useState } from "react";

const DebouncedInput = ({ value: initValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initValue);

    useEffect(() => {
        setValue(initValue);
    }, [initValue]);

    // Debounce effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value, debounce, onChange]); // Add 'onChange' to the dependencies

    return (
        <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
    );
};

export default DebouncedInput;
