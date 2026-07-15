const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const User = require("./User");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

mongoose

.connect("mongodb://127.0.0.1:27017/UserDB")

.then(() => {
    console.log("MongoDB Connected");
})

.catch((err) => {
    console.log(err);
});

app.post("/users", async (request, response) => {

    try {

        const { name, email, password } = request.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return response.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        response.status(201).json({
            message: "User Registered Successfully",
            user: newUser
        });

    }

    catch (err) {

        response.status(500).json({
            message: err.message
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});