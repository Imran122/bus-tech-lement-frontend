/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";
import { phoneNumberBaseSchema } from "../contact/addUpdateDriverSchema";

export const addBookingSeatSchema = z.object({
  coachConfigId: z
    .number({ required_error: "Coach configuration is required" })
    .nonnegative("Coach configuration is required"),
  schedule: z
    .string({ required_error: "Schedule is required" })
    .min(1, "Schedule is required"),
  counterId: z.number().optional(),
  customerName: z.string().optional(),
  paymentType: z.enum(["FULL", "PARTIAL"], {
    errorMap: () => ({
      message: "Payment Type is required",
    }),
  }),
  paymentAmount: z
    .preprocess(
      (value) => parseFloat(value as string),
      z.number().positive("Partial payment amount must be a positive number")
    )
    .optional(),

  gender: z.enum(["Male", "Female"]).optional(),
  phone: phoneNumberBaseSchema.min(1, "Contact number is required"),
  email: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  nid: z.string().optional().or(z.literal("")),
  nationality: z.string().optional().or(z.literal("")),
  paymentMethod: z
    .string({ required_error: "Payment method is required" })
    .min(1, "Payment method is required")
    .or(z.literal("")),
  boardingPoint: z
    .string({ required_error: "Boarding point is required" })
    .min(1, "Boarding point is required")
    .or(z.literal("")),
  droppingPoint: z
    .string({ required_error: "Dropping point is required" })
    .min(1, "Dropping point is required")
    .or(z.literal("")),
  noOfSeat: z
    .number({ required_error: "Number of seats is required" })
    .int()
    .positive("Number of seats is required"),
  amount: z
    .number({ required_error: "Payment amount is required" })
    .positive("Payment amount is required"),
  date: z
    .string({ required_error: "Date is required" })
    .min(1, "Date is required"),
  seats: z
    .array(
      z
        .string({ required_error: "Seats are required" })
        .min(1, "Seats are required")
    )
    .optional(),
});

export type AddBookingSeatDataProps = z.infer<typeof addBookingSeatSchema>;
