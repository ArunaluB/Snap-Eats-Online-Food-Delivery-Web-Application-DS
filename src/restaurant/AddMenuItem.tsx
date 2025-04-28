import { useState } from "react";
import {
  Tag, FileText, DollarSign, Percent, List, Image, Flame, Clock, Settings
} from "lucide-react";

export default function AddMenuItem() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountWhole: "",
    discountDecimal: "",
    category: "",
    imageUrl: "",
    dietaryTags: [""],
    calories: "",
    customizationOptions: [""],
    preparationTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleListChange = (field: string, index: number, value: string) => {
    const list = [...(form as any)[field]];
    list[index] = value;
    setForm({ ...form, [field]: list });
  };

  const handleAddToList = (field: string) => {
    setForm({ ...form, [field]: [...(form as any)[field], ""] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discountPrice = parseFloat(
      `${form.discountWhole || 0}.${form.discountDecimal || 0}`
    );

    const payload = {
      ...form,
      price: parseFloat(form.price),
      calories: parseInt(form.calories),
      preparationTime: parseInt(form.preparationTime),
      discountPrice,
      imageUrls: [form.imageUrl],
      dietaryTags: form.dietaryTags.filter((tag) => tag.trim() !== ""),
      customizationOptions: form.customizationOptions.filter((opt) => opt.trim() !== "")
    };

    console.log("Submitting:", payload);
    // submit logic...
  };

  const inputStyle = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400 transition";
  const labelStyle = "text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1";

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Add New Menu Item
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className={labelStyle}><Tag size={18} /> Item Name</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}><FileText size={18} /> Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className={inputStyle} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}><DollarSign size={18} /> Price (LKR)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
              <Percent size={18} /> Discount (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="discountWhole"
                placeholder="20"
                value={form.discountWhole}
                onChange={handleChange}
                className="w-20 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              />
              <span className="text-xl font-bold">.</span>
              <input
                type="number"
                name="discountDecimal"
                placeholder="05"
                value={form.discountDecimal}
                onChange={handleChange}
                className="w-20 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              />
              <span className="text-sm text-gray-500 font-semibold">%</span>
            </div>
          </div>
        </div>

        <div>
          <label className={labelStyle}><List size={18} /> Category</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputStyle}>
            <option value="">Select Category</option>
            <option value="MAIN_COURSE">Main Course</option>
            <option value="APPETIZER">Appetizer</option>
            <option value="BEVERAGE">Beverage</option>
            <option value="DESSERT">Dessert</option>
          </select>
        </div>

        <div>
          <label className={labelStyle}><Image size={18} /> Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}><Flame size={18} /> Dietary Tags</label>
          {form.dietaryTags.map((tag, i) => (
            <input
              key={i}
              value={tag}
              onChange={(e) => handleListChange("dietaryTags", i, e.target.value)}
              className={`${inputStyle} mb-2`}
            />
          ))}
          <button type="button" onClick={() => handleAddToList("dietaryTags")} className="text-blue-600 text-sm">
            + Add Tag
          </button>
        </div>

        <div>
          <label className={labelStyle}><Flame size={18} /> Calories</label>
          <input name="calories" type="number" value={form.calories} onChange={handleChange} className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}><Settings size={18} /> Customization Options</label>
          {form.customizationOptions.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={(e) => handleListChange("customizationOptions", i, e.target.value)}
              className={`${inputStyle} mb-2`}
            />
          ))}
          <button type="button" onClick={() => handleAddToList("customizationOptions")} className="text-blue-600 text-sm">
            + Add Option
          </button>
        </div>

        <div>
          <label className={labelStyle}><Clock size={18} /> Preparation Time (minutes)</label>
          <input name="preparationTime" type="number" value={form.preparationTime} onChange={handleChange} className={inputStyle} />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow transition">
          Add Item
        </button>
      </form>
    </div>
  );
}
