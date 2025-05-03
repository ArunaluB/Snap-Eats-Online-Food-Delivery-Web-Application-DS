import { useEffect, useState } from "react";
import ActiveToggle from "./ActiveToggle";
import UpdateMenuItemModal from "./UpdateMenuItemModal";
import { MenuItem } from "./MenuItem";


export default function MenuItemsTable() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(
          "http://localhost:8222/restaurant-service/api/menu-items/restaurant/67fde55233027910028186e3"
        );
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleUpdate = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleModalUpdate = async (updatedItem: MenuItem): Promise<void> => {
    try {
      const payload = {
        name: updatedItem.name,
        description: updatedItem.description,
        price: updatedItem.price,
        discountPrice: updatedItem.discountPrice,
        isAvailable: updatedItem.available,
        isActive: updatedItem.active,
        category: updatedItem.category,
        restaurantId: updatedItem.restaurantId,
        imageUrls: updatedItem.imageUrls,
        dietaryTags: updatedItem.dietaryTags,
        calories: updatedItem.calories,
        customizationOptions: updatedItem.customizationOptions,
        preparationTime: updatedItem.preparationTime
      };
  
      console.log("Sending update payload:", payload);
  
      const res = await fetch(
        `http://localhost:8222/restaurant-service/api/menu-items/${updatedItem.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (!res.ok) throw new Error("Update failed");
      alert("Menu item updated!");
  
      setItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
  
      setEditingItem(null);
    } catch (error) {
      console.error(error);
      alert("Error updating menu item.");
    }
  };
  

  if (loading) return <p className="text-center">Loading menu items...</p>;

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Discount</th>
              <th className="px-6 py-3">Available</th>
              <th className="px-6 py-3">Active</th>
              <th className="px-6 py-3">Tags</th>
              <th className="px-6 py-3">Calories</th>
              <th className="px-6 py-3">Customizations</th>
              <th className="px-6 py-3">Preparation Time</th>
              <th className="px-6 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={item.imageUrls[0]}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">Rs. {item.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-green-600">
                  {item.discountPrice.toFixed(2)} %
                </td>
                <td className="px-6 py-4">
                  <ActiveToggle
                    active={item.available}
                    onToggle={(newState) =>
                      console.log(`Availability toggled for ${item.name}:`, newState)
                    }
                  />
                </td>

                <td className="px-6 py-4">
                  <ActiveToggle
                    active={item.active}
                    onToggle={(newState) =>
                      console.log(`Toggled ${item.name}:`, newState)
                    }
                  />
                </td>
                <td className="px-6 py-4">{item.dietaryTags.join(", ")}</td>
                <td className="px-6 py-4">{item.calories}</td>
                <td className="px-6 py-4">
                  {item.customizationOptions.join(", ")}
                </td>
                <td className="px-6 py-4">{item.preparationTime} min</td>
                <td className="px-6 py-4">
                  <button
                    className="text-sm px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleUpdate(item)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <UpdateMenuItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={handleModalUpdate}
        />
      )}
    </>
  );
}
