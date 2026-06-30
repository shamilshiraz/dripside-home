import React, { useState, useRef } from 'react';

interface ZoomImageProps {
    src: string;
    alt: string;
    className?: string;
    zoomScale?: number;
}

const ZoomImage: React.FC<ZoomImageProps> = ({ src, alt, className = "", zoomScale = 2 }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setMousePos({ x, y });
    };

    return (
        <div
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            className={`relative overflow-hidden cursor-crosshair w-full h-full ${className}`}
        >
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-300 ease-out"
                style={{
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: isHovered ? `scale(${zoomScale})` : 'scale(1)',
                }}
            />
        </div>
    );
};

export default ZoomImage;
