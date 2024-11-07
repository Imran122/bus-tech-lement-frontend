import z from "zod";

export const addUpdateStationSchema = z.object({
  name: z.string().min(1, "Station name is required"),
});

export type AddUpdateStationDataProps = z.infer<typeof addUpdateStationSchema>;
