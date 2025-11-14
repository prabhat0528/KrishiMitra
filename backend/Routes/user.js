const express = require("express");
const router = express.Router();
const User = require("../Model/user_model");
const bcrypt = require("bcrypt");

// ----------------------- Login Route -------------------------- //
router.post("/login", async (req, res) => {
    const { user_name, password } = req.body;

    try {
        // Check if fields are missing
        if (!user_name || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if user exists
        const user = await User.findOne({ user_name });
        if (!user) {
            return res.status(404).json({
                message: "User is not registered. Please sign up first."
            });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Username or password is incorrect!"
            });
        }

        return res.status(200).json({
            message: "User logged in successfully",
            user_data: user
        });

    } catch (error) {
        return res.status(500).json({
            message: `Internal server error: ${error.message}`
        });
    }
});


//------------------------------Signup Route-------------------------------------


router.post("/signup",async(req,res) => {
    const {name,user_name,role,password} = req.body();

    try {
        if(!name,!user_name || !role || !password){
            return res.status(401).json({message: "All fields are required...!"});
        }

        const hashedPassword = bcrypt.hash(password,10);

        const newUser = new User({
            name,
            user_name, 
            role,
            hashedPassword
        })
        await newUser.save();

        const userData = {
            id: newUser._id,
            name : newUser.name,
            user_name : newUser.user_name,
            role: newUser.role


        }

        return res.status(200).json({message: "User registered successfully!",user: userData});
    } catch (error) {
        return res.status(500).json({message: `Some error is occuring and the error is: ${error}`})
    }

})

module.exports = router;
