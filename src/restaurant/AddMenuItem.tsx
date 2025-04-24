import { useState } from "react";

export default function AddMenuItem() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        isAvailable: true,
        imageUrls: [], // will be filled manually for now
        dietaryTags: [""],
        calories: "",
        customizationOptions: [""],
        discountWhole: "",
        discountDecimal: "",
        preparationTime: "",
        restaurantId: "67fde55233027910028186e3",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? target.checked : value,
        });
    };

    const handleListChange = (field: string, index: number, value: string) => {
        const updatedList = [...(form as any)[field]];
        updatedList[index] = value;
        setForm({ ...form, [field]: updatedList });
    };

    const handleAddToList = (field: string) => {
        setForm({ ...form, [field]: [...(form as any)[field], ""] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const discountPrice = parseFloat(
            `${form.discountWhole || 0}.${form.discountDecimal || 0}`
        );

        const payload = {
            restaurantId: form.restaurantId, // ✅ Add this at the top or anywhere inside
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            category: form.category,
            isAvailable: form.isAvailable,
            imageUrls: [
                "https://via.placeholder.com/300"
            ],
            dietaryTags: form.dietaryTags.filter((tag) => tag.trim() !== ""),
            calories: parseInt(form.calories),
            customizationOptions: form.customizationOptions.filter((o) => o.trim() !== ""),
            discountPrice,
            preparationTime: parseInt(form.preparationTime),
        };


        try {
            const res = await fetch("http://localhost:8222/restaurant-service/api/menu-items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create menu item");

            const result = await res.json();
            console.log("✅ Menu item created:", result);
            alert("Menu item added successfully!");
        } catch (error) {
            console.error("❌ Error:", error);
            alert("Failed to create menu item.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-6">Add New Menu Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Fields */}
                <div>
                    <label className="font-medium block">Item Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                <div>
                    <label className="font-medium block">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
                </div>

                {/* Price & Discount */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-medium block">Price (LKR)</label>
                        <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
                    </div>
                    <div>
                        <label className="font-medium block mb-1">Discount (%)</label>
                        <div className="flex items-center gap-2">
                            <input type="number" name="discountWhole" placeholder="20" value={form.discountWhole} onChange={handleChange} className="w-20 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
                            <span className="text-xl font-bold">.</span>
                            <input type="number" name="discountDecimal" placeholder="05" value={form.discountDecimal} onChange={handleChange} className="w-20 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
                            <span className="text-sm text-gray-500 font-semibold">%</span>
                        </div>
                    </div>
                </div>

                {/* Category + Availability */}
                <div>
                    <label className="font-medium block">Category</label>
                    <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300">
                        <option value="">Select</option>
                        <option value="MAIN_COURSE">Main Course</option>
                        <option value="APPETIZER">Appetizer</option>
                        <option value="BEVERAGE">Beverage</option>
                        <option value="DESSERT">Dessert</option>
                    </select>
                </div>
                <div>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
                        Available
                    </label>
                </div>

                {/* Upload & Preview */}
                <div>
                    <label className="font-medium block">Image URL</label>
                    <input
                        type="text"
                        name="imageUrl"
                        value="https://via.placeholder.com/300"
                        disabled
                        className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
                    />
                </div>


                {/* Dietary Tags */}
                <div>
                    <label className="font-medium block">Dietary Tags</label>
                    {form.dietaryTags.map((tag, idx) => (
                        <input key={idx} type="text" value={tag} onChange={(e) => handleListChange("dietaryTags", idx, e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 my-1" />
                    ))}
                    <button type="button" onClick={() => handleAddToList("dietaryTags")} className="text-blue-600 text-sm">+ Add tag</button>
                </div>

                {/* Calories */}
                <div>
                    <label className="font-medium block">Calories</label>
                    <input type="number" name="calories" value={form.calories} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
                </div>

                {/* Customization Options */}
                <div>
                    <label className="font-medium block">Customization Options</label>
                    {form.customizationOptions.map((opt, idx) => (
                        <input key={idx} type="text" value={opt} onChange={(e) => handleListChange("customizationOptions", idx, e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 my-1" />
                    ))}
                    <button type="button" onClick={() => handleAddToList("customizationOptions")} className="text-blue-600 text-sm">+ Add option</button>
                </div>
                <div>
                    <label className="font-medium block">Preparation Time (minutes)</label>
                    <input
                        type="number"
                        name="preparationTime"
                        value={form.preparationTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                {/* Submit */}
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Save Item
                </button>
            </form>
        </div>
    );
}
