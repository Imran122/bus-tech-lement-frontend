import { z } from "zod";

export const addUpdateFareSchema = z.object({
  route: z
    .string({ required_error: "Route is required" })
    .min(1, "Route is required"),

  type: z.enum(["AC", "NON AC"], {
    required_error: "Coach type is required",
  }),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  amount: z
    .number({
      required_error: "Fare amount is required",
    })
    .min(1, "Fare amount is required"),
});

export type AddUpdateFareDataProps = z.infer<typeof addUpdateFareSchema>;
