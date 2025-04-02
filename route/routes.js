import { Router } from "express";
import { userRegistration,userLogin, refreshToken,checkUser } from "../controller/userController.js";

const router = Router();

router.post("/register",userRegistration);
router.post("/login",userLogin);
router.post("/refreshtoken",refreshToken);
router.post("/checkUser",checkUser);

export default router;