import express from "express";
import  loginHandler  from "../controllers/login";
import { signUpHandler } from "../controllers/signup";

const router = express.Router();

router.get("/signup/health", signUpHandler.handleGet)
router.post("/signup", signUpHandler.handlePost)
router.post("/login", loginHandler.handlePost);

export default router;
