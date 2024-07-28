const express = require('express');
const router = express.Router();
const { promisePool } = require("./database");
const { authenticateJWT } = require("./verify");




// Get all vendors
router.get('/',authenticateJWT,async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM vendors');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new vendor
router.post('/',authenticateJWT, async (req, res) => {
    const { name, contact_email, contact_phone, address, on_time_delivery_rate, quality_rating_avg, average_response_time, fulfillment_rate } = req.body;
    try {
        const [result] = await promisePool.query(
            'INSERT INTO vendors (name, contact_email, contact_phone, address, on_time_delivery_rate, quality_rating_avg, average_response_time, fulfillment_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, contact_email, contact_phone, address, on_time_delivery_rate, quality_rating_avg, average_response_time, fulfillment_rate]
        );
        res.status(201).json({ id: result.insertId, name, contact_email, contact_phone, address, on_time_delivery_rate, quality_rating_avg, average_response_time, fulfillment_rate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a vendor
router.put('/:id',authenticateJWT, async (req, res) => {
    const id = req.params.id;
    const { field, value } = req.body;
    if (!field || !value) {
        return res.status(400).send("Field and value are required");
    }
    const query = "UPDATE vendors SET ?? = ? WHERE vendor_id = ?";
    try {
        const [result] = await promisePool.query(query, [field, value, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Vendor not found");
        }
        res.send("Record updated successfully");
    } catch (err) {
        console.error('Error updating record:', err);
        res.status(500).send('Error updating record');
    }
});

// Delete a vendor
router.delete('/:id',authenticateJWT,async (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM vendors WHERE vendor_id = ?";
    try {
        const [result] = await promisePool.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Vendor not found");
        }
        res.send("Record deleted successfully");
    } catch (err) {
        console.error('Error deleting record:', err);
        res.status(500).send('Error deleting record');
    }
});

router.get('/:id/performance', async function(req, res) {
    const id = req.params.id;
    try {
        const [rows] = await promisePool.query(
            'SELECT on_time_delivery_rate, quality_rating_avg, average_response_time, fulfillment_rate FROM vendors WHERE vendor_id = ?', 
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).send("vendor not found");
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
