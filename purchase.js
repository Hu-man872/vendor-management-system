const express = require('express');
const router = express.Router();
const { promisePool } = require('./database');
const { updateOnTimeDeliveryRate,updateQualityRatingAvg,updateAverageResponseTime ,updateFulfillmentRate} = require('./performance');
const {authenticateJWT} =require("./verify");



// Get all purchase orders
router.get('/',authenticateJWT, async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM purchaseorders');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new purchase order
router.post('/',authenticateJWT, async (req, res) => {
    const po_no = Math.floor(Math.random() * 100000).toString();
    const { vendor_id, order_date, delivery_date, items, quantity, status, quality_rating, issue_date, ack_date, expected_delivery_date } = req.body;
    const query = `
        INSERT INTO PurchaseOrders (po_no, vendor_id, order_date, delivery_date, items, quantity, status, quality_rating, issue_date, ack_date, expected_delivery_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
        const [result] = await promisePool.query(query, [
            po_no, vendor_id, order_date, delivery_date, JSON.stringify(items), quantity, status, quality_rating, issue_date, ack_date, expected_delivery_date
        ]);
        res.status(200).json({ po_no, vendor_id, order_date, delivery_date, items, quantity, status, quality_rating, issue_date, ack_date, expected_delivery_date });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a purchase order
router.put('/:id',authenticateJWT, async (req, res) => {
    const id = req.params.id;
    const { field, value } = req.body;
    if (!field || !value) {
        return res.status(400).send("Field and value are required");
    }
    const query = "UPDATE PurchaseOrders SET ?? = ? WHERE po_no = ?";
    try {
        const [result] = await promisePool.query(query, [field, value, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Order not found");
        }
        const [vendorResult] = await promisePool.query("SELECT vendor_id FROM purchaseorders WHERE po_no = ?", [id]);
        if(vendorResult.length===0){
            return res.status(404).send("Vendor not found for the given purchase order");
        }
        const vendor_id = vendorResult[0].vendor_id;

        // Update the on-time delivery rate for the vendor
        await updateOnTimeDeliveryRate(vendor_id);
        await updateQualityRatingAvg(vendor_id);
        await updateAverageResponseTime(vendor_id);
        await updateFulfillmentRate(vendor_id);
        res.send("record updated succesfully");
    } catch (err) {
        console.error('Error updating record:', err);
        res.status(500).send('Error updating record');
    }
});

// Delete a purchase order
router.delete('/:id',authenticateJWT, async (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM PurchaseOrders WHERE po_no = ?";
    try {
        const [result] = await promisePool.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Order not found");
        }
        res.send("Record deleted successfully");
    } catch (err) {
        console.error('Error deleting record:', err);
        res.status(500).send('Error deleting record');
    }
});

module.exports = router;
