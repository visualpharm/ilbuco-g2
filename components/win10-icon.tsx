import React from "react";

interface Win10IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Win10Icon: React.FC<Win10IconProps> = ({ 
  name, 
  size = 20, 
  className = ""
}) => {
  // Map of icon names to their Icons8 Windows 10 style codes
  const iconMap: Record<string, string> = {
    // Original icons - fixed and improved
    thermometer: "temperature",
    tree: "forest",
    shield: "mute",
    droplet: "water",
    wifi: "wi-fi-connected",
    home: "home",
    sofa: "sofa",
    bed: "bed",
    shower: "shower",
    building: "building",
    utensilsCrossed: "tableware",
    monitor: "monitor",
    sparkles: "checked", // Was "sparkle", placeholder
    calendar: "calendar",
    refrigerator: "fridge",
    
    // New icons for bullet points
    bedroom: "bedroom", 
    roof: "flower",
    soundInsulation: "mute",
    construction: "crane",
    ergonomicWorkspace: "checked", // Was "office-chair", placeholder
    serverRack: "server",
    coffee: "checked", // Was "coffee-cup", placeholder
    plants: "flower",
    
    // House rules and availability bullet points
    quiet: "mute",
    noParties: "no-microphone",
    cleanAreas: "broom",
    pets: "dog",
    checkIn: "checked",
    checkOut: "exit",
    utilities: "checked", // Was "no-flash", placeholder
    yearRound: "calendar-31",
    highSeason: "summer",
    bestRates: "cheap-2",
    minStay: "minimum-value",
    longTerm: "overtime",
  };

  // Ensure proper URLs for certain icons that might need special handling
  const specialIcons: Record<string, string> = {
    "mute": "https://img.icons8.com/windows/64/mute--v1.png",
    "flower": "https://img.icons8.com/windows/64/flower.png",
    "no-microphone": "https://img.icons8.com/windows/64/no-microphone.png",
    // "no-flash": "https://img.icons8.com/windows/64/no-flash.png", // URL seems to be failing
    // "coffee-cup": "https://img.icons8.com/windows/64/coffee-cup.png" // URL seems to be failing
  };

  const iconCode = iconMap[name] || name;
  
  // Use special URL if available, otherwise use standard format
  const iconUrl = specialIcons[iconCode] || `https://img.icons8.com/windows/64/${iconCode}.png`;

  return (
    <img 
      src={iconUrl} 
      alt={`${name} icon`}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}
    />
  );
};
