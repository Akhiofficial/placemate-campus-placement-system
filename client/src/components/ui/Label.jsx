import React from 'react';

const Label = ({ children, className = '', ...props }) => {
    return (
        <label
            className={`text-sm font-medium text-gray-700 ${className}`}
            {...props}
        >
            {children}
        </label>
    );
};

export default Label;
