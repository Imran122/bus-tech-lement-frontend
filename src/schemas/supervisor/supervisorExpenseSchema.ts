import { z } from "zod";

export const supervisorExpenseSchema = z.object({
  coachConfigId: z
    .number({
      required_error: "Coach Config ID is required",
    })
    .transform((value) => Number(value)),

  expenseCategoryId: z
    .number()
    .min(1, { message: "Expense Category ID is required" }),

  routeDirection: z.enum(["Up_Way", "Down_Way"], {
    errorMap: () => ({ message: "Invalid route direction" }),
  }),

  expenseType: z.enum(["Fuel", "Others"], {
    errorMap: () => ({ message: "Invalid expense type" }),
  }),

  paidAmount: z
    .number({
      required_error: "Paid Amount is required",
    })
    .positive({ message: "Paid Amount must be positive" }),

  amount: z
    .number({
      required_error: "Amount is required",
    })
    .positive({ message: "Amount must be positive" }),

  date: z.string().nonempty("Date is required"),

  file: z.string().nonempty("File is required"),
  fuelCompanyId: z.number().optional(),
  fuelWeight: z.number().optional(),
  fuelPrice: z.number().optional(),
});

export type SupervisorExpenseData = z.infer<typeof supervisorExpenseSchema>;
