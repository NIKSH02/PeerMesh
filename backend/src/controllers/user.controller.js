import { User } from "../models/user.model.js";
import httpStatus from "http-status"
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto"


const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please provide required information" });
    }

    try {
        const user = await User.findOne({ username }); 
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
        }

        const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }

        const token = crypto.randomBytes(20).toString("hex"); //  Define token here, only if login is successful
        user.token = token;
        await user.save(); // Save user with new token

        return res.status(httpStatus.OK).json({ message: "User logged in", token });
    } catch (e) {
        return res.status(500).json({ message: `Something went wrong: ${e.message}` });
    }
};

const register = async (req,res) => {
    const { name, username, password } = req.body; 
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({message: "User already in Existing"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User(
            {
                name : name , 
                username: username,
                password : hashedPassword
            }
        )

        await newUser.save();

        res.status(httpStatus.CREATED).json({message: "user registered successfully"})
    } catch (e) {
        res.status(500).json({ message: `Somthing went wrong ${e}`});
    }
}

export { login , register}