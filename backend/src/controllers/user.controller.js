import { User } from "../models/user.model.js";
import httpStatus from "http-status"
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto"


const login = async (req,res) => {
    const { username, password } = req.body ; 

    if (!username || !password ) {
        return res.status(400).json({message : "Please provide required information "});
    } // 👆 This is an early return for authentication ( It is called Early return)

    try { 
        const user = User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({message : "User Not Found "});
        } 
        if (bcrypt.compare(password, user.password)) {
            let token = crypto.randomBytes(20).toString("hex")
        }

        user.token = token; 
        await user.save;
        return res.status(httpStatus.OK).json({message: "user logged In "})
    } catch (e) {
        return res.status(500).json({message : `Somthing went wrong ${e}`})
    }
}

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