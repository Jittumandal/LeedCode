import jwt from "jsonwebtoken";
import { db } from "../libs/db.js"

export const authMiddleware = async (req, res, next) => {
    try {
        // get the token from the cookies
        const token = req.cookies.jwt;

        // check if the token exists
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided"
            })
        }
        // verify the user tokne

        let decoded;

        try {
            // verify the tokne using the secrty key
            decoded = jwt.verify(token, process.env.JWT_SECREt_KEY);
        } catch (error) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token"
            })
        }
        // get the user from the data base
        const user = await db.user.findUnique({
            where: {
                id: decoded.id
                //id is the user id in the database
            },
            // select the user data that you want to snd ib the resposnse

            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true
            }
        });


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).json({ message: "Error authenticating user" });
    }
}


export const checkAdmin = async (req, res, next) => {
    try {
        // get the user id from the request object
        const userId = req.user.id;
        // check if the user is an admin
        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                role: true
            }
        })
        // check if the user exists
        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied - Admins only"
            })
        }
        // if the user is an admin, call the next middleware
        next();
    } catch (error) {
        console.error("Error checking admin role:", error);
        res.status(500).json({ message: "Error checking admin role" });
    }
}