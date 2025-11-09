import { useState } from 'react';

interface ToggleProps {
  leftLabel: string;
  rightLabel: string;
  onLeftClick: () => void;
  onRightClick: () => void;
}

const Toggle = ({ leftLabel, rightLabel, onLeftClick, onRightClick }: ToggleProps) => {
  const [isLeftSelected, setIsLeftSelected] = useState(true);

  const handleLeftClick = () => {
    setIsLeftSelected(true);
    onLeftClick();
  };

  const handleRightClick = () => {
    setIsLeftSelected(false);
    onRightClick();
  };
  return (
    <div className="flex gap-2">
      <button
        onClick={handleLeftClick}
        className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
          isLeftSelected ? 'bg-app-blue text-white' : 'bg-app-gray-50 text-app-gray-500 hover:bg-app-gray-200'
        }`}
      >
        {leftLabel}
      </button>
      <button
        onClick={handleRightClick}
        className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
          !isLeftSelected ? 'bg-app-blue text-white' : 'bg-app-gray-50 text-app-gray-500 hover:bg-app-gray-200'
        }`}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default Toggle;
