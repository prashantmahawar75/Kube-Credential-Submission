import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getWorkerId } from "./utils/workerId";
import { hashCredential } from "./utils/credentialHash";
import { credentialSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const currentWorkerId = getWorkerId();

  // Issuance API - Issue new credentials
  app.post("/api/issuance/issue", async (req, res) => {
    try {
      const { credential } = req.body;

      // Validate credential
      const validation = credentialSchema.safeParse(credential);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid credential format",
          workerId: currentWorkerId,
          isValid: false,
        });
      }

      // Hash the credential for duplicate detection
      const credentialHash = hashCredential(credential);

      // Check if credential already exists
      const existing = storage.getCredentialByHash(credentialHash);
      if (existing) {
        return res.json({
          success: true,
          message: `Credential already issued by ${existing.workerId}`,
          workerId: currentWorkerId,
          credential: JSON.parse(existing.credentialData),
          timestamp: existing.issuedAt,
          alreadyIssued: true,
        });
      }

      // Store new credential (handles race conditions internally)
      const stored = storage.storeCredential(
        credentialHash,
        JSON.stringify(credential),
        currentWorkerId
      );

      // Check if we got back an existing credential (race condition occurred)
      const wasAlreadyIssued = stored.workerId !== currentWorkerId;

      return res.json({
        success: true,
        message: wasAlreadyIssued 
          ? `Credential already issued by ${stored.workerId}`
          : `Credential issued by ${currentWorkerId}`,
        workerId: currentWorkerId,
        credential,
        timestamp: stored.issuedAt,
        alreadyIssued: wasAlreadyIssued,
      });
    } catch (error: any) {
      console.error("Issuance error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        workerId: currentWorkerId,
      });
    }
  });

  // Verification API - Verify credentials
  app.post("/api/verification/verify", async (req, res) => {
    try {
      const { credential } = req.body;

      // Validate credential format
      const validation = credentialSchema.safeParse(credential);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid credential format",
          workerId: currentWorkerId,
          isValid: false,
        });
      }

      // Hash the credential for verification
      const credentialHash = hashCredential(credential);

      // Check if credential exists
      const stored = storage.verifyCredential(credentialHash);
      
      if (stored) {
        return res.json({
          success: true,
          message: `Valid credential issued by ${stored.workerId}`,
          workerId: currentWorkerId,
          timestamp: stored.issuedAt,
          isValid: true,
        });
      } else {
        return res.json({
          success: true,
          message: "Credential not found - never issued",
          workerId: currentWorkerId,
          isValid: false,
        });
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        workerId: currentWorkerId,
        isValid: false,
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      workerId: currentWorkerId,
      timestamp: new Date().toISOString(),
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
