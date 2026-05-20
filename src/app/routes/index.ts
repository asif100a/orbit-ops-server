import { Router } from "express";
import authRoute from "../modules/auth/auth.route";

const router = Router()

router.post('/auth', authRoute)

export default router;