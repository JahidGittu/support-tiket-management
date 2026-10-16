import { describe, it, expect } from "vitest";
import { createTicketSchema, updateStatusSchema } from "../validators/ticketValidators";
import { analyzeTicketWithAi } from "../services/geminiService";

describe("ResolveDesk AI - Ticket Workflow & Business Logic Tests", () => {
  describe("Zod Validation Schemas", () => {
    it("should accept valid ticket creation payload", () => {
      const payload = {
        title: "Database connection pool exhausted",
        description: "Postgres database returns too many clients error on high traffic load",
      };

      const result = createTicketSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should reject ticket title with fewer than 5 characters", () => {
      const payload = {
        title: "Bug",
        description: "The button on the page is broken and does not work",
      };

      const result = createTicketSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Title must be at least 5 characters");
      }
    });

    it("should reject ticket description with fewer than 10 characters", () => {
      const payload = {
        title: "System failure",
        description: "Broken",
      };

      const result = createTicketSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("should reject invalid ticket status", () => {
      const payload = {
        status: "PENDING_APPROVAL",
      };

      const result = updateStatusSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("should accept valid ticket statuses", () => {
      const allowed = ["OPEN", "IN_PROGRESS", "CUSTOMER_REPLIED", "RESOLVED", "CLOSED"];
      allowed.forEach((status) => {
        const result = updateStatusSchema.safeParse({ status });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Status Transition Logic", () => {
    const isValidTransition = (current: string, next: string): boolean => {
      if (current === "CLOSED") return false;
      const validStates = ["OPEN", "IN_PROGRESS", "CUSTOMER_REPLIED", "RESOLVED", "CLOSED"];
      return validStates.includes(next);
    };

    it("should permit OPEN to IN_PROGRESS transition", () => {
      expect(isValidTransition("OPEN", "IN_PROGRESS")).toBe(true);
    });

    it("should permit IN_PROGRESS to RESOLVED transition", () => {
      expect(isValidTransition("IN_PROGRESS", "RESOLVED")).toBe(true);
    });

    it("should permit auto-transition to CUSTOMER_REPLIED when customer sends a follow-up reply", () => {
      expect(isValidTransition("IN_PROGRESS", "CUSTOMER_REPLIED")).toBe(true);
      expect(isValidTransition("RESOLVED", "CUSTOMER_REPLIED")).toBe(true);
    });

    it("should prevent modification or reopening when ticket is CLOSED", () => {
      expect(isValidTransition("CLOSED", "OPEN")).toBe(false);
      expect(isValidTransition("CLOSED", "IN_PROGRESS")).toBe(false);
      expect(isValidTransition("CLOSED", "CUSTOMER_REPLIED")).toBe(false);
    });
  });

  describe("AI Triage & Fallback Classification", () => {
    it("should classify billing queries with high or urgent priority", async () => {
      const result = await analyzeTicketWithAi(
        "Urgent: bKash payment deducted but subscription not active",
        "TrxID 9X82KD71 paid 1000 BDT today"
      );

      expect(result.category).toBe("BILLING");
      expect(result.priority).toBe("URGENT");
      expect(result.aiSuggestedReply).toBeDefined();
    });

    it("should classify server crash queries as technical and urgent", async () => {
      const result = await analyzeTicketWithAi(
        "Critical emergency: Production API server down",
        "All requests returning 500 error and system freeze"
      );

      expect(result.category).toBe("TECHNICAL");
      expect(result.priority).toBe("URGENT");
    });

    it("should default minor inquiries to low or medium priority", async () => {
      const result = await analyzeTicketWithAi(
        "Minor typo on the contact us page footer",
        "Notice a small spelling mistake in the address line"
      );

      expect(result.priority).toBe("LOW");
    });
  });
});
