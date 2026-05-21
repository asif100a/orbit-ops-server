
        import mongoose, {Schema, Document} from 'mongoose';
        import type {DemoType} from './demo.interface';

        export interface DemoDocumentType extends DemoType, Document {}

        const DemoSchema: Schema = new Schema(
            {
                // TODO: Define Demo schema fields
            },
            {
                timestamps: true,
                versionKey: false
            }
        )
        
        export const DemoModel = mongoose.model<DemoDocumentType>('Demo', DemoSchema);
    