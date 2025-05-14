import React, { useRef, useState } from 'react';

const CustomImageMagnifier = ({ imageSrc, zoomLevel = 5 }) => {
    const [isMagnifying, setIsMagnifying] = useState(false);
    const magnifierRef = useRef(null);
    const imageRef = useRef(null);

    const handleMouseMove = (e) => {
        if (isMagnifying && magnifierRef.current && imageRef.current) {
            const magnifier = magnifierRef.current;
            const image = imageRef.current;
            const { left, top, width, height } = image.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;

            // Ensure x and y stay within bounds
            const magnifierX = Math.max(0, Math.min(width, x));
            const magnifierY = Math.max(0, Math.min(height, y));

            // Set the background position of the magnifier
            const bgX = (magnifierX * zoomLevel) - (magnifier.offsetWidth / 2);
            const bgY = (magnifierY * zoomLevel) - (magnifier.offsetHeight / 2);
            magnifier.style.backgroundPosition = `-${bgX}px -${bgY}px`;
            magnifier.style.top = `${magnifierY}px`;
            magnifier.style.left = `${magnifierX}px`;
        }
    };

    return (
        <div
            style={{
                position: 'relative',
                cursor: 'zoom-in',
            }}
            onMouseEnter={() => setIsMagnifying(true)}
            onMouseLeave={() => setIsMagnifying(false)}
            onMouseMove={handleMouseMove}
        >
            <img
                ref={imageRef}
                src={imageSrc}
                alt="Magnifiable"
                style={{ width: '100%', height: 'auto' }}
            />
            {isMagnifying && (
                <div
                    ref={magnifierRef}
                    style={{
                        position: 'absolute',
                        top: "50%",
                        left: "50%",
                        width: '200px', // Adjust size of the magnifier glass
                        height: '200px',
                        border: '1px solid rgba(255, 255, 255, 0.7)',
                        backgroundImage: `url(${imageSrc})`,
                        backgroundSize: `${imageRef.current?.naturalWidth * zoomLevel}px ${imageRef.current?.naturalHeight * zoomLevel}px`,
                        backgroundRepeat: 'no-repeat',
                        pointerEvents: 'none',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                        // borderRadius: '50%',
                        transform: 'translate(-50%, -50%)', // Center the magnifier
                    }}
                />
            )}
        </div>
    );
};

export default CustomImageMagnifier;
