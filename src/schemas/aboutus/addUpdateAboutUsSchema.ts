import { z } from "zod";

export const addUpdateAboutUsSchema = z.object({
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
});

export type AboutUsSchemaProps = z.infer<typeof addUpdateAboutUsSchema>;
