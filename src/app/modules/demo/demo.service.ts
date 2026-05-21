
    import type { DemoType } from './demo.interface';
    import { DemoModel } from './demo.model';

    export class DemoService {
        async findAll(): Promise<DemoType[]> {
            return DemoModel.find();
        }

        async findById(id: string): Promise<DemoType | null> {
            return DemoModel.findById(id);
        }

        async create(data: Partial<DemoType>): Promise<DemoType> {
            return DemoModel.create(data);
        }

        async update(id: string, data: Partial<DemoType>): Promise<DemoType | null> {
            return DemoModel.findByIdAndUpdate(id, data, {new: true});
        }

        async delete(id: string): Promise<void> {
            await DemoModel.findByIdAndDelete(id)
        }
    }
    