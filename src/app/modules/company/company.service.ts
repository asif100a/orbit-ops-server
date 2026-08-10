
    import { type CompanyType } from './company.interface';
    import { CompanyModel } from './company.model';

    export class CompanyService {
        async findAll(): Promise<CompanyType[]> {
            return CompanyModel.find();
        }

        async findById(id: string): Promise<CompanyType | null> {
            return CompanyModel.findById(id);
        }

        async create(data: Partial<CompanyType>): Promise<CompanyType> {
            return CompanyModel.create(data);
        }

        async update(id: string, data: Partial<CompanyType>): Promise<CompanyType | null> {
            return CompanyModel.findByIdAndUpdate(id, data, {new: true});
        }

        async delete(id: string): Promise<void> {
            await CompanyModel.findByIdAndDelete(id)
        }
    }
    