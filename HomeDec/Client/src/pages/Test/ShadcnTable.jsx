import React, { useState, useEffect } from 'react';
import { Loader as IconLoader } from 'lucide-react'; // Import the desired icon

const ShadcnTable = () => {
    const [progress, setProgress] = useState(0);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="relative flex items-center justify-center w-24 h-24">
                <IconLoader className="text-gray-300 w-24 h-24" />
                <div
                    className="absolute inset-0 bg-green-500 transition-all duration-500 ease-in-out"
                    style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
                />
                <span className="absolute text-white font-bold">{progress}%</span>
            </div>
        </div>
    );
};

export default ShadcnTable;
