import express from "express";
import db from "../db/conn.mjs";
import pkg from 'mongodb';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const { ObjectID } = pkg;
const router = express.Router();
var store = new ExpressBrute.MemoryStore(); 
var bruteforce = new ExpressBrute(store);

// Regex patterns
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Sign up
router.post("/signup", async (req, res) => {
    const { name, password } = req.body;

    // Validate username
    if (!USERNAME_REGEX.test(name)) {
        return res.status(400).json({ message: "Invalid username. It should be 3-20 characters long and can only contain letters, numbers, and underscores." });
    }

    // Validate password
    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ message: "Invalid password. It should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newDocument = {
        name: name,
        password: hashedPassword
    };
    
    try {
        let collection = await db.collection("users");
        let result = await collection.insertOne(newDocument);
        res.status(201).json({ message: "User created successfully", userId: result.insertedId });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed" });
    }
});

// Login (unchanged)
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { name, password } = req.body;
    console.log(name + " " + password);

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ name });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        } else {
            const token = jwt.sign(
                { username: name },
                "this_secret_should_be_longer_than_it_is",
                { expiresIn: "1h" }
            );
            res.status(200).json({ message: "Authentication successful", token: token, name: name });
            console.log("Your new token is", token);
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

export default router;