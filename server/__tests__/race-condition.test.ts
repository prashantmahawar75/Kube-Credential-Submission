import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import { registerRoutes } from "../routes";
import { storage } from "../storage";
import fs from "fs";

describe("Race Condition Tests", () => {
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

  it("should handle concurrent duplicate issuance requests gracefully", async () => {
    const credential = {
      concurrentTest: "value",
      timestamp: Date.now().toString(),
    };

    // Send multiple concurrent requests with the same credential
    const requests = Array(5)
      .fill(null)
      .map(() =>
        request(app)
          .post("/api/issuance/issue")
          .send({ credential })
      );

    const responses = await Promise.all(requests);

    // All responses should be successful (200 status)
    responses.forEach((response) => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    // At least one should be marked as "already issued" (unless first request completes first)
    // All should have the same credential data
    const credentialData = responses[0].body.credential;
    responses.forEach((response) => {
      expect(response.body.credential).toEqual(credentialData);
    });

    // Check that we don't get 500 errors
    responses.forEach((response) => {
      expect(response.status).not.toBe(500);
    });
  });

  it("should handle rapid sequential duplicate requests", async () => {
    const credential = {
      rapidTest: "sequential",
      id: Date.now().toString(),
    };

    // First request
    const first = await request(app)
      .post("/api/issuance/issue")
      .send({ credential })
      .expect(200);

    expect(first.body.alreadyIssued).toBe(false);

    // Rapid follow-up requests
    const second = await request(app)
      .post("/api/issuance/issue")
      .send({ credential })
      .expect(200);

    const third = await request(app)
      .post("/api/issuance/issue")
      .send({ credential })
      .expect(200);

    expect(second.body.success).toBe(true);
    expect(second.body.alreadyIssued).toBe(true);
    expect(third.body.success).toBe(true);
    expect(third.body.alreadyIssued).toBe(true);

    // All should reference the same original issuance
    expect(second.body.timestamp).toBe(first.body.timestamp);
    expect(third.body.timestamp).toBe(first.body.timestamp);
  });
});
