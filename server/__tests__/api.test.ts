import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "../routes";
import { storage } from "../storage";
import fs from "fs";

describe("Credential API Tests", () => {
  let app: express.Express;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe("Issuance API", () => {
    it("should issue a new credential", async () => {
      const credential = {
        name: "John Doe",
        role: "Developer",
      };

      const response = await request(app)
        .post("/api/issuance/issue")
        .send({ credential })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.workerId).toBeDefined();
      expect(response.body.workerId).toMatch(/^worker-/);
      expect(response.body.message).toContain("issued by");
      expect(response.body.credential).toEqual(credential);
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.alreadyIssued).toBe(false);
    });

    it("should detect duplicate credentials", async () => {
      const credential = {
        email: "test@example.com",
        department: "Engineering",
      };

      // Issue first time
      const firstResponse = await request(app)
        .post("/api/issuance/issue")
        .send({ credential })
        .expect(200);

      expect(firstResponse.body.alreadyIssued).toBe(false);

      // Try to issue again
      const secondResponse = await request(app)
        .post("/api/issuance/issue")
        .send({ credential })
        .expect(200);

      expect(secondResponse.body.success).toBe(true);
      expect(secondResponse.body.alreadyIssued).toBe(true);
      expect(secondResponse.body.message).toContain("already issued");
    });

    it("should reject invalid credential format", async () => {
      const response = await request(app)
        .post("/api/issuance/issue")
        .send({ credential: {} })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid credential format");
    });

    it("should handle same credential with different key order", async () => {
      const credential1 = { a: "1", b: "2" };
      const credential2 = { b: "2", a: "1" };

      const firstResponse = await request(app)
        .post("/api/issuance/issue")
        .send({ credential: credential1 })
        .expect(200);

      expect(firstResponse.body.alreadyIssued).toBe(false);

      const secondResponse = await request(app)
        .post("/api/issuance/issue")
        .send({ credential: credential2 })
        .expect(200);

      expect(secondResponse.body.alreadyIssued).toBe(true);
    });
  });

  describe("Verification API", () => {
    it("should verify an issued credential", async () => {
      const credential = {
        userId: "12345",
        accessLevel: "admin",
      };

      // Issue the credential first
      await request(app)
        .post("/api/issuance/issue")
        .send({ credential })
        .expect(200);

      // Verify it
      const verifyResponse = await request(app)
        .post("/api/verification/verify")
        .send({ credential })
        .expect(200);

      expect(verifyResponse.body.success).toBe(true);
      expect(verifyResponse.body.isValid).toBe(true);
      expect(verifyResponse.body.workerId).toBeDefined();
      expect(verifyResponse.body.timestamp).toBeDefined();
      expect(verifyResponse.body.message).toContain("Valid credential");
    });

    it("should reject non-issued credentials", async () => {
      const credential = {
        userId: "99999",
        accessLevel: "guest",
      };

      const response = await request(app)
        .post("/api/verification/verify")
        .send({ credential })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.isValid).toBe(false);
      expect(response.body.message).toContain("not found");
    });

    it("should reject invalid credential format", async () => {
      const response = await request(app)
        .post("/api/verification/verify")
        .send({ credential: {} })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.isValid).toBe(false);
    });

    it("should handle credential verification with different key order", async () => {
      const credential = { x: "10", y: "20" };
      const credentialReordered = { y: "20", x: "10" };

      // Issue with one order
      await request(app)
        .post("/api/issuance/issue")
        .send({ credential })
        .expect(200);

      // Verify with different order
      const verifyResponse = await request(app)
        .post("/api/verification/verify")
        .send({ credential: credentialReordered })
        .expect(200);

      expect(verifyResponse.body.isValid).toBe(true);
    });
  });

  describe("Health Check", () => {
    it("should return healthy status", async () => {
      const response = await request(app)
        .get("/api/health")
        .expect(200);

      expect(response.body.status).toBe("healthy");
      expect(response.body.workerId).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });
  });
});
