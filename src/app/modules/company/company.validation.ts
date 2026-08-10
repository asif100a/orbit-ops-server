
    import { z } from 'zod'

    export const CompanySchema = z.object({});

    export type Company = z.infer<typeof CompanySchema>
    