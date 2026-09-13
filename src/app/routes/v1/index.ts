import { Router } from "express";
import authRoute from "../../modules/auth/auth.route";
import companyRoute from "../../modules/company/company.route";
import paymentRoute from "../../modules/payment/payment.route";

const router = Router()

router.use('/auth', authRoute)
router.use('/company', companyRoute)
router.use('/payment', paymentRoute);

export default router;
