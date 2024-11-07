import { z } from "zod";

export const addUpdateCoachSchema = z.object({
  registrationNo: z.string().min(1, "Registration number is required"),
  coachNo: z.string().min(1, "Coach number is required"),
  manufacturerCompany: z.string().optional().or(z.literal("")),
  model: z.string().optional().or(z.literal("")),
  chasisNo: z.string().optional().or(z.literal("")),
  engineNo: z.string().optional().or(z.literal("")),
  countryOfOrigin: z.string().optional().or(z.literal("")),
  lcCode: z.string().optional().or(z.literal("")),
  deliveryToDipo: z.string().optional().or(z.literal("")),
  deliveryDate: z.date().nullable().optional(),
  color: z.string().optional().or(z.literal("")),
  noOfSeat: z
    .number({
      required_error: "Number of seat is required",
      invalid_type_error: "Number of seat must be a number",
    })
    .min(1, "Number of seat is required"),
  coachType: z.enum(["Double_Deck", "Single_Deck"], {
    required_error: "Coach type is required",
  }),
  financedBy: z.string().optional().or(z.literal("")),
  terms: z.string().optional().or(z.literal("")),
  active: z.boolean({ required_error: "Active status is required" }),
});

export type AddUpdateCoachDataProps = z.infer<typeof addUpdateCoachSchema>;
