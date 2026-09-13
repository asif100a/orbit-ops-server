
    import { z } from 'zod'

    export const PaymentSchema = z.object({});

    export type Payment = z.infer<typeof PaymentSchema>
    