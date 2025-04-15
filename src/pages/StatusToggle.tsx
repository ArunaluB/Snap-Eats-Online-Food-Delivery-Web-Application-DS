// components/StatusToggle.jsx
import { PowerIcon } from 'lucide-react';

interface StatusToggleProps {
  isOnline: boolean;
  toggleStatus: () => void;
}

export default function StatusToggle({ isOnline, toggleStatus }: StatusToggleProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className={`flex items-center justify-between rounded-full py-2 px-4 ${isOnline ? 'bg-green-500' : 'bg-gray-700'} text-white`}>
        <div className="flex items-center">
          <PowerIcon className="w-5 h-5 mr-2" />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <button
          onClick={toggleStatus}
          className="bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-medium"
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>
    </div>
  );
}