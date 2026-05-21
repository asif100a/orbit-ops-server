
    import { z } from 'zod'

    export const DemoSchema = z.object({});

    export type Demo = z.infer<typeof DemoSchema>
    