import bcrypt from "bcryptjs";
import { db } from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    // get the data from the request body
    const { name, email, password } = req.body
    // check if thhe user already exists
    try {
        const esxitsUser = await db.user.findUnique({
            where: {
                name: name,
                email: email,

            }
        })
        if (esxitsUser) {
            return res.status(401).json({
                message: 'user already exists'
            })
        }
        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // create the user in the database
        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name,
                role: UserRole.USER,
                image: "https://res.cloudinary.com/dqj0xgk8h/image/upload/v1698236482/avatars/default-avatar.png"

            }
        })

        // create a token for the user
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d' // 7 days
        })

        // set the toke in the cookies
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        })

        // send the user and the token in the response
        res.status(201).json({
            success: true,
            message: 'user created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,

            }
        })

    } catch (error) {
        console.log('error creating user', error)
        res.status(500).json({
            message: 'error creating user',
            error: error.message
        })

    }
}

const LoginUser = async (req, res) => {
    // get the data from the request body
    const { email, password } = req.body

    // check if the user exists
    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        })
        // check if the user exists
        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'user is not found'
            })
        }
        // check if the password is correct 
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        // check if the password is correct 
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: false,
                message: ' password is not correct'
            })
        }
        // create a token for the user
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d' //  for 7 days
        })
        // set the token in the cookies
        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 1000 * 60 * 60 * 24 * 7 // for 7 days 
        })

        // send the user data and the token in the response
        res.status(200).json({
            success: true,
            message: 'user loggend in successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        })


    } catch (error) {
        console.log('error logging in user', error)
        res.status(500).json({
            message: 'error logging is user',
            error: error.message
        })

    }

}

const LogoutUser = async (req, res) => {
    // get the token from the cookies
    try {
        const token = req.cookies.jwt
        // chcek if the token exists
        if (!token) {
            return res.status(402).json({
                status: false,
                message: 'token not found'
            })

        }
        //clear the cookies
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== 'development',
        })
        // send the response  
        res.status(200).json({
            success: true,
            message: 'user logged out successfully'
        })


    } catch (error) {
        console.log('error logging out user', error)
        res.status(500).json({
            message: 'error logging out user'
        })

    }
}

const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user: req.user
        });
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({
            error: "Error checking user"
        })
    }


}



export { registerUser, LoginUser, LogoutUser, getProfile }