
  import mongoose, {Schema, Document} from 'mongoose';
  import type { CompanyType } from './company.interface';

  export interface CompanyDocumentType extends CompanyType, Document {}

  const CompanySchema: Schema = new Schema(
    {
    // TODO: Define Company schema fields
    },
    {
      timestamps: true,
      versionKey: false
      }
    )
        
    export const CompanyModel = mongoose.model<CompanyDocumentType>('Company', CompanySchema);
    