import { useState } from "react";

interface ActiveToggleProps {
  active: boolean;
  onToggle?: (newState: boolean) => void;
}

export default function ActiveToggle({ active, onToggle }: ActiveToggleProps) {
  const [isActive, setIsActive] = useState(active);

  const toggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggle?.(newState);
  };

  return (
    <div
      onClick={toggle}
      className={`w-14 h-7 flex items-center rounded-full cursor-pointer px-1 transition-colors duration-300 ${
        isActive ? "bg-green-400" : "bg-yellow-300"
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isActive ? "translate-x-7" : "translate-x-0"
        }`}
      ></div>
    </div>
  );
}
