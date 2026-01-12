import React from 'react';

export default function ResponsiveImage({ mobileSrc, desktopSrc, alt, className = "" }) {
    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <picture>
                <source media="(min-width: 768px)" srcSet={desktopSrc} />
                <img
                    src={mobileSrc}
                    alt={alt}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
            </picture>
        </div>
    );
}
