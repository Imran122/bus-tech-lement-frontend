import { z } from "zod";

export const addUpdateCollectionSchema = z
  .object({
    coachConfigId: z
      .preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number()
      )
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Coach Config ID must be greater than 0",
      }),

    counterId: z
      .preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number()
      )
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Counter ID must be greater than 0",
      }),

    collectionType: z.enum(
      ["CounterCollection", "OpeningBalance", "OthersIncome"],
      {
        required_error: "Collection Type is required",
      }
    ),

    routeDirection: z.enum(["Up_Way", "Down_Way"], {
      required_error: "Route Direction is required",
    }),

    noOfPassenger: z
      .preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number()
      )
      .optional(), // Make it optional for OpeningBalance, we'll validate later

    token: z
      .preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number()
      )
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Token must be greater than 0",
      }),

    amount: z
      .preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number()
      )
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Amount must be greater than 0",
      }),

    date: z.string({ required_error: "Date is required" }),
    file: z.any().optional(), // Optional field
  })
  .refine(
    (data) => {
      // Custom validation to enforce noOfPassenger rules based on collectionType
      if (data.collectionType === "OpeningBalance") {
        return data.noOfPassenger === undefined || data.noOfPassenger === 0;
      }
      return data.noOfPassenger !== undefined && data.noOfPassenger >= 1;
    },
    {
      message:
        "Number of Passengers must be at least 1 unless it's Opening Balance",
      path: ["noOfPassenger"], // This points the error to the noOfPassenger field
    }
  );

// No extra code below the schema definition that might be causing syntax errors.
export type AddUpdateCollectionDataProps = z.infer<
  typeof addUpdateCollectionSchema
>;
