import React, { useState } from "react";

interface IcontipButtonProps {
  icon: string;
  altText: string;
  tooltipText: string;
  className?: string;
  iconSize: string;
  onClick?: () => void;
  direction?: "top" | "bottom" | "left" | "right";
}

const IcontipButton: React.FC<IcontipButtonProps> = ({
  icon,
  altText,
  tooltipText,
  className,
  iconSize,
  onClick,
  direction = "top",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => {
      setShowTooltip(true);
    }, 500); // Delay in milliseconds (500ms in this case)
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId); // Clear timeout if the cursor leaves early
    setShowTooltip(false);
  };

  const tooltipClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={className} onClick={onClick}>
        <img src={icon} alt={altText} className={iconSize} />
      </div>
      {showTooltip && (
        <div
          className={`absolute bg-black text-white text-xs px-2 py-1 rounded opacity-100 transition-opacity z-20 ${tooltipClasses[direction]}`}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default IcontipButton;
