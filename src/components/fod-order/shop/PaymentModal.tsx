import { useState } from "react";

type PaymentModalProps = {
    onClose: () => void;
    onSelect: (method: "snap" | "cash" | "card") => void;
    currentSelection?: "snap" | "cash" | "card";
  };
  

export const PaymentModal = ({ onClose, onSelect, currentSelection  }: PaymentModalProps) => {
    const [selected, setSelected] = useState<"snap" | "cash" | "card" | null>(currentSelection ?? null);


  const isSelected = (method: string) => selected === method;

  return (
    <div id="webcrumbs">
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-md w-full mx-4 relative lg:min-w-[450px]">
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 left-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Title */}
            <h2 className="text-3xl font-bold mt-10 mb-6">Payment options</h2>

            {/* Snap Cash */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg text-gray-700">Snap Cash: LKR 0.00</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg mb-6">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Uber_App_Icon.svg/2048px-Uber_App_Icon.svg.png"
                  alt="Snap logo"
                  className="w-8 h-8"
                />
                <span className="font-medium">Snap Cash: LKR 0.00</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="text-lg text-gray-700 mb-4">Payment method</h3>

              {/* Snap */}
              <div
                onClick={() => setSelected("snap")}
                className={`flex items-center justify-between p-3 border rounded-lg mb-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  isSelected("snap") ? "border-black bg-gray-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-purple-500">account_balance_wallet</span>
                  <span className="font-medium">Snap</span>
                </div>
                {isSelected("snap") && (
                  <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                  </div>
                )}
              </div>

              {/* Cash */}
              <div
                onClick={() => setSelected("cash")}
                className={`flex items-center justify-between p-3 border rounded-lg mb-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  isSelected("cash") ? "border-black bg-gray-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-500">payments</span>
                  <span className="font-medium">Cash</span>
                </div>
                {isSelected("cash") && (
                  <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                  </div>
                )}
              </div>

              {/* Card */}
              <div
                onClick={() => setSelected("card")}
                className={`flex items-center justify-between p-3 border rounded-lg mb-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  isSelected("card") ? "border-black bg-gray-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-500">credit_card</span>
                  <span className="font-medium">Card</span>
                </div>
                {isSelected("card") && (
                  <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                  </div>
                )}
              </div>

              <button className="flex items-center gap-2 p-3 w-full hover:bg-gray-50 transition-colors rounded-lg">
                <span className="text-2xl font-semibold">+</span>
                <span className="font-medium">Add Payment Method</span>
              </button>
            </div>

            {/* Save Button */}
            <button
              disabled={!selected}
              onClick={() => {
                if (selected) onSelect(selected);
                onClose();
              }}
              className="w-full bg-black text-white py-2.5 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
