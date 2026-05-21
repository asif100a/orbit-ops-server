
    import {Router} from 'express';
    import { DemoController } from './demo.controller';

    const demoRoute = Router();
    const demoController = new DemoController();

    demoRoute.get('/', demoController.getAll.bind(demoController));
    demoRoute.get('/:id', demoController.getById.bind(demoController));
    demoRoute.post('/', demoController.create.bind(demoController));
    demoRoute.put('/:id', demoController.update.bind(demoController));
    demoRoute.delete('/:id', demoController.delete.bind(demoController));

    export default demoRoute;
    