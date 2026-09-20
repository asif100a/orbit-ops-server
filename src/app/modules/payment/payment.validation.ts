
    import { z } from 'zod'

    export const PaymentSchema = z.object({
        companyId: z.string().min(1, {message: "Company Id is required"}),
        subscriptionType: z.enum(["STARTER", "GROWTH", "SCALE"]),
    });

    export type Payment = z.infer<typeof PaymentSchema>
    