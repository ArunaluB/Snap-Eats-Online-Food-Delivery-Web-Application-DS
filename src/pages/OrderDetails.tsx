// components/OrderDetails.jsx
import { X, Check, User, Phone, Navigation } from 'lucide-react';

interface OrderDetailsProps {
  selectedOrder: {
    shop: string;
    distance: string;
    destination: string;
    customerName: string;
    customerPhone: string;
    amount: string;
  };
  orderStatus: 'pending' | 'accepted' | 'pickup' | 'completed';
  setShowOrderDetails: (show: boolean) => void;
  acceptOrder: (order: any) => void;
  confirmPickup: () => void;
  completeDelivery: () => void;
  cancelOrder: (order: any) => void;
}

export default function OrderDetails({
  selectedOrder,
  orderStatus,
  setShowOrderDetails,
  acceptOrder,
  confirmPickup,
  completeDelivery,
  cancelOrder
}: OrderDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">
              {orderStatus === 'pending' ? 'Order Details' :
                orderStatus === 'accepted' ? 'Pickup Confirmation' :
                  orderStatus === 'pickup' ? 'Delivery Confirmation' :
                    'Order Completed'}
            </h3>
            <button
              className="p-1"
              onClick={() => setShowOrderDetails(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Pending Order View */}
          {orderStatus === 'pending' && (
            <PendingOrderView 
              selectedOrder={selectedOrder} 
              acceptOrder={acceptOrder} 
            />
          )}

          {/* Accepted Order View - Pickup Confirmation */}
          {orderStatus === 'accepted' && (
            <AcceptedOrderView 
              selectedOrder={selectedOrder} 
              confirmPickup={confirmPickup} 
              cancelOrder={cancelOrder} 
            />
          )}

          {/* Pickup Order View - Delivery Confirmation */}
          {orderStatus === 'pickup' && (
            <PickupOrderView 
              selectedOrder={selectedOrder} 
              completeDelivery={completeDelivery} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-components for different order states
function PendingOrderView({ selectedOrder, acceptOrder }: { selectedOrder: OrderDetailsProps['selectedOrder']; acceptOrder: (order: OrderDetailsProps['selectedOrder']) => void }) {
  return (
    <>
      <div className="bg-orange-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-orange-800">{selectedOrder.shop}</h4>
        <p className="text-sm text-orange-700 mt-1">Pickup Location</p>
      </div>

      <div className="border-l-2 border-dashed border-gray-300 pl-4 ml-2 py-4">
        <div className="h-4 w-4 rounded-full bg-gray-300 absolute -ml-6"></div>
        <p className="text-gray-500 text-sm">Distance</p>
        <p className="font-medium">{selectedOrder.distance}</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mt-2">
        <h4 className="font-medium text-blue-800">{selectedOrder.destination}</h4>
        <div className="flex items-center mt-2">
          <User className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-blue-700">{selectedOrder.customerName}</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Order Amount</span>
          <span className="font-bold">{selectedOrder.amount}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          className="bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
          onClick={() => acceptOrder(selectedOrder)}
        >
          <Navigation className="h-5 w-5 mr-2" />
          Accept
        </button>
        <a
          href={`tel:${selectedOrder.customerPhone}`}
          className="bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
        >
          <Phone className="h-5 w-5 mr-2" />
          Call
        </a>
      </div>
    </>
  );
}

function AcceptedOrderView({ selectedOrder, confirmPickup, cancelOrder }: { selectedOrder: OrderDetailsProps['selectedOrder']; confirmPickup: () => void; cancelOrder: (order: OrderDetailsProps['selectedOrder']) => void }) {
  return (
    <>
      <div className="bg-orange-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-orange-800">{selectedOrder.shop}</h4>
        <p className="text-sm text-orange-700 mt-1">Pickup Location</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mt-4">
        <h4 className="font-medium">Order Pickup Instructions</h4>
        <p className="text-sm text-gray-600 mt-2">
          1. Show your driver ID to the staff
          <br />
          2. Confirm the order number
          <br />
          3. Check items match the order
        </p>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Order Amount</span>
          <span className="font-bold">{selectedOrder.amount}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          className="bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
          onClick={confirmPickup}
        >
          <Check className="h-5 w-5 mr-2" />
          Confirm Pickup
        </button>
        <button
          className="bg-red-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
          onClick={() => cancelOrder(selectedOrder)}
        >
          <X className="h-5 w-5 mr-2" />
          Cancel
        </button>
      </div>
    </>
  );
}

function PickupOrderView({ selectedOrder, completeDelivery }: { selectedOrder: OrderDetailsProps['selectedOrder']; completeDelivery: () => void }) {
  return (
    <>
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-blue-800">{selectedOrder.destination}</h4>
        <div className="flex items-center mt-2">
          <User className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-blue-700">{selectedOrder.customerName}</span>
        </div>
        <div className="flex items-center mt-2">
          <Phone className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-blue-700">{selectedOrder.customerPhone}</span>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mt-4">
        <h4 className="font-medium">Delivery Instructions</h4>
        <p className="text-sm text-gray-600 mt-2">
          1. Confirm customer identity
          <br />
          2. Hand over the food package
          <br />
          3. Ask for confirmation
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          className="bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
          onClick={completeDelivery}
        >
          <Check className="h-5 w-5 mr-2" />
          Complete Delivery
        </button>
        <a
          href={`tel:${selectedOrder.customerPhone}`}
          className="bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
        >
          <Phone className="h-5 w-5 mr-2" />
          Call Customer
        </a>
      </div>
    </>
  );
}