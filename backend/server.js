const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readDb, writeDb } = require("./dbUtils"); // Utility for reading/writing JSON
const twilio = require("twilio");


const app = express();
const PORT = 5000;


const accountSid = "AC7cba6a762261aff5ebaff8ac5f34279d"; // Replace with your Twilio SID
const authToken = "4aa99fad50d54f8df7606efba2a8b303"; // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint to fetch the next unique ID
app.get("/ids", (req, res) => { 
    try {
        // Read the current database
        const data = readDb();
        // Extract all existing IDs from the stored objects
        const ids = data.map((item) => item.id);

        // Respond with the list of IDs
        res.json({ ids });
    } catch (error) {
        console.error("Error fetching IDs:", error);
        res.status(500).json({ error: "Failed to fetch IDs" });
    }
});

// POST to add an item (example)
app.post("/form", (req, res) => {
    const { name, phone, address, order } = req.body;

    if (!name || !phone || !address || !order) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const data = readDb();
        const ids = data.map((item) => item.id);
        const id = ids.length === 0 ? 1 : Math.max(...ids) + 1;
        const weight = "-";
        const newOrder = { id, name, phone, address, order, weight };
        data.push(newOrder);

        writeDb(data);
        res.status(201).json({ message: "Order saved successfully", order: newOrder });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Failed to save order" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/orders", (req, res) => {
    try {
        const data = readDb(); // Read from your database file
        res.json(data); // Send the entire database as a response
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

app.put("/orders/:id", (req, res) => {
    const { id } = req.params;
    const { weight } = req.body;

    if (!weight) {
        return res.status(400).json({ error: "Weight is required" });
    }

    try {
        const data = readDb();
        const orderIndex = data.findIndex((item) => item.id === parseInt(id, 10));

        if (orderIndex === -1) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Update the weight
        data[orderIndex].weight = weight;

        writeDb(data);
        res.status(200).json({ message: "Weight updated successfully", order: data[orderIndex] });
    } catch (error) {
        console.error("Error updating weight:", error);
        res.status(500).json({ error: "Failed to update weight" });
    }
});


app.post("/send-invoice", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Order ID is required" });
    }

    try {
        const data = readDb();
        const order = data.find((item) => item.id === id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Generate invoice message
        const message = `
            Invoice for Order ID: ${order.id}
            Name: ${order.name}
            Phone: ${order.phone}
            Address: ${order.address}
            Delivery Type: ${order.order}
            Weight: ${order.weight} kg
        `;

        // Send WhatsApp message
        await client.messages.create({
            from: "whatsapp:+14155238886", // Twilio sandbox WhatsApp number
            to: `whatsapp:${order.phone}`, // Customer's WhatsApp number
            body: message,
        });

        res.status(200).json({ message: "Invoice sent successfully!" });
    } catch (error) {
        console.error("Error sending invoice:", error);
        res.status(500).json({ error: "Failed to send invoice" });
    }
});
