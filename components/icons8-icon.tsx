import React from "react";
import Image from "next/image";

interface Icons8IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export const Icons8Icon: React.FC<Icons8IconProps> = ({ 
  name, 
  size = 24,
  className = "",
  color = "currentColor"
}) => {
  // Icons8 SVG files are stored in /public/icons/icons8/
  const iconPath = `/icons/icons8/${name}.svg`;

  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        color: color
      }}
    >
      <Image
        src={iconPath}
        alt={`${name} icon`}
        width={size}
        height={size}
        className="w-full h-full"
        style={{ filter: color !== 'currentColor' ? 'none' : undefined }}
      />
    </div>
  );
};