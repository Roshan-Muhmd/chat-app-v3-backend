import express from "express";
import { checkToken, userLogin, userRegister } from "../controllers/authController.js";

const router = express.Router()

router.post('/public/register', userRegister)
router.post('/login',userLogin )
router.get('/checkToken',checkToken )

export default router