import { User } from "../models/user.model";


const register = async (req,res) => {
    const { name, username, password } = req.body; 
    try {
        const existingUser = await User.findOne({ username })
    }
}