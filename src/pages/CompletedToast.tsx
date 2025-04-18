import { Check, X } from 'lucide-react';

interface CompletedToastProps {
  setOrderStatus: (status: string) => void;
}

export default function CompletedToast({ setOrderStatus }: CompletedToastProps) {
  return (
    <div className="fixed top-4 left-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
      <div className="flex items-center">
        <Check className="h-6 w-6 mr-2" />
        <span>Order delivered successfully!</span>
      </div>
      <button
        onClick={() => setOrderStatus('')}
        className="p-1"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}