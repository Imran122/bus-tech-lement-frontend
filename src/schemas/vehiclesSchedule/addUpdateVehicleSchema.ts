import { z } from "zod";

export const addUpdateVehicleSchema = z.object({
  registrationNo: z
    .string()
    .min(1, { message: "Registration number is required" }),
  manufacturerCompany: z.string().optional(),
  model: z.string().optional(),
  chasisNo: z.string().optional(),
  engineNo: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  lcCode: z.string().optional(),
  color: z.string().optional(),
  deliveryToDipo: z.string().optional(),
  deliveryDate: z.string().optional(),
  orderDate: z.string().optional(),
});

export type AddUpdateVehicleDataProps = z.infer<typeof addUpdateVehicleSchema>;
