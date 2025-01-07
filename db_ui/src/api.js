import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const fetchOrders = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders`);
        return response.data; // Returns the array of orders
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const addOrder = async (order) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/form`, order, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data; // Returns the newly added order
    } catch (error) {
        console.error("Error adding order:", error);
        throw error;
    }
};

export const updateWeight = async (id, weight) => {
    try {
        const response = await axios.put(`http://localhost:5000/orders/${id}`, { weight });
        return response.data;
    } catch (error) {
        console.error("Error updating weight:", error);
        throw error;
    }
};
