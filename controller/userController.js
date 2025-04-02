import { Users, Roles } from "../db/dbconnection.js";
import bcryptjs from "bcryptjs";
import LoginModel from "../model/LoginModel.js";
import refreshTokenUpdateModel from "../model/refreshTokenUpdateModel.js";
import userCheckModel from "../model/userCheckModel.js";
import { generateAccessToken, generateRefreshToken } from "../auth/auth.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createRolesModel from "../model/rolesModel.js";

dotenv.config(); // Load environment variables from .env file

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const userRegistration = async (req, res) => {
    try {
        const {
            username, password, personname, usertype, mobilenumber,
            nidnumber, address, drivinglisence, email, refreshtoken,
            createDate, createdby
        } = req.body;

        // Check if user already exists
        const isUserExist = await Users.findOne({ where: { username } });
        const isEmailExist = await Users.findOne({ where: { email } });

        if (isUserExist) {
            return res.status(409).json({ result: false, message: `${username} user already exists!` });
        }
        if (isEmailExist) {
            return res.status(409).json({ result: false, message: `${email} email already exists!` });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create new user
        const user = await Users.create({
            ...req.body,
            password: hashedPassword
        });

        if (!user) {
            return res.status(500).json({ result: false, message: "User registration failed!" });
        }

        return res.status(201).json({ result: true, message: `${username} is successfully registered!` });

    } catch (error) {
        console.error("Error in user registration:", error);
        return res.status(500).json({ result: false, message: "An error occurred while registering the user." });
    }
};

export const userLogin = async (req, res) => {
    try {
        const loginData = new LoginModel(req.body);
        loginData.validate();

        // Process login logic (assuming you fetch user from DB)
        const isUserExist = await Users.findOne({
            where: { username: loginData.username }, 
            include: [
                {
                    model: Roles,
                    attributes: ["rolename"], // Fetch only rolename
                },
            ],
        });
        if (!isUserExist) {
            return res.status(400).json({
                result: false,
                message: "User does not exist, please check your username!"
            });
        }

        const isValidUser = await bcryptjs.compare(loginData.password, isUserExist.password);
        if (!isValidUser) {
            return res.status(401).json({
                result: false,
                message: "Invalid user credentials!"
            });
        }

        const acctoken = generateAccessToken(loginData);
        const reftoken = generateRefreshToken(loginData);

        res.clearCookie("refreshtoken");

        res.cookie("refreshtoken", reftoken, { httpOnly: true, secure: true });

        await Users.update(
            { refreshtoken: reftoken },
            { where: { username: loginData.username } }
        );

        return res.status(200).json({
            result: true,
            message: "User is valid!",
            data: {
                access_token: acctoken,
                refresh_token: reftoken,
                rolename: isUserExist.tbl_role ? isUserExist.tbl_role.rolename : null
            }
        });

    } catch (error) {
        console.error("Error in user login:", error);
        return res.status(500).json({
            result: false,
            message: error.message || "An error occurred while logging in."
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refToken = req.cookies.refreshtoken;
        const refTokenUpdateData = new refreshTokenUpdateModel(req.body);
        refTokenUpdateData.validate();
        if (!refToken) {
            return res.status(403).json({
                result: false,
                message: "old refresh token is empty!"
            });
        } else {
            const userinfo = await Users.findOne({ where: { refreshtoken: refToken } });
            refTokenUpdateData.username = userinfo.username;
            jwt.verify(refToken, REFRESH_TOKEN_SECRET, async (error, decode) => {
                if (error) {
                    return res.status(200).json({
                        result: false,
                        message: `error during refresh token validate: ${error}`
                    });
                } else if (decode.deviceid != refTokenUpdateData.deviceid) {
                    return res.status(500).json({
                        result: false,
                        message: "You need to try with same device!"
                    });
                }
                else {
                    const acctoken = generateAccessToken(refTokenUpdateData);
                    const reftoken = generateRefreshToken(refTokenUpdateData);
                    res.clearCookie("refreshtoken");
                    res.cookie("refreshtoken", reftoken, { httpOnly: true, secure: true });

                    await Users.update(
                        { refreshtoken: reftoken },
                        { where: { username: refTokenUpdateData.username } }
                    );
                    return res.status(200).json({
                        result: true,
                        message: "refresh token updated!",
                        data: {
                            access_token: acctoken,
                            refresh_token: reftoken
                        }
                    });
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: `error during refresh token update: ${error}`
        });
    }
}

export const checkUser = async (req, res) => {
    try {
        const checkUser = new userCheckModel(req.body);
        checkUser.validate();

        console.log("req.body: ", req.body);
        console.log("Roles: ", Roles);
        const user = await Users.findOne({
            where: { username: checkUser.username },
            include: [
                {
                    model: Roles,
                    attributes: ["rolename"], // Fetch only rolename
                },
            ],
        });

        if (user) {
            return res.status(200).json({
                result: true,
                message: "User already exists. Please login now!",
                rolename: user.tbl_role ? user.tbl_role.rolename : null
            });
        } else {
            return res.status(200).json({
                result: false,
                message: "User does not exist"
            });
        }
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: `Error during user check: ${error.message}`
        });
    }
};

export const getUserInfo = async (req, res) => {
    try {
        const checkUser = new userCheckModel(req.body);
        checkUser.validate();

        console.log("req.body: ", req.body);
        console.log("Roles: ", Roles);
        const user = await Users.findOne({
            where: { username: checkUser.username },
            include: [
                {
                    model: Roles,
                    attributes: ["rolename"], // Fetch only rolename
                },
            ],
        });

        if (user) {
            return res.status(200).json({
                result: true,
                message: "User already exists.",
                data:{
                    username: user.username,
                    rolename: user.tbl_role ? user.tbl_role.rolename : null,
                    personname:user.personname,
                    mobilenumber:user.mobilenumber,
                    nidnumber:user.nidnumber,
                    email: user.email,
                    drivinglisence:user.drivinglisence,
                    address:user.address,
                    createDate:user.createdAt
                }
                
            });
        } else {
            return res.status(200).json({
                result: false,
                message: "User does not exist"
            });
        }
    } catch (error) {
        return res.status(500).json({
            result: false,
            message: `Error during user check: ${error.message}`
        });
    }
};