import { useState, useEffect } from "react";
import ActiveToggle from "./ActiveToggle"; // adjust path as needed
import {MenuItem} from "./MenuItem";


interface UpdateMenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
  onUpdate: (updatedItem: MenuItem) => Promise<void>;
}

export default function UpdateMenuItemModal({ item, onClose, onUpdate }: UpdateMenuItemModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
    active: true,
    discountWhole: "",
    discountDecimal: "",
    imageUrls: [],
    dietaryTags: [""],
    calories: "",
    customizationOptions: [""],
    restaurantId: ""
  });

  useEffect(() => {
    const [whole, decimal = "00"] = item.discountPrice.toFixed(2).split(".");
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      available: item.available,
      active: item.active,
      discountWhole: whole,
      discountDecimal: decimal,
      imageUrls: [],
      dietaryTags: item.dietaryTags,
      calories: item.calories.toString(),
      customizationOptions: item.customizationOptions,
      restaurantId: item.restaurantId
    });
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? target.checked : value
    });
  };

  const handleListChange = (field: string, index: number, value: string) => {
    const updated = [...(form as any)[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const handleAddToList = (field: string) => {
    setForm({ ...form, [field]: [...(form as any)[field], ""] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedItem: MenuItem = {
      ...item,
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      available: form.available,
      active: form.active,
      imageUrls: form.imageUrls,
      dietaryTags: form.dietaryTags.filter(tag => tag.trim() !== ""),
      calories: parseInt(form.calories),
      customizationOptions: form.customizationOptions.filter(o => o.trim() !== ""),
      discountPrice: parseFloat(`${form.discountWhole || 0}.${form.discountDecimal || 0}`),
      restaurantId: form.restaurantId
    };
    onUpdate(updatedItem);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Update Menu Item</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-medium block">Item Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="font-medium block">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium block">Price (LKR)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="font-medium block mb-1">Discount (%)</label>
              <div className="flex items-center gap-2">
                <input type="number" name="discountWhole" placeholder="20" value={form.discountWhole} onChange={handleChange} className="w-20 px-3 py-2 border rounded" />
                <span className="text-xl font-bold">.</span>
                <input type="number" name="discountDecimal" placeholder="05" value={form.discountDecimal} onChange={handleChange} className="w-20 px-3 py-2 border rounded" />
                <span className="text-sm text-gray-500 font-semibold">%</span>
              </div>
            </div>
          </div>
          <div>
            <label className="font-medium block">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded">
              <option value="">Select</option>
              <option value="MAIN_COURSE">Main Course</option>
              <option value="APPETIZER">Appetizer</option>
              <option value="BEVERAGE">Beverage</option>
              <option value="DESSERT">Dessert</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isAvailable" checked={form.available} onChange={handleChange} />
              Available
            </label>
          </div>

          <div>
            <label className="font-medium block">Active</label>
            <ActiveToggle
              active={form.active}
              onToggle={(newState) => setForm((prev) => ({ ...prev, active: newState }))}
            />
          </div>

          <div>
            <label className="font-medium block">Image URLs</label>
            {form.imageUrls.map((url, idx) => (
              <input key={idx} type="text" value={url} onChange={(e) => handleListChange("imageUrls", idx, e.target.value)} className="w-full px-3 py-2 border rounded my-1" />
            ))}
          </div>
          <div>
            <label className="font-medium block">Dietary Tags</label>
            {form.dietaryTags.map((tag, idx) => (
              <input key={idx} type="text" value={tag} onChange={(e) => handleListChange("dietaryTags", idx, e.target.value)} className="w-full px-3 py-2 border rounded my-1" />
            ))}
            <button type="button" onClick={() => handleAddToList("dietaryTags")} className="text-blue-600 text-sm">+ Add tag</button>
          </div>
          <div>
            <label className="font-medium block">Calories</label>
            <input type="number" name="calories" value={form.calories} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="font-medium block">Customization Options</label>
            {form.customizationOptions.map((opt, idx) => (
              <input key={idx} type="text" value={opt} onChange={(e) => handleListChange("customizationOptions", idx, e.target.value)} className="w-full px-3 py-2 border rounded my-1" />
            ))}
            <button type="button" onClick={() => handleAddToList("customizationOptions")} className="text-blue-600 text-sm">+ Add option</button>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
}
