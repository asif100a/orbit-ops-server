
    import { z } from 'zod'

    export const PaymentSchema = z.object({
        name: z.string().min(1),
        subscriptionType: z.enum(["STARTER", "GROWTH", "SCALE"]),
        amount: z.number().int().positive()
    });

    export type Payment = z.infer<typeof PaymentSchema>
    