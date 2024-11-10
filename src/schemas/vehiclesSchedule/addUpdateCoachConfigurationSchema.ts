import { z } from "zod";

export const addUpdateCoachConfigurationSchema = z.object({
  coachNo: z.string().min(1, { message: "Coach is required" }),
  registrationNo: z.string().optional(),
  discount: z.preprocess((val) => {
    // Convert to a number if it's a string
    if (typeof val === "string") {
      const parsedValue = parseFloat(val);
      return isNaN(parsedValue) ? undefined : parsedValue; // Return undefined if NaN to trigger the error
    }
    return val; // Return as is if already a number
  }, z.number()),

  supervisorId: z.number().optional(),
  driverId: z.number().optional(),
  fromCounterId: z.number({ required_error: "Starting counter is required" }),
  fareId: z.number({ required_error: "Fare amount is required" }),
  routeId: z
    .number({ required_error: "Route is required" })
    .min(1, { message: "Route is required" }),
  destinationCounterId: z.number({
    required_error: "Ending counter is required",
  }),

  tokenAvailable: z
    .preprocess((val) => {
      // Convert to a number if it's a string
      if (typeof val === "string") {
        const parsedValue = parseFloat(val);
        return isNaN(parsedValue) ? undefined : parsedValue; // Return undefined if NaN to trigger the error
      }
      return val; // Return as is if already a number
    }, z.number().min(1, { message: "Token must be greater than 0" }))
    .refine((val) => val > 0, { message: "Token must be greater than 0" }),
  coachType: z.enum(["AC", "NON AC"], {
    required_error: "Coach type is required",
  }),
  active: z.boolean().optional(),
  coachClass: z.enum(["E_Class", "B_Class", "S_Class", "Sleeper"], {
    required_error: "Coach class is required",
  }),
  schedule: z
    .string({ required_error: "Schedule is required" })
    .min(1, { message: "Schedule is required" }),
  departureDate: z.date().optional(),

  holdingTime: z.string().optional(),
});

export type IAddUpdateCoachConfigurationDataProps = z.infer<
  typeof addUpdateCoachConfigurationSchema
>;
