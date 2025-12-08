import userRegistration, { DashboardPage, ForgotPassword, Loginform, ResetPassword, VerifyOTP } from "../controller/userController.js";
import express from "express";

const router=express.Router();

router.post("/register",userRegistration);
router.post("/login",Loginform);
router.get("/dashboard",DashboardPage);

router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:token", ResetPassword); 
router.post("/verify-otp",VerifyOTP); 

export default router;