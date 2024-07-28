const { promisePool } = require('./database');

const updateOnTimeDeliveryRate = async (vendor_id) => {
    console.log('Updating on-time delivery rate for vendor_id:', vendor_id);
    const query = `
        UPDATE vendors v
        JOIN (
            SELECT vendor_id,
                   SUM(CASE WHEN delivery_date <= expected_delivery_date THEN 1 ELSE 0 END) / COUNT(*) AS on_time_delivery_rate
            FROM purchaseorders
            WHERE status = 'complete' AND vendor_id = ?
            GROUP BY vendor_id
        ) p ON v.vendor_id = p.vendor_id
        SET v.on_time_delivery_rate = p.on_time_delivery_rate
        WHERE v.vendor_id = ?;
    `;
    try {
        const [result] = await promisePool.query(query, [vendor_id, vendor_id]);
        console.log('Query result:', result);
        if (result.affectedRows === 0) {
            console.log('No rows updated. Please check the vendor_id or data.');
        } else {
            console.log('Vendor on-time delivery rate updated successfully.');
        }
    } catch (err) {
        console.error('Error updating on-time delivery rate:', err);
    }
};



const updateQualityRatingAvg = async (vendor_id) => {
    const query = `
        UPDATE vendors v
        JOIN (
            SELECT vendor_id,
                   AVG(quality_rating) AS quality_rating_avg
            FROM purchaseorders
            WHERE status = 'completed' AND quality_rating IS NOT NULL AND vendor_id = ?
        ) p ON v.vendor_id = p.vendor_id
        SET v.quality_rating_avg = p.quality_rating_avg
    `;
    await promisePool.query(query, [vendor_id]);
};

const updateAverageResponseTime = async (vendor_id) => {
    const query = `
        UPDATE vendors v
        JOIN (
            SELECT vendor_id,
                   AVG(TIMESTAMPDIFF(SECOND, issue_date, acknowledgment_date)) AS average_response_time
            FROM purchaseorders
            WHERE acknowledgment_date IS NOT NULL AND vendor_id = ?
        ) p ON v.vendor_id = p.vendor_id
        SET v.average_response_time = p.average_response_time
    `;
    await promisePool.query(query, [vendor_id]);
        };

const updateFulfillmentRate = async (vendor_id) => {
            const query = `
                UPDATE vendors v
                JOIN (
                    SELECT vendor_id,
                           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*) AS fulfillment_rate
                    FROM purchase_orders
                    WHERE vendor_id = ?
                ) p ON v.vendor_id = p.vendor_id
                SET v.fulfillment_rate = p.fulfillment_rate
            `;
            await promisePool.query(query, [vendor_id]);
        };
        module.exports = { updateOnTimeDeliveryRate, updateQualityRatingAvg, updateAverageResponseTime,updateFulfillmentRate};