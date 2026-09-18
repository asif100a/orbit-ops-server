
    import { z } from 'zod'

    export const PaymentSchema = z.object({
        subscriptionType: z.enum(["STARTER", "GROWTH", "SCALE"]),
    });

    export type Payment = z.infer<typeof PaymentSchema>
    