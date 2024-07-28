const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { promisePool } = require("./database");
const your_jwt_secret = "123";

// Registration endpoint
router.post("/register", async function(req, res) {
    const user_id =Math.floor(Math.random()*1000);
    const { username, password } = req.body; // Fix typo: pasword -> password
    try {
        // Hash the password with a salt
        const hashPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
        // Insert the user into the database
        const [result] = await promisePool.query("INSERT INTO users (user_id,username, password) VALUES (?,?, ?)", [user_id,username, hashPassword]);
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user in the database
        const [rows] = await promisePool.query("SELECT * FROM users WHERE username = ?", [username]);
        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = rows[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ user_id: user.user_id }, your_jwt_secret, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
