import {z} from "zod";

export const eventFormSchema = z.object({
    id: z.string().min(1, "Required"),
    name: z.string(),
    description: z.string().optional(),
    durationInMinutes: z.number().int().positive("Duration must be greater than 0")
        .max(60 * 12, "Duration must be less than or equal to 12 hours (720 minutes)."),
    isActive: z.boolean(),
});