import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET=process.env.REFRESH_TOKEN_SECRET;

// Generate Access Token (expires in 15 minutes)
const generateAccessToken = (user) => {    
    return jwt.sign(
        { username: user.username, deviceid: user.deviceid },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15d" }
    );
};

// Generate Refresh Token (expires in 7 days)
const generateRefreshToken = (user) => {
    return jwt.sign(
        { username: user.username, deviceid: user.deviceid },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "20d" }
    );
};

export { generateAccessToken, generateRefreshToken };
