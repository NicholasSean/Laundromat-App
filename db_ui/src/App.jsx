import React, { useEffect, useState } from "react";
import { fetchOrders, updateWeight } from "./api";
import axios from "axios";
import "./App.css";

function App() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchOrders();
                setOrders(data);
            } catch (err) {
                setError("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    const handleWeightChange = async (id, newWeight) => {
        try {
            const updatedOrder = await updateWeight(id, newWeight);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === updatedOrder.order.id ? updatedOrder.order : order
                )
            );
        } catch (error) {
            console.error("Failed to update weight:", error);
        }
    };

    const handleGenerateInvoice = async (id) => {
        try {
            // Ensure weight is saved to backend
            const order = orders.find((order) => order.id === id);
            if (order && order.weight) {
                await updateWeight(id, order.weight); // Save latest weight to backend
            }

            // Generate the invoice
            await axios.post("http://localhost:5000/send-invoice", { id });
            alert("Invoice sent successfully!");
        } catch (error) {
            console.error("Failed to send invoice:", error);
            alert("Failed to send invoice.");
        }
    };

    return (
        <div className="container">
            <h1>Laundromat Orders</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && (
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Delivery Type</th>
                            <th>Weight (kg)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.name}</td>
                                <td>{order.phone}</td>
                                <td>{order.address}</td>
                                <td>{order.order}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={order.weight}
                                        onChange={(e) =>
                                            handleWeightChange(order.id, e.target.value)
                                        }
                                        className="weight-input"
                                    />
                                </td>
                                <td>
                                    <button
                                        className="invoice-button"
                                        onClick={() => handleGenerateInvoice(order.id)}
                                    >
                                        Generate Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;
