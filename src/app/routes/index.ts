import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import companyRoute from "../modules/company/company.route";

const router = Router()

router.use('/auth', authRoute)
router.use('/company', companyRoute)

export default router;
