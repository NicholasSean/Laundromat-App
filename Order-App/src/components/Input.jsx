import { useState } from "react";

export function Input() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        order: ","
    }); // State to track all input fields

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // Update the specific field based on its name
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone || !formData.address || !formData.order) {
            alert("Please fill out all fields!");
            return;
        }
    
        try {
            // Fetch IDs from the backend
            const idsRes = await fetch("http://localhost:5000/ids");
            const { ids } = await idsRes.json();
    
            // Compute the next unique ID
            const id = ids.length === 0 ? 1 : Math.max(...ids) + 1;
    
            // Add the ID to formData and send the request
            const response = await fetch("http://localhost:5000/form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, id }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to save the form data");
            }
    
            const result = await response.json();
            console.log("Form data saved:", result);
            setFormData({ name: "", phone: "", address: "", order: "" });
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    

    return (
        <div className="input-container">
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
            />
            <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
            />
            <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
            />
            <select
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                placeholder="In Person Delivery?"
            >
                <option value="" disabled>
                    Delivery Type
                </option>
                <option value="Yes">Required Person Delivery</option>
                <option value="No">Not Required Person Delivery</option>
            </select>
            
            <button onClick={handleSubmit}>
                <i className="fa-solid fa-plus"></i>
            </button>
        </div>
    );
}