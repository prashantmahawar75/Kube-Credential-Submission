import { z } from "zod";

// Credential schema - accepts any valid JSON object
export const credentialSchema = z.record(z.unknown()).refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "Credential must contain at least one field" }
);

export type Credential = z.infer<typeof credentialSchema>;

// Issuance response
export const issuanceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  workerId: z.string(),
  credential: z.record(z.unknown()).optional(),
  timestamp: z.string().optional(),
  alreadyIssued: z.boolean().optional(),
});

export type IssuanceResponse = z.infer<typeof issuanceResponseSchema>;

// Verification request
export const verificationRequestSchema = z.object({
  credential: z.record(z.unknown()),
});

export type VerificationRequest = z.infer<typeof verificationRequestSchema>;

// Verification response
export const verificationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  workerId: z.string().optional(),
  timestamp: z.string().optional(),
  isValid: z.boolean(),
});

export type VerificationResponse = z.infer<typeof verificationResponseSchema>;
