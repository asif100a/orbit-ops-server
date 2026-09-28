import { Router } from "express";
import authRoute from "../../modules/auth/auth.route";
import companyRoute from "../../modules/company/company.route";
import paymentRoute from "../../modules/payment/payment.route";
import userRoute from "../../modules/user/user.route";

const router = Router()

router.use('/auth', authRoute)
router.use('/company', companyRoute)
router.use('/payment', paymentRoute);
router.use('/user', userRoute)

export default router;
