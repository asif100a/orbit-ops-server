
    import { type PaymentType } from './payment.interface';
    import { PaymentModel } from './payment.model';

    export class PaymentService {
        async findAll(): Promise<PaymentType[]> {
            return PaymentModel.find();
        }

        async findById(id: string): Promise<PaymentType | null> {
            return PaymentModel.findById(id);
        }

        async create(data: Partial<PaymentType>): Promise<PaymentType> {
            return PaymentModel.create(data);
        }

        async update(id: string, data: Partial<PaymentType>): Promise<PaymentType | null> {
            return PaymentModel.findByIdAndUpdate(id, data, {new: true});
        }

        async delete(id: string): Promise<void> {
            await PaymentModel.findByIdAndDelete(id)
        }
    }
    