
    import {Router} from 'express';
    import { PaymentController } from './payment.controller';
import { checkAuth } from '../../middlewares/checkAuth';

    const paymentRoute = Router();
    const paymentController = new PaymentController();

    // POST Payment
    paymentRoute.post('/create-checkout-session', paymentController.createCheckoutSession.bind(paymentController));
    // GET Session Status
    paymentRoute.get('/session-status', checkAuth(), paymentController.getCheckoutSessionStatus.bind(paymentController));

    export default paymentRoute;
    