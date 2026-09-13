
    import {Router} from 'express';
    import { PaymentController } from './payment.controller';

    const paymentRoute = Router();
    const paymentController = new PaymentController();

    paymentRoute.get('/', paymentController.getAll.bind(paymentController));
    paymentRoute.get('/:id', paymentController.getById.bind(paymentController));
    paymentRoute.post('/', paymentController.create.bind(paymentController));
    paymentRoute.put('/:id', paymentController.update.bind(paymentController));
    paymentRoute.delete('/:id', paymentController.delete.bind(paymentController));

    export default paymentRoute;
    