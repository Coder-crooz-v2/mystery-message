import { z } from "zod";

export const AcceptMessageSchema = z.object({
    message: z.boolean(),
});