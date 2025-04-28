import { useState } from "react";
import { toast } from "react-toastify";

interface ToggleProps {
  isActive: boolean;
  onToggle: (newStatus: boolean) => void;
}

export default function OnlineToggleButton({ isActive, onToggle }: ToggleProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const newStatus = !isActive;
    setLoading(true);
    try {
      await fetch(
        `http://localhost:8222/restaurant-service/api/restaurants/67fde55233027910028186e3/status?active=${newStatus}`,
        { method: "PATCH" }
      );
      toast.success(`Restaurant is now ${newStatus ? "online" : "offline"}`, { autoClose: 4000 });
      onToggle(newStatus);
    } catch (err) {
      toast.error("Failed to update status", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-4 py-2 rounded text-sm font-medium shadow transition ${
          isActive ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 text-white hover:bg-gray-500"
        }`}
      >
        {loading ? "Updating..." : isActive ? "Go Offline" : "Go Online"}
      </button>
    </div>
  );
}
