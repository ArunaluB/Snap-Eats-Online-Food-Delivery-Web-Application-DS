import React from 'react';
import { AddressDTO, CartResponseDTO } from '../../../utils/fod-order-types';

interface CashOrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cartResponse: CartResponseDTO | null;
  userAddress: AddressDTO | null;
}

export const CashOrderConfirmationModal: React.FC<CashOrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cartResponse,
  userAddress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Confirm Cash Order</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-500">close</span>
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            Please confirm your order for cash on delivery from{' '}
            <span className="font-medium">{cartResponse?.restaurant.name}</span>.
          </p>
          <div className="border-t border-gray-200 pt-2">
            <p className="text-sm text-gray-500">Delivery Address</p>
            <p className="font-medium">{userAddress?.street}</p>
            <p className="text-sm text-gray-600">{userAddress?.city}, {userAddress?.state}</p>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <p className="text-sm text-gray-500">Order Total</p>
            <p className="font-medium text-lg">
              LKR {(
                (cartResponse?.items.reduce((sum, item) => sum + item.netTotalPrice, 0) || 0) +
                (cartResponse?.restaurant.deliveryFee || 0)
              ).toFixed(2)}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            You will pay in cash upon delivery. Please ensure you have the exact amount ready.
          </p>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};