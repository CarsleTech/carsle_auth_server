import express from "express";
import  loginHandler  from "../controllers/login";
import { signUpHandler } from "../controllers/signup";
import { authenticateToken } from "../controllers/checkAuth";

const router = express.Router();

router.get("/signup/health", signUpHandler.handleGet)
router.post("/signup", signUpHandler.handlePost)
router.get("/login/health",authenticateToken, loginHandler.handleGet);
router.post("/login", loginHandler.handlePost);

export default router;
