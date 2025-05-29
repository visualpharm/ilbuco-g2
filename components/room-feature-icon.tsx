import React from "react";

interface RoomFeatureIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const RoomFeatureIcon: React.FC<RoomFeatureIconProps> = ({ 
  name, 
  size = 20, 
  className = ""
}) => {
  // Map of feature names to their Windows 10 style icon paths (direct URLs)
  const iconMap: Record<string, string> = {
    // Direct URLs to ensure images load properly
    "window": "https://img.icons8.com/ios/50/window.png",
    "wheelchair": "https://img.icons8.com/ios/50/wheelchair.png",
    "table-and-chair": "https://img.icons8.com/ios/50/dining-table.png",
    "desk": "https://img.icons8.com/ios/50/workstation.png", 
    "twin-bed": "https://img.icons8.com/ios/50/sleeping-in-bed.png",
    "sofa": "https://img.icons8.com/ios/50/sofa.png",
    "padlock": "https://img.icons8.com/ios/50/lock.png",
    "flower": "https://img.icons8.com/ios/50/flower.png",
    
    // Additional mappings
    "thermometer": "https://img.icons8.com/ios/50/temperature.png",
    "wifi": "https://img.icons8.com/ios/50/wifi--v1.png",
    "shower": "https://img.icons8.com/ios/50/shower.png",
    "bed": "https://img.icons8.com/ios/50/bed.png",
    "lamp-desk": "https://img.icons8.com/ios/50/desk-lamp.png",
    "utensils-crossed": "https://img.icons8.com/ios/50/cutlery.png",
  };

  // Get the URL for the icon or use a fallback
  const iconUrl = iconMap[name] || "https://img.icons8.com/ios/50/help.png";

  return (
    <img 
      src={iconUrl} 
      alt={`${name} icon`}
      width={size}
      height={size}
      className={`inline-block flex-shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}
    />
  );
};