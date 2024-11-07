import { z } from "zod";

export const addUpdateRouteSchema = z.object({
  routeType: z
    .enum(["Local", "International"], {
      required_error: "Route type is required",
    })
    .optional(),
  routeDirection: z
    .enum(["Up_Way", "Down_Way"], {
      required_error: "Route direction is required",
    })
    .optional(),
  kilo: z
    .number({
      invalid_type_error: "Distance must be a number",
    })
    .optional(),
  isPassengerInfoRequired: z
    .boolean({
      invalid_type_error: "Passenger information permission must be a boolean",
    })
    .optional(),
  via: z
    .string({
      required_error: "Via is required",
      invalid_type_error: "Via must be a string",
    })
    .optional(),
  from: z
    .number({
      required_error: "Route starting point is required",
      invalid_type_error: "Route starting point must be a number",
    })
    .min(1, "Route starting point is required"),
  to: z
    .number({
      required_error: "Route ending point is required",
      invalid_type_error: "Route ending point must be a number",
    })
    .min(1, "Route ending point is required"),
  routeName: z
    .string({
      required_error: "Route name is required",
      invalid_type_error: "Route name must be a string",
    })
    .min(1, "Route name is required"),
  viaStations: z
    .array(z.number(), {
      required_error: "Station is required",
      invalid_type_error: "Station must be an array of numbers",
    })
    .min(1, "Station is required"),
});

export type AddUpdateRouteDataProps = z.infer<typeof addUpdateRouteSchema>;
