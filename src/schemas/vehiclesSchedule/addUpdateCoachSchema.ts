import { z } from "zod";

export const addUpdateCoachSchema = z.object({
  coachNo: z.string().min(1, "Coach number is required"),
  active: z.boolean().optional(),

  noOfSeat: z
    .number({
      required_error: "Number of seat is required",
      invalid_type_error: "Number of seat must be a number",
    })
    .min(1, "Number of seat is required"),
  fromCounterId: z.number({ required_error: "Starting counter is required" }),
  fareId: z.number({ required_error: "Fare amount is required" }),
  routeId: z
    .number({ required_error: "Route is required" })
    .min(1, { message: "Route is required" }),
  destinationCounterId: z.number({
    required_error: "Ending counter is required",
  }),
  schedule: z
    .string({ required_error: "Schedule is required" })
    .min(1, { message: "Schedule is required" }),
});

export type AddUpdateCoachDataProps = z.infer<typeof addUpdateCoachSchema>;
