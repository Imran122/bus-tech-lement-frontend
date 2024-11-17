import { z } from "zod";

export const addUpdateCompanySchema = z.object({
  companyName: z.string().optional(),
  companyNameBangla: z.string().optional(),
  companyLogo: z.string().optional(),
  companyLogoBangla: z.string().optional(),
  footerLogo: z.string().optional(),
  footerLogoBangla: z.string().optional(),
  address: z.string().optional(),
  addressBangla: z.string().optional(),
  city: z.string().optional(),
  cityBangla: z.string().optional(),
  postalCode: z.string().optional(),
  supportNumber1: z.string().optional(),
  supportNumber2: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
});

export type AddUpdateCompanyProps = z.infer<typeof addUpdateCompanySchema>;
