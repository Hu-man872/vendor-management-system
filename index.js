const express = require('express');
const bodyParser = require('body-parser');
const vendorRoutes = require('./v');
const purchaseOrderRoutes = require('./p');
const registerroutes = require('./register')
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/',registerroutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/purchase_orders', purchaseOrderRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
